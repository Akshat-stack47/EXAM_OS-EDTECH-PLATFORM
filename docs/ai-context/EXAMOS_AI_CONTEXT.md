# ExamOs — AI Context Guide

## Project Overview

ExamOs is a **Next.js 16** (App Router, React 19, TypeScript 6) exam‑prep SaaS.  
Permissions by role (`STUDENT | TEACHER | PARENT | COORDINATOR | ADMIN`).  
Database: **Neon (Postgres via Prisma)** + **Upstash Redis** for rate‑limiting/queues.  
Auth: **Supabase** (email/password + magic links).  
State: **tRPC v11** (React Query on client) + **Zustand** for local UI.  
Payments: **Stripe** (one‑time & subscription).  
Notifications: **Resend** (email), **In‑app** (DB polling).  
Search: **Typesense**.  
Queue: **BullMQ** (Upstash).  
Monitoring: **Sentry** (Next.js SDK).  
UI: **shadcn/ui + Tailwind v4 + Radix** primitives.

## Critical Architectural Rules

1. **tRPC first** — every mutation/query goes through tRPC; no REST endpoints.
2. **Server Components by default** — client components only when interactivity is required.
3. **No barrel exports** — deep imports only (`@/lib/db` not `@/lib`).
4. **No `any`** — use `unknown` + Zod inference for typed boundaries.
5. **Zod validation on every public procedure input** — use Zod schemas in the procedure.
6. **Caching with `react‑query` `staleTime`** — prefer `staleTime` over `getServerSideProps`.
7. **`use client` only where needed** — keep the boundary as close to leaf components as possible.

## Patterns — Do This

- Use `Server Component → Client Component` composition with children/React nodes.
- `server/trpc.ts` base procedures (`studentProcedure`, `teacherProcedure`, etc.).
- `lib/errors.ts` `AppError` for known errors; wrap with `TRPCError` in routers.
- `db` instance from `@/lib/db` — always the Prisma client singleton.
- `sentry` wrapped in `withServerInstrumentation` for critical paths.
- Use `createTRPCRouter({ ... })` for every route group.

## Anti‑Patterns — Never

- ❌ `fetch()` in client components — use tRPC hooks.
- ❌ `Prop‑drilling` beyond 2 levels — prefer composition or Zustand.
- ❌ `any` cast — use `z.infer<typeof schema>`.
- ❌ `try/catch` swallowing — always re‑throw or use `AppError`.
- ❌ `process.env` in client code — use `NEXT_PUBLIC_` prefix.
- ❌ `hard‑coded strings` — use i18n via `i18next`.
- ❌ `direct DB writes` outside tRPC or server actions.
