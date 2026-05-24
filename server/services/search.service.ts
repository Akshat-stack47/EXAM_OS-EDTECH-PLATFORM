import { db } from '@/lib/db'
import { cache } from '@/lib/redis'
import {
  typesense,
  SEARCH_COLLECTIONS,
  upsertDocument,
  deleteDocument,
  searchCollection,
  initTypesenseCollections,
} from '@/lib/typesense'
import { AppError } from '@/lib/app-error'

const SYNC_CACHE_TTL = 60

type SearchableEntity = 'exams' | 'students' | 'whiteboards' | 'health_surveys'

export const searchService = {
  async init() {
    await initTypesenseCollections()
  },

  // --- Full re-index ---

  async reindexAll() {
    await this.reindexExams()
    await this.reindexStudents()
    await this.reindexWhiteboards()
    await this.reindexHealthSurveys()
  },

  async reindexExams() {
    const exams = await db.examCutoff.findMany({ take: 5000 })
    for (const exam of exams) {
      await upsertDocument(SEARCH_COLLECTIONS.EXAMS, {
        id: exam.id,
        examName: exam.examName,
        examYear: exam.examYear,
        stage: exam.stage,
        category: exam.examName.split(' ')[0] || 'General',
        general: exam.general,
        obc: exam.obc,
        sc: exam.sc,
        st: exam.st,
        ews: exam.ews,
        pwd: exam.pwd,
      })
    }
    return { indexed: exams.length }
  },

  async reindexStudents() {
    const students = await db.studentProfile.findMany({
      take: 5000,
      include: { user: true },
    })
    for (const s of students) {
      await upsertDocument(SEARCH_COLLECTIONS.STUDENTS, {
        id: s.id,
        name: s.user.name,
        email: s.user.email,
        targetExam: s.targetExam,
        targetYear: s.targetYear,
        xpPoints: s.xpPoints,
        currentStreak: s.currentStreak,
        totalStudyMins: s.totalStudyMins,
      })
    }
    return { indexed: students.length }
  },

  async reindexWhiteboards() {
    const sessions = await db.whiteboardSession.findMany({
      take: 5000,
    })
    for (const w of sessions) {
      await upsertDocument(SEARCH_COLLECTIONS.WHITEBOARDS, {
        id: w.id,
        title: w.title,
        topic: w.topic || '',
        status: w.status,
      })
    }
    return { indexed: sessions.length }
  },

  async reindexHealthSurveys() {
    const surveys = await db.healthSurvey.findMany({
      take: 5000,
      include: { user: true },
    })
    for (const h of surveys) {
      await upsertDocument(SEARCH_COLLECTIONS.HEALTH_SURVEYS, {
        id: h.id,
        notes: h.notes || '',
        riskLevel: h.riskLevel,
        weekStart: new Date(h.weekStart).getTime(),
      })
    }
    return { indexed: surveys.length }
  },

  // --- Real-time sync ---

  async syncDocument(entity: SearchableEntity, action: 'upsert' | 'delete', id: string) {
    const collectionMap: Record<SearchableEntity, string> = {
      exams: SEARCH_COLLECTIONS.EXAMS,
      students: SEARCH_COLLECTIONS.STUDENTS,
      whiteboards: SEARCH_COLLECTIONS.WHITEBOARDS,
      health_surveys: SEARCH_COLLECTIONS.HEALTH_SURVEYS,
    }
    const collection = collectionMap[entity]
    if (!collection) return

    if (action === 'delete') {
      await deleteDocument(collection, id)
      return
    }

    switch (entity) {
      case 'exams': {
        const exam = await db.examCutoff.findUnique({ where: { id } })
        if (!exam) throw AppError.notFound('Exam')
        await upsertDocument(collection, {
          id: exam.id,
          examName: exam.examName,
          examYear: exam.examYear,
          stage: exam.stage,
          category: exam.examName.split(' ')[0] || 'General',
          general: exam.general,
          obc: exam.obc,
          sc: exam.sc,
          st: exam.st,
          ews: exam.ews,
          pwd: exam.pwd,
        })
        break
      }
      case 'students': {
        const student = await db.studentProfile.findUnique({
          where: { id },
          include: { user: true },
        })
        if (!student) throw AppError.notFound('Student')
        await upsertDocument(collection, {
          id: student.id,
          name: student.user.name,
          email: student.user.email,
          targetExam: student.targetExam,
          targetYear: student.targetYear,
          xpPoints: student.xpPoints,
          currentStreak: student.currentStreak,
          totalStudyMins: student.totalStudyMins,
        })
        break
      }
      case 'whiteboards': {
        const wb = await db.whiteboardSession.findUnique({ where: { id } })
        if (!wb) throw AppError.notFound('Whiteboard')
        await upsertDocument(collection, {
          id: wb.id,
          title: wb.title,
          topic: wb.topic || '',
          status: wb.status,
        })
        break
      }
      case 'health_surveys': {
        const survey = await db.healthSurvey.findUnique({
          where: { id },
          include: { user: true },
        })
        if (!survey) throw AppError.notFound('HealthSurvey')
        await upsertDocument(collection, {
          id: survey.id,
          notes: survey.notes || '',
          riskLevel: survey.riskLevel,
          weekStart: new Date(survey.weekStart).getTime(),
        })
        break
      }
    }
  },

  // --- Search ---

  async search(
    query: string,
    entity?: string,
    options?: {
      filterBy?: string
      sortBy?: string
      perPage?: number
      page?: number
    },
  ) {
    if (!query || query.trim().length < 2) {
      return { hits: [], found: 0, facet_counts: [], page: 1 }
    }

    if (!typesense) {
      return this.fallbackSearch(query, entity, options)
    }

    const cacheKey = `search:${entity || 'all'}:${query.trim().toLowerCase()}:${options?.page || 1}:${options?.perPage || 20}`
    return cache.getOrSet(cacheKey, async () => {
      if (entity && entity in SEARCH_COLLECTIONS) {
        return searchCollection(entity, query, {
          queryBy: this.getQueryByFields(entity),
          filterBy: options?.filterBy,
          sortBy: options?.sortBy,
          perPage: options?.perPage || 20,
          page: options?.page || 1,
        })
      }

      const results = await Promise.all(
        Object.values(SEARCH_COLLECTIONS).map((col) =>
          searchCollection(col, query, {
            queryBy: this.getQueryByFields(col),
            perPage: 5,
            page: options?.page || 1,
          }).then((r) => ({
            collection: col,
            hits: r.hits || [],
            found: r.found || 0,
          })),
        ),
      )

      return {
        hits: results.flatMap((r) => r.hits),
        found: results.reduce((sum, r) => sum + r.found, 0),
        collections: results,
        page: options?.page || 1,
      }
    }, SYNC_CACHE_TTL)
  },

  getQueryByFields(entity: string): string {
    const map: Record<string, string> = {
      exams: 'examName,stage,category',
      students: 'name,email,targetExam',
      whiteboards: 'title,topic',
      health_surveys: 'notes,riskLevel',
    }
    return map[entity] || 'examName,stage,title,topic,notes,name'
  },

  async fallbackSearch(query: string, entity?: string, options?: { perPage?: number; cursor?: string }) {
    const perPage = options?.perPage || 20

    if (entity === 'exams' || !entity) {
      const exams = await db.examCutoff.findMany({
        where: {
          OR: [
            { examName: { contains: query, mode: 'insensitive' } },
            { stage: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: { examYear: 'desc' },
        take: perPage + 1,
        ...(options?.cursor ? { cursor: { id: options.cursor }, skip: 1 } : {}),
        select: { id: true, examName: true, examYear: true, stage: true, general: true, obc: true, sc: true, st: true, ews: true, pwd: true },
      })

      const hasMore = exams.length > perPage
      const items = hasMore ? exams.slice(0, perPage) : exams

      return {
        hits: items.map((e) => ({ document: e })),
        found: items.length,
        nextCursor: hasMore ? items[items.length - 1]?.id ?? null : null,
        page: 1,
      }
    }

    return { hits: [], found: 0, nextCursor: null, page: 1 }
  },

  // --- Suggestions / autocomplete ---

  async suggest(query: string) {
    if (!query || query.length < 2) return []
    if (!typesense) {
      const exams = await db.examCutoff.findMany({
        where: { examName: { contains: query, mode: 'insensitive' } },
        distinct: ['examName'],
        take: 5,
        select: { examName: true },
      })
      return exams.map((e) => ({ text: e.examName, type: 'exam' }))
    }

    const result = await searchCollection(SEARCH_COLLECTIONS.EXAMS, query, {
      queryBy: 'examName',
      perPage: 5,
    })
    return (result.hits || []).map((h: any) => ({
      text: h.document.examName,
      type: 'exam',
    }))
  },
}
