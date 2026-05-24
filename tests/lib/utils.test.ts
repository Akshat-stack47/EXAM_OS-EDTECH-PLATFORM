import { describe, it, expect } from 'vitest'
import { cn, sha256, generateId } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    const result = cn('a', 'b')
    expect(result).toContain('a')
    expect(result).toContain('b')
  })

  it('handles conditional classes', () => {
    const result = cn('base', false && 'hidden', 'visible')
    expect(result).toContain('base')
    expect(result).toContain('visible')
    expect(result).not.toContain('hidden')
  })
})

describe('sha256', () => {
  it('returns 64-character hex string', async () => {
    const hash = await sha256('test')
    expect(hash).toHaveLength(64)
    expect(/^[0-9a-f]+$/.test(hash)).toBe(true)
  })

  it('is deterministic', async () => {
    const a = await sha256('hello')
    const b = await sha256('hello')
    expect(a).toBe(b)
  })
})

describe('generateId', () => {
  it('returns UUID v4 format', () => {
    const id = generateId()
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    )
  })
})
