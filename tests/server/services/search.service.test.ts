import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/db', () => ({
  db: {
    examCutoff: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
    },
    studentProfile: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    whiteboardSession: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    healthSurvey: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))

vi.mock('@/lib/redis', () => ({
  cache: {
    getOrSet: vi.fn((_key, fn) => fn()),
  },
}))

vi.mock('@/lib/typesense', () => ({
  typesense: null,
  SEARCH_COLLECTIONS: {
    EXAMS: 'exams',
    STUDENTS: 'students',
    WHITEBOARDS: 'whiteboards',
    HEALTH_SURVEYS: 'health_surveys',
  },
  upsertDocument: vi.fn(),
  deleteDocument: vi.fn(),
  searchCollection: vi.fn(),
  initTypesenseCollections: vi.fn(),
}))

const { db } = await import('@/lib/db')
const { searchService } = await import('@/server/services/search.service')

describe('searchService.init', () => {
  it('initializes Typesense collections', async () => {
    const { initTypesenseCollections } = await import('@/lib/typesense')
    await searchService.init()
    expect(initTypesenseCollections).toHaveBeenCalled()
  })
})

describe('searchService.search', () => {
  it('returns empty result for short query', async () => {
    const result = await searchService.search('a')
    expect(result.hits).toEqual([])
    expect(result.found).toBe(0)
  })

  it('performs fallback search when no typesense', async () => {
    vi.mocked(db.examCutoff.findMany).mockResolvedValue([
      { id: '1', examName: 'UPSC', examYear: 2024, stage: 'Prelims', general: 98, obc: 92, sc: 88, st: 82, ews: 90, pwd: 75, totalMarks: 200, sourceUrl: null, verifiedAt: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
    ])
    vi.mocked(db.examCutoff.count).mockResolvedValue(1)

    const result = await searchService.search('UPSC', 'exams')
    expect(result.hits).toHaveLength(1)
    expect(result.found).toBe(1)
  })

  it('returns empty for no matches', async () => {
    vi.mocked(db.examCutoff.findMany).mockResolvedValue([])
    vi.mocked(db.examCutoff.count).mockResolvedValue(0)

    const result = await searchService.search('zzznotexist')
    expect(result.hits).toEqual([])
    expect(result.found).toBe(0)
  })
})

describe('searchService.suggest', () => {
  it('returns empty for short query', async () => {
    const result = await searchService.suggest('a')
    expect(result).toEqual([])
  })

  it('returns suggestions from fallback', async () => {
    vi.mocked(db.examCutoff.findMany).mockResolvedValue([
      { id: '1', examName: 'UPSC CSE', examYear: 2024, stage: 'Prelims', general: null, obc: null, sc: null, st: null, ews: null, pwd: null, totalMarks: 200, sourceUrl: null, verifiedAt: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
      { id: '2', examName: 'UPSC CAPF', examYear: 2024, stage: 'Prelims', general: null, obc: null, sc: null, st: null, ews: null, pwd: null, totalMarks: 200, sourceUrl: null, verifiedAt: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
    ] as any[])

    const result = await searchService.suggest('UPSC')
    expect(result).toHaveLength(2)
    expect(result[0].text).toBe('UPSC CSE')
    expect(result[0].type).toBe('exam')
  })
})

describe('searchService.getQueryByFields', () => {
  it('returns correct fields for exams', () => {
    expect(searchService.getQueryByFields('exams')).toBe('examName,stage,category')
  })

  it('returns correct fields for students', () => {
    expect(searchService.getQueryByFields('students')).toBe('name,email,targetExam')
  })

  it('returns default fields for unknown', () => {
    expect(searchService.getQueryByFields('unknown')).toBe('examName,stage,title,topic,notes,name')
  })
})
