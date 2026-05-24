# ExamOS Architecture

## Overview
ExamOS is a modular monolith built with Next.js 16 App Router, tRPC, and Prisma ORM on Supabase PostgreSQL. This document describes the system architecture, module boundaries, and data flow.

## Architecture Layers

### Client Layer
- **Web**: Next.js 16 (App Router) — `app/` directory
- **Mobile**: React Native (Expo 51) — `mobile/` directory
- **PWA**: Service worker in `public/manifest.json`

### Edge Layer
- **Middleware**: `proxy.ts` — JWT verification, role-based routing, preview mode
- **CDN**: Vercel Edge Network / Cloudflare

### API Layer
- **Internal API**: tRPC (all server logic via `server/routers/`)
- **External API**: Planned `/api/v1/*` REST endpoints
- **WebSocket**: Supabase Realtime + optional Socket.io

### Service Modules
Each domain is isolated in its own directory:
- `server/services/student.service.ts`
- `server/services/parent.service.ts`
- `server/services/teacher.service.ts`
- `server/services/coordinator.service.ts`
- `server/services/exam.service.ts`
- `server/services/health.service.ts`
- `server/services/whiteboard.service.ts`
- `server/services/ai.service.ts`
- `server/services/payment.service.ts`
- `server/services/notification.service.ts`

### Data Layer
- **Primary DB**: Supabase PostgreSQL via Prisma ORM
- **Cache**: Upstash Redis (7 patterns: read-through, leaderboard, AI cache, rate limiting, feature flags, distributed locks, pub/sub)
- **File Storage**: Supabase Storage (presigned URLs)

### Cross-Cutting Concerns
- Authentication: httpOnly JWT cookies + Supabase Auth OTP
- Rate Limiting: Upstash Ratelimit (3 tiers)
- Encryption: AES-256-GCM for health data
- Error Handling: AppError class with Sentry reporting
- Feature Flags: Redis-backed with 60s TTL

## Module Boundaries
- Cross-module imports only through service interface layer
- No direct imports between router modules
- Shared types in `types/` directory
- Shared components in `components/shared/`

## Data Flow
1. Client → tRPC query/mutation → Router → Service → DB/Redis
2. File Upload: Client → Presigned URL → Supabase Storage
3. Auth: Client → Login action → JWT in httpOnly cookie → Proxy verification
