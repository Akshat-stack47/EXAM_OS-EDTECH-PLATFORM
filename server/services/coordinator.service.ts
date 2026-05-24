import { db } from '@/lib/db'

export const coordinatorService = {
  async getDashboard(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    })

    if (!user) throw new Error('USER_NOT_FOUND')

    const [totalStudents, totalTeachers, totalParents, recentUsers] = await Promise.all([
      db.user.count({ where: { role: 'STUDENT', deletedAt: null } }),
      db.user.count({ where: { role: 'TEACHER', deletedAt: null } }),
      db.user.count({ where: { role: 'PARENT', deletedAt: null } }),
      db.user.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
    ])

    return {
      name: user.name,
      totalStudents,
      totalTeachers,
      totalParents,
      totalUsers: totalStudents + totalTeachers + totalParents,
      recentUsers,
    }
  },
}
