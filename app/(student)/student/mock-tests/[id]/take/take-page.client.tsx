'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'

/* ─── Sample Questions Bank ─────────────────────────────────────── */
const QUESTIONS: Record<string, any[]> = {
  default: [
    { id:1,  subject:'Polity',          topic:'Fundamental Rights',        q:'Which Article of the Indian Constitution guarantees the Right to Equality?', opts:['Article 12','Article 14','Article 19','Article 21'], correct:1, explanation:'Article 14 guarantees equality before law and equal protection of laws within India.' },
    { id:2,  subject:'History',         topic:'Freedom Movement',          q:'The Dandi March was launched in which year?', opts:['1929','1930','1931','1932'], correct:1, explanation:'Mahatma Gandhi launched the Salt March (Dandi March) on March 12, 1930 from Sabarmati Ashram.' },
    { id:3,  subject:'Geography',       topic:'Physical Geography',        q:'Which river forms the Sivasamudram falls?', opts:['Krishna','Cauvery','Godavari','Tungabhadra'], correct:1, explanation:'The Cauvery river forms Sivasamudram waterfalls in Karnataka, famous for India\'s first hydro-electric project.' },
    { id:4,  subject:'Economics',       topic:'Indian Economy',            q:'NITI Aayog replaced which body in 2015?', opts:['Finance Commission','Planning Commission','CCI','RBI'],  correct:1, explanation:'NITI Aayog (National Institution for Transforming India) replaced the Planning Commission on January 1, 2015.' },
    { id:5,  subject:'Polity',          topic:'Parliament',                q:'The Rajya Sabha is a:',  opts:['Temporary House','Permanent House','Joint House','Advisory House'], correct:1, explanation:'Rajya Sabha is a permanent house of Parliament — it is never dissolved as a whole, only 1/3rd members retire every 2 years.' },
    { id:6,  subject:'Science',         topic:'Biology',                   q:'Which organ produces insulin in the human body?', opts:['Liver','Kidney','Pancreas','Spleen'], correct:2, explanation:'The pancreas produces insulin through its beta cells in the islets of Langerhans.' },
    { id:7,  subject:'Current Affairs', topic:'International',             q:'Which country hosted the G20 Summit in 2023?', opts:['Japan','USA','India','Brazil'], correct:2, explanation:'India hosted the G20 Summit in New Delhi on September 9-10, 2023 under its presidency theme "Vasudhaiva Kutumbakam".' },
    { id:8,  subject:'History',         topic:'Ancient India',             q:'The Gupta Empire is known for its contribution to:', opts:['Maritime Trade','Science & Literature','Military Conquest','Architecture only'], correct:1, explanation:'The Gupta period (320-550 CE) is called the Golden Age of India for its remarkable achievements in science, mathematics, literature, and arts.' },
    { id:9,  subject:'Geography',       topic:'World Geography',           q:'Which is the longest river in the world?', opts:['Amazon','Yangtze','Nile','Mississippi'], correct:2, explanation:'The Nile river at approximately 6,650 km is generally considered the longest river in the world, though the Amazon is longer by some measurements.' },
    { id:10, subject:'Polity',          topic:'Constitutional Bodies',     q:'Who appoints the Chief Election Commissioner of India?', opts:['Prime Minister','President','Parliament','Supreme Court'], correct:1, explanation:'The Chief Election Commissioner is appointed by the President of India on the advice of the Prime Minister.' },
    { id:11, subject:'Economics',       topic:'Budget & Finance',          q:'Which is not a Direct Tax in India?', opts:['Income Tax','Corporate Tax','GST','Wealth Tax'], correct:2, explanation:'GST (Goods and Services Tax) is an indirect tax levied on consumption of goods and services.' },
    { id:12, subject:'Science',         topic:'Physics',                   q:'What is the SI unit of electric current?', opts:['Volt','Watt','Ampere','Ohm'], correct:2, explanation:'The Ampere (A) is the SI base unit for electric current, named after French physicist André-Marie Ampère.' },
    { id:13, subject:'History',         topic:'Medieval India',            q:'Akbar introduced the Ibadat Khana for:', opts:['Religious debates','Tax collection','Military training','Trade negotiations'], correct:0, explanation:'Akbar built the Ibadat Khana (House of Worship) at Fatehpur Sikri in 1575 for religious discussions between scholars of all faiths.' },
    { id:14, subject:'Geography',       topic:'Indian Geography',          q:'The Tropic of Cancer passes through how many Indian states?', opts:['6','7','8','9'], correct:2, explanation:'The Tropic of Cancer passes through 8 Indian states: Gujarat, Rajasthan, MP, Chhattisgarh, Jharkhand, West Bengal, Tripura, and Mizoram.' },
    { id:15, subject:'Polity',          topic:'Federalism',                q:'Which Schedule of the Constitution contains the distribution of powers?', opts:['5th Schedule','6th Schedule','7th Schedule','8th Schedule'], correct:2, explanation:'The 7th Schedule contains Union List, State List, and Concurrent List defining the division of powers between Centre and States.' },
    { id:16, subject:'Economics',       topic:'International Trade',       q:'WTO Headquarters is located in:', opts:['New York','Geneva','Brussels','Vienna'], correct:1, explanation:'The World Trade Organization (WTO) is headquartered in Geneva, Switzerland.' },
    { id:17, subject:'Science',         topic:'Chemistry',                 q:'What is the chemical symbol for Gold?', opts:['Go','Gd','Au','Ag'], correct:2, explanation:'Gold\'s chemical symbol Au comes from the Latin word "Aurum".' },
    { id:18, subject:'Current Affairs', topic:'National',                  q:'Operation Sindoor was a military operation by India against targets in:', opts:['China','Bangladesh','Pakistan','Nepal'], correct:2, explanation:'Operation Sindoor was India\'s military operation in May 2025 targeting terror infrastructure in Pakistan.' },
    { id:19, subject:'History',         topic:'Modern India',              q:'The First War of Indian Independence occurred in:', opts:['1857','1858','1885','1905'], correct:0, explanation:'The Revolt of 1857 (also called First War of Independence or Sepoy Mutiny) began on May 10, 1857 in Meerut.' },
    { id:20, subject:'Polity',          topic:'Judiciary',                 q:'The Supreme Court of India was established in:', opts:['1947','1949','1950','1935'], correct:2, explanation:'The Supreme Court of India was constituted and came into effect on January 28, 1950, two days after the Constitution came into force.' },
  ]
}

