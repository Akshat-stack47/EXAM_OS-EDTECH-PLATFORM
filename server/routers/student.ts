import { z } from 'zod'
import { createTRPCRouter, studentProcedure } from '@/server/trpc'
import { studentService } from '@/server/services/student.service'
import { healthService } from '@/server/services/health.service'
import { whiteboardService } from '@/server/services/whiteboard.service'

export const studentRouter = createTRPCRouter({
  getDashboard: studentProcedure.query(async ({ ctx }) => {
    const [profile, scores, latestHealth, whiteboards] = await Promise.all([
      studentService.getProfile(ctx.userId),
      studentService.getSubjectScores(ctx.userId),
      healthService.getLatest(ctx.userId),
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
      },
      scores: scores.map((s) => ({ subject: s.subject, score: s.score })),
      recentSessions: profile.studySessions.slice(0, 5).map((s) => ({
        duration: s.duration,
        createdAt: s.createdAt,
      })),
      latestHealth,
      whiteboards: whiteboards.map((w: any) => ({
        id: w.id,
        title: w.title,
        topic: w.topic,
        status: w.status,
        memberCount: w._count?.members ?? 0,
        createdAt: w.createdAt,
      })),
    }
  }),

  logSession: studentProcedure
    .input(z.object({ durationMinutes: z.number().min(1).max(480) }))
    .mutation(async ({ ctx, input }) => {
      const profile = await studentService.getProfile(ctx.userId)
      return studentService.logStudySession(profile.id, input.durationMinutes)
    }),
})
