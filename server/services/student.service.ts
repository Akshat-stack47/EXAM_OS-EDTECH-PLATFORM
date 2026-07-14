import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

const profileInclude = {
  user: { select: { name: true, email: true, avatarUrl: true } },
  studySessions: { orderBy: { createdAt: 'desc' as const }, take: 10 },
} satisfies Prisma.StudentProfileInclude

type ProfileResult = Prisma.StudentProfileGetPayload<{ include: typeof profileInclude }>

export const studentService = {
  async getProfile(userId: string): Promise<ProfileResult> {
    const profile = await db.studentProfile.findUnique({
      where: { userId },
      include: profileInclude,
    })

    if (!profile) throw new Error('STUDENT_PROFILE_NOT_FOUND')

    return profile as unknown as ProfileResult
  },

  async getSubjectScores(userId: string) {
    const profile = await db.studentProfile.findUnique({
      where: { userId },
      select: { id: true },
    })
    if (!profile) return []
    return db.subjectScore.findMany({
      where: { studentId: profile.id },
      orderBy: { score: 'desc' },
      take: 8,
    })
  },

  async getMockResults(userId: string) {
    const profile = await db.studentProfile.findUnique({
      where: { userId },
      select: { id: true },
    })
    if (!profile) return []
    return db.mockResult.findMany({
      where: { studentId: profile.id },
      orderBy: { attemptedAt: 'desc' },
      take: 10,
      select: {
        id: true,
        testId: true,
        score: true,
        totalMarks: true,
        percentile: true,
        rank: true,
        timeTakenSecs: true,
        attemptedAt: true,
        subjectBreakup: true,
      },
    })
  },

  async getLeaderboard(userId: string) {
    const profile = await db.studentProfile.findUnique({
      where: { userId },
      select: { targetExam: true },
    })
    if (!profile) return []
    return db.studentProfile.findMany({
      where: { targetExam: profile.targetExam, nationalRank: { not: null }, deletedAt: null },
      orderBy: { nationalRank: 'asc' },
      take: 10,
      select: {
        id: true,
        nationalRank: true,
        xpPoints: true,
        currentStreak: true,
        user: { select: { name: true, avatarUrl: true } },
      },
    })
  },

  async updateProfile(userId: string, data: {
    targetExam?: string
    targetYear?: number
    category?: string
    studyHoursGoal?: number
  }) {
    return db.studentProfile.update({
      where: { userId },
      data: {
        ...(data.targetExam && { targetExam: data.targetExam as any }),
        ...(data.targetYear && { targetYear: data.targetYear }),
        ...(data.category && { category: data.category }),
        ...(data.studyHoursGoal && { studyHoursGoal: data.studyHoursGoal }),
      },
    })
  },

  async logStudySession(studentId: string, durationMinutes: number) {
    const [session] = await db.$transaction([
      db.studySession.create({
        data: { studentId, duration: durationMinutes },
      }),
      db.studentProfile.update({
        where: { id: studentId },
        data: {
          totalStudyMins: { increment: durationMinutes },
          lastActiveAt: new Date(),
        },
      }),
    ])
    return session
  },
}
