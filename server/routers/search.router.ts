import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/trpc'
import { searchService } from '@/server/services/search.service'
import { enqueueSearchSync, enqueueReindex } from '@/server/queues/search-sync.queue'

export const searchRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(200),
        entity: z.string().optional(),
        filterBy: z.string().optional(),
        sortBy: z.string().optional(),
        perPage: z.number().min(1).max(100).default(20),
        page: z.number().min(1).default(1),
      }),
    )
    .query(async ({ input }) => {
      return searchService.search(input.query, input.entity, {
        filterBy: input.filterBy,
        sortBy: input.sortBy,
        perPage: input.perPage,
        page: input.page,
      })
    }),

  suggest: publicProcedure
    .input(z.object({ query: z.string().min(1).max(100) }))
    .query(async ({ input }) => {
      return searchService.suggest(input.query)
    }),

  reindex: protectedProcedure
    .input(
      z.object({
        entity: z.enum(['exams', 'students', 'whiteboards', 'health_surveys', 'all']).default('all'),
      }),
    )
    .mutation(async ({ input }) => {
      await enqueueReindex({ entity: input.entity })
      return { queued: true, entity: input.entity }
    }),

  sync: protectedProcedure
    .input(
      z.object({
        entity: z.enum(['exams', 'students', 'whiteboards', 'health_surveys']),
        action: z.enum(['upsert', 'delete']),
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await enqueueSearchSync({ entity: input.entity, action: input.action, id: input.id })
      return { queued: true, entity: input.entity, id: input.id }
    }),

  init: protectedProcedure.mutation(async () => {
    await enqueueReindex({ entity: 'all' })
    return { queued: true, entity: 'all' }
  }),
})
