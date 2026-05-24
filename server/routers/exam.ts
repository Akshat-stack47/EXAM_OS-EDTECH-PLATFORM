import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/trpc'
import { examService } from '@/server/services/exam.service'

export const examRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ examName: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return examService.list(input?.examName)
    }),
})
