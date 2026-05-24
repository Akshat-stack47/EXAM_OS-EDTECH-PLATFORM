import { cache as redisCache } from '@/lib/redis'

export const cache = redisCache
export { ratelimit, redis } from '@/lib/redis'
