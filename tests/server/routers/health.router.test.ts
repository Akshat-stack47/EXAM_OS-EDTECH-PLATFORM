import { describe, it, expect, vi } from 'vitest'

const mockRaw = vi.fn()
const mockCreate = vi.fn()
const mockFindFirst = vi.fn()

vi.mock('@/lib/db', () => ({
  db: {
    $queryRaw: (...args: any[]) => mockRaw(...args),
    healthSurvey: {
      create: (...args: any[]) => mockCreate(...args),
      findFirst: (...args: any[]) => mockFindFirst(...args),
    },
  },
}))

vi.mock('@/lib/crypto', () => ({
  encrypt: vi.fn((s: string) => `enc:${s}`),
  decrypt: vi.fn((s: string) => s.replace('enc:', '')),
}))

vi.mock('@/lib/redis', () => ({
  ratelimit: {
    api: { limit: vi.fn().mockResolvedValue({ success: true }) },
  },
}))

const { healthRouter } = await import('@/server/routers/health')

describe('healthRouter.submitSurvey', () => {
  it('creates survey with risk level', async () => {
    mockCreate.mockResolvedValue({ id: 'h1', overallScore: 8.5, riskLevel: 'LOW' })
    const caller = healthRouter.createCaller({ userId: 'u1', userRole: 'STUDENT' } as any)
    const result = await caller.submitSurvey({
      weekStart: '2024-01-01', moodScore: 8, sleepScore: 9,
      anxietyScore: 2, motivationScore: 8, wantsCounselor: false,
    })
    expect(result.riskLevel).toBe('LOW')
  })
})

describe('healthRouter.getLatest', () => {
  it('returns latest survey with decrypted notes', async () => {
    mockFindFirst.mockResolvedValue({
      id: 'h1', notes: 'enc:hello', riskLevel: 'LOW', weekStart: new Date(),
    })
    const caller = healthRouter.createCaller({ userId: 'u1', userRole: 'STUDENT' } as any)
    const result = await caller.getLatest()
    expect(result.notes).toBe('hello')
  })
})
