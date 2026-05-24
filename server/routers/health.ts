import { z } from 'zod'
import { createTRPCRouter, publicProcedure, studentProcedure } from '@/server/trpc'
import { healthService } from '@/server/services/health.service'

export const healthRouter = createTRPCRouter({
  check: publicProcedure.query(async () => {
    return healthService.check()
  }),

  submitSurvey: studentProcedure
    .input(z.object({
      weekStart: z.string(),
      moodScore: z.number().min(1).max(10),
      sleepScore: z.number().min(1).max(10),
      anxietyScore: z.number().min(1).max(10),
      motivationScore: z.number().min(1).max(10),
      wantsCounselor: z.boolean(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return healthService.submitSurvey(ctx.userId, input)
    }),

  getLatest: studentProcedure.query(async ({ ctx }) => {
    return healthService.getLatest(ctx.userId)
  }),
})
