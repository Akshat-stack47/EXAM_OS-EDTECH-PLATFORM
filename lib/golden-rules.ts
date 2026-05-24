import { AppError } from '@/lib/errors'
import { DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT } from '@/lib/constants'

export function assertCursorPagination(params: {
  cursor?: string
  limit?: number
  skip?: number
}) {
  if (params.skip !== undefined && params.skip > 0) {
    throw AppError.internal(
      'OFFSET pagination is forbidden. Use cursor-based pagination.',
    )
  }
  if (params.limit && params.limit > MAX_PAGE_LIMIT) {
    throw AppError.validation(
      `Page limit cannot exceed ${MAX_PAGE_LIMIT}. Received: ${params.limit}`,
    )
  }
}

export function assertCacheKey(key: string) {
  const validPattern = /^[a-z][a-z0-9]*:[a-z][a-z0-9]*:.+$/
  if (!validPattern.test(key)) {
    throw AppError.internal(
      `Invalid Redis key format: "${key}". Must be service:entity:id`,
    )
  }
}

export function assertNotInRequestCycle(context: string) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[golden-rule-15] "${context}" is a heavy operation. Ensure it runs in BullMQ, not in a tRPC handler.`,
    )
  }
}
