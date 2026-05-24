import { createTRPCRouter, teacherProcedure } from '@/server/trpc'
import { teacherService } from '@/server/services/teacher.service'

export const teacherRouter = createTRPCRouter({
  getDashboard: teacherProcedure.query(async ({ ctx }) => {
    return teacherService.getProfile(ctx.userId)
  }),
})
