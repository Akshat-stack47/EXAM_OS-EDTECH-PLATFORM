import { z } from 'zod'
import { createTRPCRouter, teacherProcedure } from '@/server/trpc'
import { teacherService } from '@/server/services/teacher.service'

export const teacherRouter = createTRPCRouter({
  getDashboard: teacherProcedure.query(async ({ ctx }) => {
    return teacherService.getDashboard(ctx.userId)
  }),

  updateProfile: teacherProcedure
    .input(z.object({
      bio: z.string().max(500).optional(),
      specialization: z.string().max(100).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return teacherService.updateProfile(ctx.userId, input)
    }),
})
