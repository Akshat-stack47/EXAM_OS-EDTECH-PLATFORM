import { describe, it, expect } from 'vitest'
import {
  checkPerformanceBudget,
  rateMetric,
  createAnalyticsTracker,
} from '@/lib/performance'

describe('rateMetric', () => {
  it('returns good for LCP under 2500', () => {
    expect(rateMetric('LCP', 1500)).toBe('good')
  })

  it('returns needs-improvement for LCP between 2500 and 4000', () => {
    expect(rateMetric('LCP', 3000)).toBe('needs-improvement')
  })

  it('returns poor for LCP over 4000', () => {
    expect(rateMetric('LCP', 5000)).toBe('poor')
  })

  it('returns good for FID under 100', () => {
    expect(rateMetric('FID', 50)).toBe('good')
  })

  it('returns good for CLS under 0.1', () => {
    expect(rateMetric('CLS', 0.05)).toBe('good')
  })

  it('returns poor for CLS over 0.25', () => {
    expect(rateMetric('CLS', 0.5)).toBe('poor')
  })

  it('returns good for unknown metric', () => {
    expect(rateMetric('UNKNOWN', 9999)).toBe('good')
  })
})

describe('checkPerformanceBudget', () => {
  it('returns reports for each metric', () => {
    const reports = checkPerformanceBudget({ LCP: 1500, CLS: 0.05 })
    expect(reports).toHaveLength(2)
  })

  it('marks passed=true when under budget', () => {
    const reports = checkPerformanceBudget({ LCP: 1000 }, { lcp: 2500 })
    expect(reports[0].passed).toBe(true)
  })

  it('marks passed=false when over budget', () => {
    const reports = checkPerformanceBudget({ LCP: 3000 }, { lcp: 2500 })
    expect(reports[0].passed).toBe(false)
  })

  it('marks passed=true for good metrics without budget', () => {
    const reports = checkPerformanceBudget({ LCP: 1500 })
    expect(reports[0].passed).toBe(true)
  })
})

describe('createAnalyticsTracker', () => {
  it('tracks and returns average', () => {
    const tracker = createAnalyticsTracker()
    tracker.track('LCP', 1000)
    tracker.track('LCP', 2000)
    expect(tracker.getAverage('LCP')).toBe(1500)
  })

  it('returns null for untracked metric', () => {
    const tracker = createAnalyticsTracker()
    expect(tracker.getAverage('FCP')).toBeNull()
  })

  it('calculates p75 correctly', () => {
    const tracker = createAnalyticsTracker()
    for (let i = 1; i <= 10; i++) tracker.track('LCP', i * 100)
    expect(tracker.getP75('LCP')).toBe(800)
  })

  it('generates report with ratings', () => {
    const tracker = createAnalyticsTracker()
    tracker.track('LCP', 1500)
    const report = tracker.generateReport()
    expect(report[0].name).toBe('LCP')
    expect(report[0].rating).toBe('good')
  })

  it('resets all metrics', () => {
    const tracker = createAnalyticsTracker()
    tracker.track('LCP', 1500)
    tracker.reset()
    expect(tracker.getAverage('LCP')).toBeNull()
  })
})
