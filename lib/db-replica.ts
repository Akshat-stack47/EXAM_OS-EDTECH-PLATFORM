/**
 * lib/db-replica.ts
 * Read-replica client for analytics/reporting queries.
 * Prisma 7 requires a driver adapter — using @prisma/adapter-pg.
 */
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForReplica = globalThis as unknown as {
  replicaClient: PrismaClient | undefined
}

function createReplicaClient(): PrismaClient {
  // Fall back to primary DATABASE_URL if no replica URL is configured
  const connectionString = process.env.DATABASE_REPLICA_URL || process.env.DATABASE_URL!
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

export const dbReplica: PrismaClient = globalForReplica.replicaClient ?? createReplicaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForReplica.replicaClient = dbReplica
}
