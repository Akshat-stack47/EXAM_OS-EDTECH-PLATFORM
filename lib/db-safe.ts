import { basePrisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function safeRawQuery<T>(
  sql: Prisma.Sql
): Promise<T[]> {
  return basePrisma.$queryRaw<T[]>(sql)
}
