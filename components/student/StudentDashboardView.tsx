'use client'

import { useState, useCallback, useEffect } from 'react'
import React from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'

/* ─── Global hover/animation styles injected once ─────────────────── */
const GLOBAL_STYLE = `
  @keyframes fadeIn   { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }

  .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease !important; }
  .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(124,58,237,0.18); border-color: rgba(124,58,237,0.3) !important; }

  .btn-primary {
    background: linear-gradient(135deg,#7C3AED,#6D28D9);
    color:#fff; border:none; padding:0.6rem 1.2rem; border-radius:10px;
    font-size:0.875rem; font-weight:700; cursor:pointer;
    box-shadow:0 4px 16px rgba(124,58,237,0.3);
    transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
  }
  .btn-primary:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 24px rgba(124,58,237,0.45); }
  .btn-primary:active:not(:disabled){ transform:translateY(0px); }
  .btn-primary:disabled { opacity:0.5; cursor:not-allowed; }

  .btn-cyan {
    background: linear-gradient(135deg,#06B6D4,#0891B2);
    color:#fff; border:none; border-radius:10px;
    font-weight:800; cursor:pointer; font-size:0.9rem;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .btn-cyan:hover { transform:translateY(-1px); box-shadow:0 8px 24px rgba(6,182,212,0.4); }

  .btn-ghost {
    background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.55);
    border:1px solid rgba(255,255,255,0.12); border-radius:10px;
    font-weight:700; cursor:pointer; font-size:0.875rem;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }
  .btn-ghost:hover { background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.2); color:#fff; }

  .btn-green {
    background:linear-gradient(135deg,#22C55E,#16A34A);
    color:#fff; border:none; border-radius:10px;
    font-weight:800; cursor:pointer; font-size:0.875rem;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .btn-green:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 24px rgba(34,197,94,0.4); }
  .btn-green:disabled { opacity:0.5; cursor:wait; }

  .news-item { transition: background 0.18s ease, transform 0.18s ease; }
  .news-item:hover { background:rgba(124,58,237,0.1) !important; transform:translateX(3px); }

  .wb-item { transition: background 0.18s ease, border-color 0.18s ease; }
  .wb-item:hover { background:rgba(124,58,237,0.12) !important; border-color:rgba(124,58,237,0.35) !important; }

  .mission-btn { transition: all 0.18s ease !important; }
  .mission-btn:hover { transform:scale(1.02); }

  .tab-btn { transition: all 0.18s ease; }
  .tab-btn:hover { background:rgba(6,182,212,0.15) !important; }

  input[type=range] { height:6px; border-radius:3px; }
`

/* ─── colour helpers ─────────────────────────────────────────────── */
const RISK_COLORS: Record<string, string> = {
  LOW: '#22C55E', MEDIUM: '#F59E0B', HIGH: '#EF4444', CRITICAL: '#DC2626',
}

/* ─── StatCard ─────────────────────────────────────────────────────── */
const StatCard = ({ value, label, sub, accent = '#7C3AED' }: { value: string; label: string; sub?: string; accent?: string }) => (
  <div className="card-hover" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.25rem 1rem', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${accent},#06B6D4)` }} />
    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>{value}</div>
    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem', fontWeight: 600 }}>{label}</div>
    {sub && <div style={{ fontSize: '0.7rem', color: '#A78BFA', marginTop: '0.15rem' }}>{sub}</div>}
  </div>
)

