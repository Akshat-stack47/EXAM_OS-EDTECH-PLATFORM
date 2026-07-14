'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

/* ─── Exam Events Data ─────────────────────────── */
const EVENTS = [
  // July 2026
  { id:1,  date:'2026-07-15', exam:'UPSC CSE',  title:'UPSC Prelims 2026 — Notification Expected', type:'notification', color:'#7C3AED', icon:'📋', important:true,  desc:'Expected notification for UPSC Civil Services Examination 2026. Apply online at upsc.gov.in.' },
  { id:2,  date:'2026-07-20', exam:'SSC',        title:'SSC CGL 2026 Tier-1 Registration Opens',    type:'registration', color:'#0EA5E9', icon:'✏️', important:true,  desc:'Online applications for SSC CGL Tier-1 2026 open. Last date: August 10, 2026.' },
  { id:3,  date:'2026-07-25', exam:'BANK',       title:'IBPS PO 2026 Official Notification',        type:'notification', color:'#22C55E', icon:'📋', important:true,  desc:'Institute of Banking Personnel Selection releases PO 2026 recruitment notification.' },
  { id:4,  date:'2026-07-28', exam:'NDA',        title:'NDA II 2026 Registration Begins',           type:'registration', color:'#F59E0B', icon:'✏️', important:false, desc:'UPSC NDA & NA Examination II 2026 registration opens for defence aspirants.' },
  // August 2026
  { id:5,  date:'2026-08-03', exam:'SSC',        title:'SSC CGL Tier-1 Registration Closes',        type:'deadline',     color:'#EF4444', icon:'⏰', important:true,  desc:'Last date to apply for SSC CGL 2026 Tier-1. Fees must be paid before midnight.' },
  { id:6,  date:'2026-08-10', exam:'RAIL',       title:'RRB NTPC 2026 Notification Released',       type:'notification', color:'#F97316', icon:'📋', important:true,  desc:'Railway Recruitment Board releases NTPC 2026 notification with vacancy details.' },
  { id:7,  date:'2026-08-15', exam:'UPSC CSE',   title:'UPSC Prelims — Last Date to Apply',         type:'deadline',     color:'#EF4444', icon:'⏰', important:true,  desc:'Independence Day — last date to apply for UPSC Prelims 2026. Apply before 6PM.' },
  { id:8,  date:'2026-08-22', exam:'BANK',       title:'IBPS PO 2026 Registration Closes',          type:'deadline',     color:'#EF4444', icon:'⏰', important:false, desc:'Last date to submit IBPS PO 2026 online application and pay registration fee.' },
  { id:9,  date:'2026-08-30', exam:'SSC',        title:'SSC CGL Tier-1 Admit Card Released',        type:'admit-card',   color:'#06B6D4', icon:'🪪', important:true,  desc:'SSC CGL Tier-1 2026 admit card available on ssc.gov.in. Download immediately.' },
  // September 2026
  { id:10, date:'2026-09-05', exam:'UPSC CSE',   title:'UPSC Prelims 2026 — EXAM DAY 🎯',           type:'exam',         color:'#7C3AED', icon:'🎯', important:true,  desc:'UPSC Civil Services Preliminary Examination 2026. GS Paper-I (10AM-12PM), GS Paper-II (2PM-4PM).' },
  { id:11, date:'2026-09-10', exam:'SSC',        title:'SSC CGL Tier-1 Exam Begins',                type:'exam',         color:'#0EA5E9', icon:'🎯', important:true,  desc:'SSC CGL Tier-1 Computer Based Test begins. Multiple shifts over 10 days.' },
  { id:12, date:'2026-09-15', exam:'NDA',        title:'NDA II 2026 — EXAM DAY',                    type:'exam',         color:'#F59E0B', icon:'🎯', important:false, desc:'NDA & NA Examination II 2026. Mathematics (10AM-12:30PM), GAT (2PM-4:30PM).' },
  { id:13, date:'2026-09-20', exam:'BANK',       title:'IBPS PO Prelims 2026 Begins',               type:'exam',         color:'#22C55E', icon:'🎯', important:true,  desc:'IBPS PO Prelims 2026 begins across multiple centres nationwide.' },
  { id:14, date:'2026-09-28', exam:'RAIL',       title:'RRB NTPC CBT-1 2026 Begins',                type:'exam',         color:'#F97316', icon:'🎯', important:false, desc:'RRB NTPC Computer Based Test Stage 1 commences across all railway zones.' },
  // October 2026
  { id:15, date:'2026-10-05', exam:'UPSC CSE',   title:'UPSC Prelims 2026 Result Expected',         type:'result',       color:'#A78BFA', icon:'📊', important:true,  desc:'Expected date for UPSC Prelims 2026 result declaration on upsc.gov.in.' },
  { id:16, date:'2026-10-15', exam:'BANK',       title:'IBPS PO Mains 2026',                        type:'exam',         color:'#22C55E', icon:'🎯', important:true,  desc:'IBPS PO Main Examination 2026. Reasoning, English, Data Analysis, General Economy.' },
  { id:17, date:'2026-10-20', exam:'SSC',        title:'SSC CGL Tier-1 Result Expected',            type:'result',       color:'#06B6D4', icon:'📊', important:false, desc:'Expected declaration of SSC CGL Tier-1 2026 result and Tier-2 schedule.' },
  { id:18, date:'2026-10-25', exam:'UPSC CSE',   title:'UPSC Mains 2026 — Registration Closes',     type:'deadline',     color:'#EF4444', icon:'⏰', important:true,  desc:'Last date to fill DAF (Detailed Application Form) for UPSC Mains 2026.' },
  // November 2026
  { id:19, date:'2026-11-01', exam:'UPSC CSE',   title:'UPSC Mains 2026 — EXAM BEGINS 🏆',          type:'exam',         color:'#7C3AED', icon:'🏆', important:true,  desc:'UPSC Civil Services Mains 2026 begins. GS Paper-I first. Continues over 5 days.' },
  { id:20, date:'2026-11-10', exam:'BANK',       title:'IBPS Clerk Prelims 2026',                   type:'exam',         color:'#22C55E', icon:'🎯', important:false, desc:'IBPS Clerk Preliminary Examination 2026. English, Reasoning, Numerical Ability.' },
  { id:21, date:'2026-11-20', exam:'SSC',        title:'SSC CHSL Tier-1 Exam Begins',               type:'exam',         color:'#0EA5E9', icon:'🎯', important:false, desc:'SSC Combined Higher Secondary Level Tier-1 Computer Based Test begins.' },
  // December 2026
  { id:22, date:'2026-12-05', exam:'UPSC CSE',   title:'UPSC Mains 2026 Result Expected',           type:'result',       color:'#A78BFA', icon:'📊', important:true,  desc:'Expected release of UPSC Mains 2026 result with marks and interview call letters.' },
  { id:23, date:'2026-12-15', exam:'BANK',       title:'IBPS PO Final Result',                      type:'result',       color:'#22C55E', icon:'📊', important:false, desc:'IBPS PO 2026 final selection list released after PO Mains and interview.' },
]

