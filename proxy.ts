import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { isEnabled } from '@/lib/flags'

const JWT_SECRET = new TextEncoder().encode(
  process.env.SUPABASE_JWT_SECRET || 'default-secret-change-in-production',
)

const noopRatelimit = {
  limit: async (_id: string) => ({ success: true, limit: 999, remaining: 999, reset: 0 }),
}

const ratelimit = (() => {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return noopRatelimit
  }
  try {
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      analytics: false,
      prefix: 'ratelimit:proxy',
    })
  } catch {
    return noopRatelimit
  }
})()

const ROLE_ROUTES: Record<string, string[]> = {
  PARENT: ['/parent'],
  STUDENT: ['/student'],
  TEACHER: ['/teacher'],
  COORDINATOR: ['/coordinator'],
}

const PUBLIC_ROUTES = ['/', '/login', '/register', '/onboarding', '/maintenance', '/exams', '/blog']
const PUBLIC_API_ROUTES = ['/api/health', '/api/webhooks', '/api/seed', '/api/trpc', '/api/migrate']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  if (pathname === '/maintenance') return response

  if (pathname.startsWith('/api/')) {
    const allowedOrigins = [
      'https://examos.in',
      'https://staging.examos.in',
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
    ].filter(Boolean)

    const origin = request.headers.get('origin') ?? ''
    const isAllowed = allowedOrigins.includes(origin)

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': isAllowed ? origin : '',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    if (isAllowed) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    }
  }

  if (pathname.startsWith('/api/') && !PUBLIC_API_ROUTES.some(r => pathname.startsWith(r))) {
    try {
      const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'anonymous'
      const { success, limit, remaining } = await ratelimit.limit(ip)

      response.headers.set('X-RateLimit-Limit', limit.toString())
      response.headers.set('X-RateLimit-Remaining', remaining.toString())

      if (!success) {
        return NextResponse.json(
          { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
          { status: 429, headers: { 'Retry-After': '60' } },
        )
      }
    } catch {
      // Redis unavailable — skip rate limiting in dev
    }
  }

  if (request.nextUrl.searchParams.has('preview')) {
    const h = new Headers(request.headers)
    h.set('x-preview-mode', 'true')
    return NextResponse.next({ request: { headers: h } })
  }

  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route)) || PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
    return response
  }

  const token = request.cookies.get('sb-access-token')?.value

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      clockTolerance: 60,
    })

    const userRole = payload.role as string
    const userId = payload.sub

    if (!userRole || !userId) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const allowedRoutes = ROLE_ROUTES[userRole] || []
    const isAllowed = allowedRoutes.some(route => pathname.startsWith(route))

    if (!isAllowed) {
      const dashboardRoute = ROLE_ROUTES[userRole]?.[0] || '/'
      return NextResponse.redirect(new URL(dashboardRoute, request.url))
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', userId)
    requestHeaders.set('x-user-role', userRole)

    return NextResponse.next({
      request: { headers: requestHeaders },
    })
  } catch (error) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    '/parent/:path*',
    '/student/:path*',
    '/teacher/:path*',
    '/coordinator/:path*',
    '/api/:path*',
    '/login',
    '/register',
    '/onboarding',
    '/maintenance',
    '/exams/:path*',
    '/blog/:path*',
  ],
}
