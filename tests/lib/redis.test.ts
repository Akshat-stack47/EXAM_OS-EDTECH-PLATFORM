import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGet = vi.fn()
const mockSet = vi.fn()
const mockDel = vi.fn()
const mockKeys = vi.fn()
const mockZadd = vi.fn()
const mockZrevrank = vi.fn()
const mockZrange = vi.fn()
const mockPublish = vi.fn()
const mockPing = vi.fn()

vi.mock('@/lib/redis', () => {
  const cache = {
    async getOrSet(key: string, fetch: () => Promise<any>, ttlSecs = 300) {
      const cached = await mockGet(key)
      if (cached !== null) return JSON.parse(cached)
      const data = await fetch()
      await mockSet(key, JSON.stringify(data), { ex: ttlSecs })
      return data
    },
    async invalidate(pattern: string) {
      const keys = await mockKeys(pattern)
      if (keys.length > 0) await mockDel(...keys)
    },
    async leaderboardAdd(key: string, score: number, member: string) {
      await mockZadd(key, { score, member })
    },
    async leaderboardRank(key: string, member: string) {
      return mockZrevrank(key, member)
    },
    async leaderboardTop(key: string, count = 100) {
      return mockZrange(key, 0, count - 1, { rev: true, withScores: true })
    },
    async cacheAiResponse(question: string, response: string) {
      const hash = 'testhash'
      await mockSet(`ai:response:${hash}`, response, { ex: 3600 })
    },
    async getAiResponse(question: string) {
      return null
    },
    async acquireLock(key: string, ttlSecs = 30) {
      const result = await mockSet(`lock:${key}`, '1', { nx: true, ex: ttlSecs })
      return result !== null
    },
    async releaseLock(key: string) {
      await mockDel(`lock:${key}`)
    },
    async publish(channel: string, message: unknown) {
      await mockPublish(channel, JSON.stringify(message))
    },
  }
  return { cache, redis: { get: mockGet, set: mockSet, del: mockDel, keys: mockKeys, zadd: mockZadd, zrevrank: mockZrevrank, zrange: mockZrange, publish: mockPublish, ping: mockPing } }
})

const { cache } = await import('@/lib/redis')

describe('cache.getOrSet', () => {
  beforeEach(() => {
    mockGet.mockReset()
    mockSet.mockReset()
  })

  it('returns cached value when available', async () => {
    mockGet.mockResolvedValue(JSON.stringify('cached'))
    const result = await cache.getOrSet('key', async () => 'fresh')
    expect(result).toBe('cached')
    expect(mockSet).not.toHaveBeenCalled()
  })

  it('calls fetch and caches when no cached value', async () => {
    mockGet.mockResolvedValue(null)
    mockSet.mockResolvedValue('OK')
    const result = await cache.getOrSet('key', async () => 'fresh')
    expect(result).toBe('fresh')
    expect(mockSet).toHaveBeenCalled()
  })
})

describe('cache.acquireLock / releaseLock', () => {
  beforeEach(() => {
    mockSet.mockReset()
    mockDel.mockReset()
  })

  it('acquires lock when available', async () => {
    mockSet.mockResolvedValue('OK')
    const acquired = await cache.acquireLock('resource')
    expect(acquired).toBe(true)
  })

  it('fails to acquire when locked', async () => {
    mockSet.mockResolvedValue(null)
    const acquired = await cache.acquireLock('resource')
    expect(acquired).toBe(false)
  })
})
