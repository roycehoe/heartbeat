# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
poetry install

# Run development server (auto-reload)
fastapi dev main.py

# Run production server
fastapi run --port 80 main.py

# Lint
ruff check .

# Format
black .

# Database migrations
alembic upgrade head
alembic revision --autogenerate -m "description"
alembic downgrade -1
```

Tests: `poetry run pytest` (suite under `tests/`).

## Architecture

**FastAPI** backend for a caregiver monitoring platform (elderly care, Singapore timezone). All routes are served under `/api/` (set via `root_path="/api"` in `main.py`).

**Database:** PostgreSQL via SQLAlchemy ORM. Migrations via Alembic. Sensitive columns (`name`, `contact_number` on `CareReceipient`) are encrypted at rest using `sqlalchemy-utils` `EncryptedType` with `DB_ENCRYPTION_SECRET`.

**Auth:** Two-layer JWT system:
1. Admins authenticate via Clerk (external). A Clerk JWT (passed in the `token` header) is verified against Clerk's JWKS endpoint (`RS256`), then exchanged for an internal app JWT (`HS256`).
2. Care recipients log in via a magic link (`POST /user/magic-link/verify`) and receive an app JWT containing `care_receipient_id` and `magic_link_token_id`. Requests are valid only while that magic-link row still exists, so revoking a link ends the session.

**Scheduling:** APScheduler `BackgroundScheduler` runs a nightly cron job at midnight `Asia/Singapore`. The job: resets `can_record_mood`, increments `consecutive_non_checkins` for care recipients who didn't check in, notifies admins via WhatsApp, suspends users who exceed the consecutive-miss threshold, and unsuspends users who do check in.

**External integrations:**
- **Clerk** — admin identity / JWKS verification
- **WhatsApp Business API** (Meta Graph API v22.0) via `gateway.py` — alerts sent to admins

## Code Layout

```
main.py               # App factory, CORS, router registration, scheduler startup
database.py           # SQLAlchemy engine, session, get_db() dependency
settings.py           # Pydantic Settings — all required env vars defined here
enums.py              # SelectedMood, Race, Gender, AppLanguage
crud.py               # Data access layer: CRUDUser, CRUDAdmin, CRUDMood
gateway.py            # WhatsApp HTTP client
scripts.py            # Nightly cron job logic + APScheduler factory

models/               # SQLAlchemy ORM models
  user.py             # User — Clerk-authenticated caregivers/admins
  care_receipient.py  # CareReceipient — elderly person being monitored (note typo in table name)
  mood.py             # Mood — daily check-in records

schemas/              # Pydantic request/response models
routers/              # Thin route handlers (admin, admin_user, user)
services/             # Business logic (admin, admin_user, user, statistics)
utils/                # JWT helpers, bcrypt hashing, mood timeline gap-fill, WhatsApp builders
alembic/              # Migration scripts
```

## Domain Model

- **User** (table: `users`) — caregiver/admin registered via Clerk
- **CareReceipient** (table: `care_receipient`) — elderly person being monitored; has `consecutive_non_checkins`, `is_suspended`, `can_record_mood`
- **Mood** (table: `mood`) — one mood (`happy`/`ok`/`sad`) per care recipient per day

Key behavioral rules:
- `can_record_mood` is set to `False` after a check-in and reset to `True` nightly.
- Two consecutive `sad` moods → WhatsApp alert to admin.
- `ERRANT_USER_CONSECUTIVE_NON_CHECKIN_CRITERION` (default: 3) consecutive missed days → user suspended, admin notified.
- A check-in from a suspended user unsuspends them.

## Environment Variables

Defined in `settings.py`. Required and optional variables, their defaults and local-dev guidance are documented in the root [README.md](../README.md#environment-variables); keep it updated when changing `settings.py`.
