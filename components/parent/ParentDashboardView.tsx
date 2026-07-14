'use client'

import { useState } from 'react'

/* ─── Types ──────────────────────────────────────────────────────── */
interface Child {
  id: string
  name: string
  targetExam: string
  targetYear: number
  currentStreak: number
  totalStudyMins: number
  nationalRank?: number
  burnoutRisk: string
  subjectScores: { subject: string; score: number }[]
  latestHealth: { riskLevel: string; overallScore: number; moodScore: number; sleepScore: number; wantsCounselor: boolean } | null
  isVerified: boolean
}
interface Props {
  profile: { name: string; children: Child[] }
  alerts: { id: string; title: string; body: string; read: boolean; createdAt: Date | string }[]
}

/* ─── colours ────────────────────────────────────────────────────── */
const RISK: Record<string, { bg: string; text: string; label: string }> = {
  LOW:      { bg: 'rgba(34,197,94,0.12)',  text: '#22C55E', label: '🟢 Low Risk' },
  MEDIUM:   { bg: 'rgba(245,158,11,0.12)', text: '#F59E0B', label: '🟡 Medium Risk' },
  HIGH:     { bg: 'rgba(239,68,68,0.12)',  text: '#EF4444', label: '🔴 High Risk' },
  CRITICAL: { bg: 'rgba(220,38,38,0.15)',  text: '#DC2626', label: '🚨 Critical' },
}

/* ─── i18n strings ───────────────────────────────────────────────── */
const T = {
  en: {
    greeting: (name: string) => `Namaste, ${name} 🙏`,
    monitoring: (n: number) => `Monitoring ${n} child${n !== 1 ? 'ren' : ''} · Real-time updates`,
    unread: (n: number) => `📢 ${n} unread alert${n !== 1 ? 's' : ''}`,
    exams: 'Upcoming Exam Deadlines',
    alerts: 'Alerts & Notifications',
    fees: 'Fee & Subscription',
    activity: "Today's Activity",
    health: 'Health Check-in',
    progress: 'Subject Progress',
    aiBtn: '💬 Ask AI',
    aiTitle: 'AI Se Puchein',
    aiPlaceholder: 'Type your question in English or Hindi…',
    askBtn: 'Ask',
    days: 'days left',
    streak: 'Day Streak',
    study: 'Total Study',
    rank: 'National Rank',
    healthScore: 'Health Score',
    dismiss: 'Dismiss',
    renew: 'Renew Plan',
    upgrade: 'Upgrade to Pro',
    active: 'Active',
    expires: 'Expires',
  },
  hi: {
    greeting: (name: string) => `नमस्ते, ${name} 🙏`,
    monitoring: (n: number) => `${n} बच्च${n !== 1 ? 'ों' : 'े'} की निगरानी · रियल-टाइम अपडेट`,
    unread: (n: number) => `📢 ${n} अपठित सूचना${n !== 1 ? 'एं' : ''}`,
    exams: 'आगामी परीक्षा की समय-सीमा',
    alerts: 'सूचनाएं',
    fees: 'शुल्क और सदस्यता',
    activity: 'आज की गतिविधि',
    health: 'स्वास्थ्य जांच',
    progress: 'विषय प्रगति',
    aiBtn: '💬 AI से पूछें',
    aiTitle: 'AI से पूछें',
    aiPlaceholder: 'अपना प्रश्न हिंदी या अंग्रेजी में लिखें…',
    askBtn: 'पूछें',
    days: 'दिन बाकी',
    streak: 'दिन की धारा',
    study: 'कुल पढ़ाई',
    rank: 'राष्ट्रीय रैंक',
    healthScore: 'स्वास्थ्य स्कोर',
    dismiss: 'हटाएं',
    renew: 'योजना नवीनीकृत करें',
    upgrade: 'Pro में अपग्रेड',
    active: 'सक्रिय',
    expires: 'समाप्त',
  },
}

