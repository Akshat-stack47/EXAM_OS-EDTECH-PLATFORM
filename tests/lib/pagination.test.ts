import { describe, it, expect } from 'vitest'
import { cursorPaginationSchema, paginate } from '@/lib/pagination'

describe('cursorPaginationSchema', () => {
  it('parses valid input with defaults', () => {
    const result = cursorPaginationSchema.parse({})
    expect(result.limit).toBe(20)
    expect(result.cursor).toBeUndefined()
  })

  it('parses valid input with values', () => {
    const result = cursorPaginationSchema.parse({ cursor: 'abc', limit: 10 })
    expect(result.cursor).toBe('abc')
    expect(result.limit).toBe(10)
  })

  it('rejects limit over 100', () => {
    expect(() => cursorPaginationSchema.parse({ limit: 200 })).toThrow()
  })

  it('rejects limit under 1', () => {
    expect(() => cursorPaginationSchema.parse({ limit: 0 })).toThrow()
  })
})

describe('paginate', () => {
  it('returns items and nextCursor when has more', async () => {
    const items = Array.from({ length: 21 }, (_, i) => ({ id: `${i}`, name: `item${i}` }))
    const fetch = async ({ take }: any) => items.slice(0, take)

    const result = await paginate(fetch, { limit: 20 })
    expect(result.items).toHaveLength(20)
    expect(result.nextCursor).toBe('19')
  })

  it('returns null cursor on last page', async () => {
    const items = Array.from({ length: 15 }, (_, i) => ({ id: `${i}`, name: `item${i}` }))
    const fetch = async ({ take }: any) => items.slice(0, take)

    const result = await paginate(fetch, { limit: 20 })
    expect(result.items).toHaveLength(15)
    expect(result.nextCursor).toBeNull()
  })
})
