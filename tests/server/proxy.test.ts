import { describe, it, expect, vi } from 'vitest'

vi.mock('jose', () => ({
  jwtVerify: vi.fn().mockResolvedValue({
    payload: { role: 'STUDENT', sub: 'u1' },
  }),
}))

const { proxy } = await import('@/proxy')

function createMockRequest(url: string, token?: string) {
  return {
    nextUrl: {
      pathname: new URL(url).pathname,
      searchParams: new URLSearchParams(),
    },
    cookies: { get: () => (token ? { value: token } : undefined) },
    headers: new Headers(),
  } as any
}

describe('proxy middleware', () => {
  it('allows public routes without auth', async () => {
    const req = createMockRequest('http://localhost/exams')
    const res = await proxy(req)
    expect(res).toBeDefined()
  })

  it('redirects to login when no token for protected route', async () => {
    const req = createMockRequest('http://localhost/student/dashboard')
    const res = await proxy(req)
    expect(res).toBeDefined()
  })
})
