import { Queue, Worker, type Job } from 'bullmq'
import { searchService } from '@/server/services/search.service'

// Build the connection config lazily to avoid crashing during Next.js build
// when no Redis server is running locally.
function getConnection() {
  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    tls: process.env.REDIS_TLS === 'true' ? ({} as any) : undefined,
    // Prevent BullMQ from crashing the build worker: don't eagerly connect
    lazyConnect: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 0,
    connectTimeout: 2000,
  }
}

const QUEUE_NAME = 'search-sync'

// Lazy singleton — created only when first enqueue/worker call is made,
// NOT at module evaluation time (which would crash the Next.js build worker).
let _queue: Queue | null = null
function getQueue(): Queue {
  if (!_queue) {
    _queue = new Queue(QUEUE_NAME, {
      connection: getConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { age: 3600 },
        removeOnFail: { age: 86400 },
      },
    })
  }
  return _queue
}

export type SyncJobPayload = {
  entity: 'exams' | 'students' | 'whiteboards' | 'health_surveys'
  action: 'upsert' | 'delete'
  id: string
}

export type ReindexJobPayload = {
  entity: 'exams' | 'students' | 'whiteboards' | 'health_surveys' | 'all'
}

export async function enqueueSearchSync(payload: SyncJobPayload) {
  try {
    await getQueue().add('sync-document', payload, {
      jobId: `${payload.entity}:${payload.action}:${payload.id}`,
    })
  } catch {
    // Silently skip if Redis is unavailable — search sync is non-critical
  }
}

export async function enqueueReindex(payload: ReindexJobPayload) {
  try {
    await getQueue().add('reindex', payload, {
      jobId: `reindex:${payload.entity}:${Date.now()}`,
    })
  } catch {
    // Silently skip if Redis is unavailable
  }
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
    { connection: getConnection(), concurrency: 5 },
  )

  worker.on('completed', (job) => {
    console.log(`Search sync completed: ${job.id}`)
  })

  worker.on('failed', (job, err) => {
    console.error(`Search sync failed: ${job?.id}`, err)
  })

  return worker
}
