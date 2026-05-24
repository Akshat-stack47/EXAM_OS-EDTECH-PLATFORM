import { db } from '@/lib/db'

export const teacherService = {
  async getProfile(userId: string) {
    const profile = await db.teacherProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { name: true, email: true, avatarUrl: true },
        },
      },
    })

    if (!profile) throw new Error('TEACHER_PROFILE_NOT_FOUND')

    const studentCount = await db.studentProfile.count()

    return {
      name: profile.user.name,
      email: profile.user.email,
      avatarUrl: profile.user.avatarUrl,
      bio: profile.bio,
      specialization: profile.specialization,
      rating: profile.rating,
      earnings: Number(profile.earnings),
      studentCount,
    }
  },
}
