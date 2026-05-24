# ExamOS — End-to-End Test Implementation Table

## Test Stack
| Layer | Tool | Config |
|-------|------|--------|
| Unit  | Vitest + @testing-library/react | vitest.config.ts (jsdom, @/ alias) |
| Integration | Vitest + tRPC mock | vitest.config.ts |
| E2E  | Playwright | playwright.config.ts |
| Coverage | Vitest (`--coverage`) | v8 provider |

---

## Phase 1 — Unit Tests (Services & Utilities)

### 1A — Utility Libraries (`lib/`)

| # | File | Test Name | What to Assert | Priority |
|---|------|-----------|----------------|----------|
| 1 | `lib/app-error.test.ts` | `creates AppError with code/message/statusCode` | `new AppError('X','msg',400).code === 'X'` | HIGH |
| 2 | `lib/app-error.test.ts` | `AppError.notFound()` | `statusCode === 404`, `code === 'NOT_FOUND'` | HIGH |
| 3 | `lib/app-error.test.ts` | `AppError.forbidden()` | `statusCode === 403`, `code === 'FORBIDDEN'` | HIGH |
| 4 | `lib/app-error.test.ts` | `AppError.validation()` | `statusCode === 400`, details passed through | HIGH |
| 5 | `lib/app-error.test.ts` | `AppError.internal()` | `statusCode === 500` | HIGH |
| 6 | `lib/app-error.test.ts` | `formatError(AppError)` | returns `{ success: false, error: { code, message } }` | HIGH |
| 7 | `lib/app-error.test.ts` | `formatError(unknown error)` | returns generic `INTERNAL_ERROR`, never leaks stack | HIGH |
| 8 | `lib/crypto.test.ts` | `encrypt/decrypt round-trip` | `decrypt(encrypt('secret')) === 'secret'` | HIGH |
| 9 | `lib/crypto.test.ts` | `encrypt produces different ciphertext each time` | same input → different base64 output (IV random) | MEDIUM |
| 10 | `lib/crypto.test.ts` | `decrypt wrong key fails` | throws on wrong key | HIGH |
| 11 | `lib/pagination.test.ts` | `cursorPaginationSchema` | parses valid input, rejects missing fields | MEDIUM |
| 12 | `lib/pagination.test.ts` | `paginate()` returns `{ items, nextCursor }` | 25 items with limit=20 → 20 items + cursor | HIGH |
| 13 | `lib/pagination.test.ts` | `paginate()` last page returns null cursor | 15 items with limit=20 → no nextCursor | HIGH |
| 14 | `lib/pagination.test.ts` | `paginate()` with cursor skips correctly | cursor mocks skip=1 | MEDIUM |
| 15 | `lib/feature-flags.test.ts` | `get()` returns default for unknown key | `get('nonexistent') === false` | MEDIUM |
| 16 | `lib/feature-flags.test.ts` | `get()` returns `DEFAULT_FLAGS` value | `get('whiteboard.botEnabled') === true` | MEDIUM |
| 17 | `lib/utils.test.ts` | `cn()` merges classes | `cn('a', 'b')` contains both | LOW |
| 18 | `lib/utils.test.ts` | `sha256()` returns hex string | 64-char hex, deterministic | MEDIUM |
| 19 | `lib/utils.test.ts` | `generateId()` returns UUID | matches UUID v4 format | LOW |
| 20 | `lib/performance.test.ts` | `checkPerformanceBudget` passes under limit | `lcp: 1500` → passed=true | LOW |
| 21 | `lib/performance.test.ts` | `checkPerformanceBudget` fails over limit | `lcp: 2500` → passed=false | LOW |
| 22 | `lib/upload.test.ts` | `getPresignedUrl` rejects bad file type | STUDENT tries .exe → throws | HIGH |
| 23 | `lib/upload.test.ts` | `getPresignedUrl` rejects oversized file | STUDENT tries 11MB → throws | HIGH |
| 24 | `lib/upload.test.ts` | `getPresignedUrl` accepts valid type | STUDENT tries PDF → returns url | HIGH |
| 25 | `lib/redis.test.ts` | `cache.getOrSet()` returns cached value | second call skips fetch fn | MEDIUM |
| 26 | `lib/redis.test.ts` | `cache.acquireLock/releaseLock` | acquire → other can't → release → other can | MEDIUM |
| 27 | `lib/redis.test.ts` | `cache.leaderboardAdd/Rank/Top` | add 3 scores → rank correct | MEDIUM |

