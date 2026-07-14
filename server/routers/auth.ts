import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '@/server/trpc'
import { authService } from '@/server/services/auth.service'
import { ratelimit } from '@/lib/redis'

export const authRouter = createTRPCRouter({
  sendOtp: publicProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      const { success } = await ratelimit.otp.limit(input.email)
      if (!success) {
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Too many OTP requests. Try again in 15 minutes.' })
      }
      return authService.sendOtp(input.email)
    }),

  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      otp: z.string().length(6),
    }))
    .mutation(async ({ input }) => {
      const { success } = await ratelimit.otp.limit(input.email)
      if (!success) {
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Too many login attempts. Try again in 15 minutes.' })
      }
      return authService.login(input)
    }),

  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      name: z.string().min(2),
      role: z.enum(['STUDENT', 'PARENT', 'TEACHER', 'COORDINATOR']),
      targetExam: z.enum(['UPSC', 'SSC', 'BANKING', 'RAILWAY', 'STATE_PSC', 'JEE', 'NEET', 'DEFENCE']).optional(),
      targetYear: z.number().min(2025).max(2035).optional(),
      category: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return authService.register(input)
    }),

  me: publicProcedure
    .query(async ({ ctx }) => {
      if (!ctx.userId) return null
      return authService.getMe(ctx.userId)
    }),
})
