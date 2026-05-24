import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/trpc'
import { aiService } from '@/server/services/ai.service'

export const aiRouter = createTRPCRouter({
  chat: protectedProcedure
    .input(z.object({
      message: z.string().min(1),
      examType: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return aiService.chat(ctx.userId, input.message, { examType: input.examType })
    }),
})
