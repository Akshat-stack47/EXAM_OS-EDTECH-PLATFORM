import { z } from 'zod'

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default('http://localhost:3000'),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
  NEXT_PUBLIC_FEATURE_AI_GRADING: z.coerce.boolean().optional().default(false),
  NEXT_PUBLIC_FEATURE_LIVE_CLASSES: z.coerce.boolean().optional().default(false),
  NEXT_PUBLIC_FEATURE_PARENT_DASHBOARD: z.coerce.boolean().optional().default(false),
})

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  SUPABASE_JWT_SECRET: z.string().min(1).optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  REDIS_URL: z.string().optional(),
  DATABASE_REPLICA_URL: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  AXIOM_TOKEN: z.string().optional(),
  AXIOM_DATASET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  MSG91_AUTH_KEY: z.string().optional(),
  MSG91_SENDER_ID: z.string().optional(),
  HEALTH_ENCRYPTION_KEY: z.string().min(1, 'HEALTH_ENCRYPTION_KEY is required'),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  TYPESENSE_API_KEY: z.string().optional(),
  TYPESENSE_HOST: z.string().optional(),
  TYPESENSE_PORT: z.coerce.number().optional(),
  TYPESENSE_PROTOCOL: z.enum(['http', 'https']).optional(),
})

const clientEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  NEXT_PUBLIC_FEATURE_AI_GRADING: process.env.NEXT_PUBLIC_FEATURE_AI_GRADING,
  NEXT_PUBLIC_FEATURE_LIVE_CLASSES: process.env.NEXT_PUBLIC_FEATURE_LIVE_CLASSES,
  NEXT_PUBLIC_FEATURE_PARENT_DASHBOARD: process.env.NEXT_PUBLIC_FEATURE_PARENT_DASHBOARD,
}

const rawServerEnv = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  REDIS_URL: process.env.REDIS_URL,
  DATABASE_REPLICA_URL: process.env.DATABASE_REPLICA_URL,
  SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
  SENTRY_ORG: process.env.SENTRY_ORG,
  SENTRY_PROJECT: process.env.SENTRY_PROJECT,
  AXIOM_TOKEN: process.env.AXIOM_TOKEN,
  AXIOM_DATASET: process.env.AXIOM_DATASET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  MSG91_AUTH_KEY: process.env.MSG91_AUTH_KEY,
  MSG91_SENDER_ID: process.env.MSG91_SENDER_ID,
  HEALTH_ENCRYPTION_KEY: process.env.HEALTH_ENCRYPTION_KEY,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  TYPESENSE_API_KEY: process.env.TYPESENSE_API_KEY,
  TYPESENSE_HOST: process.env.TYPESENSE_HOST,
  TYPESENSE_PORT: process.env.TYPESENSE_PORT,
  TYPESENSE_PROTOCOL: process.env.TYPESENSE_PROTOCOL,
}

const parsedClient = clientSchema.safeParse(clientEnv)
const parsedServer = serverSchema.safeParse(rawServerEnv)

if (!parsedClient.success) {
  console.error('Invalid client environment variables:', parsedClient.error.flatten().fieldErrors)
  if (typeof window === 'undefined') {
    throw new Error('Invalid client environment variables')
  }
}

if (!parsedServer.success) {
  console.error('Invalid server environment variables:', parsedServer.error.flatten().fieldErrors)
  throw new Error('Invalid server environment variables')
}

export const env = {
  ...parsedServer.data,
  ...parsedClient.data,
} as const

export const serverEnv = parsedServer.data ?? {} as Record<string, string | undefined>
