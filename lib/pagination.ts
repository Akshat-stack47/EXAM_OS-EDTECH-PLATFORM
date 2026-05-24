import { z } from 'zod'

export const cursorPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
})

export type CursorPaginationInput = z.infer<typeof cursorPaginationSchema>

export type PaginatedResult<T> = {
  items: T[]
  nextCursor: string | null
  total?: number
}

export async function paginate<T>(
  fetch: (args: { take: number; skip?: number; cursor?: { id: string } }) => Promise<T[]>,
  input: CursorPaginationInput,
): Promise<PaginatedResult<T>> {
  const take = input.limit + 1
  const items = await fetch({
    take,
    ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
  })

  const hasMore = items.length > input.limit
  const resultItems = hasMore ? items.slice(0, input.limit) : items
  const nextCursor = hasMore ? (resultItems[resultItems.length - 1] as any)?.id ?? null : null

  return { items: resultItems, nextCursor }
}
