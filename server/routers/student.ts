import { z } from 'zod'
import { createTRPCRouter, studentProcedure } from '@/server/trpc'
import { studentService } from '@/server/services/student.service'
import { healthService } from '@/server/services/health.service'
import { whiteboardService } from '@/server/services/whiteboard.service'

export const studentRouter = createTRPCRouter({
  getDashboard: studentProcedure.query(async ({ ctx }) => {
    const [profile, scores, latestHealth, mockResults, whiteboards] = await Promise.all([
      studentService.getProfile(ctx.userId),
      studentService.getSubjectScores(ctx.userId),
      healthService.getLatest(ctx.userId),
      studentService.getMockResults(ctx.userId),
      whiteboardService.list(ctx.userId),
    ])

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todaySessions = profile.studySessions.filter(
      (s) => new Date(s.createdAt) >= todayStart
    )
    const todayMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0)

    return {
      profile: {
        name: profile.user.name,
        nationalRank: profile.nationalRank,
        streak: profile.currentStreak,
        totalStudyMins: profile.totalStudyMins,
        todayMinutes,
        targetExam: profile.targetExam,
        targetYear: profile.targetYear,
        xpPoints: profile.xpPoints,
        burnoutRisk: profile.burnoutRisk,
      },
      scores: scores.map((s) => ({ subject: s.subject, score: s.score })),
      recentSessions: profile.studySessions.slice(0, 5).map((s) => ({
        duration: s.duration,
        createdAt: s.createdAt,
      })),
      latestHealth,
      mockResults,
      whiteboards: (whiteboards ?? []).map((w: any) => ({
        id: w.id,
        title: w.title,
        topic: w.topic,
        status: w.status,
        memberCount: w._count?.members ?? 0,
      })),
    }
  }),


  logSession: studentProcedure
    .input(z.object({ durationMinutes: z.number().min(1).max(480) }))
    .mutation(async ({ ctx, input }) => {
      const profile = await studentService.getProfile(ctx.userId)
      return studentService.logStudySession(profile.id, input.durationMinutes)
    }),

  updateProfile: studentProcedure
    .input(z.object({
      targetExam: z.enum(['UPSC', 'SSC', 'BANKING', 'RAILWAY', 'STATE_PSC', 'JEE', 'NEET', 'DEFENCE']).optional(),
      targetYear: z.number().min(2025).max(2035).optional(),
      category: z.string().optional(),
      studyHoursGoal: z.number().min(1).max(16).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return studentService.updateProfile(ctx.userId, input)
    }),

  getMockResults: studentProcedure.query(async ({ ctx }) => {
    return studentService.getMockResults(ctx.userId)
  }),

  getLeaderboard: studentProcedure.query(async ({ ctx }) => {
    return studentService.getLeaderboard(ctx.userId)
  }),
})
