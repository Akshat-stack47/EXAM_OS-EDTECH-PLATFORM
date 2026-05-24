import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { logger } from '@/lib/logger'
import { serverEnv } from '@/lib/env'

export const runtime = 'nodejs'

async function isAlreadyProcessed(webhookId: string): Promise<boolean> {
  const key = `webhook:razorpay:${webhookId}`
  const existing = await redis.get(key)
  if (existing) return true
  await redis.setex(key, 86400, '1')
  return false
}

function verifyRazorpaySignature(
  rawBody: string,
  signature: string,
  secret: string,
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature),
  )
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-razorpay-signature')

  if (!signature) {
    logger.warn('razorpay webhook missing signature')
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
  }

  const webhookSecret = serverEnv.RAZORPAY_WEBHOOK_SECRET
  if (!webhookSecret) {
    logger.error('razorpay webhook secret not configured')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const isValid = verifyRazorpaySignature(rawBody, signature, webhookSecret)

  if (!isValid) {
    logger.warn('razorpay webhook invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: { event: string; payload: Record<string, unknown>; id?: string }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const webhookId = event.id ?? `${event.event}-${Date.now()}`
  if (await isAlreadyProcessed(webhookId)) {
    logger.info('razorpay duplicate webhook ignored', { webhookId, eventType: event.event })
    return NextResponse.json({ status: 'already_processed' })
  }

  try {
    switch (event.event) {
      case 'payment.captured': {
        const payment = event.payload as { payment: { entity: { id: string; order_id: string; amount: number } } }
        const { id: paymentId, order_id: orderId, amount } = payment.payment.entity

        await db.notification.create({
          data: {
            userId: '',
            title: 'Payment Captured',
            body: `Payment ${paymentId} for order ${orderId} captured (₹${(amount / 100).toFixed(2)})`,
          },
          select: { id: true },
        })

        logger.info('razorpay payment captured', { orderId, paymentId, amountPaise: amount })
        break
      }

      case 'payment.failed': {
        const payment = event.payload as { payment: { entity: { order_id: string; error_description: string } } }
        const { order_id: orderId, error_description } = payment.payment.entity

        logger.warn('razorpay payment failed', { orderId, reason: error_description })
        break
      }

      default:
        logger.info('razorpay event ignored', { eventType: event.event })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    logger.error('razorpay webhook processing error', { error: String(error), eventType: event.event })
    return NextResponse.json({ error: 'Processing error' }, { status: 500 })
  }
}
