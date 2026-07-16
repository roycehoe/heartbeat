# STYLE.md

Personal coding idioms for this codebase (the `frontend/` React + Vite SPA). Follow these when writing or
reviewing code. This document only contains things Claude would get wrong without being told — not
standard React/TypeScript conventions, and not patterns already covered in `CLAUDE.md`.

**Stack:** React 18, React Router v6, TanStack Query v5, **Chakra UI v2 + OGP Design System**
(`@opengovsg/design-system-react`), Axios, TypeScript, Vite. There is no Tailwind, no Shadcn, no
component-library `button.tsx`, and no `cn()` helper.

**Automated enforcement:** ESLint via `pnpm run lint` (flat config in `eslint.config.js`). Everything else
is code-review only.

**Rule strength:** All rules are hard requirements unless marked **Preference**.

**Some rules lead the code.** Where a rule says "always" but existing code does otherwise, the rule is the
target and new code follows it — flagged inline below.

## API Hooks

### Folder Structure

`src/api/` is **flat** — one file per endpoint, plus three shared files at the root:

```
api/
├── httpClient.ts      # the two Axios clients
├── types.ts           # shared domain enums + interfaces
├── constants.ts       # shared API constants
├── getCaregiverDashboardResponse.ts
├── getCareReceipientMoodResponse.ts
├── postMagicLinkVerify.ts
└── ...
```

There are no per-feature subfolders. When adding an endpoint, add a new file at the root of `src/api/`.

### File and Hook Naming

One file per endpoint, one exported hook per file. Files are PascalCase verb-resource (`Response` suffix
is conventional here); hooks are `use` + the same name:

|               | Pattern                       | Example                                                    |
| ------------- | ----------------------------- | ---------------------------------------------------------- |
| File          | `{verb}{Resource}Response.ts` | `getCaregiverDashboardResponse.ts`, `getCareReceipientMoodResponse.ts` |
| Query hook    | `useGet{Resource}Response`    | `useGetCaregiverDashboardResponse`                         |
| Mutation hook | `useGet{Resource}Response`    | `useGetCareReceipientMoodResponse`                         |

### File Structure

**Query (GET):**

```typescript
export async function getCaregiverDashboardResponse(): Promise<
  AxiosResponse<CareReceipientDetailOut[]>
> {
  return await httpClient.get("/admin/dashboard");
}

export function useGetCaregiverDashboardResponse() {
  return useQuery({
    queryKey: ["caregiver", "dashboard"],
    queryFn: () => getCaregiverDashboardResponse(),
    refetchInterval: 5 * 60 * 1000,
  });
}
```

**Mutation (POST / PUT / DELETE):**

```typescript
export async function getCareReceipientMoodResponse(
  moodRequest: CareReceipientMoodRequest,
  careReceipientId: number
): Promise<CareReceipientMoodOut> {
  const response = await httpClient.post(`/user/${careReceipientId}/mood`, moodRequest);
  return response.data;
}

export function useGetCareReceipientMoodResponse(careReceipientId: number) {
  return useMutation({
    mutationFn: (request: CareReceipientMoodRequest) =>
      getCareReceipientMoodResponse(request, careReceipientId),
  });
}
```

### Query Keys

Use a resource hierarchy, never the function name. This enables prefix-based cache invalidation —
`queryClient.invalidateQueries({ queryKey: ["caregiver"] })` clears all caregiver queries at once. **This
rule leads the code:** existing hooks use the function name as the key (`["getCaregiverDashboardResponse"]`)
— write new keys as a resource hierarchy.

```typescript
// Good — resource hierarchy
queryKey: ["caregiver", "dashboard"]
queryKey: ["careReceipient", careReceipientId]
queryKey: ["careReceipient", careReceipientId, "moods"]

// Bad — function name as key, cannot be prefix-invalidated meaningfully
queryKey: ["getCaregiverDashboardResponse"]
```

Include dynamic values at the end of the key in the order they appear in the URL path.

