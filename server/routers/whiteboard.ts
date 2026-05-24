import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/trpc'
import { whiteboardService } from '@/server/services/whiteboard.service'

export const whiteboardRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return whiteboardService.list(ctx.userId)
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return whiteboardService.getById(input.id)
    }),

  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      topic: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return whiteboardService.create({ hostId: ctx.userId, title: input.title, topic: input.topic })
    }),
})
