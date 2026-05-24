import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type HealthCheckResult = {
  status: 'healthy' | 'unhealthy'
  latency?: number
  error?: string
}

export async function GET() {
  const start = Date.now()
  const checks: Record<string, HealthCheckResult> = {}

  try {
    await db.$queryRaw`SELECT 1`
    checks.database = { status: 'healthy', latency: Date.now() - start }
  } catch (error) {
    checks.database = { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' }
    logger.error('Health check: database unhealthy', { error })
  }

  const totalLatency = Date.now() - start
  const isHealthy = checks.database?.status === 'healthy'

  if (!isHealthy) {
    return NextResponse.json(
      { status: 'degraded', checks, timestamp: new Date().toISOString(), latency: totalLatency } as const,
      { status: 503 },
    )
  }

  return NextResponse.json(
    { status: 'healthy', checks, timestamp: new Date().toISOString(), latency: totalLatency } as const,
    { status: 200 },
  )
}