### Response Unwrapping

Unwrap `response.data` inside the async function and return the typed data directly, so the hook's `data`
is immediately the right type. **This rule leads the code:** some query functions still return a raw
`AxiosResponse` (e.g. `getCaregiverDashboardResponse`) and unwrap at the call site — new query functions
unwrap in the async function, as the mutation functions already do.

```typescript
// Good — unwrapped in the async function
async function getCareReceipientMoodResponse(...): Promise<CareReceipientMoodOut> {
  const response = await httpClient.post(...);
  return response.data;
}

// Avoid — raw AxiosResponse leaks out, every caller unwraps .data
async function getCaregiverDashboardResponse(): Promise<AxiosResponse<CareReceipientDetailOut[]>> {
  return await httpClient.get("/admin/dashboard");
}
```

### Cache Invalidation

`invalidateQueries` belongs in the component or page that triggers the mutation, never inside the hook —
the hook doesn't know what else needs refreshing after a mutation; the caller does. **This rule leads the
code:** some hooks call `invalidateQueries` in `onSuccess` internally — move new invalidations to the
component.

```typescript
// Good — invalidation in the component
const { mutate } = useGetCareReceipientMoodResponse(careReceipientId);

mutate(request, {
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["careReceipient", careReceipientId] });
  },
});
```

### HTTP Client

Always use a client from `@/api/httpClient` — never create a new axios instance or call axios directly.
There are two:

- `httpClient` — sends both `token` and `clerk_token` headers from `localStorage`; used for all normal API
  calls.
- `httpClerkClient` — sends the Clerk token; used only for the Clerk → app-token exchange at login.

Base URL is `http://localhost:8000` in dev and `/api` in prod (chosen via `import.meta.env.DEV`).

### Conditional Queries

Use `enabled: !!param` to prevent a query from firing until its required parameter exists. Always `!!`, not
`Boolean()` or an explicit null check.

```typescript
export function useGetCareReceipientResponse(careReceipientId: number) {
  return useQuery({
    queryKey: ["careReceipient", careReceipientId],
    queryFn: () => getCareReceipientResponse(careReceipientId),
    enabled: !!careReceipientId,
  });
}
```

### Request and Response Interfaces

Shared domain shapes (the request/response types passed across the app) live in `src/api/types.ts` and are
imported by both hooks and components — e.g. `CareReceipientCreateRequest`, `CareReceipientDetailOut`,
`CareReceipientMoodRequest`. Keep one-off request/response shapes used only by a single hook in that hook's
file. Always PascalCase.

---

## Forms

**Target stack:** react-hook-form + Zod (`zodResolver`), rendered with Chakra field components. RHF and Zod
are **not yet installed** — current forms use a controlled `useState` object plus `handleChange` (see
`CreateCareReceipientForm` / `DEFAULT_CREATE_CARE_RECEIPIENT_FORM` in
`pages/Caregiver/CreateCareReceipient/index.tsx`). Adopt RHF + Zod for new forms; the rules below describe
that target.

### Schema Co-location

The Zod schema lives in the same file as the form component. Never extract a schema into a separate file —
if a schema needs to be shared, that means the form itself should be shared.

### Static Constants at Module Scope

Define `formSchema` and other static constants (default values, option arrays) at module scope, not inside
the component function — a constant defined inside a component is recreated on every render.

```typescript
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  age_range: z.nativeEnum(AgeRange),
  race: z.nativeEnum(Race),
  gender: z.nativeEnum(Gender),
  appLanguage: z.nativeEnum(AppLanguage),
});

export function FormCreateCareReceipient() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", race: Race.CHINESE, gender: Gender.MALE },
  });
}
```

### Enum Fields

Always use `z.nativeEnum()` for enum-typed fields — never `z.string()` for a field whose values come from
an enum in `src/api/types.ts` (`SelectedMood`, `Race`, `Gender`, `AppLanguage`, `AgeRange`).

