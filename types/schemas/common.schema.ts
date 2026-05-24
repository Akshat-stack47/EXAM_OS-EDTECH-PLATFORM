import { z } from 'zod'

export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().positive().default(20),
})

export const idSchema = z.object({
  id: z.string().min(1, 'ID is required'),
})

export type PaginationInput = z.infer<typeof paginationSchema>
export type IdInput = z.infer<typeof idSchema>
