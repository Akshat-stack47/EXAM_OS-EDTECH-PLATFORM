'use client'
import { useState } from 'react'
import Link from 'next/link'

const NOW = Date.now()
const NOTIFS = [
  { id:1,  type:'exam',    icon:'📋', title:'UPSC CSE Prelims 2026 — Admit Card Out!',         body:'Download your admit card from upsc.gov.in before June 5, 2026.',          time: NOW - 1000*60*15,    read:false, badge:'#EF4444', tag:'Exam Alert' },
  { id:2,  type:'streak',  icon:'🔥', title:'Streak Reminder — Keep your 12-day streak alive!', body:'You haven\'t logged a study session today. Study at least 25 mins.',      time: NOW - 1000*60*60*2,  read:false, badge:'#F59E0B', tag:'Streak' },
  { id:3,  type:'result',  icon:'📊', title:'Your Mock Test Result is Ready',                   body:'UPSC Prelims GS-1 Full Mock: Score 74/200 · 68th Percentile.',           time: NOW - 1000*60*60*5,  read:false, badge:'#7C3AED', tag:'Results' },
  { id:4,  type:'plan',    icon:'📅', title:'Today\'s Study Plan Updated',                      body:'Polity: 2h, History 1.5h, Current Affairs 30min. Start now!',            time: NOW - 1000*60*60*8,  read:true,  badge:'#22C55E', tag:'Study Plan' },
  { id:5,  type:'ai',      icon:'🤖', title:'AI Insight: Focus on Geography this week',         body:'Your Geography accuracy dropped to 42% in last 3 tests. Time to review.', time: NOW - 1000*60*60*24, read:true,  badge:'#A78BFA', tag:'AI Mentor' },
  { id:6,  type:'exam',    icon:'📋', title:'SSC CGL Tier-1 Notification Released',             body:'SSC CGL 2026 official notification. Last date to apply: Aug 10, 2026.',   time: NOW - 1000*60*60*36, read:true,  badge:'#EF4444', tag:'Exam Alert' },
  { id:7,  type:'system',  icon:'🎉', title:'New Feature: Flashcards now available!',           body:'Create custom flashcard decks for spaced repetition learning.',            time: NOW - 1000*60*60*48, read:true,  badge:'#06B6D4', tag:'Product' },
  { id:8,  type:'streak',  icon:'🏆', title:'Achievement Unlocked: 10-Day Streak!',             body:'You\'ve maintained a 10-day study streak. Keep going — 30 days = Boss Mode!', time: NOW - 1000*60*60*72, read:true, badge:'#F59E0B', tag:'Achievement' },
  { id:9,  type:'plan',    icon:'📈', title:'Weekly Report: Performance Improved 15%',          body:'Your overall score improved from 58% to 67% this week. Excellent progress!', time: NOW - 1000*60*60*96, read:true, badge:'#22C55E', tag:'Weekly Report' },
  { id:10, type:'exam',    icon:'📋', title:'IBPS PO 2026 Calendar Released',                   body:'IBPS PO Prelims: Oct 2026. Mains: Nov 2026. Start your preparation now.', time: NOW - 1000*60*60*120, read:true,  badge:'#EF4444', tag:'Exam Alert' },
]

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  .notif-row { display:flex; align-items:flex-start; gap:1rem; padding:1rem 1.25rem; border-bottom:1px solid rgba(255,255,255,.05); transition:background .15s; cursor:default; }
  .notif-row:hover { background:rgba(255,255,255,.03); }
  .notif-row.unread { background:rgba(124,58,237,.06); }
  .notif-row:last-child { border-bottom:none; }
  .filter-btn { padding:.35rem .85rem; border-radius:100px; border:1px solid rgba(255,255,255,.12); background:transparent; color:rgba(255,255,255,.5); font-family:inherit; font-size:.75rem; font-weight:700; cursor:pointer; transition:all .15s; }
  .filter-btn.active { background:rgba(124,58,237,.2); border-color:rgba(124,58,237,.4); color:#A78BFA; }
  ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:3px}
