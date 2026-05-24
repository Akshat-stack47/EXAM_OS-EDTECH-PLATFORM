import { createTRPCRouter, parentProcedure } from '@/server/trpc'
import { parentService } from '@/server/services/parent.service'

export const parentRouter = createTRPCRouter({
  getDashboard: parentProcedure.query(async ({ ctx }) => {
    const profile = await parentService.getProfile(ctx.userId)
    const alerts = await parentService.getAlerts(ctx.userId)
    return { profile, alerts }
  }),
})
