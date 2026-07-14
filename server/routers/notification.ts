import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/trpc'
import { notificationService } from '@/server/services/notification.service'

export const notificationRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return notificationService.list(ctx.userId)
  }),

  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    return notificationService.unreadCount(ctx.userId)
  }),

  markRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return notificationService.markRead(input.id)
    }),

  markAllRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      return notificationService.markAllRead(ctx.userId)
    }),
})