### 1B — Service Layer (`server/services/`)

| # | File | Test Name | What to Assert | Priority |
|---|------|-----------|----------------|----------|
| 28 | `student.service.test.ts` | `getProfile` returns student with user data | includes `user.name`, `studySessions` | HIGH |
| 29 | `student.service.test.ts` | `getProfile` throws not found for bad userId | `STUDENT_PROFILE_NOT_FOUND` | HIGH |
| 30 | `student.service.test.ts` | `getSubjectScores` returns top 5 ordered | desc by score, max 5 | MEDIUM |
| 31 | `student.service.test.ts` | `logStudySession` creates session + increments total | duration adds to total, returns session | HIGH |
| 32 | `student.service.test.ts` | `logStudySession` uses transaction | if profile update fails, session not created | HIGH |
| 33 | `health.service.test.ts` | `check()` returns ok when DB up | `{ status: 'ok', database: 'connected' }` | MEDIUM |
| 34 | `health.service.test.ts` | `submitSurvey` encrypts notes | stored `notes !== original` | HIGH |
| 35 | `health.service.test.ts` | `getLatest` decrypts notes | returned `notes === original` | HIGH |
| 36 | `health.service.test.ts` | `submitSurvey` calculates overallScore correctly | `(mood + sleep + (10-anxiety) + motivation)/4` | HIGH |
| 37 | `health.service.test.ts` | `submitSurvey` sets correct riskLevel | overallScore >= 7 → LOW, < 2 → CRITICAL | HIGH |
| 38 | `exam.service.test.ts` | `list` returns all exams ordered | [{ examYear desc }, { examName asc }] | MEDIUM |
| 39 | `exam.service.test.ts` | `list` filters by examName | only matching examName | MEDIUM |
| 40 | `exam.service.test.ts` | `getByName` returns by name ordered by year | desc year | MEDIUM |

---

## Phase 2 — Integration Tests (tRPC Routers)

### 2A — Router Tests (`server/routers/`)

| # | File | Test Name | What to Assert | Priority |
|---|------|-----------|----------------|----------|
| 41 | `trpc.test.ts` | `publicProcedure` works without auth | no userId → passes | HIGH |
| 42 | `trpc.test.ts` | `protectedProcedure` rejects unauthed | no userId → throws UNAUTHORIZED | HIGH |
| 43 | `trpc.test.ts` | `studentProcedure` rejects non-student | parent role → FORBIDDEN | HIGH |
| 44 | `trpc.test.ts` | `studentProcedure` accepts student role | student role → next() | HIGH |
| 45 | `trpc.test.ts` | `parentProcedure` rejects non-parent | student role → FORBIDDEN | HIGH |
| 46 | `trpc.test.ts` | `teacherProcedure` rejects non-teacher | student role → FORBIDDEN | HIGH |
| 47 | `trpc.test.ts` | `coordinatorProcedure` rejects non-coordinator | student role → FORBIDDEN | HIGH |
| 48 | `trpc.test.ts` | rate limiting kicks in after 10 requests | 11th request → TOO_MANY_REQUESTS | HIGH |
| 49 | `exam.router.test.ts` | `exam.list` returns ExamCutoff data | array of exam objects | HIGH |
| 50 | `exam.router.test.ts` | `exam.list` with filter works | `{ examName: 'UPSC' }` → filtered | MEDIUM |
| 51 | `student.router.test.ts` | `student.getDashboard` returns profile + scores | expected shape | HIGH |
| 52 | `student.router.test.ts` | `student.logSession` returns session | input `{ durationMinutes: 25 }` | HIGH |
| 53 | `student.router.test.ts` | `student.logSession` validates input | duration < 1 → Zod error | HIGH |
| 54 | `health.router.test.ts` | `health.submit` creates survey | returns survey with riskLevel | HIGH |
| 55 | `health.router.test.ts` | `health.getLatest` returns decrypted notes | notes match original | HIGH |
| 56 | `whiteboard.router.test.ts` | `whiteboard.list` returns user's sessions | created by user | MEDIUM |
| 57 | `whiteboard.router.test.ts` | `whiteboard.create` creates session | returns session with title | HIGH |
| 58 | `whiteboard.router.test.ts` | `whiteboard.getById` returns session | by id | MEDIUM |
| 59 | `ai.router.test.ts` | `ai.chat` returns reply | input message → string reply | MEDIUM |
| 60 | `notification.router.test.ts` | `notification.list` returns notifications | by userId | LOW |
| 61 | `notification.router.test.ts` | `notification.markRead` updates read status | read = true | LOW |