### Validation Error Messages

Validation messages belong in the Zod schema, not rendered manually in JSX — keeps validation logic and
its messaging co-located.

### Rendering

Render fields with Chakra: `<FormControl isRequired isDisabled={isPending}>` wrapping `<FormLabel>` and
`<Input>` / `<Select>` (see `FormInputCareReceipient.tsx`). Disable **all** inputs while the mutation is
pending, not just the submit button.

### Pre-populating Edit Forms

Edit forms receive existing data as props from a parent that has already resolved the query, and pass it
straight into `defaultValues` — never `useEffect` + `form.reset()` to populate after mount. The parent
gates rendering behind `isLoading` so the form initialises with real data.

### Reset

Call `form.reset()` in `onSuccess` after a successful submission. Do not reset on close or cancel — a failed
or abandoned form keeps its state.

---

## File and Folder Naming

| Thing                 | Convention        | Example                                                  |
| --------------------- | ----------------- | -------------------------------------------------------- |
| Folders               | `PascalCase`      | `CreateCareReceipient/`, `CareReceipientDetail/`         |
| Component files       | `PascalCase.tsx`  | `ModalDeleteCareReceipient.tsx`, `TableMoodSnapshot.tsx` |
| All other `.ts` files | `camelCase.ts`    | `getCaregiverDashboardResponse.ts`, `types.ts`, `utils.ts` |

`src/` has exactly four folders: `api/`, `components/`, `pages/`, `assets/`. There is no `src/lib`,
`src/constants`, `src/types`, or `src/forms`. Shared helpers live in a feature-local `utils.ts` (e.g.
`pages/Caregiver/utils.ts`); don't duplicate utilities across components.

## Component Naming

Components follow `[Category][Context].tsx`. The category prefix describes what kind of component it is;
the context is the specific subject, added only as far as needed to disambiguate within the folder.

| Category | Used for                  | Example                                  |
| -------- | ------------------------- | ---------------------------------------- |
| `Form`   | Form components / fields  | `FormInputCareReceipient.tsx`, `FormFieldsCareReceipientCreateUpdate.tsx` |
| `Modal`  | Chakra modal dialogs      | `ModalDeleteCareReceipient.tsx`, `ModalLogout.tsx`, `ModalMoodStreak.tsx` |
| `Table`  | Table renderers           | `TableMoodSnapshot.tsx`                  |
| `Card`   | Card display components   | `ShareLoginLinkCard.tsx`                 |
| `Icon`   | Icon wrapper components    | `IconArrowLeft.tsx`, `IconMood.tsx`, `IconGear.tsx` |

When the category alone is self-explanatory within the folder, the context suffix can be omitted.

## Function Naming

Function names reflect their specific use in context — never a generic description of the operation in the
abstract. Functions read as verbs, not nouns or class names.

```typescript
// Good — tied to the specific domain operation
getSubmitCreateCareReceipientFormErrorMessage(form)
handleCreateCareReceipient()

// Bad — generic, could apply anywhere
validateForm()
handleClick()
```

## General Conventions

- Never write comments or JSDoc — names must be self-documenting. The only exception is a non-obvious
  business constraint that cannot be expressed in the name.
- Always use `import type` for type-only imports.
- Never wrap a single element in a fragment — only use fragments when returning multiple siblings with no
  container element needed.
