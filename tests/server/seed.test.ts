import { describe, it, expect } from 'vitest'

const EXAMS = [
  { examName: 'UPSC Civil Services', examYear: 2024, stage: 'Prelims', totalMarks: 200 },
  { examName: 'UPSC Civil Services', examYear: 2024, stage: 'Mains', totalMarks: 1750 },
  { examName: 'UPSC Civil Services', examYear: 2023, stage: 'Prelims', totalMarks: 200 },
  { examName: 'SSC CGL', examYear: 2024, stage: 'Tier 1', totalMarks: 200 },
  { examName: 'SSC CGL', examYear: 2023, stage: 'Tier 1', totalMarks: 200 },
  { examName: 'IBPS PO', examYear: 2024, stage: 'Prelims', totalMarks: 100 },
  { examName: 'IBPS PO', examYear: 2023, stage: 'Prelims', totalMarks: 100 },
  { examName: 'IBPS Clerk', examYear: 2024, stage: 'Prelims', totalMarks: 100 },
  { examName: 'RRB NTPC', examYear: 2024, stage: 'CBT 1', totalMarks: 100 },
  { examName: 'UPSC CAPF', examYear: 2024, stage: 'Written', totalMarks: 500 },
  { examName: 'JEE Advanced', examYear: 2024, stage: 'Final', totalMarks: 360 },
  { examName: 'NEET UG', examYear: 2024, stage: 'Final', totalMarks: 720 },
  { examName: 'NEET UG', examYear: 2023, stage: 'Final', totalMarks: 720 },
  { examName: 'UPSC EPFO', examYear: 2024, stage: 'Prelims', totalMarks: 150 },
]

describe('seed data', () => {
  it('has 14 exam records', () => {
    expect(EXAMS).toHaveLength(14)
  })

  it('each record has required fields', () => {
    for (const exam of EXAMS) {
      expect(exam.examName).toBeTruthy()
      expect(exam.examYear).toBeGreaterThan(0)
      expect(exam.stage).toBeTruthy()
      expect(exam.totalMarks).toBeGreaterThan(0)
    }
  })

  it('includes all exam categories', () => {
    const categories = [...new Set(EXAMS.map(e => e.examName.split(' ')[0]))]
    expect(categories).toContain('UPSC')
    expect(categories).toContain('SSC')
    expect(categories).toContain('IBPS')
    expect(categories).toContain('RRB')
    expect(categories).toContain('JEE')
    expect(categories).toContain('NEET')
  })
})
