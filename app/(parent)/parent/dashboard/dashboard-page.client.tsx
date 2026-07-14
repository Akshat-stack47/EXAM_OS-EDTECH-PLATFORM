'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useParentDashboard } from '@/hooks/useParentDashboard'
import { ParentDashboardView } from '@/components/parent/ParentDashboardView'

/* ─── Loading Skeleton ─────────────────────────────────────────────── */
function ParentLoading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0D0D1A 0%,#1B1040 50%,#0D0D1A 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#E88D2A,#F5A623)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
          👨‍👩‍👧
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', fontWeight: 600 }}>Loading Parent Dashboard…</p>
      </div>
    </div>
  )
}

/* ─── No Profile / Link Student CTA ───────────────────────────────── */
function NoProfileCard() {
  const [linkEmail, setLinkEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    // Placeholder — will hit real API when implemented
    setTimeout(() => setStatus('sent'), 1200)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0D0D1A 0%,#1B1040 50%,#0D0D1A 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Ambient glows */}
      <div style={{ position: 'fixed', top: '20%', right: '15%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(232,141,42,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#E88D2A,#F5A623)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, boxShadow: '0 0 24px rgba(232,141,42,0.35)' }}>👨‍👩‍👧</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>Exam<span style={{ color: '#F59E0B' }}>OS</span></span>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '2.5rem', backdropFilter: 'blur(20px)', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>👩‍👧</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>Link Your Child</h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Enter your child's registered email address to start monitoring their progress, health, and exam preparation.
            </p>
          </div>

          {status === 'sent' ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 16 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
              <h2 style={{ color: '#4ADE80', fontWeight: 800, fontSize: '1.1rem', margin: '0 0 0.5rem' }}>Link Request Sent!</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                Your child will receive a notification to approve the link. Once approved, you'll see their dashboard here.
              </p>
            </div>
          ) : (
            <form onSubmit={handleLink}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                  Child's Email Address
                </label>
                <input
                  type="email"
                  placeholder="child@example.com"
                  value={linkEmail}
                  onChange={e => setLinkEmail(e.target.value)}
                  required
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 12, padding: '0.85rem 1rem', color: '#fff', fontSize: '1rem', outline: 'none',
                    boxSizing: 'border-box', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(232,141,42,0.6)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  width: '100%', background: 'linear-gradient(135deg,#E88D2A,#F5A623)',
                  color: '#fff', border: 'none', borderRadius: 12, padding: '0.9rem',
                  fontWeight: 800, fontSize: '1rem', cursor: 'pointer', transition: 'opacity 0.2s',
                  opacity: status === 'sending' ? 0.7 : 1,
                }}
              >
                {status === 'sending' ? '⏳ Sending Link Request…' : '🔗 Send Link Request →'}
              </button>
            </form>
          )}

          {/* Features preview */}
          <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { icon: '📊', title: 'Progress Tracking', desc: 'Daily study hours & rank' },
              { icon: '❤️', title: 'Health Monitoring', desc: 'Burnout risk & mood scores' },
              { icon: '📅', title: 'Exam Deadlines', desc: 'Never miss a date' },
              { icon: '🔔', title: 'Smart Alerts', desc: 'Instant notifications' },
            ].map(f => (
              <div key={f.title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '0.85rem' }}>
                <div style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>{f.icon}</div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.82rem' }}>{f.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', marginTop: '0.15rem' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Page Component ───────────────────────────────────────────── */
export default function ParentDashboardPageClient() {
  const searchParams = useSearchParams()
  const isPreview = searchParams.has('preview')
  const { data, isLoading, error } = useParentDashboard()

  // Preview mode uses demo children data
  if (isPreview) {
    const demoProfile = {
      name: 'Anita Sharma',
      children: [
        {
          id: 'demo-1', name: 'Riya Sharma', targetExam: 'UPSC', targetYear: 2026,
          currentStreak: 14, totalStudyMins: 4320, nationalRank: 1847, burnoutRisk: 'LOW',
          subjectScores: [
            { subject: 'History', score: 78 }, { subject: 'Polity', score: 82 },
            { subject: 'Geography', score: 65 }, { subject: 'Economy', score: 71 },
          ],
          latestHealth: { riskLevel: 'LOW', overallScore: 7.5, moodScore: 8, sleepScore: 7, wantsCounselor: false },
          isVerified: true,
        },
      ],
    }
    return <ParentDashboardView profile={demoProfile} alerts={[]} />
  }

  if (isLoading) return <ParentLoading />

  // Error (no profile found) or no data — show link-student CTA
  if (error || !data?.profile) return <NoProfileCard />

  return <ParentDashboardView profile={data.profile} alerts={data.alerts} />
}
