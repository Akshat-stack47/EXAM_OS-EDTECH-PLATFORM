import { db } from '@/lib/db'
import { encrypt, decrypt } from '@/lib/crypto'
import { auditLog } from '@/lib/audit'

export const healthService = {
  async check() {
    try {
      await db.$queryRaw`SELECT 1`
      return { status: 'ok', database: 'connected', timestamp: new Date().toISOString() }
    } catch {
      return { status: 'degraded', database: 'disconnected', timestamp: new Date().toISOString() }
    }
  },

  async submitSurvey(userId: string, data: {
    weekStart: string
    moodScore: number
    sleepScore: number
    anxietyScore: number
    motivationScore: number
    wantsCounselor: boolean
    notes?: string
  }) {
    const overallScore = (data.moodScore + data.sleepScore + (10 - data.anxietyScore) + data.motivationScore) / 4

    const riskLevel = overallScore >= 7 ? 'LOW' : overallScore >= 4 ? 'MEDIUM' : overallScore >= 2 ? 'HIGH' : 'CRITICAL'

    const encryptedNotes = data.notes ? await encrypt(data.notes) : null

    const survey = await db.healthSurvey.create({
      data: {
        userId,
        weekStart: new Date(data.weekStart),
        moodScore: data.moodScore,
        sleepScore: data.sleepScore,
        anxietyScore: data.anxietyScore,
        motivationScore: data.motivationScore,
        overallScore,
        riskLevel: riskLevel as any,
        wantsCounselor: data.wantsCounselor,
        notes: encryptedNotes,
        aiResponse: null,
      },
      select: { id: true, riskLevel: true, overallScore: true, weekStart: true },
    })

    await auditLog({ userId, action: 'HEALTH_SURVEY_SUBMITTED', entityType: 'HealthSurvey', entityId: survey.id, metadata: { riskLevel: riskLevel, overallScore } })

    return survey
  },

  async getLatest(userId: string) {
    const survey = await db.healthSurvey.findFirst({
      where: { userId },
      select: { id: true, weekStart: true, moodScore: true, sleepScore: true, anxietyScore: true, motivationScore: true, overallScore: true, riskLevel: true, notes: true, wantsCounselor: true, submittedAt: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    if (survey?.notes) {
      survey.notes = await decrypt(survey.notes)
    }
    return survey
  },

  async getHistory(userId: string, limit = 10) {
    const surveys = await db.healthSurvey.findMany({
      where: { userId },
      select: { id: true, weekStart: true, moodScore: true, sleepScore: true, anxietyScore: true, motivationScore: true, overallScore: true, riskLevel: true, notes: true, wantsCounselor: true, submittedAt: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    for (const survey of surveys) {
      if (survey.notes) {
        survey.notes = await decrypt(survey.notes)
      }
    }
    return surveys
  },
}
