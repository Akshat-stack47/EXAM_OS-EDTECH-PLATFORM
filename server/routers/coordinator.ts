import { createTRPCRouter, coordinatorProcedure } from '@/server/trpc'
import { coordinatorService } from '@/server/services/coordinator.service'

export const coordinatorRouter = createTRPCRouter({
  getDashboard: coordinatorProcedure.query(async ({ ctx }) => {
    return coordinatorService.getDashboard(ctx.userId)
  }),
})
