'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'

type Mode = 'work' | 'break'
type Preset = '25/5' | '50/10' | '90/20'

const PRESETS: Record<Preset, { work: number; rest: number; label: string }> = {
  '25/5':  { work: 25 * 60, rest: 5 * 60,  label: 'Classic Pomodoro' },
  '50/10': { work: 50 * 60, rest: 10 * 60, label: 'Deep Work' },
  '90/20': { work: 90 * 60, rest: 20 * 60, label: 'Ultradian Rhythm' },
}

export default function TimerPageClient() {
  const [preset, setPreset] = useState<Preset>('25/5')
  const [mode, setMode] = useState<Mode>('work')
  const [running, setRunning] = useState(false)
  const [secs, setSecs] = useState(PRESETS['25/5'].work)
  const [sessions, setSessions] = useState(0)
  const [toast, setToast] = useState<string | null>(null)

  const logSession = trpc.student.logSession.useMutation()
  const utils = trpc.useUtils()

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  useEffect(() => {
    if (!running) return
    const { work, rest } = PRESETS[preset]
    const id = setInterval(() => {
      setSecs(s => {
        if (s <= 1) {
          setRunning(false)
          if (mode === 'work') {
            setSessions(n => n + 1)
            setMode('break')
            showToast('🎉 Focus session done! Time for a break.')
            logSession.mutateAsync({ durationMinutes: Math.floor(work / 60) }).then(() => utils.student.getDashboard.invalidate()).catch(() => {})
            return rest
          } else {
            setMode('work')
            showToast('☕ Break over! Let\'s get back to work.')
            return work
          }
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running, mode, preset])

  const reset = () => { setRunning(false); setMode('work'); setSecs(PRESETS[preset].work) }
  const switchPreset = (p: Preset) => { setPreset(p); setRunning(false); setMode('work'); setSecs(PRESETS[p].work) }
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const { work } = PRESETS[preset]
  const pct = 1 - (secs / (mode === 'work' ? PRESETS[preset].work : PRESETS[preset].rest))
  const r = 110
  const circ = 2 * Math.PI * r
  const dashOffset = circ * (1 - pct)

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: '#0D0D1A', minHeight: '100vh', color: '#fff' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .preset-btn { border-radius:10px; cursor:pointer; font-weight:700; font-size:0.82rem; padding:0.55rem 1rem; transition:all 0.18s; border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.55); }
        .preset-btn.active { background:rgba(6,182,212,0.18); border-color:rgba(6,182,212,0.45); color:#06B6D4; }
        .preset-btn:hover { background:rgba(255,255,255,0.08); color:#fff; }
        .ctrl-btn { border:none; border-radius:14px; cursor:pointer; font-weight:800; font-size:1rem; padding:0.85rem 2rem; transition:all 0.2s; }
      `}</style>

      {/* Toast */}
      {toast && <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'rgba(20,30,50,0.97)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 14, padding: '0.9rem 1.5rem', fontWeight: 700, fontSize: '0.9rem', zIndex: 9999, backdropFilter: 'blur(16px)', animation: 'fadeUp 0.2s ease' }}>{toast}</div>}

      {/* Header */}
      <div style={{ background: 'rgba(13,13,26,0.95)', borderBottom: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', height: 64, gap: '1rem' }}>
          <Link href="/student/dashboard" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'}>
            ← Dashboard
          </Link>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)' }} />
          <span style={{ fontSize: '1.3rem' }}>⏱️</span>
          <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Study Timer</span>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '3rem 2rem', textAlign: 'center' }}>

        {/* Preset Selector */}
        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '3rem', animation: 'fadeUp 0.4s ease', flexWrap: 'wrap' }}>
          {(Object.entries(PRESETS) as [Preset, typeof PRESETS[Preset]][]).map(([key, val]) => (
            <button key={key} className={`preset-btn${preset === key ? ' active' : ''}`} onClick={() => switchPreset(key)}>
              <div>{key}</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, opacity: 0.7 }}>{val.label}</div>
            </button>
          ))}
        </div>

        {/* Circular Timer */}
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem', animation: 'fadeUp 0.4s 0.1s ease both' }}>
          <svg width={260} height={260} viewBox="0 0 260 260">
            <circle cx={130} cy={130} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={14} />
            <circle cx={130} cy={130} r={r} fill="none"
              stroke={mode === 'work' ? '#7C3AED' : '#22C55E'}
              strokeWidth={14} strokeLinecap="round"
              strokeDasharray={`${circ}`}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 130 130)"
              style={{ transition: running ? 'stroke-dashoffset 1s linear' : 'none', filter: `drop-shadow(0 0 12px ${mode === 'work' ? '#7C3AED88' : '#22C55E88'})` }}
            />
          </svg>
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: mode === 'work' ? '#A78BFA' : '#22C55E', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.3rem' }}>
              {mode === 'work' ? '📚 Focus' : '☕ Break'}
            </div>
            <div style={{ fontSize: '3.8rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: running ? '#fff' : 'rgba(255,255,255,0.6)', fontVariantNumeric: 'tabular-nums', transition: 'color 0.3s' }}>
              {fmt(secs)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem' }}>
              🍅 {sessions} session{sessions !== 1 ? 's' : ''} done
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', animation: 'fadeUp 0.4s 0.15s ease both' }}>
          <button className="ctrl-btn" onClick={() => setRunning(r => !r)}
            style={{ background: running ? 'rgba(239,68,68,0.18)' : 'linear-gradient(135deg,#7C3AED,#06B6D4)', color: '#fff', boxShadow: running ? 'none' : '0 6px 20px rgba(124,58,237,0.4)', minWidth: 130 }}>
            {running ? '⏸ Pause' : '▶ Start'}
          </button>
          <button className="ctrl-btn" onClick={reset}
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.12)' }}>
            ↺ Reset
          </button>
        </div>

        {/* Session Log */}
        <div style={{ marginTop: '3rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '1.5rem', animation: 'fadeUp 0.4s 0.2s ease both' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 1rem' }}>Today's Progress</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
            {[
              { label: 'Sessions Done', value: sessions },
              { label: 'Focus Time', value: `${sessions * Math.floor(work / 60)}m` },
              { label: 'Target', value: '8 sessions' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#A78BFA' }}>{s.value}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
