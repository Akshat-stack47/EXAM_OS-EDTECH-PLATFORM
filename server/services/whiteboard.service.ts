import { db } from '@/lib/db'
import { cache } from '@/lib/redis'

export const whiteboardService = {
  async list(hostId?: string) {
    const where = hostId ? { hostId } : {}
    return db.whiteboardSession.findMany({
      where,
      select: { id: true, title: true, topic: true, status: true, hostId: true, startedAt: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(id: string) {
    return db.whiteboardSession.findUnique({
      where: { id },
      select: { id: true, title: true, topic: true, status: true, hostId: true, canvasData: true, maxMembers: true, isPublic: true, inviteCode: true, botEnabled: true, startedAt: true, endedAt: true, createdAt: true },
    })
  },

  async getSessionState(sessionId: string) {
    const cached = await cache.getSessionState(sessionId)
    if (cached) return cached
    const session = await db.whiteboardSession.findUnique({
      where: { id: sessionId },
      select: { canvasData: true, status: true },
    })
    if (session) {
      await cache.cacheSessionState(sessionId, session)
    }
    return session
  },

  async create(data: { hostId: string; title: string; topic?: string }) {
    return db.whiteboardSession.create({
      data: {
        hostId: data.hostId,
        title: data.title,
        topic: data.topic || null,
        canvasData: {},
      },
    })
  },

  async updateSessionState(sessionId: string, canvasData: object) {
    await cache.cacheSessionState(sessionId, { canvasData, status: 'ACTIVE' })
    return db.whiteboardSession.update({
      where: { id: sessionId },
      data: { canvasData },
    })
  },

  async endSession(sessionId: string) {
    await cache.clearSessionState(sessionId)
    return db.whiteboardSession.update({
      where: { id: sessionId },
      data: { status: 'ENDED', endedAt: new Date() },
    })
  },
}
