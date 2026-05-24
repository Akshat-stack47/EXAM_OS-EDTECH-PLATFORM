import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
  beforeSend(event) {
    if (event.user) {
      delete event.user.email
      delete event.user.ip_address
    }
    if (event.request?.headers) {
      delete event.request.headers['Authorization']
      delete event.request.headers['Cookie']
    }
    return event
  },
  denyUrls: [
    /localhost/i,
    /staging\.examos\.app/i,
  ],
})