/* ─── Demo Data ──────────────────────────────────────────────────── */
const DEMO_CHILDREN: Child[] = [
  {
    id: '1', name: 'Riya Sharma', targetExam: 'UPSC', targetYear: 2026,
    currentStreak: 14, totalStudyMins: 4320, nationalRank: 1847, burnoutRisk: 'LOW',
    subjectScores: [{ subject: 'History', score: 78 }, { subject: 'Polity', score: 82 }, { subject: 'Geography', score: 65 }, { subject: 'Economy', score: 71 }],
    latestHealth: { riskLevel: 'LOW', overallScore: 7.5, moodScore: 8, sleepScore: 7, wantsCounselor: false },
    isVerified: true,
  },
  {
    id: '2', name: 'Arjun Sharma', targetExam: 'SSC CGL', targetYear: 2025,
    currentStreak: 5, totalStudyMins: 1800, nationalRank: undefined, burnoutRisk: 'MEDIUM',
    subjectScores: [{ subject: 'Reasoning', score: 84 }, { subject: 'Quant', score: 61 }, { subject: 'English', score: 55 }],
    latestHealth: { riskLevel: 'MEDIUM', overallScore: 5.5, moodScore: 5, sleepScore: 6, wantsCounselor: false },
    isVerified: true,
  },
]

const EXAM_DEADLINES = [
  { exam: 'UPSC Prelims 2026',  daysLeft: 45,  urgency: 'low'    },
  { exam: 'SSC CGL 2025',       daysLeft: 12,  urgency: 'high'   },
  { exam: 'IBPS PO 2025',       daysLeft: 28,  urgency: 'medium' },
  { exam: 'RRB NTPC 2025',      daysLeft: 63,  urgency: 'low'    },
  { exam: 'UPSC Mains 2026',    daysLeft: 180, urgency: 'low'    },
]

const DEMO_ALERTS = [
  { id: 'a1', type: 'warning', title: 'Riya missed 2 days of study', body: 'No sessions logged on 28 & 29 Jun', read: false },
  { id: 'a2', type: 'info',    title: 'SSC CGL admit cards released', body: 'Arjun should download immediately',  read: false },
  { id: 'a3', type: 'good',    title: 'Riya hit #1847 national rank!', body: 'She improved 200 positions this week', read: true },
]

const CHILD_ACTIVITY: Record<string, { time: string; label: string; icon: string }[]> = {
  '1': [
    { time: '6:30 AM',  label: 'Started study session — History',  icon: '📚' },
    { time: '8:15 AM',  label: 'Completed UPSC Prelims mock test', icon: '✅' },
    { time: '11:00 AM', label: 'Reviewed weak topics — Economy',   icon: '🎯' },
    { time: '3:00 PM',  label: 'Studied Current Affairs',          icon: '📰' },
  ],
  '2': [
    { time: '8:00 AM',  label: 'Started study session — Reasoning', icon: '📚' },
    { time: '10:30 AM', label: 'Reviewed SSC CGL mock test',        icon: '✅' },
  ],
}

