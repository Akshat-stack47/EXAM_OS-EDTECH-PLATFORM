import { db } from '@/lib/db'

export const parentService = {
  async getProfile(userId: string) {
    const profile = await db.parentProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { name: true, email: true, avatarUrl: true } },
        children: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    name: true,
                    healthSurveys: {
                      orderBy: { createdAt: 'desc' },
                      take: 1,
                      select: { id: true, riskLevel: true, overallScore: true, moodScore: true, sleepScore: true, wantsCounselor: true, createdAt: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!profile) throw new Error('PARENT_PROFILE_NOT_FOUND')

    const p = profile as any
    const children = p.children.map((link: any) => ({
      id: link.student.id,
      name: link.student.user.name,
      targetExam: link.student.targetExam,
      targetYear: link.student.targetYear,
      currentStreak: link.student.currentStreak,
      totalStudyMins: link.student.totalStudyMins,
      nationalRank: link.student.nationalRank,
      burnoutRisk: link.student.burnoutRisk,
      subjectScores: link.student.subjectScores.map((s: any) => ({
        subject: s.subject,
        score: s.score,
      })),
      latestHealth: link.student.user.healthSurveys?.[0] || null,
      isVerified: link.isVerified,
    }))

    return {
      name: p.user.name,
      children,
    }
  },

  async getAlerts(userId: string) {
    return await db.notification.findMany({
      where: { userId, read: false },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
  },
}
