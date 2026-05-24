import { describe, it, expect } from 'vitest'
import { db } from '@/lib/db'

describe('Prisma extensions', () => {
  it('db is defined and has expected methods', () => {
    expect(db).toBeDefined()
    expect(typeof db.examCutoff.findMany).toBe('function')
    expect(typeof db.studentProfile.findUnique).toBe('function')
    expect(typeof db.healthSurvey.create).toBe('function')
    expect(typeof db.$transaction).toBe('function')
  })
})