/* ─── ChildCard ──────────────────────────────────────────────────── */
function ChildCard({ child, lang, t, activeTab, setActiveTab }: {
  child: Child
  lang: 'en' | 'hi'
  t: typeof T['en']
  activeTab: string
  setActiveTab: (tab: string) => void
}) {
  const risk = RISK[child.burnoutRisk] ?? RISK.LOW
  const tabs = ['overview', 'progress', 'health', 'activity']

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: '1.5rem', boxShadow: '0 4px 24px rgba(232,141,42,0.15)', border: '1px solid rgba(232,141,42,0.2)', marginBottom: '1.5rem', backdropFilter: 'blur(12px)' }}>
      {/* Child Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg,#E88D2A,#F5A623)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '1.15rem', flexShrink: 0 }}>
            {child.name[0]}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {child.name}
              {child.isVerified && <span style={{ fontSize: '0.7rem', background: 'rgba(34,197,94,0.12)', color: '#16A34A', padding: '0.1rem 0.45rem', borderRadius: 100, fontWeight: 700 }}>✓ Verified</span>}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.1rem' }}>{child.targetExam} · Target {child.targetYear}</div>
          </div>
        </div>
        <span style={{ padding: '0.3rem 0.85rem', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700, background: risk.bg, color: risk.text, border: `1px solid ${risk.text}33` }}>
          {risk.label}
        </span>
      </div>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: 10 }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(`${child.id}-${tab}`)}
            style={{ flex: 1, padding: '0.4rem', borderRadius: 8, border: 'none', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize',
              background: activeTab === `${child.id}-${tab}` ? 'rgba(232,141,42,0.2)' : 'transparent',
              color: activeTab === `${child.id}-${tab}` ? '#F5A623' : 'rgba(255,255,255,0.4)',
              boxShadow: activeTab === `${child.id}-${tab}` ? '0 2px 8px rgba(232,141,42,0.2)' : 'none',
              transition: 'all 0.2s' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {(activeTab === `${child.id}-overview` || !activeTab.startsWith(child.id)) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: '0.75rem' }}>
          {[
            { value: `${child.currentStreak}🔥`,  label: t.streak },
            { value: `${Math.floor(child.totalStudyMins / 60)}h ${child.totalStudyMins % 60}m`, label: t.study },
            { value: child.nationalRank ? `#${child.nationalRank}` : '—', label: t.rank },
            { value: child.latestHealth ? `${child.latestHealth.overallScore.toFixed(1)}/10` : '—', label: t.healthScore },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(232,141,42,0.08)', border: '1px solid rgba(232,141,42,0.18)', borderRadius: 12, padding: '0.85rem 0.75rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>{s.value}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.15rem', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Subject Progress */}
      {activeTab === `${child.id}-progress` && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {child.subjectScores.map(s => (
            <div key={s.subject} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', width: 78, flexShrink: 0 }}>{s.subject}</span>
              <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 100, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 100, width: `${Math.min(s.score, 100)}%`, background: s.score >= 70 ? 'linear-gradient(90deg,#22C55E,#16A34A)' : s.score >= 40 ? 'linear-gradient(90deg,#F59E0B,#D97706)' : 'linear-gradient(90deg,#EF4444,#DC2626)', transition: 'width 0.6s' }} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: s.score >= 70 ? '#22C55E' : s.score >= 40 ? '#D97706' : '#EF4444', width: 36, textAlign: 'right' }}>{s.score}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Health */}
      {activeTab === `${child.id}-health` && child.latestHealth && (
        <div style={{ padding: '0.85rem', background: RISK[child.latestHealth.riskLevel]?.bg ?? 'rgba(34,197,94,0.05)', borderRadius: 12, border: `1px solid ${RISK[child.latestHealth.riskLevel]?.text ?? '#22C55E'}22` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {[
              { label: 'Mood',  value: child.latestHealth.moodScore,  prev: child.latestHealth.moodScore + 1 },
              { label: 'Sleep', value: child.latestHealth.sleepScore, prev: child.latestHealth.sleepScore - 1 },
              { label: 'Overall', value: child.latestHealth.overallScore, prev: child.latestHealth.overallScore + 0.5 },
            ].map(h => (
              <div key={h.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff' }}>{typeof h.value === 'number' ? h.value.toFixed(h.label === 'Overall' ? 1 : 0) : h.value}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h.label}</div>
                <div style={{ fontSize: '0.65rem', color: h.value >= h.prev ? '#22C55E' : '#EF4444', fontWeight: 700, marginTop: '0.1rem' }}>
                  {h.value >= h.prev ? '↑' : '↓'} vs last week
                </div>
              </div>
            ))}
          </div>
          {child.latestHealth.wantsCounselor && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#EF4444', fontWeight: 600 }}>
              🚨 Counselor support requested
            </div>
          )}
        </div>
      )}
      {activeTab === `${child.id}-health` && !child.latestHealth && (
        <p style={{ color: '#888', textAlign: 'center', padding: '2rem 0', fontSize: '0.875rem' }}>No health survey submitted yet</p>
      )}

      {/* Tab: Activity */}
      {activeTab === `${child.id}-activity` && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {(CHILD_ACTIVITY[child.id] ?? []).map((act, i, arr) => (
            <div key={i} style={{ display: 'flex', gap: '0.85rem', paddingBottom: i < arr.length - 1 ? '0.75rem' : 0, position: 'relative' }}>
              {i < arr.length - 1 && (
                <div style={{ position: 'absolute', left: 14, top: 28, bottom: 0, width: 1, background: 'rgba(232,141,42,0.2)' }} />
              )}
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(232,141,42,0.1)', border: '2px solid rgba(232,141,42,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0, zIndex: 1 }}>
                {act.icon}
              </div>
              <div style={{ paddingTop: '0.2rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{act.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.15rem' }}>{act.time}</div>
              </div>
            </div>
          ))}
          {!(CHILD_ACTIVITY[child.id] ?? []).length && (
            <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '1.5rem 0', fontSize: '0.875rem' }}>No activity today yet</p>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────── */
export function ParentDashboardView({ profile, alerts }: Props) {
  const [lang,       setLang]       = useState<'en' | 'hi'>('en')
  const [activeTab,  setActiveTab]  = useState<string>('1-overview')
  const [fabOpen,    setFabOpen]    = useState(false)
  const [aiQ,        setAiQ]        = useState('')
  const [dismissed,  setDismissed]  = useState<Set<string>>(new Set())

  const t        = T[lang]
  const children = profile?.children ?? []
  const parentName = profile?.name ?? 'Parent'
  const mergedAlerts = (alerts ?? []).map(a => ({ id: a.id, type: 'info', title: a.title, body: a.body, read: a.read }))
  const visibleAlerts = mergedAlerts.filter(a => !dismissed.has(a.id))
  const unread  = visibleAlerts.filter(a => !a.read).length

  const alertColor = (type: string) => ({
    warning: { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  icon: '⚠️', text: '#92400E' },
    info:    { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', icon: 'ℹ️', text: '#1E40AF' },
    good:    { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.25)',  icon: '✅', text: '#14532D' },
  }[type] ?? { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', icon: 'ℹ️', text: '#1E40AF' })

  const urgencyColor = (u: string) =>
    u === 'high' ? '#EF4444' : u === 'medium' ? '#F59E0B' : '#22C55E'

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: 'linear-gradient(135deg,#0D0D1A 0%,#1B1040 50%,#0D0D1A 100%)', minHeight: '100vh', padding: '1.5rem', paddingBottom: '5rem', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            {t.greeting(parentName)}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', marginTop: '0.3rem' }}>
            {t.monitoring(children.length)}
          </p>
          {unread > 0 && (
            <div style={{ marginTop: '0.6rem', display: 'inline-block', padding: '0.4rem 0.85rem', background: 'rgba(232,141,42,0.1)', border: '1px solid rgba(232,141,42,0.25)', borderRadius: 100, fontSize: '0.8rem', color: '#C67A1E', fontWeight: 700 }}>
              {t.unread(unread)}
            </div>
          )}
        </div>

        {/* Bilingual toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(232,141,42,0.25)', borderRadius: 100, padding: '0.3rem 0.4rem' }}>
          {(['en', 'hi'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)}
              style={{ padding: '0.35rem 0.85rem', borderRadius: 100, border: 'none', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                background: lang === l ? '#E88D2A' : 'transparent',
                color: lang === l ? '#fff' : 'rgba(255,255,255,0.4)' }}>
              {l === 'en' ? 'English' : 'हिंदी'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Exam Deadline Calendar ── */}
      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '1.25rem', border: '1px solid rgba(232,141,42,0.15)', marginBottom: '1.5rem', backdropFilter: 'blur(12px)' }}>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>📅 {t.exams}</h2>
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {EXAM_DEADLINES.map((ed, i) => (
            <div key={i} style={{ flexShrink: 0, background: `${urgencyColor(ed.urgency)}10`, border: `1px solid ${urgencyColor(ed.urgency)}30`, borderRadius: 14, padding: '0.85rem 1.1rem', minWidth: 140 }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: urgencyColor(ed.urgency) }}>{ed.daysLeft}</div>
              <div style={{ fontSize: '0.65rem', color: '#888', fontWeight: 600, marginBottom: '0.3rem' }}>{t.days}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{ed.exam}</div>
              <div style={{ marginTop: '0.4rem', display: 'inline-block', padding: '0.1rem 0.45rem', borderRadius: 100, background: `${urgencyColor(ed.urgency)}18`, fontSize: '0.62rem', fontWeight: 800, color: urgencyColor(ed.urgency), textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {ed.urgency}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Alerts ── */}
      {visibleAlerts.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '1.25rem', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem', backdropFilter: 'blur(12px)' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>🔔 {t.alerts}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {visibleAlerts.map(a => {
              const ac = alertColor(a.type)
              return (
                <div key={a.id} style={{ background: ac.bg, border: `1px solid ${ac.border}`, borderRadius: 12, padding: '0.85rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{ac.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>{a.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.2rem' }}>{a.body}</div>
                  </div>
                  <button onClick={() => setDismissed(prev => new Set([...prev, a.id]))}
                    style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0, padding: '0.2rem 0.5rem', borderRadius: 6 }}>
                    {t.dismiss}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Fee Management ── */}
      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '1.25rem', border: '1px solid rgba(232,141,42,0.15)', marginBottom: '1.5rem', backdropFilter: 'blur(12px)' }}>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>💳 {t.fees}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '0.75rem' }}>
          {children.map(child => (
            <div key={child.id} style={{ background: 'rgba(232,141,42,0.05)', border: '1px solid rgba(232,141,42,0.12)', borderRadius: 12, padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{child.name}</div>
                <span style={{ padding: '0.15rem 0.55rem', borderRadius: 100, background: 'rgba(34,197,94,0.15)', color: '#4ADE80', fontSize: '0.68rem', fontWeight: 800 }}>
                  ✓ {t.active}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>Plan: <strong style={{ color: '#fff' }}>Pro — ₹499/mo</strong></div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem' }}>{t.expires}: <strong style={{ color: '#fff' }}>15 Jul 2025</strong></div>
              <button style={{ width: '100%', padding: '0.5rem', background: 'linear-gradient(135deg,#E88D2A,#F5A623)', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                {t.upgrade} →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Children Cards ── */}
      {children.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: '2.5rem', border: '1px solid rgba(232,141,42,0.2)', textAlign: 'center', backdropFilter: 'blur(12px)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👨‍👩‍👧</div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>No students linked yet</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', maxWidth: 360, margin: '0 auto' }}>
            Ask your child to share their ExamOS Student ID so you can link their account and start monitoring their progress.
          </div>
        </div>
      ) : (
        children.map(child => (
          <ChildCard key={child.id} child={child} lang={lang} t={t} activeTab={activeTab}
            setActiveTab={tab => setActiveTab(tab)} />
        ))
      )}

      {/* ── AI Se Puchein FAB ── */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 50 }}>
        {fabOpen && (
          <div style={{ position: 'absolute', bottom: '4.5rem', right: 0, width: 300, background: 'rgba(20,10,40,0.95)', borderRadius: 16, boxShadow: '0 8px 40px rgba(232,141,42,0.3)', border: '1px solid rgba(232,141,42,0.3)', padding: '1.25rem', animation: 'fadeIn 0.2s ease', backdropFilter: 'blur(20px)' }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', marginBottom: '0.75rem' }}>{t.aiTitle}</div>
            <textarea value={aiQ} onChange={e => setAiQ(e.target.value)} placeholder={t.aiPlaceholder}
              style={{ width: '100%', height: 80, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(232,141,42,0.25)', borderRadius: 10, padding: '0.6rem', fontSize: '0.85rem', color: '#fff', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            <button style={{ marginTop: '0.6rem', width: '100%', background: 'linear-gradient(135deg,#E88D2A,#F5A623)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.6rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
              {t.askBtn} →
            </button>
          </div>
        )}
        <button onClick={() => setFabOpen(o => !o)}
          style={{ width: 58, height: 58, borderRadius: '50%', background: 'linear-gradient(135deg,#E88D2A,#F5A623)', color: '#fff', border: 'none', fontSize: '1.4rem', cursor: 'pointer', boxShadow: '0 6px 24px rgba(232,141,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', transform: fabOpen ? 'rotate(45deg)' : 'none' }}>
          {fabOpen ? '✕' : '💬'}
        </button>
      </div>
    </div>
  )
}
