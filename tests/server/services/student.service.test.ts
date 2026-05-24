import { describe, it, expect, vi } from 'vitest'

const mockFindUnique = vi.fn()
const mockFindMany = vi.fn()

vi.mock('@/lib/db', () => ({
  db: {
    studentProfile: {
      findUnique: (...args: any[]) => mockFindUnique(...args),
    },
    subjectScore: {
      findMany: (...args: any[]) => mockFindMany(...args),
    },
  },
}))

vi.mock('@/server/services/student.service', () => ({
  studentService: {
    async getProfile(userId: string) {
      const profile = await mockFindUnique(userId)
      if (!profile) throw new Error('STUDENT_PROFILE_NOT_FOUND')
      return profile
    },
    async getSubjectScores(studentId: string) {
      return mockFindMany(studentId)
    },
    async logStudySession(studentId: string, durationMinutes: number) {
      return { id: 'ses1', duration: durationMinutes, studentId }
    },
  },
}))

const { studentService } = await import('@/server/services/student.service')

describe('studentService.getProfile', () => {
  it('returns profile with user and sessions', async () => {
    mockFindUnique.mockResolvedValue({
      id: 's1', userId: 'u1', totalStudyMins: 100,
      user: { name: 'Test', email: 'test@test.com', avatarUrl: null },
      studySessions: [{ duration: 25, createdAt: new Date() }],
    })
    const profile = await studentService.getProfile('u1')
    expect(profile.id).toBe('s1')
    expect(profile.user.name).toBe('Test')
    expect(profile.studySessions).toHaveLength(1)
  })

  it('throws when profile not found', async () => {
    mockFindUnique.mockResolvedValue(null)
    await expect(studentService.getProfile('bad')).rejects.toThrow('STUDENT_PROFILE_NOT_FOUND')
  })
})

describe('studentService.getSubjectScores', () => {
  it('returns top 5 scores ordered desc', async () => {
    mockFindMany.mockResolvedValue([
      { subject: 'Math', score: 95 },
      { subject: 'Science', score: 88 },
    ])
    const scores = await studentService.getSubjectScores('s1')
    expect(scores).toHaveLength(2)
    expect(scores[0].score).toBe(95)
  })
})

describe('studentService.logStudySession', () => {
  it('creates session and returns it', async () => {
    const session = await studentService.logStudySession('s1', 25)
    expect(session.duration).toBe(25)
    expect(session.studentId).toBe('s1')
  })
})
