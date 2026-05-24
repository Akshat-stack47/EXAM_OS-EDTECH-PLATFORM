import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { CACHE_TTL_PROFILE_SECONDS, CACHE_TTL_LEADERBOARD_SECONDS, CACHE_TTL_AI_RESPONSE_SECONDS } from '@/lib/constants'

const hasRedis = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

const createRedisClient = () => {
  if (!hasRedis) {
    return {
      get: async () => null,
      set: async () => 'OK',
      del: async () => 0,
      keys: async () => [],
      zadd: async () => 0,
      zrevrank: async () => null,
      zrange: async () => [],
      publish: async () => 0,
      ping: async () => 'PONG',
      setex: async () => 'OK',
    } as unknown as Redis
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })
}

export const redis = createRedisClient()

const noopLimit = async () => ({ success: true, limit: 999, remaining: 999, reset: 0 })

export const ratelimit = {
  api: hasRedis
    ? new Ratelimit({ redis: redis as Redis, limiter: Ratelimit.slidingWindow(100, '1 m'), analytics: true })
    : { limit: noopLimit } as any,
  auth: hasRedis
    ? new Ratelimit({ redis: redis as Redis, limiter: Ratelimit.slidingWindow(5, '15 m'), analytics: true })
    : { limit: noopLimit } as any,
  ai: hasRedis
    ? new Ratelimit({ redis: redis as Redis, limiter: Ratelimit.slidingWindow(10, '1 m'), analytics: true })
    : { limit: noopLimit } as any,
  otp: hasRedis
    ? new Ratelimit({ redis: redis as Redis, limiter: Ratelimit.slidingWindow(3, '15 m'), analytics: true })
    : { limit: noopLimit } as any,
  search: hasRedis
    ? new Ratelimit({ redis: redis as Redis, limiter: Ratelimit.slidingWindow(30, '1 m'), analytics: true })
    : { limit: noopLimit } as any,
}

export const cache = {
  async getOrSet<T>(key: string, fetch: () => Promise<T>, ttlSecs = CACHE_TTL_PROFILE_SECONDS): Promise<T> {
    const cached = await redis.get<string>(key)
    if (cached !== null) return JSON.parse(cached) as T
    const data = await fetch()
    await redis.set(key, JSON.stringify(data), { ex: ttlSecs })
    return data
  },

  async invalidate(pattern: string) {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) await redis.del(...keys)
  },

  async leaderboardAdd(key: string, score: number, member: string) {
    await redis.zadd(key, { score, member })
  },

  async leaderboardRank(key: string, member: string) {
    return redis.zrevrank(key, member)
  },

  async leaderboardTop(key: string, count = 100) {
    return redis.zrange(key, 0, count - 1, { rev: true, withScores: true })
  },

  async cacheAiResponse(question: string, response: string, ttlSecs = CACHE_TTL_AI_RESPONSE_SECONDS) {
    const encoder = new TextEncoder()
    const data = encoder.encode(question.trim().toLowerCase())
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    await redis.set(`ai:response:${hash}`, response, { ex: ttlSecs })
  },

  async getAiResponse(question: string): Promise<string | null> {
    const encoder = new TextEncoder()
    const data = encoder.encode(question.trim().toLowerCase())
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return redis.get(`ai:response:${hash}`)
  },

  async acquireLock(key: string, ttlSecs = 30): Promise<boolean> {
    const result = await redis.set(`lock:${key}`, '1', { nx: true, ex: ttlSecs })
    return result !== null
  },

  async releaseLock(key: string) {
    await redis.del(`lock:${key}`)
  },

  async publish(channel: string, message: unknown) {
    await redis.publish(channel, JSON.stringify(message))
  },

  async cacheSessionState(sessionId: string, state: object) {
    await redis.set(`whiteboard:session:${sessionId}:state`, JSON.stringify(state), { ex: 86400 })
  },

  async getSessionState(sessionId: string): Promise<object | null> {
    const raw = await redis.get<string>(`whiteboard:session:${sessionId}:state`)
    return raw ? JSON.parse(raw) : null
  },

  async clearSessionState(sessionId: string) {
    await redis.del(`whiteboard:session:${sessionId}:state`)
  },
}
