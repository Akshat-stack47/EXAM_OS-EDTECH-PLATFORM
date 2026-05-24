import { db } from '@/lib/db'

export const examService = {
  async list(examName?: string) {
    const where = examName ? { examName } : {}
    return db.examCutoff.findMany({
      where,
      select: { id: true, examName: true, examYear: true, stage: true, general: true, obc: true, sc: true, st: true, ews: true, pwd: true },
      orderBy: [{ examYear: 'desc' }, { examName: 'asc' }],
      take: 100,
    })
  },

  async getByName(examName: string) {
    return db.examCutoff.findMany({
      where: { examName },
      select: { id: true, examName: true, examYear: true, stage: true, general: true, obc: true, sc: true, st: true, ews: true, pwd: true },
      orderBy: { examYear: 'desc' },
    })
  },
}
