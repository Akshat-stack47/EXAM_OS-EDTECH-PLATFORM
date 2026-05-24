'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function PostHogPageViews() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const initPostHog = async () => {
      const posthog = await import('posthog-js')
      const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
      if (!key) return

      posthog.default.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        loaded: (ph) => {
          if (process.env.NODE_ENV === 'development') ph.debug()
        },
      })
    }
    initPostHog()
  }, [])

  useEffect(() => {
    if (pathname) {
      const url = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname
      import('posthog-js').then(({ default: posthog }) => {
        posthog.capture('$pageview', { $current_url: url })
      })
    }
  }, [pathname, searchParams])

  return null
}
