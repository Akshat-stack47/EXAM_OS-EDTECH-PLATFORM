import { describe, it, expect, vi } from 'vitest'

const mockFindMany = vi.fn()

vi.mock('@/lib/db', () => ({
  db: { examCutoff: { findMany: (...args: any[]) => mockFindMany(...args) } },
}))

const { examRouter } = await import('@/server/routers/exam')
const { createTRPCContext } = await import('@/server/trpc')

describe('examRouter.list', () => {
  it('returns exam cutoff data', async () => {
    mockFindMany.mockResolvedValue([
      { id: '1', examName: 'UPSC', examYear: 2024, stage: 'Prelims', general: 98 },
    ])
    const caller = examRouter.createCaller({} as any)
    const result = await caller.list({ examName: 'UPSC' })
    expect(result).toHaveLength(1)
    expect(result[0].examName).toBe('UPSC')
  })

  it('returns all when no filter', async () => {
    mockFindMany.mockResolvedValue([
      { id: '1', examName: 'UPSC', examYear: 2024 },
      { id: '2', examName: 'SSC', examYear: 2023 },
    ])
    const caller = examRouter.createCaller({} as any)
    const result = await caller.list()
    expect(result).toHaveLength(2)
  })
})
