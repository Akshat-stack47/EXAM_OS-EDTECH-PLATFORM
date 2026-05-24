import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

type WebVitalMetric = {
  name: string
  value: number
  id: string
  rating?: string
  delta?: number
  url?: string
  timestamp?: number
}

export async function POST(request: NextRequest) {
  try {
    const metrics: WebVitalMetric = await request.json()

    logger.info('web vitals', {
      action: 'web_vitals',
      metadata: {
        name: metrics.name,
        value: metrics.value,
        rating: metrics.rating,
        delta: metrics.delta,
        path: metrics.url,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    logger.warn('web vitals parse error', {
      action: 'web_vitals_error',
      metadata: { error: String(error) },
    })
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
