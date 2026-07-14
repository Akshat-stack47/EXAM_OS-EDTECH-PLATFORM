# ExamOS — Phase 0 (Foundation) Claude Implementation Prompt

Copy everything between the line below `=== PROMPT START ===` and `=== PROMPT END ===` and paste it into a new Claude chat session.

---

=== PROMPT START ===

You are acting as a WORLD-CLASS SOFTWARE SYSTEM ARCHITECT, PRINCIPAL FRONTEND/BACKEND ENGINEER, and SUPABASE/NEXT.JS INFRASTRUCTURE SPECIALIST. We are building **ExamOS v2.0** — a unified Exam Intelligence Platform and EdTech ecosystem targeting 200M+ government exam aspirants in India.

We have generated our master engineering roadmap and are now starting **Phase 0 — Foundation**. 

Our codebase already has a solid boilerplate in place. Your job is to analyze the existing setup, understand its architecture, and generate the exact code files to complete **Phase 0**.

---

## 1. EXISTING CODEBASE ARCHITECTURE

We are using a single monolithic Next.js repository with the following structure:
* **Prisma Schema (`prisma/schema.prisma`)**: Fully defined with models for `User`, `StudentProfile`, `TeacherProfile`, `ParentProfile`, `ParentChildLink`, `HealthSurvey`, `WhiteboardSession`, `MockResult`, `AuditLog`, `SubjectScore`, `StudySession`, and `Notification`.
* **Prisma RLS SQL (`prisma/rls-policies.sql`)**: Contains all SQL statements to enable Row-Level Security and create access policies for every table (allowing users to access their own records, parents to view linked student data, and coordinators to manage data globally).
* **Database Connection (`lib/db.ts`)**: Pre-configured Prisma Client that automatically filters out soft-deleted records (`deletedAt: null`) and enforces a 5-second operation timeout.
* **Upstash Cache/Redis (`lib/redis.ts`)**: Set up with `@upstash/redis` and `@upstash/ratelimit`. Provides helpers for general cache, sorted sets for leaderboards, locks, and API rate limits.
* **Structured Logger (`lib/logger.ts`)**: Custom Pino logger that redacts PII data (emails, phones, credentials) from outputs and logs to console.
* **Error Handling (`lib/errors.ts` & `lib/api-response.ts`)**: Structured custom `AppError` class with predefined HTTP statuses and response formatters (`apiSuccess`/`apiError`) ensuring consistent `{success: false, error: {code, message}}` structure.
* **Environment Validation (`lib/env.ts`)**: Uses Zod to strictly validate environment variables on startup.
* **tRPC Server Setup (`server/trpc.ts`)**: Base context extraction utilizing Supabase session validation, custom middleware for sliding window rate limits, and custom procedures: `publicProcedure`, `protectedProcedure`, `studentProcedure`, `parentProcedure`, `teacherProcedure`, and `coordinatorProcedure`.
* **Next.js App Structure (`app/`)**: Route groups initialized: `(auth)`, `(student)`, `(parent)`, `(teacher)`, `(coordinator)`, and `api/trpc`.

---

## 2. THE GOAL OF PHASE 0 (FOUNDATION)

We need to implement the base infrastructural code. You must write/generate production-ready, highly clean, robust, and typed code for the following tasks:

### TASK 1: Comprehensive Database Seed Script (`prisma/seed.ts`)
Write the complete seed script that:
* Populates all core `ExamCategory` enum values.
* Seeds at least 3 major exams (e.g., `UPSC_CSE`, `SSC_CGL`, `BANKING_PO`) with realistic syllabus structures stored as JSONB.
* Seeds 5 mock tests per exam with `totalMarks`, `duration`, and ordered arrays of question IDs.
* Seeds a pool of 20 realistic multiple-choice questions per exam. Each question must have a difficulty rating, topic path (e.g., `polity.constitution.dpsp`), options, correct answer, and detailed explanations.
* Handles upsert operations safely to avoid duplicate records on multiple runs.

### TASK 2: Database Migration & RLS Automation Setup
* Read the `prisma/rls-policies.sql` file and write a Node/TypeScript helper script (`scripts/apply-rls.ts`) using `@prisma/client` to execute the raw SQL statements directly in the Supabase/PostgreSQL database during local deployments or CI/CD pipelines.

### TASK 3: Base Authentication Services
* Complete `server/services/auth.service.ts` and `server/routers/auth.ts`:
  * Core OTP Flow: Mock sending OTP (log to console) and save in Upstash Redis cache (TTL 5 mins) to prevent multi-container state sharing.
  * OTP Verification: Check OTP from Redis, check if user exists in database. If they don't, auto-create the User and their corresponding Profile (e.g., `StudentProfile` for STUDENT role) inside a Prisma transaction.
  * Generate a secure JWT using `jose` with custom claims (role and userId).
  * Ensure every operation calls the `auditLog` handler for compliance.

### TASK 4: BullMQ Scaffolding & Setup
* Scaffold the BullMQ queues and workers setup.
* Create `server/queues/queue-manager.ts` to configure connection strings to Upstash Redis and initialize queues for:
  * `ai-study-plan` (Processing study plans asynchronously after test completions)
  * `analytics-rollup` (Hourly dashboard aggregations)
  * `push-notifications` (FCM/Email alerts)
* Create sample worker registration skeletons demonstrating how to process these background tasks without blockages.

### TASK 5: Zustand Store Scaffolding
Create state stores in `stores/` to handle client state:
* `authStore.ts`: Session management (token, loading state, user metadata, and logout).
* `studentStore.ts`: Current onboarding step, active mock test progress (selected responses, timer remaining, flagged questions).

### TASK 6: Base Dashboard Layout Shells
Create responsive layout containers in `app/` using Tailwind CSS and Vanilla CSS, respecting color palettes and accessibility criteria:
* **Student Dashboard (`app/(student)/layout.tsx`)**: Dark Premium "Gaming" palette (Deep Purple `#7C3AED` and Cyan `#06B6D4`) with custom font variables.
* **Parent Dashboard (`app/(parent)/layout.tsx`)**: Warm Saffron Orange (`#E8722A` and cream `#FFF8F2`) with highly readable fonts.
* **Teacher Dashboard (`app/(teacher)/layout.tsx`)**: Professional Navy Blue (`#1E40AF` and sky `#0EA5E9`).
* **Coordinator Dashboard (`app/(coordinator)/layout.tsx`)**: Terminal Dark (`#0F1117` and Cyan `#00D2FF`) with monospaced style tags.

---

## 3. STRICT CODING SPECIFICATIONS & RULES

1. **TypeScript Strict Mode**: Every function signature must be explicitly typed. Avoid using `any` under any circumstances.
2. **Zero Placeholders**: Write fully functional code. Do not write `// TODO: Implement later` or mock logic unless specified.
3. **No Redundant Code**: Use existing utility modules (`@/lib/db`, `@/lib/redis`, `@/lib/logger`, `@/lib/errors`) for database calls, caching, logging, and error handling.
4. **Prisma Best Practices**: Ensure all raw database transactions handle rollbacks gracefully, and soft-delete states are respected.
5. **PII Safety**: Use the redacting filters from `@/lib/logger` when log output contains user metadata.

Please output the code files labeled with their target paths (e.g. `// File: prisma/seed.ts`). Provide clear setup instructions on how to run migrations, apply RLS, seed the database, and verify tRPC auth endpoints.

=== PROMPT END ===
