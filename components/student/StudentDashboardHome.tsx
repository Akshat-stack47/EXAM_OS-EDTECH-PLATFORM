'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'

const STYLE = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes shimmer{ 0%{background-position:-400px 0} 100%{background-position:400px 0} }

  .tile {
    display:flex; flex-direction:column;
    background:rgba(255,255,255,0.035);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:20px; padding:1.75rem 1.5rem;
    cursor:pointer; text-decoration:none; color:#fff;
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, background 0.22s ease;
    position:relative; overflow:hidden;
    animation: fadeUp 0.4s ease both;
  }
  .tile::before {
    content:''; position:absolute; inset:0;
    background: linear-gradient(135deg, var(--tile-c1,#7C3AED22), transparent 60%);
    opacity:0; transition:opacity 0.22s;
  }
  .tile:hover { transform:translateY(-5px); box-shadow:0 16px 40px rgba(0,0,0,0.4); border-color:var(--tile-border,rgba(124,58,237,0.35)); background:rgba(255,255,255,0.055); }
  .tile:hover::before { opacity:1; }

  .stat-card {
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:16px; padding:1.25rem 1rem;
    position:relative; overflow:hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    animation: fadeUp 0.35s ease both;
  }
  .stat-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.3); }

  .mission-btn { transition:all 0.18s ease; }
  .mission-btn:hover { transform:scale(1.02); }

  .log-btn {
    background:linear-gradient(135deg,#7C3AED,#06B6D4);
    color:#fff; border:none; padding:0.65rem 1.4rem;
    border-radius:10px; font-size:0.875rem; font-weight:700;
    cursor:pointer; transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    box-shadow:0 4px 16px rgba(124,58,237,0.3);
  }
  .log-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 24px rgba(124,58,237,0.45); }
  .log-btn:disabled { opacity:0.55; cursor:not-allowed; }