const SUBJECTS = ['All', 'Polity', 'History', 'Geography', 'Economics', 'Science', 'Current Affairs']
const SUBJECT_COLORS: Record<string, string> = {
  Polity: '#7C3AED', History: '#F59E0B', Geography: '#22C55E', Economics: '#0EA5E9', Science: '#EC4899', 'Current Affairs': '#F97316'
}

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.6} }
  @keyframes tick   { from{stroke-dashoffset:0} to{stroke-dashoffset:220} }
  .opt-btn { width:100%; text-align:left; padding:.9rem 1.1rem; border-radius:14px; border:2px solid rgba(255,255,255,.1); background:rgba(255,255,255,.04); color:#fff; font-family:inherit; font-size:.92rem; cursor:pointer; transition:all .18s; display:flex; align-items:center; gap:.85rem; }
  .opt-btn:hover:not([disabled]) { border-color:rgba(124,58,237,.5); background:rgba(124,58,237,.1); }
  .opt-btn.selected { border-color:#7C3AED; background:rgba(124,58,237,.15); }
  .opt-btn.correct  { border-color:#22C55E; background:rgba(34,197,94,.12); }
  .opt-btn.wrong    { border-color:#EF4444; background:rgba(239,68,68,.1); }
  .opt-btn.reveal   { border-color:rgba(255,255,255,.07); opacity:.55; }
  .qnum-btn { width:36px; height:36px; border-radius:9px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.05); color:rgba(255,255,255,.65); font-family:inherit; font-size:.72rem; font-weight:800; cursor:pointer; transition:all .15s; display:flex; align-items:center; justify-content:center; }
  .qnum-btn.answered { background:rgba(34,197,94,.18); border-color:rgba(34,197,94,.4); color:#4ADE80; }
  .qnum-btn.flagged  { background:rgba(245,158,11,.15); border-color:rgba(245,158,11,.4); color:#FCD34D; }
  .qnum-btn.current  { background:linear-gradient(135deg,#7C3AED,#4F46E5); border-color:#7C3AED; color:#fff; box-shadow:0 0 12px rgba(124,58,237,.5); }
  .qnum-btn.unanswered { background:rgba(239,68,68,.08); border-color:rgba(239,68,68,.25); color:#F87171; }
  .nav-btn { padding:.7rem 1.4rem; border-radius:12px; font-family:inherit; font-weight:800; font-size:.85rem; cursor:pointer; transition:all .18s; border:none; }
  .nav-btn-pri { background:linear-gradient(135deg,#7C3AED,#4F46E5); color:#fff; }
  .nav-btn-pri:hover { filter:brightness(1.12); transform:translateY(-1px); }
  .nav-btn-sec { background:rgba(255,255,255,.08); color:rgba(255,255,255,.7); border:1px solid rgba(255,255,255,.12)!important; }
  .nav-btn-sec:hover { background:rgba(255,255,255,.14); color:#fff; }
  .nav-btn-flag { background:rgba(245,158,11,.12); color:#FCD34D; border:1px solid rgba(245,158,11,.3)!important; }
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:3px}
`

export default function MockTestPlayerClient() {
  const router = useRouter()
  const params = useParams()
  const testId = params?.id as string ?? 'upsc-prelims-gs1'

  const questions = QUESTIONS.default
  const totalQ = questions.length

  /* State */
  const [current,   setCurrent]   = useState(0)
  const [answers,   setAnswers]   = useState<Record<number, number | null>>({})
  const [flagged,   setFlagged]   = useState<Set<number>>(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showPanel, setShowPanel]  = useState(true)
  const [timeLeft,  setTimeLeft]   = useState(120 * 60) // 120 min
  const [paused,    setPaused]     = useState(false)
  const timerRef = useRef<any>(null)

  const q = questions[current]
  const answered = answers[current] !== undefined && answers[current] !== null
  const isFlagged = flagged.has(current)

  /* Timer */
  useEffect(() => {
    if (submitted || paused) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [submitted, paused])

  const mm = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const ss = (timeLeft % 60).toString().padStart(2, '0')
  const timeWarning = timeLeft < 600 // < 10 min

  /* Counts */
  const answeredCount = Object.values(answers).filter(v => v !== null && v !== undefined).length
  const flaggedCount  = flagged.size
  const unanswered    = totalQ - answeredCount

  const selectAnswer = (optIdx: number) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [current]: optIdx }))
  }

  const toggleFlag = () => {
    setFlagged(prev => {
      const s = new Set(prev)
      if (s.has(current)) s.delete(current); else s.add(current)
      return s
    })
  }

  const handleSubmit = useCallback(() => {
    clearInterval(timerRef.current)
    setShowConfirm(false)
    setSubmitted(true)
    // Navigate to results after 1 sec so user sees final state
    setTimeout(() => {
      router.push(`/student/mock-tests/${testId}/results?answers=${encodeURIComponent(JSON.stringify(answers))}&time=${120*60 - timeLeft}`)
    }, 1200)
  }, [answers, timeLeft, testId, router])

  const getQState = (i: number) => {
    if (i === current) return 'current'
    if (answers[i] !== undefined && answers[i] !== null) return 'answered'
    if (flagged.has(i)) return 'flagged'
    if (answers[i] === null) return 'unanswered'
    return ''
  }

  if (submitted) {
    return (
      <div style={{ minHeight:'100vh', background:'#0A0F1E', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:"'Inter',system-ui,sans-serif", color:'#fff' }}>
        <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>📊</div>
        <div style={{ fontWeight:900, fontSize:'1.4rem' }}>Calculating your results…</div>
        <div style={{ color:'rgba(255,255,255,.4)', marginTop:'.5rem', fontSize:'.9rem' }}>Analysing weak topics and performance</div>
        <div style={{ marginTop:'1.5rem', width:48, height:48, border:'4px solid rgba(124,58,237,.3)', borderTopColor:'#7C3AED', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:'#070B14', minHeight:'100vh', color:'#fff', display:'flex', flexDirection:'column' }}>
      <style>{STYLE}</style>

      {/* ── Top Bar ── */}
      <div style={{ background:'rgba(7,11,20,.98)', borderBottom:'1px solid rgba(255,255,255,.08)', position:'sticky', top:0, zIndex:100, backdropFilter:'blur(20px)', padding:'0 1.25rem', height:58, display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
        {/* Left: logo + title */}
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexShrink:0 }}>
          <div style={{ fontWeight:900, fontSize:'1rem', background:'linear-gradient(135deg,#7C3AED,#06B6D4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>ExamOS ⚡</div>
          <div style={{ width:1, height:18, background:'rgba(255,255,255,.12)' }} />
          <div style={{ fontSize:'.82rem', color:'rgba(255,255,255,.5)', fontWeight:600 }}>UPSC Prelims GS-1 Full Mock</div>
        </div>

        {/* Center: Timer */}
        <div style={{ display:'flex', alignItems:'center', gap:'.5rem', background: timeWarning ? 'rgba(239,68,68,.12)' : 'rgba(255,255,255,.06)', border:`1px solid ${timeWarning ? 'rgba(239,68,68,.4)' : 'rgba(255,255,255,.1)'}`, borderRadius:12, padding:'.4rem 1rem', animation: timeWarning ? 'pulse 1s infinite' : 'none' }}>
          <span style={{ fontSize:'1rem' }}>{timeWarning ? '⚠️' : '⏱️'}</span>
          <span style={{ fontWeight:900, fontSize:'1.2rem', letterSpacing:'.05em', color: timeWarning ? '#F87171' : '#fff', fontVariantNumeric:'tabular-nums' }}>{mm}:{ss}</span>
          <button onClick={() => setPaused(p => !p)} style={{ background:'none', border:'none', color:'rgba(255,255,255,.4)', cursor:'pointer', fontSize:'.75rem', padding:'0 .25rem' }} title={paused ? 'Resume' : 'Pause'}>
            {paused ? '▶' : '⏸'}
          </button>
        </div>

        {/* Right: progress + submit */}
        <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
          <div style={{ fontSize:'.78rem', color:'rgba(255,255,255,.4)', fontWeight:700 }}>
            <span style={{ color:'#4ADE80' }}>{answeredCount}</span>/{totalQ} answered
          </div>
          <button className="nav-btn nav-btn-pri" onClick={() => setShowConfirm(true)} style={{ padding:'.5rem 1.1rem', background:'linear-gradient(135deg,#22C55E,#16A34A)', boxShadow:'0 0 16px rgba(34,197,94,.35)' }}>
            Submit Test
          </button>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div style={{ flex:1, display:'flex', overflow:'hidden', height:'calc(100vh - 58px)' }}>

        {/* Question area */}
        <div style={{ flex:1, overflowY:'auto', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1.25rem' }}>

          {/* Question header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'.75rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
              <div style={{ background:'linear-gradient(135deg,#7C3AED,#4F46E5)', borderRadius:12, padding:'.4rem .9rem', fontWeight:900, fontSize:'.82rem' }}>
                Q {current + 1} / {totalQ}
              </div>
              <div style={{ background:`${SUBJECT_COLORS[q.subject] ?? '#6B7280'}20`, border:`1px solid ${SUBJECT_COLORS[q.subject] ?? '#6B7280'}50`, borderRadius:8, padding:'.3rem .75rem', fontSize:'.72rem', fontWeight:800, color:SUBJECT_COLORS[q.subject] ?? '#9CA3AF' }}>
                {q.subject}
              </div>
              <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.35)', fontWeight:700 }}>{q.topic}</div>
            </div>
            <div style={{ display:'flex', gap:'.5rem' }}>
              <button className="nav-btn nav-btn-flag" style={{ padding:'.45rem .9rem', fontSize:'.78rem' }} onClick={toggleFlag}>
                {isFlagged ? '🚩 Flagged' : '⚑ Flag'}
              </button>
              <button className="nav-btn nav-btn-sec" style={{ padding:'.45rem .9rem', fontSize:'.78rem' }} onClick={() => setShowPanel(p => !p)}>
                {showPanel ? 'Hide Panel' : 'Show Panel'}
              </button>
            </div>
          </div>

          {/* Question text */}
          <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.09)', borderRadius:18, padding:'1.5rem 1.75rem', animation:'fadeUp .3s ease' }}>
            <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.3)', fontWeight:700, marginBottom:'.75rem', textTransform:'uppercase', letterSpacing:'.08em' }}>
              Question {current + 1} · Single Correct Answer · (+2 / -0.66)
            </div>
            <p style={{ fontSize:'1.05rem', lineHeight:1.8, fontWeight:600, color:'#F0F0FF' }}>{q.q}</p>
          </div>

          {/* Options */}
          <div style={{ display:'flex', flexDirection:'column', gap:'.65rem', animation:'fadeUp .35s ease' }}>
            {q.opts.map((opt: string, i: number) => {
              const sel = answers[current] === i
              return (
                <button key={i} className={`opt-btn${sel ? ' selected' : ''}`}
                  onClick={() => selectAnswer(i)} disabled={false}>
                  <div style={{ width:30, height:30, borderRadius:8, background: sel ? 'rgba(124,58,237,.4)' : 'rgba(255,255,255,.07)', border:`1.5px solid ${sel ? '#7C3AED' : 'rgba(255,255,255,.12)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'.8rem', color: sel ? '#A78BFA' : 'rgba(255,255,255,.55)', flexShrink:0, transition:'all .15s' }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span style={{ fontWeight: sel ? 700 : 500, color: sel ? '#fff' : 'rgba(255,255,255,.8)' }}>{opt}</span>
                  {sel && <span style={{ marginLeft:'auto', fontSize:'1rem', flexShrink:0 }}>✓</span>}
                </button>
              )
            })}
          </div>

          {/* Skip/clear */}
          {answered && (
            <div style={{ animation:'fadeUp .2s ease' }}>
              <button onClick={() => setAnswers(prev => { const n={...prev}; delete n[current]; return n })}
                style={{ background:'none', border:'none', color:'rgba(255,255,255,.3)', fontFamily:'inherit', fontSize:'.78rem', cursor:'pointer', textDecoration:'underline', fontWeight:600 }}>
                Clear Selection
              </button>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:'.5rem', paddingTop:'1rem', borderTop:'1px solid rgba(255,255,255,.06)' }}>
            <button className="nav-btn nav-btn-sec" disabled={current === 0} onClick={() => setCurrent(c => c - 1)}>← Prev</button>
            <div style={{ display:'flex', gap:'.5rem' }}>
              <button className="nav-btn nav-btn-sec" onClick={() => { const next = questions.findIndex((_,i) => i > current && (answers[i] === undefined || answers[i] === null)); if(next !== -1) setCurrent(next) }} style={{ fontSize:'.78rem' }}>
                Next Unanswered ↷
              </button>
              <button className="nav-btn nav-btn-pri" disabled={current === totalQ - 1} onClick={() => setCurrent(c => c + 1)}>Next →</button>
            </div>
          </div>

          {/* Marking scheme reminder */}
          <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.2)', textAlign:'center', paddingBottom:'1rem' }}>
            +2 for correct · −⅔ for wrong · 0 for not attempted
          </div>
        </div>

        {/* ── Right Panel: Question Navigator ── */}
        {showPanel && (
          <div style={{ width:260, borderLeft:'1px solid rgba(255,255,255,.07)', background:'rgba(255,255,255,.02)', overflowY:'auto', padding:'1.25rem 1rem', display:'flex', flexDirection:'column', gap:'1.25rem', flexShrink:0 }}>

            {/* Progress rings summary */}
            <div style={{ background:'rgba(255,255,255,.04)', borderRadius:16, padding:'1rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.6rem' }}>
              {[
                { label:'Answered',   count:answeredCount,       color:'#22C55E' },
                { label:'Unanswered', count:unanswered,          color:'#EF4444' },
                { label:'Flagged',    count:flaggedCount,         color:'#F59E0B' },
                { label:'Total',      count:totalQ,               color:'#A78BFA' },
              ].map(s => (
                <div key={s.label} style={{ background:'rgba(255,255,255,.04)', borderRadius:10, padding:'.6rem .75rem', textAlign:'center' }}>
                  <div style={{ fontWeight:900, fontSize:'1.2rem', color:s.color }}>{s.count}</div>
                  <div style={{ fontSize:'.62rem', color:'rgba(255,255,255,.4)', marginTop:'.1rem', fontWeight:700 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem', fontSize:'.65rem', color:'rgba(255,255,255,.4)', fontWeight:700 }}>
              {[['#22C55E','Answered'],['#EF4444','Not Answered'],['#F59E0B','Flagged'],['#7C3AED','Current']].map(([c,l]) => (
                <div key={l} style={{ display:'flex', alignItems:'center', gap:'.3rem' }}>
                  <div style={{ width:8, height:8, borderRadius:2, background:c }} />
                  {l}
                </div>
              ))}
            </div>

            {/* Question grid */}
            <div>
              <div style={{ fontSize:'.65rem', fontWeight:800, color:'rgba(255,255,255,.35)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.6rem' }}>Question Navigator</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem' }}>
                {questions.map((_, i) => (
                  <button key={i} className={`qnum-btn ${getQState(i)}`}
                    onClick={() => setCurrent(i)} title={`Q${i+1}${flagged.has(i) ? ' (Flagged)' : ''}`}>
                    {flagged.has(i) ? '🚩' : i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject filter view */}
            <div>
              <div style={{ fontSize:'.65rem', fontWeight:800, color:'rgba(255,255,255,.35)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.6rem' }}>Subjects</div>
              <div style={{ display:'flex', flexDirection:'column', gap:'.4rem' }}>
                {Object.entries(
                  questions.reduce((acc:Record<string,{total:number,done:number}>, q, i) => {
                    if (!acc[q.subject]) acc[q.subject] = {total:0, done:0}
                    acc[q.subject].total++
                    if (answers[i] !== undefined && answers[i] !== null) acc[q.subject].done++
                    return acc
                  }, {})
                ).map(([sub, {total, done}]) => (
                  <div key={sub} style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:SUBJECT_COLORS[sub] ?? '#6B7280', flexShrink:0 }} />
                    <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.55)', flex:1 }}>{sub}</div>
                    <div style={{ fontSize:'.68rem', fontWeight:800, color:'rgba(255,255,255,.4)' }}>{done}/{total}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit from panel */}
            <button className="nav-btn nav-btn-pri" style={{ marginTop:'auto', width:'100%', padding:'.75rem', background:'linear-gradient(135deg,#22C55E,#16A34A)', boxShadow:'0 0 16px rgba(34,197,94,.3)' }} onClick={() => setShowConfirm(true)}>
              ✓ Submit Test
            </button>
          </div>
        )}
      </div>

      {/* ── Submit Confirmation Modal ── */}
      {showConfirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.75)', backdropFilter:'blur(8px)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }} onClick={() => setShowConfirm(false)}>
          <div style={{ background:'#111827', border:'1px solid rgba(255,255,255,.12)', borderRadius:24, padding:'2rem', maxWidth:440, width:'100%', animation:'fadeUp .3s ease' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize:'2.5rem', textAlign:'center', marginBottom:'1rem' }}>📝</div>
            <h2 style={{ fontWeight:900, fontSize:'1.25rem', textAlign:'center', marginBottom:'.5rem' }}>Submit Your Test?</h2>
            <p style={{ color:'rgba(255,255,255,.5)', textAlign:'center', fontSize:'.88rem', lineHeight:1.6, marginBottom:'1.5rem' }}>
              You have answered <strong style={{ color:'#4ADE80' }}>{answeredCount}</strong> out of <strong>{totalQ}</strong> questions.
              {unanswered > 0 && <> <strong style={{ color:'#F87171' }}>{unanswered} questions</strong> are still unanswered.</>}
            </p>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'.65rem', marginBottom:'1.5rem' }}>
              {[
                { label:'Answered', count:answeredCount, color:'#22C55E', icon:'✅' },
                { label:'Skipped',  count:unanswered,   color:'#EF4444', icon:'⬜' },
                { label:'Flagged',  count:flaggedCount,  color:'#F59E0B', icon:'🚩' },
              ].map(s => (
                <div key={s.label} style={{ background:'rgba(255,255,255,.04)', borderRadius:12, padding:'.75rem', textAlign:'center' }}>
                  <div style={{ fontSize:'1.1rem' }}>{s.icon}</div>
                  <div style={{ fontWeight:900, fontSize:'1.1rem', color:s.color, marginTop:'.2rem' }}>{s.count}</div>
                  <div style={{ fontSize:'.65rem', color:'rgba(255,255,255,.4)', marginTop:'.1rem' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display:'flex', gap:'.75rem' }}>
              <button className="nav-btn nav-btn-sec" style={{ flex:1, padding:'.8rem', border:'1px solid rgba(255,255,255,.12)' }} onClick={() => setShowConfirm(false)}>← Continue Test</button>
              <button className="nav-btn nav-btn-pri" style={{ flex:1, padding:'.8rem', background:'linear-gradient(135deg,#22C55E,#16A34A)', boxShadow:'0 0 20px rgba(34,197,94,.4)' }} onClick={handleSubmit}>
                ✓ Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
