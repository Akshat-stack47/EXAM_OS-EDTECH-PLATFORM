import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof makePrismaClient> | undefined
}

function makePrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'warn', 'error']
      : ['warn', 'error'],
  }).$extends(withAccelerate())
}

const prismaClient = globalForPrisma.prisma ?? makePrismaClient()

export const db = prismaClient.$extends({
  query: {
    $allModels: {
      async findMany({ args, query }) {
        args.where = { ...args.where, deletedAt: null }
        return query(args)
      },
      async findFirst({ args, query }) {
        args.where = { ...args.where, deletedAt: null }
        return query(args)
      },
      async findUnique({ args, query }) {
        args.where = { ...args.where, deletedAt: null }
        return query(args)
      },
      async count({ args, query }) {
        args.where = { ...args.where, deletedAt: null }
        return query(args)
      },
    },
  },
}).$extends({
  query: {
    $allModels: {
      async $allOperations({ args, query }) {
        const timeout = (args as any)?.timeout ?? 5000
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), timeout)
        try {
          const result = await query(args)
          return result
        } finally {
          clearTimeout(timer)
        }
      },
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient as any
