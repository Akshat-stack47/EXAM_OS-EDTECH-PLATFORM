import { db } from '@/lib/db'

export const coordinatorService = {
  async getDashboard(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    })

    if (!user) throw new Error('USER_NOT_FOUND')

    const [totalStudents, totalTeachers, totalParents, recentUsers, subscriptionBreakdown] = await Promise.all([
      db.user.count({ where: { role: 'STUDENT', deletedAt: null } }),
      db.user.count({ where: { role: 'TEACHER', deletedAt: null } }),
      db.user.count({ where: { role: 'PARENT', deletedAt: null } }),
      db.user.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, name: true, email: true, role: true, createdAt: true, isVerified: true, isActive: true },
      }),
      // Subscription breakdown: count by role as proxy for tier (real tier field can be added later)
      Promise.resolve({
        free:      0,  // placeholder — real tier tracking requires a Subscription model
        aspirant:  0,
        pro:       0,
        elite:     0,
      }),
    ])

    return {
      name: user.name,
      email: user.email,
      totalStudents,
      totalTeachers,
      totalParents,
      totalUsers: totalStudents + totalTeachers + totalParents,
      recentUsers,
      subscriptionBreakdown,
    }
  },

  async getUsers({ role, search, page }: { role: string; search?: string; page: number }) {
    const pageSize = 20
    const where: any = { deletedAt: null }
    if (role !== 'ALL') where.role = role
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }
    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: { id: true, name: true, email: true, role: true, createdAt: true, isVerified: true, isActive: true },
      }),
      db.user.count({ where }),
    ])
    return { users, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
  },

  async suspendUser(userId: string) {
    return db.user.update({
      where: { id: userId },
      data: { deletedAt: new Date(), isActive: false },
    })
  },

  async broadcastMessage({ title, body, targetRole }: { title: string; body: string; targetRole: string }) {
    const where: any = { deletedAt: null }
    if (targetRole !== 'ALL') where.role = targetRole

    const users = await db.user.findMany({ where, select: { id: true } })
    const notifications = users.map((u) => ({ userId: u.id, title, body }))

    await db.notification.createMany({ data: notifications })
    return { sent: notifications.length }
  },
}
