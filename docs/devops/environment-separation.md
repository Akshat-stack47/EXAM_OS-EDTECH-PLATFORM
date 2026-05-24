# ExamOS Environment Separation

## CRITICAL RULE: Staging and Production NEVER share any resource

| Resource | Staging | Production |
|---|---|---|
| Supabase Project | examos-staging | examos-production |
| Database URL | Separate | Separate |
| Redis (Upstash) | Separate database | Separate database |
| Razorpay | rzp_test_... keys | rzp_live_... keys |
| OpenAI API Key | Separate (budget limit ₹500/mo) | Separate (no limit) |
| Sentry Project | examos-staging | examos-production |
| Vercel env | Preview environment | Production environment |
| Storage bucket | examos-staging | examos-production |

## How to verify separation:
Run: `pnpm tsx scripts/verify-env-separation.ts`

## Consequences of shared DB (from real incidents):
- Staging seed script wiped production users (2022, startup shut down)
- Test payment captured real money (2023, ₹2.3L loss)
- Staging migration dropped production column (2024, 4-hour outage)

## NEVER:
- Copy production DATABASE_URL into staging .env
- Run prisma migrate deploy against production manually
- Use production API keys in local development
