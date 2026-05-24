import { redis } from '@/lib/redis'

type FlagValue = boolean | string | number

const DEFAULT_FLAGS: Record<string, FlagValue> = {
  'whiteboard.botEnabled': true,
  'health.surveyEnabled': true,
  'ai.mentorEnabled': true,
  'payment.enabled': false,
  'leaderboard.enabled': true,
  'darkMode.enabled': true,
}

export const featureFlags = {
  async get(key: string, userId?: string): Promise<FlagValue> {
    const globalKey = `flags:global:${key}`
    const cached = await redis.get<string>(globalKey)
    if (cached !== null) return JSON.parse(cached)

    if (userId) {
      const userKey = `flags:${userId}:${key}`
      const userVal = await redis.get<string>(userKey)
      if (userVal !== null) return JSON.parse(userVal)
    }

    return DEFAULT_FLAGS[key] ?? false
  },

  async set(key: string, value: FlagValue, userId?: string) {
    const redisKey = userId ? `flags:${userId}:${key}` : `flags:global:${key}`
    await redis.set(redisKey, JSON.stringify(value), { ex: 60 })
  },

  async getAll(userId?: string): Promise<Record<string, FlagValue>> {
    const result = { ...DEFAULT_FLAGS }
    for (const key of Object.keys(DEFAULT_FLAGS)) {
      result[key] = await this.get(key, userId)
    }
    return result
  },
}
