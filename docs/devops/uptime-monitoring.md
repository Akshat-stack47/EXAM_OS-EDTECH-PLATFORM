# Uptime Monitoring & Status Page

## Overview
ExamOS uses Better Uptime for external monitoring and Vercel Analytics for real-time traffic.

## Monitors

| Endpoint | Frequency | Expected Status |
|----------|-----------|----------------|
| `https://examos.app/health` | 1 min | 200 |
| `https://examos.app/api/auth/session` | 5 min | 200 |
| `https://examos.app/login` | 5 min | 200 |

## Alert Channels

| Channel | Priority | Use Case |
|---------|----------|----------|
| Slack (#alerts) | P0-P1 | Downtime, 5xx spike |
| Email (ops@examos.app) | P2-P3 | Degraded performance |
| SMS (on-call engineer) | P0 | Complete outage |

## Status Page
Public status page: `https://status.examos.app`

Components tracked:
- API / Backend
- Database (Supabase PostgreSQL)
- Authentication (Supabase Auth)
- Search (Typesense)
- AI Grading Engine

## Runbook for On-Call

1. Check `https://status.examos.app` for component status
2. Check Sentry for error spike: `https://sentry.io/organizations/exam-os/`
3. Check Axiom logs: `https://app.axiom.co/datasets/exam-os-logs/explorer`
4. Check Vercel Dashboard: `https://vercel.com/exam-os/`
5. If database issue → check Supabase Dashboard → check pg_stat_activity
6. If Redis issue → check Upstash Dashboard → check memory usage
7. If Typesense issue → restart Typesense cluster
