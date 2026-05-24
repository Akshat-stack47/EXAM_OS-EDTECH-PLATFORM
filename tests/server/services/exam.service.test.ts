import { describe, it, expect, vi } from 'vitest'

const mockFindMany = vi.fn()

vi.mock('@/lib/db', () => ({
  db: {
    examCutoff: {
      findMany: (...args: any[]) => mockFindMany(...args),
    },
  },
}))

const { examService } = await import('@/server/services/exam.service')

describe('examService.list', () => {
  it('returns all exams ordered by year desc then name asc', async () => {
    mockFindMany.mockResolvedValue([
      { examName: 'UPSC', examYear: 2024 },
      { examName: 'SSC', examYear: 2024 },
    ])
    const exams = await examService.list()
    expect(exams).toHaveLength(2)
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: [{ examYear: 'desc' }, { examName: 'asc' }] }),
    )
  })

  it('filters by examName', async () => {
    mockFindMany.mockResolvedValue([
      { examName: 'UPSC CSE', examYear: 2024 },
    ])
    const exams = await examService.list('UPSC')
    expect(exams).toHaveLength(1)
    expect(exams[0].examName).toBe('UPSC CSE')
  })
})

describe('examService.getByName', () => {
  it('returns exams ordered by year desc', async () => {
    mockFindMany.mockResolvedValue([
      { examName: 'UPSC', examYear: 2024 },
      { examName: 'UPSC', examYear: 2023 },
    ])
    const exams = await examService.getByName('UPSC')
    expect(exams).toHaveLength(2)
    expect(exams[0].examYear).toBe(2024)
  })
})
