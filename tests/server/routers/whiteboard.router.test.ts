import { describe, it, expect, vi } from 'vitest'

const mockFindMany = vi.fn()
const mockFindUnique = vi.fn()
const mockCreate = vi.fn()

vi.mock('@/lib/db', () => ({
  db: {
    whiteboardSession: {
      findMany: (...args: any[]) => mockFindMany(...args),
      findUnique: (...args: any[]) => mockFindUnique(...args),
      create: (...args: any[]) => mockCreate(...args),
    },
  },
}))

vi.mock('@/lib/redis', () => ({
  ratelimit: { api: { limit: vi.fn().mockResolvedValue({ success: true }) } },
  cache: { getSessionState: vi.fn(), cacheSessionState: vi.fn() },
}))

const { whiteboardRouter } = await import('@/server/routers/whiteboard')

describe('whiteboardRouter.list', () => {
  it('returns user sessions', async () => {
    mockFindMany.mockResolvedValue([
      { id: 'w1', title: 'Test Session', hostId: 'u1' },
    ])
    const caller = whiteboardRouter.createCaller({ userId: 'u1', userRole: 'STUDENT' } as any)
    const result = await caller.list()
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Test Session')
  })
})

describe('whiteboardRouter.getById', () => {
  it('returns session by id', async () => {
    mockFindUnique.mockResolvedValue({ id: 'w1', title: 'My Session' })
    const caller = whiteboardRouter.createCaller({ userId: 'u1', userRole: 'STUDENT' } as any)
    const result = await caller.getById({ id: 'w1' })
    expect(result.title).toBe('My Session')
  })
})

describe('whiteboardRouter.create', () => {
  it('creates a new session', async () => {
    mockCreate.mockResolvedValue({ id: 'w2', title: 'New Session', hostId: 'u1' })
    const caller = whiteboardRouter.createCaller({ userId: 'u1', userRole: 'STUDENT' } as any)
    const result = await caller.create({ title: 'New Session' })
    expect(result.title).toBe('New Session')
  })
})
