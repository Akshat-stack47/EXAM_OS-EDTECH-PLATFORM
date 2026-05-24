# Code Pattern Template

Use this template when adding new features or tRPC routes to ensure consistency with ExamOs conventions.

## tRPC Route Template

```ts
// server/routers/{feature}.router.ts
import { z } from 'zod/v4'
import { createTRPCRouter, protectedProcedure, studentProcedure, teacherProcedure } from '@/server/trpc'
import { AppError } from '@/lib/errors'

const mySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
})

export const myFeatureRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ cursor: z.string().optional(), limit: z.number().default(20) }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.myModel.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      })
      let nextCursor: string | undefined
      if (items.length > input.limit) {
        const last = items.pop()
        nextCursor = last!.id
      }
      return { items, nextCursor }
    }),

  create: studentProcedure
    .input(mySchema)
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.myModel.create({ data: input })
      return item
    }),

  delete: teacherProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.myModel.findUnique({ where: { id: input.id } })
      if (!existing) throw AppError.notFound('MyModel')
      await ctx.db.myModel.delete({ where: { id: input.id } })
      return { success: true }
    }),
})
```

## Service Module Template

```ts
// lib/services/{feature}.ts
import { db } from '@/lib/db'
import { AppError } from '@/lib/errors'

export async function getMyData(id: string) {
  const data = await db.myModel.findUnique({ where: { id } })
  if (!data) throw AppError.notFound('MyModel')
  return data
}
```

## Page Template

```ts
// app/(dashboard)/{feature}/page.tsx
import { Suspense } from 'react'
import { MyFeatureList } from './my-feature-list.client'

export default function MyFeaturePage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <MyFeatureList />
    </Suspense>
  )
}
```

## Client Component Template

```tsx
// app/(dashboard)/{feature}/my-feature-list.client.tsx
'use client'

import { api } from '@/lib/api'

export function MyFeatureList() {
  const { data, isLoading } = api.myFeature.list.useQuery({ limit: 20 })
  if (isLoading) return <div>Loading…</div>
  return <div>{data?.items.map(item => <div key={item.id}>{item.name}</div>)}</div>
}
```
