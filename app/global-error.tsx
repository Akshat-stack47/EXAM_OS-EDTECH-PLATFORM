'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body className="min-h-screen bg-[#080B10] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Something went wrong
          </h1>
          <p className="text-gray-400 mb-6 text-sm">
            An unexpected error occurred. Our team has been automatically notified.
          </p>
          <button
            onClick={reset}
            className="px-6 py-2 bg-green-500 text-black font-semibold rounded-lg text-sm"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
