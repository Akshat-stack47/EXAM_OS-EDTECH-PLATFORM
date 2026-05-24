# Observability Alert Rules

## Sentry Alerts

| Rule | Condition | Action | Severity |
|------|-----------|--------|----------|
| Error Spike | > 50 errors in 5 min | Slack #alerts | P0 |
| New Error | First occurrence | Slack #alerts + Email | P1 |
| P95 Latency > 2s | Per endpoint | Slack #alerts | P1 |
| Apdex < 0.9 | Per endpoint | Slack #alerts | P2 |

## Axiom Log Alerts

| Rule | Condition | Action | Severity |
|------|-----------|--------|----------|
| 5xx Rate > 5% | Rolling 5 min window | Slack #alerts | P0 |
| Auth Failure Spike | > 100 failures in 5 min | Slack #alerts | P1 |
| Database Query Time > 1s | Any query | Slack #performance | P2 |
| Rate Limit Hits > 100/min | Per user/IP | Slack #alerts | P2 |

## PostHog Alerts

| Rule | Condition | Action | Severity |
|------|-----------|--------|----------|
| Signup Drop > 30% | Week over week | Slack #product | P2 |
| Payment Failure > 10% | Daily | Slack #product + Email | P1 |
| Active Users Drop > 20% | Daily | Slack #product | P2 |

## Infrastructure Alerts (Better Uptime)

| Rule | Condition | Action | Severity |
|------|-----------|--------|----------|
| Health Endpoint Down | 2 consecutive failures | PagerDuty + Slack | P0 |
| SSL Expiry < 30 days | Daily check | Email | P3 |
| Response Time > 3s | Any endpoint | Slack #alerts | P1 |

## Runbook Integration
All P0 alerts trigger automatic runbook execution via PagerDuty with:
- Link to Sentry issue
- Link to Axiom log search (filtered by time range)
- Link to Vercel deployment log
- Suggested rollback command: `vercel rollback <deployment-id>`
