# STYLE.md

Personal coding idioms for this codebase (the `backend/` FastAPI service). Follow these when writing
or reviewing code. This document only contains things Claude would get wrong without being told — not
standard Python conventions.

**Automated enforcement:** none. `ruff check .` and `black .` are run **manually** (see
`backend/CLAUDE.md`); there is no `[tool.ruff]`/`[tool.black]` config in `pyproject.toml` and no
pre-commit hook. Everything in this file is enforced by code review only.

**Rule strength:** All rules are hard requirements unless marked **Preference** — team default where a
technical alternative exists; deviate only with explicit justification.

**Some rules lead the code.** Where a rule says "must" but existing code does otherwise, the rule is the
target and new code follows it — call out the divergence in review rather than copying the old pattern.
Cases like this are flagged inline below.

## General Conventions

- Must annotate every function signature — all parameters and return types, including private helpers.
- Must use absolute imports only — never relative imports (`from .crud import ...`). Every intra-package
  import is absolute from the package root (`from crud import CRUDCareReceipient`).
- Never write docstrings. (A stray docstring exists in `services/care_receipient.py` —
  `_authenticate_care_receipient` — treat it as the exception, not the pattern.)
- Never add comments unless code looks wrong but exists for a specific business reason; if a comment is
  needed it must explain *why*, not *what*.
- Use a real logger, never `print()`. **Target:** introduce Loguru's `logger` when logging is added —
  there is currently no logging in the backend, so this is the convention to adopt the first time you
  need it, not a description of existing code.
- Must keep all functions in `utils/` pure — no side effects, no I/O; any layer may import from here
  safely (`utils/token.py`, `utils/mood.py`, `utils/whatsapp.py`, `utils/hashing.py`).

## Layer Naming

| Layer | Pattern | Example |
|-------|---------|---------|
| CRUD class | `CRUD` + PascalCase domain | `CRUDCareReceipient`, `CRUDCaregiver`, `CRUDMood`, `CRUDMagicLinkToken` |
| CRUD methods | verb or verb + noun | `create()`, `get()`, `get_by()`, `suspend()`, `update_profile()` |
| Service functions | snake_case verb phrases, usually `get_…_response` | `authenticate_care_receipient()`, `get_caregiver_dashboard_response()`, `get_create_care_receipient_response()` |
| Schema — request | PascalCase domain + `…Request` | `CareReceipientCreateRequest`, `CareReceipientLogInRequest`, `MagicLinkVerifyRequest` |
| Schema — response | `Get…Response` / `Create…Response` / `…Token` / `…Data` | `GetCareReceipientDashboardResponse`, `CreateCareReceipientMoodResponse`, `CareReceipientToken` |
| Exception class | Domain + Verb/State + Noun + `Exception` | `CareReceipientNotFoundException`, `DBDuplicateAccountException` |

All exceptions live in a single flat `exceptions.py` — there is no `exceptions/` package.

## Variable Naming

**Encode state and role in the name.**

- Must use `validated_` / `unvalidated_` prefix on variables that have or have not been through a
  validation step — makes the validation boundary visible; prevents passing unvalidated data to code
  that assumes it is safe.
- Must use `token_` prefix on variables derived from the request's JWT — makes the origin explicit and
  prevents treating JWT-derived data the same as DB-loaded data — e.g. `token_caregiver_id`,
  `token_care_receipient_id` (both used in `services/care_receipient.py`).
- Must use `{key}_to_{value}` pattern for dict/mapping variables — makes lookup intent visible without
  tracing what the dict contains — e.g. `app_language_to_mood_messages`.
- Must use `is_` prefix on all boolean variables and boolean constants — unambiguous in conditional
  expressions.
- Must strip only `get_` from the function name when naming the variable that holds the result — avoids
  name stuttering.

**No abbreviations for domain objects, ever** — abbreviated names require the reader to maintain a mental
mapping; full names are self-documenting at the read site. Spell out full names for loop variables.
`enumerate` index counters may use `i` when the index has no domain meaning; use a descriptive name when
it does.

```python
# Good
for care_receipient in care_receipients_under_caregiver: ...
for i, mood in enumerate(moods): ...                 # i: no domain meaning

# Bad
for cr in care_receipients_under_caregiver: ...      # cr abbreviates the domain object
```

```python
# Good
unvalidated_care_receipient = CRUDCareReceipient(db).get(care_receipient_id)
if unvalidated_care_receipient is None:
    raise CareReceipientNotFoundException
validated_care_receipient = unvalidated_care_receipient

# Bad
care_receipient = CRUDCareReceipient(db).get(care_receipient_id)
```

