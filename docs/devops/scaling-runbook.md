# Scaling Runbook

## Architecture Overview
- **Frontend**: Vercel (auto-scaling, global edge network)
- **Database**: Supabase PostgreSQL (scale to 8GB RAM, read replicas)
- **Cache**: Upstash Redis (global, auto-scaling)
- **Search**: Typesense (cluster with 3+ nodes)
- **Queues**: BullMQ via Upstash Redis
- **File Storage**: Supabase Storage (S3-compatible)

## Load Tiers

### Tier 1: 0–1,000 concurrent users
- No scaling needed
- Hobby/Pro Vercel plan
- Supabase Pro (8GB RAM)
- Single Typesense node

### Tier 2: 1,000–10,000 concurrent users
- Enable Vercel Analytics
- Supabase Pro (16GB RAM)
- Typesense cluster (3 nodes)
- Enable CDN caching for static assets

### Tier 3: 10,000–100,000 concurrent users
- Vercel Enterprise (dedicated infra)
- Supabase Enterprise (read replicas, connection pooling)
- Upstash Redis (global replication)
- Typesense cluster (5+ nodes)
- Implement database read replicas for dashboard queries
- Enable response caching with HTTP caching headers
- Monitor connection pool saturation
- Scale horizontally: add more Vercel regions

### Tier 4: 100,000–1,000,000 concurrent users
- Supabase read replicas (3+)
- Database sharding by tenant (school_id hash)
- Redis cluster with read replicas
- Typesense cluster (10+ nodes)
- Implement CDN caching with cache invalidation strategy
- Full observability stack (Sentry + Axiom + PostHog)
- Dedicated BullMQ workers
- Auto-scaling policies in place

### Tier 5: 1M–10M concurrent users
- Database: Citus (distributed PostgreSQL)
- Redis: Global distribution with multi-region replication
- Search: Dedicated Typesense fleet
- AI engine: Dedicated GPU instances
- Multi-region deployment (US, EU, APAC)
- Chaos engineering practices

### Tier 6: 10M–100M concurrent users
- Custom infrastructure
- Global load balancers
- CDN-first architecture
- Eventual consistency for non-critical reads
- Full microservices decomposition
- Predictive auto-scaling with ML models

## Auto-scaling Triggers

| Metric | Threshold | Action |
|--------|-----------|--------|
| CPU > 70% for 5 min | Alert + scale up | Add read replica |
| Connection pool > 80% | Alert + scale up | Increase pool size |
| Redis memory > 75% | Alert | Evict LRU / scale up |
| P99 latency > 500ms | Alert | Investigate + scale |
| Error rate > 1% | Pager | Rollback last deploy |
