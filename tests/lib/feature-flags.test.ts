import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockRedisGet = vi.fn()
const mockRedisSet = vi.fn()
vi.mock('@/lib/redis', () => ({
  redis: {
    get: (...args: any[]) => mockRedisGet(...args),
    set: (...args: any[]) => mockRedisSet(...args),
  },
}))

const { featureFlags } = await import('@/lib/feature-flags')

describe('featureFlags', () => {
  beforeEach(() => {
    mockRedisGet.mockReset()
    mockRedisSet.mockReset()
  })

  it('returns default false for unknown key', async () => {
    mockRedisGet.mockResolvedValue(null)
    const val = await featureFlags.get('nonexistent')
    expect(val).toBe(false)
  })

  it('returns default value for known flag', async () => {
    mockRedisGet.mockResolvedValue(null)
    const val = await featureFlags.get('whiteboard.botEnabled')
    expect(val).toBe(true)
  })

  it('returns Redis value when set', async () => {
    mockRedisGet.mockResolvedValue(JSON.stringify(false))
    const val = await featureFlags.get('whiteboard.botEnabled')
    expect(val).toBe(false)
  })

  it('stores flag with 60s TTL', async () => {
    await featureFlags.set('test.key', true)
    expect(mockRedisSet).toHaveBeenCalledWith('flags:global:test.key', 'true', { ex: 60 })
  })

  it('stores user-specific flag', async () => {
    await featureFlags.set('test.key', 42, 'user1')
    expect(mockRedisSet).toHaveBeenCalledWith('flags:user1:test.key', '42', { ex: 60 })
  })
})