## Function Naming

- Private helpers that **return** an object must use `_get_` prefix — signals the helper produces a
  value, not a side effect — e.g. `_get_mood_message()`.
- Private helpers that **return a bool** must use a predicate prefix (`_is_`/`_can_`/`_should_`) — readable
  in conditional context — e.g. `_can_record_mood()`, `_should_alert_caregiver()`.
- Private helpers that **do** something side-effectful must use `_verb_noun` — makes clear the helper does
  work, not returns a value — e.g. `_update_care_receipient_mood_checkin()`, `_create_magic_link_token()`.
  Never `_do_` — it describes no specific action.
- Never use hedge words in names — hedge words describe optional behavior that belongs in the logic, not
  the name: `update_consecutive_checkins` not `update_consecutive_checkins_if_needed`.

## Router Request Parameters

Request body parameters in routers must use the full descriptive name of their schema, never the generic
`request` — makes the schema type readable at the call site without chasing the variable. **This rule
leads the code:** most routers still pass a bare `request`; new and touched routes use the descriptive
form, as `care_receipient_log_in` already does:

```python
# Good
def care_receipient_log_in(
    care_receipient_log_in_request: CareReceipientLogInRequest,
    token: str = Header(None),
    db: Session = Depends(get_db),
):
    return authenticate_care_receipient(care_receipient_log_in_request, token, db)

# Bad
def care_receipient_log_in(request: CareReceipientLogInRequest, ...):
```

Authentication is performed **inside the service function**, not via a FastAPI dependency. Routers take
the raw token off the header and hand it to the service: `token: str = Header(None)` alongside
`db: Session = Depends(get_db)`. There is no `Depends(get_current_user)`-style auth dependency.

## Guard Clauses, No Else

Early-exit with `raise` or `return` — keeps the happy path at the lowest indentation level. Never write an
`else` branch when the `if` branch exits.

Compound `or` guards where each condition represents a different failure mode must be split into separate
`if` blocks — each failure mode remains readable and raiseable in isolation:

```python
# Good
if care_receipient is None:
    raise InvalidCredentialsToAccessCareReceipient
if care_receipient.user_id != token_caregiver_id:
    raise InvalidCredentialsToAccessCareReceipient

# Bad
if care_receipient is None or care_receipient.user_id != token_caregiver_id:
    raise InvalidCredentialsToAccessCareReceipient
```

## None Checks

Do not use falsy checks as None guards — SQLModel objects can evaluate as falsy in unexpected states. Use
`if care_receipient is None:` explicitly. **This rule leads the code:** existing services use `if not
care_receipient:`; prefer the explicit `is None` form going forward.

```python
# Good
if care_receipient is None:
    raise CareReceipientNotFoundException

# Bad — ambiguous for ORM objects
if not care_receipient:
    raise CareReceipientNotFoundException
```

## Comparisons

Always repeat the full comparison rather than using `in` / `not in` — each condition is independently
readable, and future conditions won't silently fold into the group.

```python
# Good
if mood.mood != SelectedMood.SAD and mood.mood != SelectedMood.OK:
    ...

# Bad
if mood.mood not in [SelectedMood.SAD, SelectedMood.OK]:
    ...
```

## Exception Handling

Each exception type gets its own `except` block — handlers often diverge over time; grouping prevents
adding different handling without first splitting the block. Never group exception types in a tuple, even
when the handler is identical (services already follow this):

```python
# Good
except InvalidCredentialsToAccessCareReceipient:
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials to access care receipient",
    )
except CareReceipientNotFoundException:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Care receipient not found",
    )
except NoRecordFoundException:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Care receipient not found",
    )

# Bad
except (InvalidCredentialsToAccessCareReceipient, CareReceipientNotFoundException):
    raise
```

## List Comprehensions

Always inline single-use transformations directly in `return` / construction statements — avoids naming a
throwaway variable that only exists to be passed on the next line:

```python
return GetCareReceipientDashboardResponse(
    care_receipient_id=care_receipient_id,
    name=care_receipient.name,
    moods=[
        CareReceipientDashboardMoodData(mood=mood.mood, created_at=mood.created_at)
        for mood in mood_models
    ],
    ...
)
```

## Function Signatures

Three or more parameters must be one per line, closing paren on its own line — makes signature changes
diff-friendly; adding one parameter touches exactly one line.

