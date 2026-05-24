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
      take: 5,
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
