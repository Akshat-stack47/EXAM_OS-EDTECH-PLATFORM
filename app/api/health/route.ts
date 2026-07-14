import { NextResponse } from 'next/server'
import { basePrisma } from '@/lib/db'
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
    await basePrisma.$queryRaw`SELECT 1`
    checks.database = { status: 'healthy', latency: Date.now() - start }
  } catch (error) {
    checks.database = {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
    logger.error('Health check: database unhealthy', { error })
  }

  const totalLatency = Date.now() - start
  const isHealthy = checks.database?.status === 'healthy'

  // Always return 200 for the keep-alive ping — the detail is in the JSON body
  // Return 503 only for actual service consumers who need strict health checking
  const isKeepAlivePing = false // Could detect via User-Agent in future

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'degraded',
      checks,
      timestamp: new Date().toISOString(),
      latency: totalLatency,
    },
    { status: isHealthy ? 200 : 503 },
  )
}