const EXAM_TYPES = ['All', 'UPSC CSE', 'SSC', 'BANK', 'RAIL', 'NDA']
const TYPE_COLORS: Record<string, string> = { exam:'#7C3AED', notification:'#0EA5E9', registration:'#22C55E', deadline:'#EF4444', 'admit-card':'#06B6D4', result:'#A78BFA' }
const EXAM_COLORS: Record<string, string> = { 'UPSC CSE':'#7C3AED', SSC:'#0EA5E9', BANK:'#22C55E', RAIL:'#F97316', NDA:'#F59E0B' }

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideIn { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
  .event-row { padding:.85rem 1.1rem; border-bottom:1px solid rgba(255,255,255,.05); transition:background .15s; cursor:pointer; display:flex; align-items:flex-start; gap:.85rem; }
  .event-row:hover { background:rgba(255,255,255,.03); }
  .event-row:last-child { border-bottom:none; }
  .filter-btn { padding:.3rem .8rem; border-radius:100px; border:1px solid rgba(255,255,255,.12); background:transparent; color:rgba(255,255,255,.5); font-family:inherit; font-size:.72rem; font-weight:800; cursor:pointer; transition:all .15s; }
  .filter-btn.active { background:rgba(124,58,237,.2); border-color:rgba(124,58,237,.4); color:#A78BFA; }
  .cal-day { width:36px; height:36px; display:flex; align-items:center; justify-content:center; border-radius:10px; font-size:.78rem; font-weight:700; cursor:pointer; transition:all .15s; border:1px solid transparent; }
  .cal-day:hover { background:rgba(255,255,255,.06); }
  .cal-day.has-event { border-color:rgba(124,58,237,.3); }
  .cal-day.today { background:rgba(124,58,237,.25); border-color:#7C3AED; color:#A78BFA; font-weight:900; }
  .cal-day.selected { background:#7C3AED; border-color:#7C3AED; color:#fff; }
  ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:3px}
`

const today = new Date()
const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function firstDayOf(y: number, m: number)  { return new Date(y, m, 1).getDay() }
function dStr(y: number, m: number, d: number) { return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}` }
function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - new Date(todayStr).getTime()
  const d = Math.ceil(diff / 86400000)
  if (d === 0) return 'Today!'
  if (d === 1) return 'Tomorrow'
  if (d < 0)  return `${Math.abs(d)}d ago`
  return `in ${d} days`
}

export default function ExamCalendarClient() {
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [examFilter, setExamFilter] = useState('All')
  const [selDate,   setSelDate]   = useState<string | null>(null)
  const [selEvent,  setSelEvent]  = useState<typeof EVENTS[number] | null>(null)

  const filteredEvents = useMemo(() => examFilter === 'All' ? EVENTS : EVENTS.filter(e => e.exam === examFilter), [examFilter])

  const eventsForDate = (d: string) => filteredEvents.filter(e => e.date === d)
  const eventsThisMonth = filteredEvents.filter(e => e.date.startsWith(`${viewYear}-${String(viewMonth+1).padStart(2,'0')}`))
  const upcomingEvents  = filteredEvents.filter(e => e.date >= todayStr).slice(0, 8)

  const prevMonth = () => { if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11) } else setViewMonth(m => m-1) }
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0) } else setViewMonth(m => m+1) }

  const days = daysInMonth(viewYear, viewMonth)
  const firstDay = firstDayOf(viewYear, viewMonth)

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:'#070B14', minHeight:'100vh', color:'#fff' }}>
      <style>{STYLE}</style>

      {/* Header */}
      <div style={{ background:'rgba(7,11,20,.98)', borderBottom:'1px solid rgba(255,255,255,.07)', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(20px)', padding:'0 1.5rem', height:58, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <Link href="/student/dashboard" style={{ color:'rgba(255,255,255,.4)', textDecoration:'none', fontSize:'.85rem' }}>← Dashboard</Link>
          <div style={{ width:1, height:16, background:'rgba(255,255,255,.12)' }} />
          <div style={{ fontWeight:900, fontSize:'.95rem' }}>📅 Exam Calendar 2026</div>
        </div>
        <div style={{ display:'flex', gap:'.4rem', flexWrap:'wrap' }}>
          {EXAM_TYPES.map(t => (
            <button key={t} className={`filter-btn${examFilter===t?' active':''}`} onClick={() => setExamFilter(t)}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'1.5rem 1.5rem 4rem', display:'grid', gridTemplateColumns:'1fr 340px', gap:'1.5rem', alignItems:'start' }}>

        {/* ── LEFT: Calendar + Month Events ── */}
        <div>
          {/* Calendar header */}
          <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:20, padding:'1.25rem', marginBottom:'1.25rem', animation:'fadeUp .4s ease' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.1rem' }}>
              <button onClick={prevMonth} style={{ background:'rgba(255,255,255,.08)', border:'none', color:'#fff', borderRadius:10, width:34, height:34, cursor:'pointer', fontSize:'1rem', fontFamily:'inherit' }}>‹</button>
              <div style={{ fontWeight:900, fontSize:'1.1rem' }}>{MONTHS[viewMonth]} {viewYear}</div>
              <button onClick={nextMonth} style={{ background:'rgba(255,255,255,.08)', border:'none', color:'#fff', borderRadius:10, width:34, height:34, cursor:'pointer', fontSize:'1rem', fontFamily:'inherit' }}>›</button>
            </div>

            {/* Day headers */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'.3rem', marginBottom:'.4rem' }}>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} style={{ textAlign:'center', fontSize:'.65rem', fontWeight:800, color:'rgba(255,255,255,.25)', letterSpacing:'.06em', padding:'.35rem 0' }}>{d}</div>
              ))}
            </div>

            {/* Day grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'.3rem' }}>
              {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: days }, (_, i) => {
                const d = i + 1
                const ds = dStr(viewYear, viewMonth, d)
                const dayEvents = eventsForDate(ds)
                const isToday   = ds === todayStr
                const isSel     = ds === selDate
                const hasEvent  = dayEvents.length > 0
                return (
                  <div key={d} className={`cal-day${hasEvent?' has-event':''}${isToday?' today':''}${isSel?' selected':''}`}
                    onClick={() => { setSelDate(isSel ? null : ds); setSelEvent(null) }}
                    style={{ flexDirection:'column', gap:'2px', height:44, position:'relative' }}>
                    <span>{d}</span>
                    {hasEvent && (
                      <div style={{ display:'flex', gap:'2px' }}>
                        {dayEvents.slice(0,3).map(e => (
                          <div key={e.id} style={{ width:4, height:4, borderRadius:'50%', background:e.color }} />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'.65rem', marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid rgba(255,255,255,.06)' }}>
              {Object.entries(TYPE_COLORS).map(([t, c]) => (
                <div key={t} style={{ display:'flex', alignItems:'center', gap:'.3rem', fontSize:'.65rem', color:'rgba(255,255,255,.4)', fontWeight:700 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:c }} />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </div>
              ))}
            </div>
          </div>

          {/* Selected day events */}
          {selDate && eventsForDate(selDate).length > 0 && (
            <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:18, padding:'1.1rem', marginBottom:'1.25rem', animation:'slideIn .3s ease' }}>
              <div style={{ fontWeight:800, fontSize:'.85rem', marginBottom:'.75rem', color:'rgba(255,255,255,.7)' }}>
                📅 {new Date(selDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}
              </div>
              {eventsForDate(selDate).map(e => (
                <div key={e.id} onClick={() => setSelEvent(e)} className="event-row" style={{ borderRadius:12, marginBottom:'.4rem', cursor:'pointer', background:selEvent?.id===e.id?`${e.color}12`:'transparent' }}>
                  <span style={{ fontSize:'1.1rem' }}>{e.icon}</span>
                  <div>
                    <div style={{ fontWeight:800, fontSize:'.85rem' }}>{e.title}</div>
                    <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.4)', marginTop:'.2rem' }}>{e.exam} · {e.type}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* This month events list */}
          <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:18, overflow:'hidden', animation:'fadeUp .4s .05s ease both' }}>
            <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid rgba(255,255,255,.07)', fontWeight:900, fontSize:'.88rem' }}>
              Events in {MONTHS[viewMonth]} {viewYear}
              <span style={{ marginLeft:'.5rem', fontSize:'.72rem', color:'rgba(255,255,255,.35)', fontWeight:700 }}>({eventsThisMonth.length} events)</span>
            </div>
            {eventsThisMonth.length === 0 ? (
              <div style={{ padding:'2rem', textAlign:'center', color:'rgba(255,255,255,.25)', fontSize:'.85rem' }}>No events this month for selected filter.</div>
            ) : eventsThisMonth.map(e => (
              <div key={e.id} className="event-row" onClick={() => { setSelEvent(e); setSelDate(e.date) }}>
                <div style={{ width:38, height:38, borderRadius:10, background:`${e.color}15`, border:`1px solid ${e.color}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>{e.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:'.85rem', marginBottom:'.15rem' }}>{e.title}</div>
                  <div style={{ display:'flex', gap:'.65rem', fontSize:'.7rem', color:'rgba(255,255,255,.35)', flexWrap:'wrap' }}>
                    <span style={{ color:EXAM_COLORS[e.exam] ?? '#9CA3AF', fontWeight:800 }}>{e.exam}</span>
                    <span>{new Date(e.date+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
                    <span style={{ color: e.date >= todayStr ? '#4ADE80' : '#F87171', fontWeight:700 }}>{daysUntil(e.date)}</span>
                  </div>
                </div>
                {e.important && <div style={{ width:8, height:8, borderRadius:'50%', background:'#EF4444', flexShrink:0, marginTop:4 }} title="Important" />}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Upcoming + Event Detail ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

          {/* Event detail panel */}
          {selEvent && (
            <div style={{ background:`${selEvent.color}10`, border:`1px solid ${selEvent.color}30`, borderRadius:18, padding:'1.25rem', animation:'slideIn .3s ease' }}>
              <div style={{ fontSize:'2rem', marginBottom:'.6rem' }}>{selEvent.icon}</div>
              <div style={{ fontWeight:900, fontSize:'.95rem', marginBottom:'.3rem', lineHeight:1.4 }}>{selEvent.title}</div>
              <div style={{ display:'flex', gap:'.5rem', marginBottom:'.85rem', flexWrap:'wrap' }}>
                <span style={{ fontSize:'.65rem', fontWeight:800, background:`${selEvent.color}20`, color:selEvent.color, border:`1px solid ${selEvent.color}40`, borderRadius:100, padding:'.15rem .55rem' }}>{selEvent.exam}</span>
                <span style={{ fontSize:'.65rem', fontWeight:800, background:'rgba(255,255,255,.07)', color:'rgba(255,255,255,.5)', border:'1px solid rgba(255,255,255,.1)', borderRadius:100, padding:'.15rem .55rem' }}>{selEvent.type}</span>
              </div>
              <p style={{ fontSize:'.82rem', color:'rgba(255,255,255,.6)', lineHeight:1.7, marginBottom:'.85rem' }}>{selEvent.desc}</p>
              <div style={{ fontSize:'.78rem', fontWeight:800, color: selEvent.date >= todayStr ? '#4ADE80' : '#F87171' }}>
                🕐 {new Date(selEvent.date+'T00:00:00').toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})} · {daysUntil(selEvent.date)}
              </div>
            </div>
          )}

          {/* Upcoming events */}
          <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:18, overflow:'hidden', animation:'fadeUp .4s .1s ease both' }}>
            <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid rgba(255,255,255,.07)', fontWeight:900, fontSize:'.88rem' }}>📌 Upcoming Events</div>
            {upcomingEvents.map(e => (
              <div key={e.id} className="event-row" onClick={() => { setSelEvent(e); setSelDate(e.date) }}>
                <div style={{ width:36, height:36, borderRadius:10, background:`${e.color}15`, border:`1px solid ${e.color}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.95rem', flexShrink:0 }}>{e.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:'.8rem', marginBottom:'.1rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{e.title}</div>
                  <div style={{ display:'flex', gap:'.5rem', fontSize:'.68rem' }}>
                    <span style={{ color:EXAM_COLORS[e.exam] ?? '#9CA3AF', fontWeight:800 }}>{e.exam}</span>
                    <span style={{ color:'rgba(255,255,255,.35)' }}>{new Date(e.date+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
                  </div>
                </div>
                <div style={{ fontSize:'.68rem', fontWeight:800, color: e.date === todayStr ? '#F87171' : '#4ADE80', flexShrink:0, textAlign:'right' }}>{daysUntil(e.date)}</div>
              </div>
            ))}
          </div>

          {/* Countdown to nearest important exam */}
          {(() => {
            const next = filteredEvents.find(e => e.date >= todayStr && e.type === 'exam' && e.important)
            if (!next) return null
            const days = Math.ceil((new Date(next.date).getTime() - new Date(todayStr).getTime()) / 86400000)
            return (
              <div style={{ background:'linear-gradient(135deg,rgba(124,58,237,.2),rgba(6,182,212,.1))', border:'1px solid rgba(124,58,237,.35)', borderRadius:18, padding:'1.25rem', textAlign:'center', animation:'fadeUp .4s .15s ease both' }}>
                <div style={{ fontSize:'.7rem', fontWeight:800, color:'rgba(255,255,255,.4)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.5rem' }}>Next Major Exam</div>
                <div style={{ fontWeight:900, fontSize:'2.5rem', background:'linear-gradient(135deg,#A78BFA,#38BDF8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1 }}>{days}</div>
                <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.5)', marginTop:'.25rem' }}>days away</div>
                <div style={{ fontSize:'.82rem', fontWeight:700, color:'#fff', marginTop:'.65rem', lineHeight:1.4 }}>{next.title}</div>
              </div>
            )
          })()}
        </div>

      </div>
    </div>
  )
}
