import { z } from 'zod'
import { createTRPCRouter, coordinatorProcedure } from '@/server/trpc'
import { coordinatorService } from '@/server/services/coordinator.service'

export const coordinatorRouter = createTRPCRouter({
  getDashboard: coordinatorProcedure.query(async ({ ctx }) => {
    return coordinatorService.getDashboard(ctx.userId)
  }),

  getUsers: coordinatorProcedure
    .input(z.object({
      role: z.enum(['STUDENT', 'TEACHER', 'PARENT', 'COORDINATOR', 'ALL']).default('ALL'),
      search: z.string().optional(),
      page: z.number().min(1).default(1),
    }))
    .query(async ({ input }) => {
      return coordinatorService.getUsers(input)
    }),

  suspendUser: coordinatorProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      return coordinatorService.suspendUser(input.userId)
    }),

  broadcastMessage: coordinatorProcedure
    .input(z.object({
      title: z.string().min(1).max(100),
      body: z.string().min(1).max(1000),
      targetRole: z.enum(['ALL', 'STUDENT', 'TEACHER', 'PARENT']).default('ALL'),
    }))
    .mutation(async ({ input }) => {
      return coordinatorService.broadcastMessage(input)
    }),
})
