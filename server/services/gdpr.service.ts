import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { auditLog } from '@/lib/audit'
import { logger } from '@/lib/logger'
import { AppError } from '@/lib/errors'
import { REDIS_KEY } from '@/lib/constants'

export async function exportUserData(userId: string): Promise<Record<string, unknown>> {
  const [profile, mockResults, healthSurveys, auditLogs] =
    await Promise.all([
      db.user.findUnique({
        where: { id: userId, deletedAt: null },
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          languagePref: true,
          createdAt: true,
          studentProfile: {
            select: {
              targetExam: true,
              xpPoints: true,
              currentStreak: true,
              totalStudyMins: true,
              burnoutRisk: true,
            },
          },
        },
      }),
      db.mockResult.findMany({
        where: { studentId: userId, deletedAt: null },
        select: { testId: true, score: true, attemptedAt: true, subjectBreakup: true },
        orderBy: { attemptedAt: 'desc' },
        take: 100,
      }),
      db.healthSurvey.findMany({
        where: { userId, deletedAt: null },
        select: { weekStart: true, riskLevel: true, createdAt: true },
        orderBy: { weekStart: 'desc' },
        take: 52,
      }),
      db.auditLog.findMany({
        where: { userId },
        select: { action: true, createdAt: true, entityType: true },
        orderBy: { createdAt: 'desc' },
        take: 200,
      }),
    ])

  await auditLog({
    userId,
    action: 'DATA_EXPORTED',
    metadata: {
      recordCounts: {
        mockResults: mockResults.length,
        surveys: healthSurveys.length,
      },
    },
  })

  return {
    exportedAt: new Date().toISOString(),
    profile,
    mockResults,
    healthSurveys,
    activityLog: auditLogs,
  }
}

export async function deleteUserData(
  userId: string,
  requestedByUserId: string,
): Promise<void> {
  if (userId !== requestedByUserId) {
    const requester = await db.user.findUnique({
      where: { id: requestedByUserId },
      select: { role: true },
    })
    if (requester?.role !== 'COORDINATOR') {
      throw AppError.forbidden('Only the user or a coordinator can delete user data')
    }
  }

  const now = new Date()

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        email: `deleted_${userId}@examos.invalid`,
        phone: null,
        deletedAt: now,
      },
      select: { id: true },
    })

    await tx.studentProfile.updateMany({
      where: { userId },
      data: { deletedAt: now },
    })

    await tx.mockResult.updateMany({
      where: { studentId: userId },
      data: { deletedAt: now },
    })

    await tx.healthSurvey.updateMany({
      where: { userId },
      data: { deletedAt: now },
    })
  })

  await Promise.allSettled([
    redis.del(REDIS_KEY.studentProfile(userId)),
    redis.del(REDIS_KEY.parentChildren(userId)),
  ])

  await auditLog({
    userId: requestedByUserId,
    action: 'DATA_DELETED',
    entityId: userId,
    entityType: 'user',
    metadata: { reason: 'gdpr_erasure_request' },
  })

  logger.info('user data deleted', {
    userId: requestedByUserId,
    targetUserId: userId,
  })
}
