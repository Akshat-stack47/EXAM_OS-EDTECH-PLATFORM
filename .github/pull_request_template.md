## Description

<!-- Briefly describe what this PR does -->

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor
- [ ] Documentation
- [ ] CI / Infra

## AI Governance Checklist

- [ ] No barrel exports (> 3 symbols in index.ts)
- [ ] No `any` type (uses `unknown` + Zod inference)
- [ ] tRPC routers use base procedures (`studentProcedure`, etc.)
- [ ] `publicProcedure` has Zod `.input()` validation
- [ ] No `use client` in layout/page files
- [ ] No hard‑coded strings > 40 chars without `t()`
- [ ] Imports use `@/` alias (no deep `../../../`)
- [ ] Empty catch blocks removed or handled
- [ ] Tests added/updated in `tests/unit/` or `tests/integration/`
- [ ] `pnpm audit:ai` passes locally

## Testing

- [ ] `pnpm test` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` passes

## Screenshots (if applicable)

<!-- Add screenshots to help explain your changes -->