`

const timeAgo = (ts: number) => {
  const d = Math.floor((Date.now() - ts) / 1000)
  if (d < 60)   return 'just now'
  if (d < 3600) return `${Math.floor(d/60)}m ago`
  if (d < 86400) return `${Math.floor(d/3600)}h ago`
  return `${Math.floor(d/86400)}d ago`
}

export default function NotificationsClient() {
  const [notifs, setNotifs] = useState(NOTIFS)
  const [filter, setFilter] = useState('all')

  const unreadCount = notifs.filter(n => !n.read).length
  const FILTERS = ['all', 'exam', 'streak', 'result', 'plan', 'ai', 'system']

  const filtered = filter === 'all' ? notifs : notifs.filter(n => n.type === filter)

  const markRead   = (id: number) => setNotifs(ns => ns.map(n => n.id === id ? {...n, read:true} : n))
  const markAllRead = () => setNotifs(ns => ns.map(n => ({...n, read:true})))
  const deleteNotif = (id: number) => setNotifs(ns => ns.filter(n => n.id !== id))
  const clearAll   = () => setNotifs([])

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:'#070B14', minHeight:'100vh', color:'#fff' }}>
      <style>{STYLE}</style>

      {/* Header */}
      <div style={{ background:'rgba(7,11,20,.98)', borderBottom:'1px solid rgba(255,255,255,.07)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:50, padding:'0 1.5rem', height:58, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <Link href="/student/dashboard" style={{ color:'rgba(255,255,255,.4)', textDecoration:'none', fontSize:'.85rem' }}>← Dashboard</Link>
          <div style={{ width:1, height:16, background:'rgba(255,255,255,.12)' }} />
          <div style={{ fontWeight:900, fontSize:'.95rem' }}>🔔 Notifications</div>
          {unreadCount > 0 && (
            <div style={{ background:'#EF4444', borderRadius:100, padding:'.15rem .55rem', fontSize:'.65rem', fontWeight:900, minWidth:20, textAlign:'center' }}>{unreadCount}</div>
          )}
        </div>
        <div style={{ display:'flex', gap:'.65rem' }}>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ background:'rgba(124,58,237,.15)', border:'1px solid rgba(124,58,237,.3)', color:'#A78BFA', borderRadius:10, padding:'.4rem .9rem', fontSize:'.78rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              ✓ Mark all read
            </button>
          )}
          <button onClick={clearAll} style={{ background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.2)', color:'#F87171', borderRadius:10, padding:'.4rem .9rem', fontSize:'.78rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
            🗑 Clear all
          </button>
        </div>
      </div>

      <div style={{ maxWidth:760, margin:'0 auto', padding:'1.5rem 1.5rem 4rem' }}>

        {/* Filter row */}
        <div style={{ display:'flex', gap:'.4rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
          {FILTERS.map(f => (
            <button key={f} className={`filter-btn${filter===f?' active':''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? `All (${notifs.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Notification list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem', color:'rgba(255,255,255,.3)', animation:'fadeUp .3s ease' }}>
            <div style={{ fontSize:'3rem', marginBottom:'.75rem' }}>🎉</div>
            <div style={{ fontWeight:800, fontSize:'1rem' }}>All caught up!</div>
            <div style={{ fontSize:'.82rem', marginTop:'.35rem' }}>No notifications to show.</div>
          </div>
        ) : (
          <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:20, overflow:'hidden', animation:'fadeUp .35s ease' }}>
            {filtered.map((n, i) => (
              <div key={n.id} className={`notif-row${!n.read?' unread':''}`} style={{ animationDelay:`${i*.04}s` }}>
                {/* Unread dot */}
                <div style={{ width:8, height:8, borderRadius:'50%', background: n.read ? 'transparent' : n.badge, flexShrink:0, marginTop:'0.35rem' }} />

                {/* Icon */}
                <div style={{ width:40, height:40, borderRadius:12, background:`${n.badge}18`, border:`1px solid ${n.badge}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>
                  {n.icon}
                </div>

                {/* Content */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'.5rem', flexWrap:'wrap' }}>
                    <div style={{ fontWeight: n.read ? 600 : 800, fontSize:'.88rem', color: n.read ? 'rgba(255,255,255,.7)' : '#fff', lineHeight:1.4 }}>
                      {n.title}
                    </div>
                    <span style={{ fontSize:'.65rem', color:'rgba(255,255,255,.25)', fontWeight:600, flexShrink:0 }}>{timeAgo(n.time)}</span>
                  </div>
                  <div style={{ fontSize:'.78rem', color:'rgba(255,255,255,.4)', marginTop:'.3rem', lineHeight:1.55 }}>{n.body}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginTop:'.5rem' }}>
                    <span style={{ fontSize:'.65rem', background:`${n.badge}18`, border:`1px solid ${n.badge}30`, color:n.badge, borderRadius:100, padding:'.15rem .55rem', fontWeight:800 }}>{n.tag}</span>
                    {!n.read && (
                      <button onClick={() => markRead(n.id)} style={{ background:'none', border:'none', color:'rgba(255,255,255,.3)', fontFamily:'inherit', fontSize:'.72rem', cursor:'pointer', textDecoration:'underline' }}>
                        Mark read
                      </button>
                    )}
                    <button onClick={() => deleteNotif(n.id)} style={{ background:'none', border:'none', color:'rgba(239,68,68,.4)', fontFamily:'inherit', fontSize:'.72rem', cursor:'pointer', marginLeft:'auto' }}>
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notification settings link */}
        <div style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'.78rem', color:'rgba(255,255,255,.3)' }}>
          Manage notification preferences in{' '}
          <Link href="/student/settings" style={{ color:'#A78BFA', textDecoration:'none', fontWeight:700 }}>Settings →</Link>
        </div>
      </div>
    </div>
  )
}