- Never leave `console.log` in production code. If an error needs surfacing, display a user-readable
  message — see [Error Display](#error-display).

```typescript
// Good
import type { CareReceipientDetailOut } from "@/api/types";

// Bad
import { CareReceipientDetailOut } from "@/api/types";
```

## Boolean Naming

Boolean variables always use an `is`/`can`/`has` prefix — `isPending`, `isOpen`, `hasCreatedUserSuccessfully`.
A plain noun or verb without the prefix doesn't read as a boolean predicate at the call site.

## State Typing

Pass an explicit type parameter to `useState` when the value isn't a plain primitive literal. When the
state holds a domain type, be explicit so the type isn't lost.

```typescript
// Good
const [createCareReceipientForm, setCreateCareReceipientForm] =
  useState<CreateCareReceipientForm>(DEFAULT_CREATE_CARE_RECEIPIENT_FORM);

// Bad — domain type lost
const [form, setForm] = useState(DEFAULT_CREATE_CARE_RECEIPIENT_FORM);
```

## Enum State Machines

When a UI component can be in more than two mutually exclusive states, model it as an enum rather than
multiple boolean flags. Boolean flags compound — two flags give four possible states, most of which are
invalid.

```typescript
// Good — one valid state at a time
enum DashboardView {
  LIST = "List",
  DETAIL = "Detail",
}
const [view, setView] = useState<DashboardView>(DashboardView.LIST);

// Bad — two flags, invalid combinations possible
const [isListView, setIsListView] = useState(true);
const [isDetailView, setIsDetailView] = useState(false);
```

## Hook Return Shape

Custom hooks always return a named object, never a tuple — positional unpacking breaks silently when a
hook grows a new value.

```typescript
// Good
const { settings, setSettings } = useAppearanceSettings();

// Bad
const [settings, setSettings] = useAppearanceSettings();
```

## Dialogs

Dialogs use Chakra `<Modal>` — `ModalOverlay`, `ModalContent`, `ModalHeader`, `ModalBody`, `ModalFooter`
(see `ModalDeleteCareReceipient.tsx`).

Default to the **parent-controlled** pattern: the parent owns `isOpen`/`onClose` (typically via Chakra's
`useDisclosure`) and passes them in, so the dialog is reusable and the trigger lives with the parent.

```tsx
function ModalDeleteCareReceipient({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete User</ModalHeader>
        <ModalBody>...</ModalBody>
        <ModalFooter display="flex" justifyContent="flex-end" gap={3}>
          <Button onClick={onClose}>Cancel</Button>
          <Button colorScheme="red" onClick={onConfirm}>Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
```

## Error Display

Render inline form errors with a Chakra `<Alert status="error">` containing `<AlertIcon>` and
`<AlertDescription>`. Place it below the form content and above the action button, and hide it while empty:

```tsx
<Alert status="error" variant="subtle" hidden={errorMessage === ""}>
  <AlertIcon />
  <AlertDescription>{errorMessage}</AlertDescription>
</Alert>
```

Use Chakra's `useToast()` for transient success/failure notifications (e.g. after creating a user), not for
inline validation feedback.

```tsx
const toast = useToast();
toast({ title: "User created", status: "success", duration: 9000, isClosable: true });
```

## Mutation Error Pattern

Clear `errorMessage` to `""` before (or on) a successful submit, then set it in `onError` — never leave a
stale error from a previous attempt on screen during a new one.

```typescript
mutate(values, {
  onSuccess: () => {
    setErrorMessage("");
    // ...
  },
  onError: () => setErrorMessage("Something went wrong. Please try again later."),
});
```

## Loading States

Gate loading UI on `isLoading` (from `useQuery`) / `isPending` (from `useMutation`) — not `isFetching`,
which is also true during background refetches and would flash a spinner over already-rendered content
during the 5-minute `refetchInterval`.

Render a Chakra `<Spinner>` for the loading state; use `<Fade in={!isLoading}>` to reveal content once
ready.

```tsx
const { data, isLoading } = useGetCaregiverDashboardResponse();
if (isLoading || !data) return <Spinner />;
```

## Button Pending State

Loading buttons use the Chakra / OGP `<Button>` `isLoading` prop (which renders the spinner and disables
the button) — never a hand-rolled spinner-plus-label. Change the idle label to a progressive verb form only
where it adds clarity.

```tsx
<Button onClick={handleCreateCareReceipient} isLoading={isPending}>
  Create account
</Button>
```

## Conditional Branching

Use `if` with early returns for loading/error states and enum-driven JSX. Include a final fallback return so
enum additions are caught at review time.

```tsx
if (isLoading) return <Spinner />;
if (isError) return <ErrorDisplay />;

if (mood === SelectedMood.HAPPY) return <IconHappy />;
if (mood === SelectedMood.OK) return <IconOk />;
if (mood === SelectedMood.SAD) return <IconSad />;
return <IconUnknown />;
```

When there is a single positive condition, return it directly rather than splitting into two `return`
statements:

```tsx
// Good
return isPending ? <Spinner /> : null;
```

Use `switch` for longer non-rendering logic chains — value mappings and similar pure computations.

## Styling

Style with Chakra props and theme tokens, not raw CSS. Spacing, color, and layout come from Chakra props
(`display`, `flexDirection`, `gap`, `bg`, `color`, `mt`) or the `sx` prop; colors use Chakra theme tokens
(`color="gray.500"`, `bg={colorTag}`), never arbitrary hex.

```tsx
// Good
<Box display="flex" flexDirection="column" gap="12px">
  <Text color="gray.500" fontSize="sm" mt={2}>...</Text>
</Box>

// Bad — arbitrary hex / raw CSS values
<Box style={{ color: "#6b7280" }} />
```

`index.css` holds only global resets and the handful of shared classes (e.g. `.page`); reach for it only
when something genuinely cannot be expressed with Chakra props. There is no Tailwind and no `cn()` helper.

## Tables

Tables are built from Chakra primitives — `TableContainer`, `Table`, `Thead`, `Tbody`, `Tr`, `Th`, `Td`
(see `TableMoodSnapshot.tsx`). There is no TanStack Table; don't introduce column-definition helpers,
`getRowId`, or a four-file table structure. A table is a single component that takes its data as props and
maps over it.

```tsx
<TableContainer>
  <Table size="sm" variant="simple">
    <Thead>...</Thead>
    <Tbody>
      {dashboardData.map((user) => (
        <TableMoodSnapshotRow key={user.care_receipient_id} ... />
      ))}
    </Tbody>
  </Table>
</TableContainer>
```

## Enums and Constants

Never use magic strings or numbers directly in code — promote them to a named enum or constant.

### Placement

- **Enums** (and shared domain interfaces) → `src/api/types.ts`.
- **Shared API constants** → `src/api/constants.ts`.
- **Page-local config** (form field definitions, option arrays) → that page's `constants.tsx`
  (e.g. `pages/Caregiver/constants.tsx`).

### Naming

Constants are `SCREAMING_SNAKE_CASE` (`UPDATE_CARE_RECEIPIENT_FORM_FIELDS_PROPS`,
`DEFAULT_CREATE_CARE_RECEIPIENT_FORM`). Enums are `PascalCase` with `SCREAMING_SNAKE_CASE` members
(`AgeRange.UNDER_45`, `SelectedMood.HAPPY`).

---

## Types

### `interface` vs `type`

Use `interface` for object shapes you write by hand — domain models, API shapes, component props. Use `type`
for anything computed or derived (unions, `z.infer<...>`, utility types).

```typescript
// Good — hand-written object shape
interface CareReceipientDetailOut {
  care_receipient_id: number;
  name: string;
  age_range: AgeRange;
}

// Good — derived
type FormValues = z.infer<typeof formSchema>;
```

### Placement

Shared interfaces live in `src/api/types.ts`. Component prop shapes stay inline in the component file when
used only there. Zod-derived form value types live with the form.

---

## Timeouts

Request timeouts are named constants, not inline numbers buried at the call site. The Axios clients in
`httpClient.ts` set a shared timeout (`10000` ms) — if a specific call needs a different timeout, give it a
named constant rather than a literal.

## Routing

Routes are React Router v6, defined inline in `src/App.tsx` inside `<BrowserRouter><Routes>`. There is no
`routes/` folder and no file-based routing — add a `<Route>` to `App.tsx`.