### 2B — Auth & Middleware Tests

| # | File | Test Name | What to Assert | Priority |
|---|------|-----------|----------------|----------|
| 62 | `auth.test.ts` | `auth.requestOTP` creates OTP for email | returns success | HIGH |
| 63 | `auth.test.ts` | `auth.verifyOTP` returns JWT on correct code | token present, role in payload | HIGH |
| 64 | `auth.test.ts` | `auth.verifyOTP` rejects wrong code | throws error | HIGH |
| 65 | `auth.test.ts` | `auth.me` returns user profile | name, email, role | HIGH |
| 66 | `auth.test.ts` | `auth.me` returns null for unauthed | no token → null | HIGH |
| 67 | `proxy.test.ts` | proxy redirects to correct dashboard per role | STUDENT → /student/dashboard | HIGH |
| 68 | `proxy.test.ts` | proxy blocks wrong role access | PARENT → /student/* → redirect | HIGH |
| 69 | `proxy.test.ts` | proxy allows public routes without auth | /, /exams → pass through | HIGH |

### 2C — Database Integrity Tests

| # | File | Test Name | What to Assert | Priority |
|---|------|-----------|----------------|----------|
| 70 | `db.test.ts` | soft delete hides records | `findFirst` with deleted record returns null | HIGH |
| 71 | `db.test.ts` | soft delete keeps record in DB | record still exists (can query directly) | HIGH |
| 72 | `db.test.ts` | query timeout fires on slow queries | >5s query throws | MEDIUM |
| 73 | `db.test.ts` | `$transaction` rolls back on partial failure | session not created if profile update fails | HIGH |
| 74 | `seed.test.ts` | seed creates 14 exam cutoff records | count = 14 | MEDIUM |
| 75 | `seed.test.ts` | seed data has correct structure | examName, examYear, general, etc. | MEDIUM |

---

## Phase 3 — Component Tests (UI)

### 3A — Shared Components

| # | File | Test Name | What to Assert | Priority |
|---|------|-----------|----------------|----------|
| 76 | `AIChat.test.tsx` | renders empty state | "Ask me anything" text visible | MEDIUM |
| 77 | `AIChat.test.tsx` | sends message on button click | calls onSend prop | HIGH |
| 78 | `AIChat.test.tsx` | shows loading state while sending | "Thinking..." visible | MEDIUM |
| 79 | `AIChat.test.tsx` | displays AI response | message list shows both user + AI bubbles | HIGH |
| 80 | `AIChat.test.tsx` | disables send when input empty | button disabled | MEDIUM |
| 81 | `AIChat.test.tsx` | clears input after send | input.value === '' | MEDIUM |
| 82 | `NotificationBell.test.tsx` | renders bell icon | button exists | MEDIUM |
| 83 | `NotificationBell.test.tsx` | shows unread count badge | count > 0 → badge visible | HIGH |
| 84 | `NotificationBell.test.tsx` | opens dropdown on click | dropdown appears | MEDIUM |
| 85 | `NotificationBell.test.tsx` | marks notification as read | click → read state changes | MEDIUM |
| 86 | `LanguageToggle.test.tsx` | shows current language | renders "हिं" or "EN" | MEDIUM |
| 87 | `LanguageToggle.test.tsx` | toggles lang on click | EN → changes to हिं | HIGH |

### 3B — Student Components

| # | File | Test Name | What to Assert | Priority |
|---|------|-----------|----------------|----------|
| 88 | `StudentDashboardView.test.tsx` | renders welcome with name | "Welcome back, {name}" | HIGH |
| 89 | `StudentDashboardView.test.tsx` | shows 4 stat cards | streak, rank, total, today | HIGH |
| 90 | `StudentDashboardView.test.tsx` | shows subject scores bar chart | all subjects rendered | HIGH |
| 91 | `StudentDashboardView.test.tsx` | shows "Log 25min Study" button | button present | MEDIUM |
| 92 | `StudentDashboardView.test.tsx` | shows empty state when no scores | "No subject scores yet" | MEDIUM |
| 93 | `StudyTimer.test.tsx` | renders timer at 25:00 | default display | HIGH |
| 94 | `StudyTimer.test.tsx` | starts countdown on start | time decreases after 1s | HIGH |
| 95 | `StudyTimer.test.tsx` | pauses on pause | time stops decreasing | MEDIUM |
| 96 | `StudyTimer.test.tsx` | resets to 25:00 on reset | time back to start | MEDIUM |
| 97 | `StudyTimer.test.tsx` | shows "Time's up!" at 0 | switches to break mode | HIGH |

### 3C — Parent Components

| # | File | Test Name | What to Assert | Priority |
|---|------|-----------|----------------|----------|
| 98 | `ParentDashboardView.test.tsx` | renders child selector | child toggle buttons | HIGH |
| 99 | `ParentDashboardView.test.tsx` | shows stat cards | 4 stats visible | HIGH |
| 100 | `ParentDashboardView.test.tsx` | shows subject progress bars | 5 subjects with percentages | HIGH |
| 101 | `ParentDashboardView.test.tsx` | shows alert feed | alert items visible | MEDIUM |
| 102 | `ParentDashboardView.test.tsx` | quick action buttons | 6 buttons in grid | MEDIUM |

### 3D — Shared UI Components

| # | File | Test Name | What to Assert | Priority |
|---|------|-----------|----------------|----------|
| 103 | `VirtualizedList.test.tsx` | renders all items | count matches | MEDIUM |
| 104 | `VirtualizedList.test.tsx` | only renders visible + overscan | DOM nodes < total items | MEDIUM |
| 105 | `CardSkeleton.test.tsx` | renders animated placeholder | div with animate-pulse | LOW |
| 106 | `StatsSkeleton.test.tsx` | renders correct number of stat placeholders | count prop respected | LOW |
| 107 | `PageSkeleton.test.tsx` | renders full page skeleton | multiple skeleton divs | LOW |

### 3E — Feature-Specific Components

| # | File | Test Name | What to Assert | Priority |
|---|------|-----------|----------------|----------|
| 108 | `WhiteboardCanvas.test.tsx` | renders canvas area | placeholder with sessionId | MEDIUM |
| 109 | `ExamsClient.test.tsx` | renders filter buttons | 8 category buttons | HIGH |
| 110 | `ExamsClient.test.tsx` | filters exams on click | selected filter toggles | MEDIUM |
| 111 | `HealthSurvey.test.tsx` | renders survey questions | mood, sleep, anxiety, motivation | HIGH |
| 112 | `HealthSurvey.test.tsx` | submits survey on completion | calls submit mutation | HIGH |
| 113 | `HealthSurvey.test.tsx` | shows risk result | LOW/MEDIUM/HIGH/CRITICAL badge | HIGH |

---

## Phase 4 — End-to-End Flow Tests (Playwright)

### 4A — Auth & Onboarding Flows

| # | Test Name | Steps | Assertions | Priority |
|---|-----------|-------|------------|----------|
| 114 | `Landing page loads` | Navigate to `/` | Title visible, 4 dashboard cards, CTA buttons | HIGH |
| 115 | `Register as Student` | Select STUDENT → fill name/email → submit | Redirect to /register, JWT set | HIGH |
| 116 | `Register as Parent` | Select PARENT → fill name/email → submit | Redirect to /register, JWT set | HIGH |
| 117 | `Register as Teacher` | Select TEACHER → fill → submit | Redirect, role in cookie | HIGH |
| 118 | `Login with OTP` | Enter email → request OTP → enter code | Redirect to role dashboard | HIGH |
| 119 | `Login wrong OTP` | Enter email → enter wrong code | Error message shown | HIGH |
| 120 | `Logout` | Click Logout link | Redirect to /login, cookie cleared | HIGH |
| 121 | `Protected route redirects to login` | Visit /student/dashboard without auth | Redirect to /login | HIGH |
| 122 | `Role mismatch redirects` | Parent visits /student/dashboard | Redirect or 403 | HIGH |

### 4B — Student Flows

| # | Test Name | Steps | Assertions | Priority |
|---|-----------|-------|------------|----------|
| 123 | `Student dashboard loads` | Login as student → navigate to /student/dashboard | Streak, rank, scores visible | HIGH |
| 124 | `Study timer works` | Click Start → wait 3s → click Pause → Reset | Timer counts down, pauses, resets | HIGH |
| 125 | `Log study session` | Click "Log 25min Study" | Total study time increments | HIGH |
| 126 | `Health survey submit` | Go to /student/health → fill scores → submit | Survey saved, risk level shown | HIGH |
| 127 | `Health survey shows history` | Submit 2+ surveys → view history | Previous entries listed | MEDIUM |
| 128 | `Exam listing page` | Go to /exams | 14 cutoff records displayed | HIGH |
| 129 | `Exam filter works` | Click "UPSC" filter | Only UPSC records shown | HIGH |
| 130 | `AI chat sends and receives` | Type question → click Ask | AI reply appears in chat | HIGH |
| 131 | `Whiteboard create session` | Go to /student/whiteboard → New Session → fill title → Create | Session appears in list | HIGH |
| 132 | `Whiteboard list sessions` | Create 2 sessions → view list | Both sessions listed | MEDIUM |

### 4C — Parent Flows

| # | Test Name | Steps | Assertions | Priority |
|---|-----------|-------|------------|----------|
| 133 | `Parent dashboard loads` | Login as parent → /parent/dashboard | Stats, children selector, alerts visible | HIGH |
| 134 | `Child progress visible` | Click child toggle | Subject progress updates | HIGH |
| 135 | `Quick actions work` | Click "Call Mentor", "Full Report" | Navigate to correct pages | MEDIUM |
| 136 | `Notifications visible` | Create notification for parent → view | Alert badge shows count | MEDIUM |

### 4D — Teacher Flows

| # | Test Name | Steps | Assertions | Priority |
|---|-----------|-------|------------|----------|
| 137 | `Teacher dashboard loads` | Login as teacher → /teacher/dashboard | Stats, at-risk students, schedule | HIGH |
| 138 | `At-risk student list shown` | Dashboard loads | Students with risk badges | HIGH |
| 139 | `Student risk badges colored` | HIGH=red, MEDIUM=amber, LOW=green | CSS classes applied | MEDIUM |

### 4E — Coordinator Flows

| # | Test Name | Steps | Assertions | Priority |
|---|-----------|-------|------------|----------|
| 140 | `Coordinator dashboard loads` | Login as coordinator → /coordinator/dashboard | KPIs, service health table, events | HIGH |
| 141 | `KPI values correct` | View 4 KPI cards | Numbers formatted correctly | HIGH |
| 142 | `Service health table visible` | 5 services listed | Status dots + latency + error rates | HIGH |

### 4F — i18n & Cross-Cutting Flows

| # | Test Name | Steps | Assertions | Priority |
|---|-----------|-------|------------|----------|
| 143 | `Language toggle changes nav labels` | Click language button | "Dashboard" → "डैशबोर्ड", "Logout" → "लॉगआउट" | HIGH |
| 144 | `Language toggle persists` | Toggle → reload page | Language preference maintained (cookie) | MEDIUM |
| 145 | `PWA manifest loads` | Visit /manifest.json | JSON with correct fields | MEDIUM |
| 146 | `Security headers sent` | Check response headers | X-Frame-Options: DENY, CSP present | HIGH |

---

## Phase 5 — Performance & Security Tests

### 5A — Performance Tests

| # | Test Name | Tool | What to Assert | Priority |
|---|-----------|------|----------------|----------|
| 147 | `First Load JS < 100KB` | `next build` output | Main bundle size | HIGH |
| 148 | `LCP < 2.0s on simulated 3G` | Playwright + lighthouse | LCP metric | HIGH |
| 149 | `No N+1 queries in student dashboard` | prisma-query-inspector | Single query for profile + scores | HIGH |
| 150 | `Bundle size does not regress` | `@next/bundle-analyzer` | Compare vs baseline | MEDIUM |
| 151 | `Images are WebP/AVIF` | Check response `content-type` | image/webp or image/avif | MEDIUM |
| 152 | `Fonts self-hosted` | Check font URL starts with origin | Not Google CDN | MEDIUM |
| 153 | `Dynamic imports load separately` | Check chunk names in build | WhiteboardCanvas in own chunk | MEDIUM |

### 5B — Security Tests

| # | Test Name | Tool | What to Assert | Priority |
|---|-----------|------|----------------|----------|
| 154 | `JWT not in localStorage` | Browser test | No localStorage JWT keys | HIGH |
| 155 | `API validates input with Zod` | Send malformed input | 400 with zodError | HIGH |
| 156 | `No SQL injection via Prisma` | Attempt SQL injection | Parameterized query prevents | HIGH |
| 157 | `Health data encrypted at rest` | Direct DB query on notes column | Binary, not plain text | HIGH |
| 158 | `CORS blocks external origins` | Fetch from different origin | Blocked | HIGH |
| 159 | `Rate limit on auth endpoint` | Send 6 OTP requests in 1 min | 6th request blocked | HIGH |
| 160 | `RLS prevents cross-tenant access` | Student A queries student B data | Empty result | HIGH |

---

## Test File Structure

```
tests/
├── setup.ts                         # jest-dom matchers
├── example.test.ts                  # smoke test
├── lib/
│   ├── app-error.test.ts
│   ├── crypto.test.ts
│   ├── feature-flags.test.ts
│   ├── pagination.test.ts
│   ├── performance.test.ts
│   ├── utils.test.ts
│   ├── upload.test.ts
│   └── redis.test.ts
├── server/
│   ├── trpc.test.ts
│   ├── auth.test.ts
│   ├── proxy.test.ts
│   ├── db.test.ts
│   ├── seed.test.ts
│   ├── services/
│   │   ├── student.service.test.ts
│   │   ├── health.service.test.ts
│   │   └── exam.service.test.ts
│   └── routers/
│       ├── exam.router.test.ts
│       ├── student.router.test.ts
│       ├── health.router.test.ts
│       ├── whiteboard.router.test.ts
│       ├── ai.router.test.ts
│       └── notification.router.test.ts
├── components/
│   ├── AIChat.test.tsx
│   ├── NotificationBell.test.tsx
│   ├── LanguageToggle.test.tsx
│   ├── VirtualizedList.test.tsx
│   ├── skeletons.test.tsx
│   ├── StudyTimer.test.tsx
│   ├── WhiteboardCanvas.test.tsx
│   ├── HealthSurvey.test.tsx
│   ├── ExamsClient.test.tsx
│   └── student/
│       └── StudentDashboardView.test.tsx
└── e2e/                             # Playwright
    ├── auth.spec.ts
    ├── student-flows.spec.ts
    ├── parent-flows.spec.ts
    ├── teacher-flows.spec.ts
    ├── coordinator-flows.spec.ts
    ├── exam.spec.ts
    ├── health.spec.ts
    ├── whiteboard.spec.ts
    ├── i18n.spec.ts
    └── security.spec.ts
```

---

## Execution Order (by dependency)

```
Phase 1 (Unit — 40 tests)
  └── Phase 2 (Integration — 35 tests) 
       └── Phase 3 (Component — 38 tests)
            └── Phase 4 (E2E — 33 tests)
                 └── Phase 5 (Perf/Security — 14 tests)
```

**Total: ~160 tests across 5 phases**

---

## Commands

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test",
  "test:ci": "vitest run --coverage && playwright test",
  "test:lib": "vitest run tests/lib",
  "test:server": "vitest run tests/server",
  "test:components": "vitest run tests/components"
}
```

## Coverage Target

| Threshold | Minimum |
|-----------|---------|
| Services (`server/services/`) | 90% |
| Utilities (`lib/`) | 85% |
| Components (`components/`) | 70% |
| Overall | 80% |
