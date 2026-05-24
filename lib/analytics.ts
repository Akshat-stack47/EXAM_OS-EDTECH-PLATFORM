import { createHash } from 'crypto'

type AnalyticsEvent = {
  event: string
  properties?: Record<string, unknown>
  userId?: string
}

function hashUserId(userId: string): string {
  return createHash('sha256').update(userId).digest('hex')
}

export const analytics = {
  async track(event: string, properties?: Record<string, unknown>, userId?: string): Promise<void> {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

    if (!posthogKey || !posthogHost || typeof window === 'undefined') return

    try {
      const distinctId = userId ? hashUserId(userId) : 'anonymous'
      const body = {
        api_key: posthogKey,
        event,
        distinct_id: distinctId,
        properties: {
          ...properties,
          $lib: 'exam-os-analytics',
        },
        timestamp: new Date().toISOString(),
      }

      await fetch(`${posthogHost}/capture/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } catch {
      // Fail silently
    }
  },

  async identify(userId: string, traits?: Record<string, unknown>): Promise<void> {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

    if (!posthogKey || !posthogHost || typeof window === 'undefined') return

    try {
      const distinctId = hashUserId(userId)
      await fetch(`${posthogHost}/identify/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: posthogKey,
          distinct_id: distinctId,
          properties: {
            ...traits,
            $hashed_user_id: true,
          },
        }),
      })
    } catch {
      // Fail silently
    }
  },

  async pageView(page: string, userId?: string): Promise<void> {
    await this.track('$pageview', { page }, userId)
  },
}

export function useAnalytics() {
  return analytics
}
