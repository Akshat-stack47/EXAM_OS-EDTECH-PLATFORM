import * as Sentry from '@sentry/nextjs'

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: unknown,
  ) {
    super(message)
    this.name = 'AppError'
  }

  static notFound(entity: string) {
    return new AppError('NOT_FOUND', `${entity} not found`, 404)
  }

  static forbidden(message = 'Access denied') {
    return new AppError('FORBIDDEN', message, 403)
  }

  static validation(details: unknown) {
    return new AppError('VALIDATION_ERROR', 'Validation failed', 400, details)
  }

  static internal(message = 'Internal server error', details?: unknown) {
    return new AppError('INTERNAL_ERROR', message, 500, details)
  }

  static unauthorized(message = 'Authentication required') {
    return new AppError('UNAUTHORIZED', message, 401)
  }

  static aiError(message = 'AI service temporarily unavailable') {
    return new AppError('AI_ERROR', message, 503)
  }
}

export type ErrorResponse = {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
  meta: {
    requestId: string
    timestamp: string
  }
}

export function handleServiceError(error: unknown, context: string): never {
  if (error instanceof AppError) throw error
  Sentry.captureException(error, { extra: { context } })
  throw AppError.internal(`Error in ${context}`)
}

export function formatError(err: unknown): ErrorResponse {
  if (err instanceof AppError) {
    return {
      success: false,
      error: { code: err.code, message: err.message, details: err.details },
      meta: { requestId: crypto.randomUUID?.() ?? '', timestamp: new Date().toISOString() },
    }
  }

  Sentry.captureException(err)

  return {
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
    meta: { requestId: crypto.randomUUID?.() ?? '', timestamp: new Date().toISOString() },
  }
}
