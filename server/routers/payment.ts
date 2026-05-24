import { createTRPCRouter, protectedProcedure } from '@/server/trpc'
import { paymentService } from '@/server/services/payment.service'

export const paymentRouter = createTRPCRouter({
  history: protectedProcedure.query(async ({ ctx }) => {
    return paymentService.list(ctx.userId)
  }),
})
