import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function safeRawQuery<T>(
  sql: Prisma.Sql
): Promise<T[]> {
  return db.$queryRaw<T[]>(sql)
}
