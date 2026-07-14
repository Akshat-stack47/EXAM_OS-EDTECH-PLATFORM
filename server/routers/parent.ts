import { z } from 'zod'
import { createTRPCRouter, parentProcedure } from '@/server/trpc'
import { parentService } from '@/server/services/parent.service'

export const parentRouter = createTRPCRouter({
  getDashboard: parentProcedure.query(async ({ ctx }) => {
    const [profile, alerts] = await Promise.all([
      parentService.getProfile(ctx.userId),
      parentService.getAlerts(ctx.userId),
    ])
    return { profile, alerts, unreadCount: alerts.length }
  }),

  getChildren: parentProcedure.query(async ({ ctx }) => {
    const profile = await parentService.getProfile(ctx.userId)
    return profile.children
  }),

  markAlertRead: parentProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ input }) => {
      const { db } = await import('@/lib/db')
      return db.notification.update({
        where: { id: input.notificationId },
        data: { read: true },
      })
    }),
})
