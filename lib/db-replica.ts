import { PrismaClient } from '@prisma/client'

const globalForReplica = globalThis as unknown as {
  replicaClient: PrismaClient | undefined
}

export const dbReplica = globalForReplica.replicaClient ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForReplica.replicaClient = dbReplica
}
