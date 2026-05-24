import Typesense from 'typesense'
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections'

const hasTypesense =
  !!process.env.TYPESENSE_API_KEY &&
  !!process.env.TYPESENSE_HOST &&
  !!process.env.TYPESENSE_PORT

const createClient = () => {
  if (!hasTypesense) {
    return null
  }
  return new Typesense.Client({
    nodes: [
      {
        host: process.env.TYPESENSE_HOST!,
        port: parseInt(process.env.TYPESENSE_PORT || '8108', 10),
        protocol: process.env.TYPESENSE_PROTOCOL || 'http',
      },
    ],
    apiKey: process.env.TYPESENSE_API_KEY!,
    connectionTimeoutSeconds: 5,
  })
}

export const typesense = createClient()

export const SEARCH_COLLECTIONS = {
  EXAMS: 'exams',
  STUDENTS: 'students',
  WHITEBOARDS: 'whiteboards',
  HEALTH_SURVEYS: 'health_surveys',
} as const

const collectionSchemas: CollectionCreateSchema[] = [
  {
    name: SEARCH_COLLECTIONS.EXAMS,
    fields: [
      { name: 'examName', type: 'string' },
      { name: 'examYear', type: 'int32' },
      { name: 'stage', type: 'string' },
      { name: 'category', type: 'string', facet: true },
      { name: 'general', type: 'float', optional: true },
      { name: 'obc', type: 'float', optional: true },
      { name: 'sc', type: 'float', optional: true },
      { name: 'st', type: 'float', optional: true },
      { name: 'ews', type: 'float', optional: true },
      { name: 'pwd', type: 'float', optional: true },
    ],
    default_sorting_field: 'examYear',
  },
  {
    name: SEARCH_COLLECTIONS.STUDENTS,
    fields: [
      { name: 'name', type: 'string' },
      { name: 'email', type: 'string' },
      { name: 'targetExam', type: 'string', facet: true },
      { name: 'targetYear', type: 'int32' },
      { name: 'xpPoints', type: 'int32' },
      { name: 'currentStreak', type: 'int32' },
      { name: 'totalStudyMins', type: 'int32' },
    ],
    default_sorting_field: 'xpPoints',
  },
  {
    name: SEARCH_COLLECTIONS.WHITEBOARDS,
    fields: [
      { name: 'title', type: 'string' },
      { name: 'topic', type: 'string' },
      { name: 'status', type: 'string', facet: true },
    ],
  },
  {
    name: SEARCH_COLLECTIONS.HEALTH_SURVEYS,
    fields: [
      { name: 'notes', type: 'string' },
      { name: 'riskLevel', type: 'string', facet: true },
      { name: 'weekStart', type: 'int64' },
    ],
  },
]

export async function initTypesenseCollections() {
  if (!typesense) return
  for (const schema of collectionSchemas) {
    try {
      await typesense.collections().create(schema)
    } catch (err: any) {
      if (err?.httpStatus === 409) continue
      console.warn(`Typesense collection ${schema.name} init:`, err?.message)
    }
  }
}

export async function upsertDocument(collection: string, document: Record<string, unknown>) {
  if (!typesense) return null
  return typesense.collections(collection).documents().upsert(document)
}

export async function deleteDocument(collection: string, id: string) {
  if (!typesense) return null
  return typesense.collections(collection).documents(id).delete()
}

export async function deleteCollection(collection: string) {
  if (!typesense) return
  try {
    await typesense.collections(collection).delete()
  } catch { }
}

export async function searchCollection(
  collection: string,
  query: string,
  options?: {
    queryBy?: string
    filterBy?: string
    sortBy?: string
    perPage?: number
    page?: number
    facetBy?: string
  },
) {
  if (!typesense) {
    return { hits: [], found: 0, facet_counts: [] }
  }
  return typesense.collections(collection).documents().search({
    q: query,
    query_by: options?.queryBy || 'examName,stage,title,topic,notes,name',
    filter_by: options?.filterBy || undefined,
    sort_by: options?.sortBy || undefined,
    per_page: options?.perPage || 20,
    page: options?.page || 1,
    facet_by: options?.facetBy || undefined,
  })
}
