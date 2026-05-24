import { db } from '@/lib/db'

export const notificationService = {
  async list(userId: string) {
    return db.notification.findMany({
      where: { userId },
      select: { id: true, title: true, body: true, read: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  },

  async markRead(notificationId: string) {
    return db.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })
  },

  async create(userId: string, title: string, body: string) {
    return db.notification.create({
      data: { userId, title, body },
    })
  },
}
