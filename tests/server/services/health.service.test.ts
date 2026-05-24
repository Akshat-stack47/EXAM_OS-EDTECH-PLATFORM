import { describe, it, expect, vi } from 'vitest'

const mockRaw = vi.fn()
const mockCreate = vi.fn()
const mockFindFirst = vi.fn()
const mockFindMany = vi.fn()

vi.mock('@/lib/db', () => ({
  db: {
    $queryRaw: (...args: any[]) => mockRaw(...args),
    healthSurvey: {
      create: (...args: any[]) => mockCreate(...args),
      findFirst: (...args: any[]) => mockFindFirst(...args),
      findMany: (...args: any[]) => mockFindMany(...args),
    },
  },
}))

vi.mock('@/lib/crypto', () => ({
  encrypt: vi.fn((s: string) => Promise.resolve(`enc:${s}`)),
  decrypt: vi.fn((s: string) => Promise.resolve(s.replace('enc:', ''))),
}))

const { healthService } = await import('@/server/services/health.service')

describe('healthService.check', () => {
  it('returns ok when DB is up', async () => {
    mockRaw.mockResolvedValue([{ 1: 1 }])
    const result = await healthService.check()
    expect(result.status).toBe('ok')
    expect(result.database).toBe('connected')
  })

  it('returns degraded when DB fails', async () => {
    mockRaw.mockRejectedValue(new Error('timeout'))
    const result = await healthService.check()
    expect(result.status).toBe('degraded')
  })
})

describe('healthService.submitSurvey', () => {
  it('encrypts notes and calculates risk level', async () => {
    mockCreate.mockResolvedValue({ id: 'h1', overallScore: 8.5, riskLevel: 'LOW' })
    const result = await healthService.submitSurvey('u1', {
      weekStart: '2024-01-01',
      moodScore: 8, sleepScore: 9, anxietyScore: 2, motivationScore: 8,
      wantsCounselor: false, notes: 'feeling great',
    })
    expect(result.riskLevel).toBe('LOW')
  })

  it('calculates overallScore correctly', async () => {
    let captured: any
    mockCreate.mockImplementation((args: any) => {
      captured = args.data
      return captured
    })
    await healthService.submitSurvey('u1', {
      weekStart: '2024-01-01',
      moodScore: 6, sleepScore: 6, anxietyScore: 6, motivationScore: 6,
      wantsCounselor: true, notes: undefined,
    })
    expect(captured.overallScore).toBe(5.5)
    expect(captured.riskLevel).toBe('MEDIUM')
  })

  it('returns HIGH risk for low scores', async () => {
    let captured: any
    mockCreate.mockImplementation((args: any) => {
      captured = args.data
      return captured
    })
    await healthService.submitSurvey('u1', {
      weekStart: '2024-01-01',
      moodScore: 2, sleepScore: 2, anxietyScore: 9, motivationScore: 2,
      wantsCounselor: true, notes: undefined,
    })
    expect(captured.overallScore).toBe(1.75)
    expect(captured.riskLevel).toBe('CRITICAL')
  })
})

describe('healthService.getLatest', () => {
  it('decrypts notes on return', async () => {
    mockFindFirst.mockResolvedValue({
      id: 'h1', notes: 'enc:secret', riskLevel: 'LOW', weekStart: new Date(),
    })
    const survey = await healthService.getLatest('u1')
    expect(survey.notes).toBe('secret')
  })
})
