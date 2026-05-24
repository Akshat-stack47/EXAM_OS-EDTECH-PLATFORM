export interface PerformanceBudget {
  lcp?: number
  fid?: number
  cls?: number
  inp?: number
  tbt?: number
  fcp?: number
}

export interface MetricReport {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  passed: boolean
}

const THRESHOLDS: Record<string, { good: number; poor: number }> = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
  TBT: { good: 200, poor: 600 },
  FCP: { good: 1800, poor: 3000 },
}

export function rateMetric(name: string, value: number): MetricReport['rating'] {
  const t = THRESHOLDS[name]
  if (!t) return 'good'
  if (value <= t.good) return 'good'
  if (value <= t.poor) return 'needs-improvement'
  return 'poor'
}

export function checkPerformanceBudget(
  metrics: Partial<Record<string, number>>,
  budget?: PerformanceBudget,
): MetricReport[] {
  return Object.entries(metrics).flatMap(([name, value]) => {
    if (value === undefined) return []
    const rating = rateMetric(name, value)
    const budgetLimit = budget?.[name.toLowerCase() as keyof PerformanceBudget]
    const passed = budgetLimit !== undefined ? value <= budgetLimit : rating === 'good'
    return [{ name, value, rating, passed }]
  })
}

export function reportWebVitals(metric: { name: string; value: number; id: string }) {
  if (typeof navigator === 'undefined' || !navigator.sendBeacon) return

  try {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      id: metric.id,
      url: window.location.pathname,
      timestamp: Date.now(),
    })

    navigator.sendBeacon('/api/vitals', body)
  } catch {}
}

export function createAnalyticsTracker() {
  const metrics: Record<string, number[]> = {}

  return {
    track(name: string, value: number) {
      if (!metrics[name]) metrics[name] = []
      metrics[name].push(value)
    },

    getAverage(name: string): number | null {
      const vals = metrics[name]
      if (!vals || vals.length === 0) return null
      return vals.reduce((a, b) => a + b, 0) / vals.length
    },

    getP75(name: string): number | null {
      const vals = metrics[name]
      if (!vals || vals.length === 0) return null
      const sorted = [...vals].sort((a, b) => a - b)
      return sorted[Math.floor(sorted.length * 0.75)]
    },

    generateReport(): MetricReport[] {
      return Object.entries(metrics).map(([name, vals]) => {
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length
        const report = checkPerformanceBudget({ [name]: avg })[0]
        return { name: report.name, value: Math.round(avg), rating: report.rating, passed: report.passed }
      })
    },

    reset() {
      Object.keys(metrics).forEach((k) => delete metrics[k])
    },
  }
}

export function lazyLoadObserver(
  element: HTMLElement,
  onVisible: () => void,
  options?: IntersectionObserverInit,
) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onVisible()
        observer.unobserve(element)
      }
    })
  }, options)

  observer.observe(element)
  return () => observer.disconnect()
}

export function prefetchOnHover(element: HTMLElement, url: string) {
  let link: HTMLLinkElement | null = null

  const handleMouseEnter = () => {
    if (link) return
    link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    document.head.appendChild(link)
  }

  element.addEventListener('mouseenter', handleMouseEnter, { once: true })

  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter)
    if (link) link.remove()
  }
}
