import { Suspense } from 'react'
import { ExamsClient } from './ExamsClient'

export const revalidate = 86400

export default function ExamsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0D0D1A', color: '#F8F8FF', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <Suspense fallback={<ExamsSkeleton />}>
          <ExamsClient />
        </Suspense>
      </div>
    </div>
  )
}

function ExamsSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ height: 32, width: 200, background: 'rgba(255,255,255,0.08)', borderRadius: 8 }} />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ height: 32, width: 90, background: 'rgba(255,255,255,0.08)', borderRadius: 100 }} />
        ))}
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{ height: 100, background: 'rgba(255,255,255,0.04)', borderRadius: 16 }} />
      ))}
    </div>
  )
}
