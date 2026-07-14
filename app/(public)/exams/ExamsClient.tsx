'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import Link from 'next/link'

const EXAM_CATEGORIES = ['UPSC', 'SSC', 'BANKING', 'RAILWAY', 'STATE_PSC', 'JEE', 'NEET', 'DEFENCE'] as const

const CATEGORY_ICONS: Record<string, string> = {
  UPSC: '🏛️', SSC: '📋', BANKING: '🏦', RAILWAY: '🚂',
  STATE_PSC: '🏢', JEE: '⚗️', NEET: '🩺', DEFENCE: '🛡️',
}

export function ExamsClient() {
  const [selected, setSelected] = useState<string | null>(null)
  const { data: exams, isLoading } = trpc.exam.list.useQuery(
    selected ? { examName: selected } : undefined,
  )

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textDecoration: 'none', marginBottom: '1.25rem' }}>
          ← Back to Home
        </Link>
        <h1 style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 0.5rem', background: 'linear-gradient(90deg,#A78BFA,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Exam Cutoff Database
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', margin: 0 }}>
          Historical cutoff marks across all major Indian competitive exams
        </p>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <button
          onClick={() => setSelected(null)}
          style={{
            padding: '0.45rem 1rem', borderRadius: 100, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
            background: !selected ? 'linear-gradient(135deg,#7C3AED,#06B6D4)' : 'rgba(255,255,255,0.05)',
            border: !selected ? 'none' : '1px solid rgba(255,255,255,0.12)',
            color: !selected ? '#fff' : 'rgba(255,255,255,0.5)',
          }}
        >
          All Exams
        </button>
        {EXAM_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(selected === cat ? null : cat)}
            style={{
              padding: '0.45rem 1rem', borderRadius: 100, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
              background: selected === cat ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.05)',
              border: selected === cat ? '1px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.1)',
              color: selected === cat ? '#A78BFA' : 'rgba(255,255,255,0.5)',
            }}
          >
            {CATEGORY_ICONS[cat]} {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ height: 110, background: 'rgba(255,255,255,0.04)', borderRadius: 16, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : !exams || exams.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>No cutoff data yet</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>
            Exam cutoff data will appear here once imported. Check back soon!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {exams.map((exam: any) => (
            <div
              key={exam.id}
              style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: '1.25rem 1.5rem', transition: 'all 0.2s', cursor: 'default',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(124,58,237,0.08)'
                el.style.borderColor = 'rgba(124,58,237,0.25)'
                el.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(255,255,255,0.03)'
                el.style.borderColor = 'rgba(255,255,255,0.08)'
                el.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: '0 0 0.2rem' }}>
                    {CATEGORY_ICONS[exam.examName] ?? '📋'} {exam.examName} {exam.examYear}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {exam.stage}
                  </span>
                </div>
                {exam.totalMarks && (
                  <span style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, padding: '0.2rem 0.75rem', fontSize: '0.78rem', color: '#A78BFA', fontWeight: 700 }}>
                    Max: {exam.totalMarks} marks
                  </span>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.6rem' }}>
                {[
                  { label: 'General', value: exam.general, color: '#06B6D4' },
                  { label: 'OBC', value: exam.obc, color: '#A78BFA' },
                  { label: 'SC', value: exam.sc, color: '#F59E0B' },
                  { label: 'ST', value: exam.st, color: '#22C55E' },
                  { label: 'EWS', value: exam.ews, color: '#E879F9' },
                  { label: 'PwD', value: exam.pwd, color: '#FB923C' },
                ].map(c => (
                  <div key={c.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem', fontWeight: 600 }}>{c.label}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: c.value != null ? c.color : 'rgba(255,255,255,0.2)' }}>
                      {c.value ?? '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer note */}
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.78rem', marginTop: '3rem' }}>
        Data sourced from official commission notifications. Always verify with official sources.
      </p>
    </>
  )
}
