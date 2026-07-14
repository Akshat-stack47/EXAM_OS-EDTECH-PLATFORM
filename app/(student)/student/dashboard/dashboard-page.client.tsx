'use client'

import { useSearchParams } from 'next/navigation'
import { useStudentProfile } from '@/hooks/useStudentProfile'
import { StudentDashboardHome } from '@/components/student/StudentDashboardHome'

const DEMO_DATA = {
  profile: { name: 'Riya Sharma', streak: 12, nationalRank: 1847, totalStudyMins: 3600, todayMinutes: 45, targetExam: 'UPSC', xpPoints: 2450 },
  scores: [],
  recentSessions: [],
  latestHealth: null,
  whiteboards: [],
  mockResults: [],
}

export default function StudentDashboardPageClient() {
  const searchParams = useSearchParams()
  const isPreview = searchParams.has('preview')
  const { data, isLoading, error } = useStudentProfile()

  if (isPreview) return <StudentDashboardHome data={DEMO_DATA} />

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0D0D1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter',system-ui,sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', animation: 'pulse 1.5s ease-in-out infinite' }}>🎓</div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.9rem' }}>Loading your dashboard…</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', background: '#0D0D1A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: "'Inter',system-ui,sans-serif" }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '2.5rem', textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Unable to Load Dashboard</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', lineHeight: 1.6 }}>{error?.message || 'Something went wrong. Please refresh.'}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '1.25rem', background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.65rem 1.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
            Refresh →
          </button>
        </div>
      </div>
    )
  }

  return <StudentDashboardHome data={data} />
}
