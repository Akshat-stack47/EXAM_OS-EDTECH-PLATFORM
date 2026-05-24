import { describe, it, expect } from 'vitest'
import { AppError, formatError } from '@/lib/app-error'

describe('AppError', () => {
  it('creates with code, message, and statusCode', () => {
    const err = new AppError('TEST_CODE', 'test message', 400)
    expect(err.code).toBe('TEST_CODE')
    expect(err.message).toBe('test message')
    expect(err.statusCode).toBe(400)
    expect(err.name).toBe('AppError')
  })

  it('notFound returns 404', () => {
    const err = AppError.notFound('Resource')
    expect(err.statusCode).toBe(404)
    expect(err.code).toBe('NOT_FOUND')
    expect(err.message).toContain('Resource')
  })

  it('forbidden returns 403', () => {
    const err = AppError.forbidden()
    expect(err.statusCode).toBe(403)
    expect(err.code).toBe('FORBIDDEN')
  })

  it('validation passes details through', () => {
    const details = { field: 'email', error: 'invalid' }
    const err = AppError.validation(details)
    expect(err.statusCode).toBe(400)
    expect(err.code).toBe('VALIDATION_ERROR')
    expect(err.details).toEqual(details)
  })

  it('internal returns 500', () => {
    const err = AppError.internal()
    expect(err.statusCode).toBe(500)
    expect(err.code).toBe('INTERNAL_ERROR')
  })
})

describe('formatError', () => {
  it('formats AppError correctly', () => {
    const err = new AppError('NOT_FOUND', 'User not found', 404)
    const result = formatError(err)
    expect(result.success).toBe(false)
    expect(result.error.code).toBe('NOT_FOUND')
    expect(result.error.message).toBe('User not found')
    expect(result.meta.requestId).toBeDefined()
    expect(result.meta.timestamp).toBeDefined()
  })

  it('formats unknown error as generic INTERNAL_ERROR', () => {
    const result = formatError(new Error('secret info'))
    expect(result.success).toBe(false)
    expect(result.error.code).toBe('INTERNAL_ERROR')
    expect(result.error.message).toBe('An unexpected error occurred')
    expect(result.meta.requestId).toBeDefined()
  })
})