```python
# Good
def get_create_care_receipient_mood_response(
    request: CareReceipientMoodRequest,
    care_receipient_id: int,
    token: str,
    db: Session,
) -> CreateCareReceipientMoodResponse:
    ...
```

Must use `*` to force keyword-only arguments when a function has optional boolean flags — prevents
unreadable positional boolean calls like `update(care_receipient, True, False)`.

## Type Annotations

- **Preference** — Use `Optional[T]` over `T | None`. The `schemas/` and `models/` layers consistently use
  `Optional[T]` (e.g. `unit: Optional[str] = None`); keep new schema/model code consistent. (`crud.py`
  return types currently use `T | None` — do not propagate that into schemas/models.)
- Use `list[T]` (lowercase) in function signatures, never `List[T]` from typing — `List[T]` is deprecated
  since Python 3.9 (PEP 585). Models still import `List` for SQLModel relationship annotations; leave those
  as-is, but new function annotations use `list[T]`.
- **Preference** — No walrus operator (`:=`) — it is visually similar to `==`; misreading one for the other
  is a silent correctness bug. (`utils/token.py` has one legacy use.)
- Never use `from __future__ import annotations` — defers annotation evaluation in ways that can break
  Pydantic v2, which evaluates annotations at class creation time.

## Multi-Value Returns

Functions that return multiple values use a typed `@dataclass`, never a tuple — tuple returns require
callers to unpack positionally; adding a field breaks all callers silently. (No multi-value returns exist
yet — this is the convention to use the first time one is needed.)

```python
# Good
@dataclass
class CheckinStreak:
    consecutive_checkins: int
    consecutive_non_checkins: int

def _get_checkin_streak(...) -> CheckinStreak:
    return CheckinStreak(consecutive_checkins=c, consecutive_non_checkins=n)

# Bad
def _get_checkin_streak(...) -> tuple:
    return c, n
```

## Constants

Inline string and numeric literals that represent fixed named values must be defined as module-level
constants, never inlined at the usage site — a name makes the value self-documenting and ensures updates
happen in one place (`SHOULD_ALERT_CAREGIVER_CRITERION = 2` in `services/care_receipient.py`).

Module-private constants — those used only within their defining module — take a leading underscore
(`_MOOD_MESSAGES`). Constants imported by other modules do not.

Always use `_` as a thousands separator for integer literals ≥ 1000 — makes large literals scannable:
`10_000`, `60_000`.

Always use **tuples** (not lists) for constant sequences — immutable by construction; a list invites
accidental mutation (`DEFAULT_MOOD_MESSAGES_ENGLISH`, `DEFAULT_MOOD_MESSAGES_CHINESE`, … are all tuples):

```python
DEFAULT_MOOD_MESSAGES_ENGLISH = (
    "Every day is a new beginning.",
    "You are stronger than you think.",
    ...
)

_MOOD_MESSAGES: dict[AppLanguage, tuple[str, ...]] = {
    AppLanguage.ENGLISH: DEFAULT_MOOD_MESSAGES_ENGLISH,
    AppLanguage.CHINESE: DEFAULT_MOOD_MESSAGES_CHINESE,
}
```

## CRUD: One Expression, Service Prepares

Must instantiate CRUD and call the method in a single expression. Never assign the CRUD instance to an
intermediate variable — the instance has no reusable state. **This rule leads the code:** a few service
helpers still bind `crud = CRUDCareReceipient(db)`; new code uses the single-expression form:

```python
# Good
mood_models = CRUDMood(db).get_by({"care_receipient_id": care_receipient_id})

# Bad
crud = CRUDCareReceipient(db)
care_receipient = crud.get(care_receipient_id)
```

The service layer is responsible for deciding and preparing values. Pass already-prepared values to the
CRUD method — never let CRUD derive or compute them.

## CRUD Mutation Methods

Must follow distinct phases, separated by blank lines: (1) prepare, (2) set attributes, (3) DB ops,
(4) return. Omit a phase only when there is nothing to do in it (e.g. no preparation needed):

```python
def suspend(self, account: CareReceipient) -> CareReceipient:
    account.is_suspended = True          # 2. set attributes

    self.session.add(account)            # 3. DB ops
    self.session.commit()
    self.session.refresh(account)

    return account                       # 4. return
```

## SQLModel Query Chaining

Must wrap multi-line chains in parentheses. Never combine `.where()` conditions with `&` — chain separate
`.where()` calls so each filter is independently readable:

