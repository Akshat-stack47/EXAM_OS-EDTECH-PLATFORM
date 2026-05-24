import { describe, it, expect, vi } from 'vitest'

const mockFindUnique = vi.fn()
const mockFindMany = vi.fn()

vi.mock('@/lib/db', () => ({
  db: {
    studentProfile: {
      findUnique: (...args: any[]) => mockFindUnique(...args),
    },
    subjectScore: { findMany: (...args: any[]) => mockFindMany(...args) },
  },
}))

vi.mock('@/lib/redis', () => ({
  ratelimit: {
    api: { limit: vi.fn().mockResolvedValue({ success: true }) },
  },
}))

vi.mock('@/server/services/student.service', () => ({
  studentService: {
    getProfile: (...args: any[]) => mockFindUnique(...args),
    getSubjectScores: (...args: any[]) => mockFindMany(...args),
    logStudySession: vi.fn().mockResolvedValue({ id: 'ses1', duration: 25 }),
  },
}))

const { studentRouter } = await import('@/server/routers/student')

describe('studentRouter.getDashboard', () => {
  it('returns profile with scores', async () => {
    mockFindUnique.mockResolvedValue({
      id: 's1', userId: 'u1', nationalRank: 100, currentStreak: 5,
      totalStudyMins: 500, user: { name: 'Test' },
      studySessions: [{ duration: 25, createdAt: new Date() }],
      subjectScores: [],
    })
    mockFindMany.mockResolvedValue([
      { subject: 'Math', score: 90 },
    ])
    const caller = studentRouter.createCaller({ userId: 'u1', userRole: 'STUDENT' } as any)
    const result = await caller.getDashboard()
    expect(result.profile.name).toBe('Test')
    expect(result.profile.nationalRank).toBe(100)
  })
})

describe('studentRouter.logSession', () => {
  it('creates session and returns it', async () => {
    const caller = studentRouter.createCaller({ userId: 'u1', userRole: 'STUDENT' } as any)
    const result = await caller.logSession({ durationMinutes: 25 })
    expect(result).toBeDefined()
  })
})
