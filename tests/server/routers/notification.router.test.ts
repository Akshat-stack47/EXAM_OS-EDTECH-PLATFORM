import { describe, it, expect, vi } from 'vitest'

const mockFindMany = vi.fn()
const mockUpdate = vi.fn()

vi.mock('@/lib/db', () => ({
  db: {
    notification: {
      findMany: (...args: any[]) => mockFindMany(...args),
      update: (...args: any[]) => mockUpdate(...args),
    },
  },
}))

vi.mock('@/lib/redis', () => ({
  ratelimit: { api: { limit: vi.fn().mockResolvedValue({ success: true }) } },
}))

const { notificationRouter } = await import('@/server/routers/notification')

describe('notificationRouter.list', () => {
  it('returns notifications for user', async () => {
    mockFindMany.mockResolvedValue([
      { id: 'n1', title: 'Test', body: 'Body', read: false, createdAt: new Date() },
    ])
    const caller = notificationRouter.createCaller({ userId: 'u1', userRole: 'STUDENT' } as any)
    const result = await caller.list()
    expect(result).toHaveLength(1)
  })
})

describe('notificationRouter.markRead', () => {
  it('marks notification as read', async () => {
    mockUpdate.mockResolvedValue({ id: 'n1', read: true })
    const caller = notificationRouter.createCaller({ userId: 'u1', userRole: 'STUDENT' } as any)
    const result = await caller.markRead({ id: 'n1' })
    expect(result.read).toBe(true)
  })
})