```python
# Good
statement = (
    select(Mood)
    .where(Mood.care_receipient_id == care_receipient_id)
    .order_by(Mood.created_at.desc())
    .limit(limit)
)

# Bad
statement = select(Mood).where(
    (Mood.care_receipient_id == care_receipient_id) & (Mood.created_at > cutoff)
)
```

## Pydantic Models

Schemas are Pydantic v2 and configure behaviour with an inner `class Config` (`use_enum_values`,
`from_attributes`, `arbitrary_types_allowed`) — match that style rather than `model_config = ConfigDict(...)`.

**Response schemas** (`Get…Response`, `Create…Response`, `…Data`) must not have field defaults. Every field
must be explicitly populated at construction. If a field can be absent, type it `Optional[T]` but do not
add `= None` — require the caller to pass `None` explicitly. Defaults on response models hide missing
fields silently. **This rule leads the code:** a few response fields still carry `= None` — don't add more.

**Mutable field defaults** must use `Field(default_factory=...)` — mutable defaults are shared across all
instances in Python; a plain `[]` default means every instance shares the same list.

**External API responses** must be parsed through a Pydantic model before any field access — dict key
access fails at access time; Pydantic validation fails at the boundary, which is where you want to
discover schema changes. This applies to anything `gateway.py` receives from the WhatsApp API.

Do not add `model_config = ConfigDict(extra="forbid")` (or `Config.extra = "forbid"`) unless there is a
specific reason — the project default is permissive; `extra="forbid"` breaks when external APIs add new
fields.

## Exception Classes

Exceptions are bare marker classes in `exceptions.py` — no `__init__`, no error codes, no messages:

```python
class CareReceipientNotFoundException(Exception):
    pass

# Raising — no ()
raise CareReceipientNotFoundException
```

The **service** catches the marker and translates it into an `HTTPException` with the status code and
user-facing message. Keep the marker class free of presentation concerns; the status/message decision
belongs in the service's `except` block:

```python
try:
    care_receipient = CRUDCareReceipient(db).get(care_receipient_id)
    if care_receipient is None:
        raise CareReceipientNotFoundException
    ...
except CareReceipientNotFoundException:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Care receipient not found",
    )
```

Name every exception with an `Exception` suffix (`CareReceipientNotFoundException`). One legacy class
(`InvalidCredentialsToAccessCareReceipient`) omits the suffix — don't follow it.

## Error Messages

The `HTTPException(detail=...)` string is what the user sees: second person where natural, sentence-case,
capital first word. Reads as feedback, not a developer note:

```
"Invalid credentials to access care receipient"
"Mood for today has already been recorded. Please try again tomorrow"
"Cannot delete care receipient that is not under current caregiver"
```

Not: `"permission denied"`, `"invalid token"`.

## Validation

There is no dedicated validator layer (no `get_validated_*` / `validate_can_*` helpers). Validation and
authorization checks are inline in the service function, guarding with `if … : raise <Exception>` before
the happy path — see `_authenticate_care_receipient` and `_assert_caregiver_owns_care_receipient` in
`services/care_receipient.py`. Keep these checks at the top of the service function, raising marker
exceptions that the surrounding `try/except` translates to `HTTPException`.

## Database Model Field Ordering

1. Primary key
2. Business fields (name, contact_number, age_range, postal_code, …)
3. State/boolean fields (`is_suspended`, `can_record_mood`)
4. Timestamp fields (`created_at`)
5. Foreign key IDs (`user_id`)
6. Relationship declarations (`caregiver`, `moods`)

`models/care_receipient.py` is the reference. (Its current field order is only loosely sorted — follow the
ordering above for new models and new fields.)

## String Field Defaults

Use `""` (empty string) as the default for optional string fields in domain models, never `None`. Reserve
`None` for fields that are genuinely absent/unknown — this keeps `Optional[T]` meaningful rather than
routine. `unit: Optional[str] = None` on `CareReceipient` is correct precisely because a missing unit
number is genuinely unknown, not "not yet provided".

## Datetime

Always `datetime.now(timezone.utc)`. Never `datetime.now()` (returns a naive datetime with no timezone) or
`datetime.utcnow()` (deprecated, also naive). The app's domain timezone is `Asia/Singapore` — the nightly
scheduler (`scripts.py`) is already timezone-aware via `pytz.timezone("Asia/Singapore")`. **This rule leads
the code:** mood creation and care-recipient creation still call the naive `datetime.now()`; new code is
timezone-aware.

```python
# Good
time_now = datetime.now(timezone.utc)

# Bad
time_now = datetime.now()     # naive — no timezone info
time_now = datetime.utcnow()  # deprecated, also naive
```
