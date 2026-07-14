/**
 * lib/db.ts
 *
 * Prisma 7 uses the new "client" engine type which REQUIRES a driver adapter.
 * We use @prisma/adapter-pg (already in dependencies) to provide the pg connection.
 *
 * When individual DB_* env vars are present they are preferred over DATABASE_URL
 * to avoid URL-encoding issues with passwords containing special characters.
 */
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  let adapter: PrismaPg

  if (process.env.DB_HOST) {
    // Use individual params — avoids all URL-encoding headaches
    adapter = new PrismaPg({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '6543', 10),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'postgres',
      ssl: { rejectUnauthorized: false },
      max: 5,
    })
  } else {
    // Fallback to DATABASE_URL
    adapter = new PrismaPg(process.env.DATABASE_URL!)
  }

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['warn', 'error'],
  })
}

export const basePrisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient()

/**
 * Models that have a deletedAt column (soft-delete enabled).
 * ExamCutoff, AuditLog, BotCorrection, and WhiteboardMember are excluded
 * because they either don't support soft-delete or are reference tables.
 * 
 * The extension safely skips injecting deletedAt for models not in this list.
 */
const SOFT_DELETE_MODELS = new Set([
  'User',
  'StudentProfile',
  'TeacherProfile',
  'ParentProfile',
  'ParentChildLink',
  'HealthSurvey',
  'WhiteboardSession',
  'MockResult',
  'SubjectScore',
  'StudySession',
  'Notification',
])

// Soft-delete extension: inject deletedAt: null ONLY for models that support it
export const db = basePrisma.$extends({
  query: {
    $allModels: {
      async findMany({ model, args, query }) {
        if (SOFT_DELETE_MODELS.has(model)) {
          args.where = { ...args.where, deletedAt: null }
        }
        return query(args)
      },
      async findFirst({ model, args, query }) {
        if (SOFT_DELETE_MODELS.has(model)) {
          args.where = { ...args.where, deletedAt: null }
        }
        return query(args)
      },
      async count({ model, args, query }) {
        if (SOFT_DELETE_MODELS.has(model)) {
          args.where = { ...args.where, deletedAt: null }
        }
        return query(args)
      },
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = basePrisma
