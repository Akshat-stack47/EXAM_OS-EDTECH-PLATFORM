import { db } from '@/lib/db'

export const teacherService = {
  async getDashboard(userId: string) {
    const profile = await db.teacherProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { name: true, email: true, avatarUrl: true },
        },
      },
    })

    if (!profile) throw new Error('TEACHER_PROFILE_NOT_FOUND')

    const [studentCount, atRiskStudents, recentStudents] = await Promise.all([
      db.studentProfile.count({ where: { deletedAt: null } }),
      db.studentProfile.findMany({
        where: { burnoutRisk: { in: ['MEDIUM', 'HIGH', 'CRITICAL'] }, deletedAt: null },
        take: 10,
        select: {
          id: true,
          targetExam: true,
          currentStreak: true,
          burnoutRisk: true,
          nationalRank: true,
          user: { select: { name: true } },
        },
      }),
      db.studentProfile.findMany({
        where: { deletedAt: null },
        orderBy: { lastActiveAt: 'desc' },
        take: 20,
        select: {
          id: true,
          targetExam: true,
          nationalRank: true,
          burnoutRisk: true,
          user: { select: { name: true } },
        },
      }),
    ])

    return {
      name: profile.user.name,
      email: profile.user.email,
      avatarUrl: profile.user.avatarUrl,
      bio: profile.bio,
      specialization: profile.specialization,
      rating: profile.rating,
      earnings: Number(profile.earnings),
      studentCount,
      atRiskStudents: atRiskStudents.map((s) => ({
        id: s.id,
        name: s.user.name,
        exam: s.targetExam,
        burnoutRisk: s.burnoutRisk,
        nationalRank: s.nationalRank,
        weakestSubject: null,
        weakestScore: null,
      })),
      recentStudents: recentStudents.map((s) => ({
        id: s.id,
        name: s.user.name,
        exam: s.targetExam,
        burnoutRisk: s.burnoutRisk,
        nationalRank: s.nationalRank,
        topScore: null,
      })),
    }
  },

  async getProfile(userId: string) {
    return (await this.getDashboard(userId))
  },

  async updateProfile(userId: string, data: { bio?: string; specialization?: string }) {
    return db.teacherProfile.update({
      where: { userId },
      data,
    })
  },
}