/* ─── Weakness Radar SVG ─────────────────────────────────────────── */
const RadarChart = ({ subjects }: { subjects: { label: string; score: number; color: string }[] }) => {
  const cx = 130, cy = 130, R = 95, n = subjects.length
  const angle = (i: number) => (i * 2 * Math.PI / n) - Math.PI / 2
  const pt = (i: number, frac: number) => ({
    x: cx + frac * R * Math.cos(angle(i)),
    y: cy + frac * R * Math.sin(angle(i)),
  })
  const grids = [0.25, 0.5, 0.75, 1]
  const dataPolygon = subjects.map((s, i) => {
    const p = pt(i, s.score / 100)
    return `${p.x},${p.y}`
  }).join(' ')
  return (
    <svg viewBox="0 0 260 260" style={{ width: '100%', maxWidth: 260 }}>
      <defs>
        <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      {grids.map(f => (
        <polygon key={f} points={subjects.map((_, i) => { const p = pt(i, f); return `${p.x},${p.y}` }).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      ))}
      {subjects.map((_, i) => {
        const outer = pt(i, 1)
        return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      })}
      <polygon points={dataPolygon} fill="url(#radarFill)" stroke="#7C3AED" strokeWidth="2" />
      {subjects.map((s, i) => {
        const p = pt(i, s.score / 100)
        return <circle key={i} cx={p.x} cy={p.y} r="5" fill={s.color} stroke="#0D0D1A" strokeWidth="2" />
      })}
      {subjects.map((s, i) => {
        const outer = pt(i, 1.22)
        const textAnchor = outer.x > cx + 5 ? 'start' : outer.x < cx - 5 ? 'end' : 'middle'
        return (
          <text key={i} x={outer.x} y={outer.y + 4} textAnchor={textAnchor} fontSize="10" fill="rgba(255,255,255,0.55)" fontWeight="600">
            {s.label}
          </text>
        )
      })}
    </svg>
  )
}

/* ─── Gauge Chart SVG ────────────────────────────────────────────── */
const GaugeChart = ({ value }: { value: number }) => {
  const cx = 90, cy = 85, r = 65
  const toRad = (d: number) => d * Math.PI / 180
  const arcPath = (from: number, to: number) => {
    const s = { x: cx + r * Math.cos(toRad(from)), y: cy + r * Math.sin(toRad(from)) }
    const e = { x: cx + r * Math.cos(toRad(to)), y: cy + r * Math.sin(toRad(to)) }
    const lg = to - from > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${lg} 1 ${e.x} ${e.y}`
  }
  const fillEnd = 150 + (value / 100) * 240
  const scoreColor = value >= 70 ? '#22C55E' : value >= 50 ? '#F59E0B' : '#EF4444'
  return (
    <svg viewBox="0 0 180 130" style={{ width: '100%', maxWidth: 180 }}>
      <defs>
        <linearGradient id="gaugeG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <path d={arcPath(150, 390)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" strokeLinecap="round" />
      <path d={arcPath(150, fillEnd)} fill="none" stroke="url(#gaugeG)" strokeWidth="14" strokeLinecap="round" />
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="24" fontWeight="900" fill={scoreColor}>{value}%</text>
      <text x={cx} y={cy + 24} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">Percentile</text>
    </svg>
  )
}

/* ─── Circular Progress Ring ─────────────────────────────────────── */
const CircularRing = ({ pct, label, color }: { pct: number; label: string; color: string }) => {
  const r = 30, cx = 38, cy = 38
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
      <svg viewBox="0 0 76 76" style={{ width: 76 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="9"
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: 'stroke-dasharray 0.8s ease' }} />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">{pct}%</text>
      </svg>
      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', textAlign: 'center', maxWidth: 70 }}>{label}</span>
    </div>
  )
}

/* ─── Mock data ──────────────────────────────────────────────────── */
const SUBJECTS_RADAR = [
  { label: 'History',      score: 65, color: '#A78BFA' },
  { label: 'Polity',       score: 78, color: '#06B6D4' },
  { label: 'Geography',    score: 52, color: '#F59E0B' },
  { label: 'Economy',      score: 70, color: '#22C55E' },
  { label: 'Science',      score: 44, color: '#EF4444' },
  { label: 'Reasoning',    score: 80, color: '#06B6D4' },
  { label: 'English',      score: 73, color: '#A78BFA' },
  { label: 'Curr.Affairs', score: 58, color: '#F59E0B' },
]

const MOCK_TESTS = [
  { date: '28 Jun', exam: 'UPSC Prelims', score: 142, percentile: 78, up: true },
  { date: '22 Jun', exam: 'UPSC Prelims', score: 128, percentile: 71, up: true },
  { date: '15 Jun', exam: 'UPSC GS-2',   score: 95,  percentile: 64, up: false },
  { date: '8 Jun',  exam: 'UPSC Prelims', score: 110, percentile: 68, up: true },
  { date: '1 Jun',  exam: 'UPSC GS-1',   score: 88,  percentile: 55, up: true },
]

const CURRENT_AFFAIRS = [
  { title: 'India-Pakistan Ceasefire: Key Points for UPSC Prelims', tags: ['UPSC', 'IR'],      date: 'Today',      url: '#' },
  { title: 'RBI Keeps Repo Rate at 6.5% — Economic Analysis',       tags: ['UPSC', 'Banking'], date: 'Today',      url: '#' },
  { title: 'PM KISAN Scheme: New Beneficiary Data Released',         tags: ['UPSC', 'Agri'],   date: 'Yesterday',  url: '#' },
  { title: 'DPDP Act 2023 — Key Provisions for Mains',              tags: ['UPSC', 'Polity'],  date: 'Yesterday',  url: '#' },
  { title: "India's GDP Growth Q4 FY25: Analysis",                  tags: ['UPSC', 'Economy'], date: '2 days ago', url: '#' },
]

const SYLLABUS = [
  { subject: 'History',     pct: 68 },
  { subject: 'Polity',      pct: 82 },
  { subject: 'Geography',   pct: 55 },
  { subject: 'Economy',     pct: 70 },
  { subject: 'Science',     pct: 40 },
  { subject: 'Environment', pct: 35 },
]

const INITIAL_MISSIONS = [
  { id: 1, label: 'Take a mock test',    xp: 50 },
  { id: 2, label: 'Study for 2 hours',   xp: 100 },
  { id: 3, label: 'Review 1 weak topic', xp: 75 },
]

/* ─── Main Component ─────────────────────────────────────────────── */
export const StudentDashboardView = React.memo(({ data }: { data: any }) => {
  /* ai + pomodoro state */
  const [aiQuestion,   setAiQuestion]   = useState('')
  const [aiReply,      setAiReply]      = useState<string | null>(null)
  const [toast,        setToast]        = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [aiError,      setAiError]      = useState<string | null>(null)

  /* health survey state */
  const [showHealthForm, setShowHealthForm] = useState(false)
  const [hMood,       setHMood]       = useState(7)
  const [hSleep,      setHSleep]      = useState(7)
  const [hAnxiety,    setHAnxiety]    = useState(4)
  const [hMotivation, setHMotivation] = useState(7)
  const [hCounselor,  setHCounselor]  = useState(false)
  const [hNotes,      setHNotes]      = useState('')

  /* pomodoro state */
  const [timerPreset,  setTimerPreset]  = useState<'25/5' | '50/10'>('25/5')
  const [pomMode,      setPomMode]      = useState<'work' | 'break'>('work')
  const [pomRunning,   setPomRunning]   = useState(false)
  const [pomSecs,      setPomSecs]      = useState(25 * 60)
  const [pomSessions,  setPomSessions]  = useState(0)

  /* missions state */
  const [missions, setMissions] = useState(INITIAL_MISSIONS.map(m => ({ ...m, done: false })))

  /* whiteboard create state */
  const [showWbForm,   setShowWbForm]   = useState(false)
  const [wbTitle,      setWbTitle]      = useState('')
  const [wbTopic,      setWbTopic]      = useState('')

  /* tRPC hooks */
  const aiChat        = trpc.ai.chat.useMutation()
  const logSession    = trpc.student.logSession.useMutation()
  const submitHealth  = trpc.health.submitSurvey.useMutation()
  const createWb      = trpc.whiteboard.create.useMutation()
  const utils         = trpc.useUtils()

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  /* pomodoro tick */
  useEffect(() => {
    if (!pomRunning) return
    const work = timerPreset === '25/5' ? 25 * 60 : 50 * 60
    const rest = timerPreset === '25/5' ?  5 * 60 : 10 * 60
    const id = setInterval(() => {
      setPomSecs(s => {
        if (s <= 1) {
          setPomRunning(false)
          if (pomMode === 'work') { setPomSessions(n => n + 1); setPomMode('break'); return rest }
          else                   { setPomMode('work'); return work }
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [pomRunning, pomMode, timerPreset])

  const resetPomodoro = () => {
    setPomRunning(false); setPomMode('work')
    setPomSecs((timerPreset === '25/5' ? 25 : 50) * 60)
  }

  const switchPreset = (p: '25/5' | '50/10') => {
    setTimerPreset(p); setPomRunning(false)
    setPomMode('work'); setPomSecs((p === '25/5' ? 25 : 50) * 60)
  }

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const handleAskAI = useCallback(async () => {
    if (!aiQuestion.trim()) return
    setAiError(null)
    try {
      const result = await aiChat.mutateAsync({ message: aiQuestion, examType: 'UPSC' })
      setAiReply(result.reply)
    } catch (e: any) {
      setAiError(e?.message || 'AI service unavailable')
    }
  }, [aiQuestion, aiChat])

  const handleLogSession = useCallback(async () => {
    try {
      await logSession.mutateAsync({ durationMinutes: 25 })
      showToast('✅ 25 min study session logged!')
      utils.student.getDashboard.invalidate()
    } catch (e: any) {
      showToast('❌ Failed to log session: ' + (e?.message || 'unknown error'), 'error')
    }
  }, [logSession, utils])

  const handleHealthSubmit = useCallback(async () => {
    const weekStart = new Date()
    weekStart.setHours(0, 0, 0, 0)
    const dayOfWeek = weekStart.getDay()
    weekStart.setDate(weekStart.getDate() - dayOfWeek)
    try {
      await submitHealth.mutateAsync({
        weekStart: weekStart.toISOString(),
        moodScore: hMood,
        sleepScore: hSleep,
        anxietyScore: hAnxiety,
        motivationScore: hMotivation,
        wantsCounselor: hCounselor,
        notes: hNotes || undefined,
      })
      setShowHealthForm(false)
      showToast('💚 Health survey submitted!')
      utils.student.getDashboard.invalidate()
    } catch (e: any) {
      showToast('❌ Failed to submit survey: ' + (e?.message || 'unknown error'), 'error')
    }
  }, [submitHealth, hMood, hSleep, hAnxiety, hMotivation, hCounselor, hNotes, utils])

  const handleCreateWhiteboard = useCallback(async () => {
    if (!wbTitle.trim()) return
    try {
      const session = await createWb.mutateAsync({ title: wbTitle, topic: wbTopic || undefined })
      setWbTitle(''); setWbTopic(''); setShowWbForm(false)
      showToast('🖊️ Whiteboard created!')
      utils.student.getDashboard.invalidate()
      // Navigate to whiteboard
      window.location.href = `/student/whiteboard?session=${session.id}`
    } catch (e: any) {
      showToast('❌ Failed to create whiteboard: ' + (e?.message || 'unknown error'), 'error')
    }
  }, [createWb, wbTitle, wbTopic, utils])

  const streak    = data.profile?.currentStreak ?? data.profile?.streak ?? 12
  const totalXP   = data.profile?.xpPoints ?? 2450
  const nextLvlXP = 3000
  const level     = Math.floor(totalXP / 250) || 12
  const isBoss    = streak >= 30
  const missionsDone = missions.filter(m => m.done).length

  const card = (bg: string, border: string) => ({
    background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: '1.5rem',
  })

  /* real mock data merged with demo fallback */
  const realMocks = (data.mockResults ?? []).map((m: any) => ({
    date: new Date(m.attemptedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    exam: m.testId,
    score: Math.round(m.score),
    percentile: m.percentile ? Math.round(m.percentile) : Math.round(m.score / m.totalMarks * 100),
    up: true,
  }))
  const mockTests = realMocks.length > 0 ? realMocks : MOCK_TESTS

  /* real subject scores merged with demo fallback */
  const realSubjects = (data.scores ?? []).map((s: any) => ({
    subject: s.subject, score: Math.round(s.score),
  }))
  const subjectList = realSubjects.length > 0 ? realSubjects : SYLLABUS.map(s => ({ subject: s.subject, score: s.pct }))

  const whiteboards = data.whiteboards ?? []

  /* ─── render ─── */
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#0D0D1A', minHeight: '100vh', color: '#fff', padding: '1.5rem', maxWidth: 1400, margin: '0 auto' }}>
      <style>{GLOBAL_STYLE}</style>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          background: toast.type === 'error' ? 'rgba(50,20,20,0.97)' : 'rgba(20,30,50,0.97)',
          border: `1px solid ${toast.type === 'error' ? 'rgba(239,68,68,0.5)' : 'rgba(34,197,94,0.4)'}`,
          borderRadius: 14, padding: '0.9rem 1.5rem', color: '#fff', fontSize: '0.9rem',
          fontWeight: 700, zIndex: 9999, boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(16px)', animation: 'fadeIn 0.2s ease',
        }}>
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
            Welcome back,{' '}
            <span style={{ background: 'linear-gradient(90deg,#A78BFA,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {data.profile?.name ?? data.profile?.user?.name ?? 'Aspirant'}
            </span>! 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {data.profile?.targetExam ?? 'UPSC'} · Keep your streak alive — stay consistent!
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {isBoss && (
            <div style={{ background: 'linear-gradient(135deg,#F59E0B,#DC2626)', padding: '0.4rem 0.85rem', borderRadius: 100, fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>
              🔥 BOSS MODE
            </div>
          )}
          <Link href="/student/whiteboard" style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.35)', color: '#06B6D4', padding: '0.6rem 1.2rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(6,182,212,0.25)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(6,182,212,0.15)' }}>
            🖊️ Whiteboard
          </Link>
          <button className="btn-primary" onClick={handleLogSession} disabled={logSession.isPending}>
            {logSession.isPending ? '⏳ Logging…' : '+ Log 25min Study'}
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard value={`${streak}🔥`}  label="Day Streak"    sub="Keep it up!" accent="#F59E0B" />
        <StatCard value={`#${data.profile?.nationalRank ?? '—'}`} label="National Rank" sub="Among all aspirants" accent="#7C3AED" />
        <StatCard value={`${Math.floor((data.profile?.totalStudyMins ?? 0) / 60)}h`} label="Total Study" sub={`${(data.profile?.totalStudyMins ?? 0) % 60}m lifetime`} accent="#22C55E" />
        <StatCard value={`${data.profile?.todayMinutes ?? 0}m`} label="Today" sub="Goal: 480m" accent="#06B6D4" />
      </div>

      {/* ── Gamification Bar ── */}
      <div style={{ ...card('rgba(124,58,237,0.09)', 'rgba(124,58,237,0.28)'), marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', borderRadius: 8, padding: '0.3rem 0.75rem', fontSize: '0.8rem', fontWeight: 800 }}>
              LVL {level}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{totalXP.toLocaleString()} XP</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{Math.max(0, nextLvlXP - totalXP).toLocaleString()} XP to Level {level + 1}</div>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', color: missionsDone === missions.length ? '#22C55E' : 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
            {missionsDone === missions.length ? '✅ All missions done!' : `${missionsDone}/${missions.length} daily missions`}
          </span>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 100, overflow: 'hidden', marginBottom: '1rem' }}>
          <div style={{ height: '100%', width: `${Math.min((totalXP / nextLvlXP) * 100, 100)}%`, background: 'linear-gradient(90deg,#7C3AED,#06B6D4)', borderRadius: 100, transition: 'width 1s ease' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '0.6rem' }}>
          {missions.map(m => (
            <button key={m.id} className="mission-btn"
              onClick={() => setMissions(prev => prev.map(x => x.id === m.id ? { ...x, done: !x.done } : x))}
              style={{ background: m.done ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${m.done ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '0.65rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: m.done ? '#22C55E' : 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600 }}>
              <span>{m.done ? '✅' : '⬜'} {m.label}</span>
              <span style={{ background: 'rgba(124,58,237,0.25)', borderRadius: 100, padding: '0.1rem 0.5rem', fontSize: '0.7rem', color: '#A78BFA', fontWeight: 800 }}>+{m.xp} XP</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Radar + Score Predictor + Pomodoro ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>

        {/* Weakness Radar */}
        <div className="card-hover" style={card('rgba(255,255,255,0.03)', 'rgba(255,255,255,0.07)')}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>🎯 Weakness Radar</h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <RadarChart subjects={SUBJECTS_RADAR} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
            {SUBJECTS_RADAR.filter(s => s.score < 60).map(s => (
              <span key={s.label} style={{ padding: '0.15rem 0.55rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 100, fontSize: '0.65rem', color: '#FCA5A5', fontWeight: 700 }}>⚠️ {s.label}</span>
            ))}
          </div>
        </div>

        {/* AI Score Predictor */}
        <div className="card-hover" style={card('rgba(124,58,237,0.06)', 'rgba(124,58,237,0.18)')}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>🔮 AI Score Predictor</h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GaugeChart value={67} />
          </div>
          <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>847<span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.35)' }}>/1250</span></div>
            <div style={{ fontSize: '0.78rem', color: '#A78BFA', marginTop: '0.2rem' }}>Predicted Score · Est. Rank ~2,400</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.85rem' }}>
            {[{ label: 'Confidence', value: 'High', color: '#22C55E' }, { label: 'Trend', value: '↑ Rising', color: '#06B6D4' }, { label: 'Mock Avg', value: '73%', color: '#F59E0B' }, { label: 'Study Hours', value: `${Math.floor((data.profile?.totalStudyMins ?? 0) / 60)}h`, color: '#A78BFA' }].map(it => (
              <div key={it.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '0.5rem 0.75rem' }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{it.label}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: it.color, marginTop: '0.2rem' }}>{it.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pomodoro Timer */}
        <div className="card-hover" style={card('rgba(6,182,212,0.06)', 'rgba(6,182,212,0.18)')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>⏱️ Pomodoro Timer</h2>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {(['25/5', '50/10'] as const).map(p => (
                <button key={p} className="tab-btn" onClick={() => switchPreset(p)}
                  style={{ padding: '0.2rem 0.55rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700, border: `1px solid ${timerPreset === p ? '#06B6D4' : 'rgba(255,255,255,0.15)'}`, background: timerPreset === p ? 'rgba(6,182,212,0.2)' : 'transparent', color: timerPreset === p ? '#06B6D4' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>{p}</button>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center', margin: '0.75rem 0' }}>
            <div style={{ fontSize: '0.75rem', color: pomMode === 'work' ? '#06B6D4' : '#22C55E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>
              {pomMode === 'work' ? '📚 Focus Time' : '☕ Break Time'}
            </div>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1, color: pomRunning ? '#fff' : 'rgba(255,255,255,0.6)', fontVariantNumeric: 'tabular-nums', transition: 'color 0.3s' }}>
              {fmt(pomSecs)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'center', marginBottom: '0.85rem' }}>
            <button className={pomRunning ? 'btn-ghost' : 'btn-cyan'} onClick={() => setPomRunning(r => !r)}
              style={{ padding: '0.6rem 1.5rem' }}>
              {pomRunning ? '⏸ Pause' : '▶ Start'}
            </button>
            <button className="btn-ghost" onClick={resetPomodoro} style={{ padding: '0.6rem 1rem' }}>
              ↺ Reset
            </button>
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>
            🍅 {pomSessions} session{pomSessions !== 1 ? 's' : ''} completed today
          </div>
        </div>
      </div>

      {/* ── Subject Performance + AI Mentor ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>

        {/* Subject Performance */}
        <div className="card-hover" style={card('rgba(255,255,255,0.03)', 'rgba(255,255,255,0.07)')}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>Subject Performance</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {subjectList.map((s: any) => (
              <div key={s.subject}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{s.subject}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: s.score >= 70 ? '#22C55E' : s.score >= 40 ? '#F59E0B' : '#EF4444' }}>{s.score}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 100, background: s.score >= 70 ? 'linear-gradient(90deg,#22C55E,#16A34A)' : s.score >= 40 ? 'linear-gradient(90deg,#F59E0B,#D97706)' : 'linear-gradient(90deg,#EF4444,#DC2626)', width: `${Math.min(s.score, 100)}%`, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Study Assistant */}
        <div className="card-hover" style={card('rgba(124,58,237,0.08)', 'rgba(124,58,237,0.2)')}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>🧠 AI Study Assistant</h2>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input value={aiQuestion} onChange={e => setAiQuestion(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAskAI()}
              placeholder="Ask anything… 'Explain DPSP in 3 lines'"
              style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.6rem 0.85rem', color: '#fff', fontSize: '0.875rem', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
            <button className="btn-primary" onClick={handleAskAI} disabled={aiChat.isPending || !aiQuestion.trim()}>
              {aiChat.isPending ? '…' : 'Ask'}
            </button>
          </div>
          {aiError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '0.7rem', fontSize: '0.82rem', color: '#FCA5A5', marginBottom: '0.75rem' }}>
              ⚠️ {aiError}
            </div>
          )}
          {aiReply && (
            <div style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 10, padding: '0.85rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.65, animation: 'fadeIn 0.3s ease' }}>
              {aiReply}
            </div>
          )}
          {(data.recentSessions ?? []).length > 0 && (
            <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Recent Sessions</p>
              {data.recentSessions.slice(0, 3).map((s: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span suppressHydrationWarning>{new Date(s.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' })}</span>
                  <span style={{ fontWeight: 700, color: '#A78BFA' }}>{s.duration} min</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Current Affairs + Mock Test History ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>

        {/* Current Affairs Feed */}
        <div className="card-hover" style={card('rgba(255,255,255,0.03)', 'rgba(255,255,255,0.07)')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>📰 Current Affairs</h2>
            <span style={{ fontSize: '0.7rem', color: '#06B6D4', fontWeight: 700 }}>✨ AI-Curated</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {CURRENT_AFFAIRS.map((item, i) => (
              <div key={i} className="news-item" style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.025)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', lineHeight: 1.4, marginBottom: '0.4rem' }}>{item.title}</div>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {item.tags.map(tag => (
                    <span key={tag} style={{ padding: '0.1rem 0.45rem', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.35)', borderRadius: 100, fontSize: '0.62rem', fontWeight: 700, color: '#A78BFA' }}>{tag}</span>
                  ))}
                  <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mock Test History */}
        <div className="card-hover" style={card('rgba(255,255,255,0.03)', 'rgba(255,255,255,0.07)')}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>📊 Mock Test History</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr>
                  {['Date', 'Exam', 'Score', 'Percentile', 'Trend'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.4rem 0.5rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.62rem', letterSpacing: '0.06em', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockTests.map((t: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                    <td style={{ padding: '0.6rem 0.5rem', color: 'rgba(255,255,255,0.38)' }}>{t.date}</td>
                    <td style={{ padding: '0.6rem 0.5rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{t.exam}</td>
                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 800, color: '#fff' }}>{t.score}</td>
                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 700, color: t.percentile >= 70 ? '#22C55E' : '#F59E0B' }}>{t.percentile}%ile</td>
                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 900, color: t.up ? '#22C55E' : '#EF4444', fontSize: '1.1rem' }}>{t.up ? '↑' : '↓'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/student/whiteboard" style={{ display: 'block', marginTop: '1rem', textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '0.65rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 600, transition: 'all 0.18s ease' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(124,58,237,0.12)'; el.style.color = '#A78BFA'; el.style.borderColor = 'rgba(124,58,237,0.3)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.04)'; el.style.color = 'rgba(255,255,255,0.5)'; el.style.borderColor = 'rgba(255,255,255,0.08)' }}>
            Start Practice Test →
          </Link>
        </div>
      </div>

      {/* ── Syllabus Coverage ── */}
      <div style={{ ...card('rgba(255,255,255,0.03)', 'rgba(255,255,255,0.07)'), marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>📚 Syllabus Coverage</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', padding: '0.5rem 0' }}>
          {SYLLABUS.map(s => (
            <CircularRing key={s.subject} pct={s.pct} label={s.subject} color={s.pct >= 70 ? '#22C55E' : s.pct >= 50 ? '#F59E0B' : '#EF4444'} />
          ))}
        </div>
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[{ c: '#22C55E', l: '≥70% — Strong' }, { c: '#F59E0B', l: '50–69% — Review' }, { c: '#EF4444', l: '<50% — Focus Now' }].map(lx => (
            <div key={lx.l} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: lx.c }} />{lx.l}
            </div>
          ))}
        </div>
      </div>

      {/* ── Health + Whiteboards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.25rem' }}>

        {/* Health Status */}
        <div className="card-hover" style={card('rgba(255,255,255,0.03)', 'rgba(255,255,255,0.07)')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>💚 Health Status</h2>
            <button onClick={() => setShowHealthForm(f => !f)}
              style={{ background: showHealthForm ? 'rgba(255,255,255,0.06)' : 'rgba(34,197,94,0.15)', border: showHealthForm ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '0.3rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, color: showHealthForm ? 'rgba(255,255,255,0.4)' : '#22C55E', cursor: 'pointer', transition: 'all 0.2s' }}>
              {showHealthForm ? 'Cancel' : '+ Submit Survey'}
            </button>
          </div>

          {/* Health Survey Form */}
          {showHealthForm && (
            <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.25rem', animation: 'fadeIn 0.25s ease' }}>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>Weekly check-in — rate each area 1 (low) → 10 (high)</p>
              {[
                { label: 'Mood 😊', val: hMood, set: setHMood, desc: '1 = very sad, 10 = very happy' },
                { label: 'Sleep 😴', val: hSleep, set: setHSleep, desc: '1 = very poor, 10 = excellent' },
                { label: 'Anxiety 😰', val: hAnxiety, set: setHAnxiety, desc: '1 = very anxious, 10 = calm' },
                { label: 'Motivation 🔥', val: hMotivation, set: setHMotivation, desc: '1 = no motivation, 10 = fully driven' },
              ].map(({ label, val, set, desc }) => (
                <div key={label} style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{label}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 900, color: val >= 7 ? '#22C55E' : val >= 4 ? '#F59E0B' : '#EF4444' }}>{val}/10</span>
                  </div>
                  <input type="range" min={1} max={10} value={val} onChange={e => set(Number(e.target.value))}
                    style={{ width: '100%', accentColor: val >= 7 ? '#22C55E' : val >= 4 ? '#F59E0B' : '#EF4444', cursor: 'pointer' }} />
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.1rem' }}>{desc}</div>
                </div>
              ))}
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem' }}>Notes (optional)</label>
                <textarea value={hNotes} onChange={e => setHNotes(e.target.value)}
                  placeholder="How are you feeling this week?"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.6rem 0.75rem', color: '#fff', fontSize: '0.82rem', outline: 'none', resize: 'vertical', minHeight: 60, boxSizing: 'border-box' }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
                <input type="checkbox" checked={hCounselor} onChange={e => setHCounselor(e.target.checked)}
                  style={{ accentColor: '#EF4444', width: 16, height: 16, cursor: 'pointer' }} />
                I'd like to speak with a counselor
              </label>
              <button className="btn-green" onClick={handleHealthSubmit} disabled={submitHealth.isPending}
                style={{ width: '100%', padding: '0.65rem 1.25rem' }}>
                {submitHealth.isPending ? '⏳ Submitting...' : '💚 Submit Health Survey'}
              </button>
            </div>
          )}

          {!data.latestHealth ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🫀</div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>No survey submitted yet</p>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>Weekly health check-ins help prevent burnout.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Overall Score', value: `${data.latestHealth.overallScore?.toFixed(1) ?? '—'}/10` },
                { label: 'Mood',          value: `${data.latestHealth.moodScore}/10` },
                { label: 'Sleep',         value: `${data.latestHealth.sleepScore}/10` },
                { label: 'Anxiety',       value: `${data.latestHealth.anxietyScore}/10` },
                { label: 'Motivation',    value: `${data.latestHealth.motivationScore}/10` },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: RISK_COLORS[data.latestHealth.riskLevel] ?? '#6B7280' }}>{item.value}</span>
                </div>
              ))}
              <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: `${RISK_COLORS[data.latestHealth.riskLevel] ?? '#6B7280'}22`, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Risk Level</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: RISK_COLORS[data.latestHealth.riskLevel] ?? '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{data.latestHealth.riskLevel}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Whiteboard Section (FULLY FUNCTIONAL) ── */}
        <div className="card-hover" style={card('rgba(6,182,212,0.05)', 'rgba(6,182,212,0.15)')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>🖊️ Collaborative Whiteboard</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setShowWbForm(f => !f)}
                style={{ background: showWbForm ? 'rgba(255,255,255,0.06)' : 'rgba(6,182,212,0.15)', border: `1px solid ${showWbForm ? 'rgba(255,255,255,0.12)' : 'rgba(6,182,212,0.35)'}`, borderRadius: 8, padding: '0.3rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, color: showWbForm ? 'rgba(255,255,255,0.4)' : '#06B6D4', cursor: 'pointer', transition: 'all 0.2s' }}>
                {showWbForm ? 'Cancel' : '+ New'}
              </button>
              <Link href="/student/whiteboard" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.3rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)' }}>
                View All
              </Link>
            </div>
          </div>

          {/* Create Whiteboard Form */}
          {showWbForm && (
            <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 12, padding: '1rem', marginBottom: '1rem', animation: 'fadeIn 0.2s ease' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <input value={wbTitle} onChange={e => setWbTitle(e.target.value)}
                  placeholder="Session title (e.g. UPSC GS-1 Revision)"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.6rem 0.85rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(6,182,212,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                <input value={wbTopic} onChange={e => setWbTopic(e.target.value)}
                  placeholder="Topic (optional — e.g. Indian History)"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.6rem 0.85rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(6,182,212,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>
              <button className="btn-cyan" onClick={handleCreateWhiteboard} disabled={createWb.isPending || !wbTitle.trim()}
                style={{ width: '100%', padding: '0.6rem', opacity: !wbTitle.trim() ? 0.5 : 1 }}>
                {createWb.isPending ? '⏳ Creating…' : '🚀 Create & Open Session'}
              </button>
            </div>
          )}

          {/* Sessions List */}
          {whiteboards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎨</div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>No whiteboard sessions yet</p>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', marginBottom: '1.25rem' }}>Create your first session to draw, plan, and study together</p>
              <button className="btn-cyan" onClick={() => setShowWbForm(true)} style={{ padding: '0.6rem 1.5rem' }}>
                🖊️ Create First Session
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {whiteboards.slice(0, 5).map((w: any) => (
                <Link key={w.id} href={`/student/whiteboard?session=${w.id}`} style={{ textDecoration: 'none' }}>
                  <div className="wb-item" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>{w.title}</div>
                      {w.topic && <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>{w.topic}</div>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{w.memberCount ?? 0} members</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 100, background: w.status === 'ACTIVE' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)', color: w.status === 'ACTIVE' ? '#22C55E' : 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{w.status}</span>
                    </div>
                  </div>
                </Link>
              ))}
              <Link href="/student/whiteboard" style={{ display: 'block', textAlign: 'center', marginTop: '0.5rem', fontSize: '0.8rem', color: '#06B6D4', fontWeight: 700, textDecoration: 'none', padding: '0.5rem', borderRadius: 8, transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(6,182,212,0.1)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                View All Sessions →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

StudentDashboardView.displayName = 'StudentDashboardView'
