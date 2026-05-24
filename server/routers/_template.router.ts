import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/trpc'
import { handleServiceError } from '@/lib/errors'
import { logger } from '@/lib/logger'

export const domainRouter = createTRPCRouter({

  getOne: protectedProcedure
    .input(z.object({
      id: z.string().cuid2(),
    }))
    .query(async ({ ctx, input }) => {
      const start = Date.now()
      try {
        logger.info('domain.router.getOne', {
          service: 'domain.router',
          action: 'getOne',
          userId: ctx.userId,
          durationMs: Date.now() - start,
          metadata: { id: input.id },
        })

        return {}
      } catch (error) {
        handleServiceError(error, 'domain.router.getOne')
      }
    }),

  list: protectedProcedure
    .input(z.object({
      cursor: z.string().cuid2().optional(),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ ctx, input }) => {
      try {
        return {
          items: [],
          nextCursor: null,
          total: 0,
          hasMore: false,
        }
      } catch (error) {
        handleServiceError(error, 'domain.router.list')
      }
    }),

  create: protectedProcedure
    .input(z.object({
    }))
    .mutation(async ({ ctx, input }) => {
      const start = Date.now()
      try {
        logger.info('domain.router.create', {
          service: 'domain.router',
          action: 'create',
          userId: ctx.userId,
          durationMs: Date.now() - start,
        })

        return { success: true }
      } catch (error) {
        handleServiceError(error, 'domain.router.create')
      }
    }),
})
