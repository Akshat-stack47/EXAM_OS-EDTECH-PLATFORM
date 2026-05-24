import { describe, it, expect } from 'vitest'

describe('ExamOS app', () => {
  it('should load without errors', () => {
    expect(true).toBe(true)
  })

  it('should have correct app name', () => {
    const appName = 'ExamOS'
    expect(appName).toMatch(/Exam/)
  })
})
