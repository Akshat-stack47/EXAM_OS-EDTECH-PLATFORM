# Disaster Recovery Runbook

## Recovery Objectives

| Tier | RTO | RPO |
|------|-----|-----|
| P0 (Complete Outage) | 30 min | 5 min |
| P1 (Degraded Service) | 2 hours | 15 min |
| P2 (Minor Issue) | 24 hours | 1 hour |
| P3 (Cosmetic) | Next release | N/A |

## Disaster Scenarios

### 1. Database Failure (Supabase)
**Symptoms**: Health check fails, 5xx errors on read/write endpoints
**Detection**: Better Uptime alert → Sentry error spike → Axiom log spike
**Response**:
1. Check Supabase Dashboard → Database Health
2. Check `pg_stat_activity` for stuck queries
3. If corrupted → restore from latest backup:
   ```bash
   pg_restore -h $DB_HOST -U $DB_USER -d $DB_NAME --clean backup.dump
   ```
4. If primary fails → promote read replica:
   ```sql
   SELECT pg_promote();
   ```
5. Update DATABASE_URL in Vercel env vars
6. Redeploy: `vercel --prod`
7. Run health check: `curl https://examos.app/health`

**Backup Schedule**: Hourly WAL archiving, daily full backup (retention: 30 days)

### 2. Redis Failure (Upstash)
**Symptoms**: Rate limiting disabled, queues not processing
**Detection**: BullMQ jobs queued but not processing
**Response**:
1. Check Upstash Dashboard → Cluster Health
2. If regional failure → failover to replica region
3. If data loss → accept degradation (Redis is cache, not source of truth)
4. BullMQ jobs will retry automatically with exponential backoff

### 3. Vercel Deployment Failure
**Symptoms**: 502/504 errors, deployment stuck
**Detection**: Vercel Dashboard → Deployments
**Response**:
1. Check Vercel Dashboard → build logs
2. If build fails → check for:
   - TypeScript errors
   - Missing env vars
   - Prisma schema mismatch
3. Rollback to last known good deployment:
   ```bash
   vercel rollback <deployment-id>
   ```
4. Fix and redeploy

### 4. Auth Provider Failure (Supabase Auth)
**Symptoms**: Users cannot log in, SSO failures
**Detection**: Sentry spike on auth endpoints
**Response**:
1. Check Supabase Auth Dashboard
2. Verify Supabase service health
3. If regional issue → switch to backup auth provider
4. If JWT secret rotation → reissue tokens
5. Notify users of extended maintenance window

### 5. Search Service Failure (Typesense)
**Symptoms**: Search returns empty, 503 from search endpoint
**Detection**: Sentry alert, user reports
**Response**:
1. Check Typesense cluster health
2. Restart failing nodes:
   ```bash
   docker-compose restart typesense-node-2
   ```
3. If complete failure → reindex from database:
   ```bash
   pnpm run search:reindex
   ```
4. Graceful degradation: show server-side filtered results instead

### 6. Payment Gateway Failure (Razorpay)
**Symptoms**: Payment failures, checkout errors
**Detection**: PostHog payment failure spike
**Response**:
1. Check Razorpay Dashboard → API Health
2. If Razorpay down → enable offline payment mode
3. Queue pending payments for retry
4. Notify finance team

## Communication Plan

| Severity | Notify | Channel | Timeframe |
|----------|--------|---------|-----------|
| P0 | All hands | Slack #incidents + Email | Immediate |
| P1 | Engineering team | Slack #alerts | < 5 min |
| P2 | Engineering lead | Slack | < 1 hour |
| P3 | No notification | Jira ticket | Next sprint |

## Post-Mortem Process
1. Document timeline of events
2. Identify root cause
3. Implement preventive measures
4. Update runbook
5. Schedule follow-up review (within 1 week)
