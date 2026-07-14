import { initTRPC, TRPCError } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { db } from '@/lib/db'
import { AppError } from '@/lib/errors'
import { ratelimit } from '@/lib/redis'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.SUPABASE_JWT_SECRET || 'default-secret-change-in-production'
)

type InnerContext = {
  db: typeof db
  userId: string | null
  userRole: string | null
}

// ─── Read & verify our custom JWT from the sb-access-token cookie ────────────
async function getUserFromCookie(): Promise<{ userId: string; userRole: string } | null> {
  try {
    const cookieStore = await cookies()
    // Support both cookie names for backwards compat
    const token =
      cookieStore.get('sb-access-token')?.value ??
      cookieStore.get('sb-auth-token')?.value

    if (!token) return null

    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId   = (payload.sub ?? (payload as any).userId) as string | undefined
    const userRole = (payload.role ?? (payload as any).userRole) as string | undefined

    if (!userId || !userRole) return null
    return { userId, userRole }
  } catch {
    // Token missing, expired, or invalid — treat as unauthenticated
    return null
  }
}

export const createTRPCContext = async (_opts: any): Promise<InnerContext> => {
  const user = await getUserFromCookie()
  return {
    db,
    userId:   user?.userId   ?? null,
    userRole: user?.userRole ?? null,
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
