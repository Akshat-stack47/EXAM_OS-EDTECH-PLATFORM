import { initTRPC, TRPCError } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { db } from '@/lib/db'
import { AppError } from '@/lib/errors'
import { ratelimit } from '@/lib/redis'
import { createServerClient } from '@/lib/supabase/server'

type CreateContextOptions = {
  userId: string | null
  userRole: string | null
}

type InnerContext = {
  db: typeof db
  userId: string | null
  userRole: string | null
  supabase: Awaited<ReturnType<typeof createServerClient>>
}

export const createTRPCContext = async (opts: CreateNextContextOptions): Promise<InnerContext> => {
  const { req } = opts
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  const userId = session?.user?.id ?? (req.headers['x-user-id'] as string | undefined)
  const userRole = session?.user?.user_metadata?.role ?? (req.headers['x-user-role'] as string | undefined)

  return {
    db,
    supabase,
    userId: userId ?? null,
    userRole: userRole ?? null,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    const isAppError = error.cause instanceof AppError
    return {
      ...shape,
      message: isAppError ? error.cause.message : shape.message,
      data: {
        ...shape.data,
        code: isAppError ? error.cause.code : shape.data?.code ?? 'INTERNAL_ERROR',
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.userId || !ctx.userRole) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Authentication required' })
  }

  const { success } = await ratelimit.api.limit(ctx.userId)
  if (!success) {
    throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded' })
  }

  return next({
    ctx: { ...ctx, userId: ctx.userId, userRole: ctx.userRole },
  })
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)

export const studentProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.userRole !== 'STUDENT') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Student access only' })
  }
  return next({ ctx })
})

export const parentProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.userRole !== 'PARENT') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Parent access only' })
  }
  return next({ ctx })
})

export const teacherProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.userRole !== 'TEACHER') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Teacher access only' })
  }
  return next({ ctx })
})

export const coordinatorProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.userRole !== 'COORDINATOR') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Coordinator access only' })
  }
  return next({ ctx })
})
