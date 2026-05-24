# Hard Rules — Automated Enforcement

These rules are enforced by **automated CI** and will **fail the build** when violated.  
Run `pnpm audit:ai` locally to check before pushing.

---

## 1. No Barrel Exports
- `index.ts` must NOT re-export more than 3 symbols.
- Pattern checked: `export { ... } from './*'` with > 3 members.

## 2. No `any` Type
- `tsc --noEmit` must pass with `strict: true`.
- Any file containing `: any` or `as any` triggers a warning (eslint `@typescript-eslint/no-explicit-any: warn`).

## 3. tRPC Router Structure
- Every `*.router.ts` file must export a `createTRPCRouter` call.
- Must NOT contain raw `t.procedure` calls — must use base procedures from `server/trpc.ts`.

## 4. Zod Validation on Public Procedures
- Every `publicProcedure` must have a `.input(z.object({...}))` or `.input(mySchema)` call.

## 5. `use client` Hygiene
- Files named `*.client.tsx` must start with `'use client'`.
- No `'use client'` in `layout.tsx` or `page.tsx` (they are Server Components by default).
- No `useState`, `useEffect`, or React hooks in files without `'use client'`.

## 6. i18n Hard‑coded Strings
- JSX text nodes must NOT contain raw strings longer than 40 characters without a `t()` call.
- Checked by `eslint-plugin-i18next` (configured in `.eslintrc.json`).

## 7. Import Paths
- No relative imports that traverse more than 3 levels up (`../../../`).
- Use `@/` alias for project imports.
- No barrel imports from `@/lib`, `@/components`, etc.; must import from specific file.

## 8. Error Handling
- Every `catch` block must either: (a) re‑throw, (b) call `AppError`, or (c) call `reportError`/`sentry.captureException`.
- Empty `catch {}` is a **hard error**.

## 9. Test Coverage
- New features must include tests in `tests/unit/` or `tests/integration/`.
- Coverage thresholds: branches 70%, functions 70%, lines 70%, statements 70%.

## 10. Dependency Rules
- `lib/` must not import from `components/` or `app/`.
- `server/` must not import from `app/` (UI layer).
