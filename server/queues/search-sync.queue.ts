import { Queue, Worker, type Job } from 'bullmq'
import { searchService } from '@/server/services/search.service'

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
}

const QUEUE_NAME = 'search-sync'

export const searchSyncQueue = new Queue(QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  },
})

export type SyncJobPayload = {
  entity: 'exams' | 'students' | 'whiteboards' | 'health_surveys'
  action: 'upsert' | 'delete'
  id: string
}

export type ReindexJobPayload = {
  entity: 'exams' | 'students' | 'whiteboards' | 'health_surveys' | 'all'
}

export async function enqueueSearchSync(payload: SyncJobPayload) {
  await searchSyncQueue.add('sync-document', payload, {
    jobId: `${payload.entity}:${payload.action}:${payload.id}`,
  })
}

export async function enqueueReindex(payload: ReindexJobPayload) {
  await searchSyncQueue.add('reindex', payload, {
    jobId: `reindex:${payload.entity}:${Date.now()}`,
  })
}

const entityReindexMap: Record<string, () => Promise<any>> = {
  exams: () => searchService.reindexExams(),
  students: () => searchService.reindexStudents(),
  whiteboards: () => searchService.reindexWhiteboards(),
  health_surveys: () => searchService.reindexHealthSurveys(),
}

export function startSearchSyncWorker() {
  const worker = new Worker<SyncJobPayload | ReindexJobPayload>(
    QUEUE_NAME,
    async (job: Job<SyncJobPayload | ReindexJobPayload>) => {
      if (job.name === 'sync-document') {
        const { entity, action, id } = job.data as SyncJobPayload
        await searchService.syncDocument(entity, action, id)
      } else if (job.name === 'reindex') {
        const { entity } = job.data as ReindexJobPayload
        if (entity === 'all') {
          await searchService.reindexAll()
        } else {
          await entityReindexMap[entity]()
        }
      }
    },
    { connection, concurrency: 5 },
  )

  worker.on('completed', (job) => {
    console.log(`Search sync completed: ${job.id}`)
  })

  worker.on('failed', (job, err) => {
    console.error(`Search sync failed: ${job?.id}`, err)
  })

  return worker
}