`

const TILES = [
  {
    icon: '📄',
    title: 'PYQ Browser',
    desc: 'Solve previous year questions with explanations & AI help',
    stat: 'Practice Now',
    href: '/student/pyq',
    accent: '#F59E0B',
    c1: '#F59E0B33',
    border: 'rgba(245,158,11,0.4)',
    delay: '0s',
  },
  {
    icon: '🎓',
    title: 'Exam Hub',
    desc: 'Eligibility, syllabus, vacancies & key dates for all exams',
    stat: 'Explore Exams',
    href: '/student/exam-hub',
    accent: '#06B6D4',
    c1: '#06B6D433',
    border: 'rgba(6,182,212,0.4)',
    delay: '0.02s',
  },
  {
    icon: '🧠',
    title: 'AI Mentor',
    desc: 'Ask anything — get instant, exam-focused explanations',
    stat: 'Powered by AI',
    href: '/student/ai-chat',
    accent: '#7C3AED',
    c1: '#7C3AED33',
    border: 'rgba(124,58,237,0.4)',
    delay: '0.05s',
  },
  {
    icon: '📊',
    title: 'Mock Tests',
    desc: 'Track scores, percentile trends and performance analytics',
    stat: 'View History',
    href: '/student/mock-tests',
    accent: '#06B6D4',
    c1: '#06B6D433',
    border: 'rgba(6,182,212,0.4)',
    delay: '0.1s',
  },
  {
    icon: '🖊️',
    title: 'Whiteboard',
    desc: 'Collaborative drawing sessions for visual note-taking',
    stat: 'Draw & Plan',
    href: '/student/whiteboard',
    accent: '#A78BFA',
    c1: '#A78BFA33',
    border: 'rgba(167,139,250,0.4)',
    delay: '0.15s',
  },
  {
    icon: '💚',
    title: 'Health & Wellness',
    desc: 'Weekly check-ins to track mood, sleep and burnout risk',
    stat: 'Submit Survey',
    href: '/student/health',
    accent: '#22C55E',
    c1: '#22C55E33',
    border: 'rgba(34,197,94,0.4)',
    delay: '0.2s',
  },
  {
    icon: '📰',
    title: 'Current Affairs',
    desc: 'AI-curated daily news relevant to your exam syllabus',
    stat: 'Stay Updated',
    href: '/student/current-affairs',
    accent: '#F59E0B',
    c1: '#F59E0B33',
    border: 'rgba(245,158,11,0.4)',
    delay: '0.25s',
  },
  {
    icon: '📚',
    title: 'Syllabus Tracker',
    desc: 'Monitor coverage across all subjects and topics',
    stat: 'Track Progress',
    href: '/student/syllabus',
    accent: '#06B6D4',
    c1: '#06B6D433',
    border: 'rgba(6,182,212,0.4)',
    delay: '0.3s',
  },
  {
    icon: '⏱️',
    title: 'Study Timer',
    desc: 'Pomodoro timer to maximise focus and track sessions',
    stat: 'Start Focus',
    href: '/student/timer',
    accent: '#EF4444',
    c1: '#EF444433',
    border: 'rgba(239,68,68,0.4)',
    delay: '0.35s',
  },
  {
    icon: '🎯',
    title: 'Weakness Radar',
    desc: 'Radar chart showing your strong and weak subjects',
    stat: 'Analyse Gaps',
    href: '/student/mock-tests',
    accent: '#E879F9',
    c1: '#E879F933',
    border: 'rgba(232,121,249,0.4)',
    delay: '0.4s',
  },
  {
    icon: '▶️',
    title: 'Video Lectures',
    desc: 'Subject-wise YouTube playlists curated for your target exam',
    stat: 'Watch Now',
    href: '/student/video-lectures',
    accent: '#FF4444',
    c1: '#FF444433',
    border: 'rgba(255,68,68,0.4)',
    delay: '0.45s',
  },
  {
    icon: '🏆',
    title: 'Leaderboard',
    desc: 'Your national rank among all aspirants for your target exam',
    stat: 'View Rankings',
    href: '/student/leaderboard',
    accent: '#FFD700',
    c1: '#FFD70033',
    border: 'rgba(255,215,0,0.4)',
    delay: '0.5s',
  },
  {
    icon: '⚡',
    title: 'Upgrade Plan',
    desc: 'Unlock unlimited mocks, PYQs, AI mentor & teacher access',
    stat: 'View Plans',
    href: '/student/subscription',
    accent: '#A78BFA',
    c1: '#A78BFA33',
    border: 'rgba(167,139,250,0.4)',
    delay: '0.55s',
  },
  {
    icon: '⚙️',
    title: 'Settings',
    desc: 'Profile, notifications, privacy & account management',
    stat: 'Manage Profile',
    href: '/student/settings',
    accent: '#94A3B8',
    c1: '#94A3B833',
    border: 'rgba(148,163,184,0.3)',
    delay: '0.6s',
  },
  {
    icon: '🃏',
    title: 'Flashcards',
    desc: 'Spaced repetition decks for Polity, History, Geography & more',
    stat: 'Study Cards',
    href: '/student/flashcards',
    accent: '#F97316',
    c1: '#F9731633',
    border: 'rgba(249,115,22,0.4)',
    delay: '0.62s',
  },
  {
    icon: '📅',
    title: 'Exam Calendar',
    desc: 'Important exam dates, deadlines, admit cards & results',
    stat: 'View Dates',
    href: '/student/calendar',
    accent: '#06B6D4',
    c1: '#06B6D433',
    border: 'rgba(6,182,212,0.4)',
    delay: '0.64s',
  },
  {
    icon: '🔔',
    title: 'Notifications',
    desc: 'Exam alerts, streak reminders, results & study plan updates',
    stat: 'View All',
    href: '/student/notifications',
    accent: '#EF4444',
    c1: '#EF444433',
    border: 'rgba(239,68,68,0.35)',
    delay: '0.66s',
  },
]

const INITIAL_MISSIONS = [
  { id: 1, label: 'Take a mock test', xp: 50 },
  { id: 2, label: 'Study for 2 hours', xp: 100 },
  { id: 3, label: 'Review 1 weak topic', xp: 75 },
]

export function StudentDashboardHome({ data }: { data: any }) {
  const [missions, setMissions] = useState(INITIAL_MISSIONS.map(m => ({ ...m, done: false })))
  const [toast, setToast] = useState<string | null>(null)

  const logSession = trpc.student.logSession.useMutation()
  const utils = trpc.useUtils()

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleLogSession = async () => {
    try {
      await logSession.mutateAsync({ durationMinutes: 25 })
      showToast('✅ 25 min study session logged!')
      utils.student.getDashboard.invalidate()
    } catch (e: any) {
      showToast('❌ ' + (e?.message || 'Failed to log session'))
    }
  }

  const profile = data?.profile ?? {}
  const streak = profile.streak ?? 0
  const totalXP = profile.xpPoints ?? 0
  const level = Math.max(1, Math.floor(totalXP / 250))
  const nextLvlXP = (level + 1) * 250
  const missionsDone = missions.filter(m => m.done).length
  const isBoss = streak >= 30
  const name = profile.name ?? 'Aspirant'
  const exam = profile.targetExam ?? 'UPSC'

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: '#0D0D1A', minHeight: '100vh', color: '#fff' }}>
      <style>{STYLE}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'rgba(20,30,50,0.97)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: 14, padding: '0.9rem 1.5rem', fontWeight: 700, fontSize: '0.9rem', zIndex: 9999, boxShadow: '0 8px 32px rgba(0,0,0,0.6)', backdropFilter: 'blur(16px)', animation: 'fadeUp 0.2s ease' }}>
          {toast}
        </div>
      )}

      {/* ── Top Nav Bar ── */}
      <div style={{ background: 'rgba(13,13,26,0.9)', borderBottom: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100, padding: '0 2rem' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, boxShadow: '0 0 18px rgba(124,58,237,0.4)' }}>⚡</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Exam<span style={{ color: '#A78BFA' }}>OS</span></span>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isBoss && (
              <div style={{ background: 'linear-gradient(135deg,#F59E0B,#DC2626)', padding: '0.3rem 0.75rem', borderRadius: 100, fontSize: '0.75rem', fontWeight: 800 }}>🔥 BOSS MODE</div>
            )}
            <button className="log-btn" onClick={handleLogSession} disabled={logSession.isPending}>
              {logSession.isPending ? '⏳ Logging…' : '+ Log 25min Study'}
            </button>
            <a href="/student/settings" title="Settings" style={{ display:'flex', alignItems:'center', justifyContent:'center', width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', fontSize:'.95rem', textDecoration:'none', transition:'all .2s' }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.12)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.06)'}}>
              ⚙️
            </a>
            <a href="/student/settings" style={{ textDecoration:'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, boxShadow: '0 0 12px rgba(124,58,237,0.35)', cursor:'pointer' }}>
                {name.charAt(0).toUpperCase()}
              </div>
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '2rem 2rem 4rem' }}>

        {/* ── Welcome Header ── */}
        <div style={{ marginBottom: '2.5rem', animation: 'fadeUp 0.4s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
              {greeting()},{' '}
              <span style={{ background: 'linear-gradient(90deg,#A78BFA,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {name}
              </span>
              ! 👋
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', margin: 0 }}>
            {exam} Aspirant · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* ── Onboarding Banner (shows if not personalised) ── */}
        {!profile.onboardingDone && (
          <div style={{ marginBottom:'1.75rem', background:'linear-gradient(135deg,rgba(124,58,237,.18),rgba(6,182,212,.12))', border:'1px solid rgba(124,58,237,.35)', borderRadius:18, padding:'1.25rem 1.5rem', display:'flex', alignItems:'center', gap:'1.25rem', flexWrap:'wrap', animation:'fadeUp .4s ease' }}>
            <div style={{ fontSize:'2rem', flexShrink:0 }}>🎯</div>
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ fontWeight:800, fontSize:'.95rem', marginBottom:'.25rem' }}>Complete your profile setup — takes 2 minutes!</div>
              <div style={{ fontSize:'.8rem', color:'rgba(255,255,255,.5)', lineHeight:1.5 }}>
                Tell us your target exam, category &amp; study hours so we can personalise your mock tests, PYQs and study plan.
              </div>
            </div>
            <a href="/onboarding" style={{ textDecoration:'none', flexShrink:0 }}>
              <button style={{ background:'linear-gradient(135deg,#7C3AED,#06B6D4)', color:'#fff', border:'none', borderRadius:12, padding:'.7rem 1.35rem', fontFamily:"'Inter',system-ui,sans-serif", fontWeight:800, fontSize:'.88rem', cursor:'pointer', whiteSpace:'nowrap', boxShadow:'0 0 24px rgba(124,58,237,.4)' }}>
                ⚡ Set Up Profile →
              </button>
            </a>
          </div>
        )}

        {/* ── Stats Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          {[
            { value: `${streak}🔥`, label: 'Day Streak', sub: 'Keep it up!', accent: '#F59E0B', delay: '0.05s' },
            { value: `#${profile.nationalRank ?? '—'}`, label: 'National Rank', sub: 'Among all aspirants', accent: '#7C3AED', delay: '0.1s' },
            { value: `${Math.floor((profile.totalStudyMins ?? 0) / 60)}h`, label: 'Total Study', sub: `${(profile.totalStudyMins ?? 0) % 60}m lifetime`, accent: '#22C55E', delay: '0.15s' },
            { value: `${profile.todayMinutes ?? 0}m`, label: 'Today', sub: 'Goal: 480 min', accent: '#06B6D4', delay: '0.2s' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ animationDelay: s.delay }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${s.accent},#06B6D4)` }} />
              <div style={{ fontSize: '1.85rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem', fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: '0.68rem', color: s.accent, marginTop: '0.1rem' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── XP Bar + Daily Missions ── */}
        <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.22)', borderRadius: 20, padding: '1.5rem', marginBottom: '2.5rem', animation: 'fadeUp 0.4s 0.2s ease both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', borderRadius: 8, padding: '0.3rem 0.75rem', fontSize: '0.8rem', fontWeight: 800 }}>LVL {level}</div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{totalXP.toLocaleString()} XP</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{Math.max(0, nextLvlXP - totalXP).toLocaleString()} XP to Level {level + 1}</div>
              </div>
            </div>
            <span style={{ fontSize: '0.8rem', color: missionsDone === missions.length ? '#22C55E' : 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
              {missionsDone === missions.length ? '✅ All missions done!' : `${missionsDone}/${missions.length} daily missions`}
            </span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 100, overflow: 'hidden', marginBottom: '1.1rem' }}>
            <div style={{ height: '100%', width: `${Math.min((totalXP / nextLvlXP) * 100, 100)}%`, background: 'linear-gradient(90deg,#7C3AED,#06B6D4)', borderRadius: 100, transition: 'width 1s ease' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '0.6rem' }}>
            {missions.map(m => (
              <button key={m.id} className="mission-btn"
                onClick={() => setMissions(prev => prev.map(x => x.id === m.id ? { ...x, done: !x.done } : x))}
                style={{ background: m.done ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${m.done ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '0.65rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: m.done ? '#22C55E' : 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>{m.done ? '✅' : '⬜'} {m.label}</span>
                <span style={{ background: 'rgba(124,58,237,0.25)', borderRadius: 100, padding: '0.1rem 0.5rem', fontSize: '0.7rem', color: '#A78BFA', fontWeight: 800 }}>+{m.xp} XP</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Section Title ── */}
        <div style={{ marginBottom: '1.25rem', animation: 'fadeUp 0.4s 0.25s ease both' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
            Your Dashboard Sections
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', margin: '0.25rem 0 0' }}>
            Click any section to open it
          </p>
        </div>

        {/* ── Feature Tiles Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.1rem' }}>
          {TILES.map(tile => (
            <Link
              key={tile.href + tile.title}
              href={tile.href}
              className="tile"
              style={{ ['--tile-c1' as any]: tile.c1, ['--tile-border' as any]: tile.border, animationDelay: tile.delay }}
            >
              {/* Top accent line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${tile.accent},transparent)` }} />

              <div style={{ fontSize: '2.25rem', marginBottom: '0.85rem' }}>{tile.icon}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.01em' }}>{tile.title}</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, flex: 1, marginBottom: '1.1rem' }}>{tile.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: tile.accent, fontWeight: 700, background: `${tile.accent}18`, padding: '0.2rem 0.6rem', borderRadius: 100, border: `1px solid ${tile.accent}33` }}>
                  {tile.stat}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '1.1rem' }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
