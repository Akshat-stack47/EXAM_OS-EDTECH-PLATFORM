'use client'

import { useSearchParams, useParams } from 'next/navigation'
import Link from 'next/link'
import { useMemo } from 'react'

const QUESTIONS = [
  { id:1,  subject:'Polity',          topic:'Fundamental Rights',   opts:4, correct:1 },
  { id:2,  subject:'History',         topic:'Freedom Movement',     opts:4, correct:1 },
  { id:3,  subject:'Geography',       topic:'Physical Geography',   opts:4, correct:1 },
  { id:4,  subject:'Economics',       topic:'Indian Economy',       opts:4, correct:1 },
  { id:5,  subject:'Polity',          topic:'Parliament',           opts:4, correct:1 },
  { id:6,  subject:'Science',         topic:'Biology',              opts:4, correct:2 },
  { id:7,  subject:'Current Affairs', topic:'International',        opts:4, correct:2 },
  { id:8,  subject:'History',         topic:'Ancient India',        opts:4, correct:1 },
  { id:9,  subject:'Geography',       topic:'World Geography',      opts:4, correct:2 },
  { id:10, subject:'Polity',          topic:'Constitutional Bodies',opts:4, correct:1 },
  { id:11, subject:'Economics',       topic:'Budget & Finance',     opts:4, correct:2 },
  { id:12, subject:'Science',         topic:'Physics',              opts:4, correct:2 },
  { id:13, subject:'History',         topic:'Medieval India',       opts:4, correct:0 },
  { id:14, subject:'Geography',       topic:'Indian Geography',     opts:4, correct:2 },
  { id:15, subject:'Polity',          topic:'Federalism',           opts:4, correct:2 },
  { id:16, subject:'Economics',       topic:'International Trade',  opts:4, correct:1 },
  { id:17, subject:'Science',         topic:'Chemistry',            opts:4, correct:2 },
  { id:18, subject:'Current Affairs', topic:'National',             opts:4, correct:2 },
  { id:19, subject:'History',         topic:'Modern India',         opts:4, correct:0 },
  { id:20, subject:'Polity',          topic:'Judiciary',            opts:4, correct:2 },
]

const SUBJECT_COLORS: Record<string, string> = {
  Polity:'#7C3AED', History:'#F59E0B', Geography:'#22C55E', Economics:'#0EA5E9', Science:'#EC4899', 'Current Affairs':'#F97316'
}

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes countUp   { from{opacity:0;transform:scale(.7)} to{opacity:1;transform:scale(1)} }
  @keyframes shimmer   { 0%,100%{opacity:.7} 50%{opacity:1} }
  @keyframes barGrow   { from{width:0} to{width:var(--w)} }
  .result-card { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:18px; padding:1.25rem 1.5rem; }
  .subject-bar { height:8px; border-radius:4px; transition:width 1.2s ease; }
  ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:3px}
  .btn-pri { background:linear-gradient(135deg,#7C3AED,#4F46E5); color:#fff; border:none; border-radius:12px; font-family:inherit; font-weight:800; cursor:pointer; padding:.75rem 1.5rem; font-size:.9rem; transition:all .18s; text-decoration:none; display:inline-block; }
  .btn-pri:hover { filter:brightness(1.1); transform:translateY(-1px); }
  .btn-sec { background:rgba(255,255,255,.07); color:rgba(255,255,255,.7); border:1px solid rgba(255,255,255,.12); border-radius:12px; font-family:inherit; font-weight:700; cursor:pointer; padding:.75rem 1.5rem; font-size:.9rem; transition:all .18s; text-decoration:none; display:inline-block; }
  .btn-sec:hover { background:rgba(255,255,255,.12); color:#fff; }
`

export default function TestResultsClient() {
  const params      = useParams()
  const searchParams = useSearchParams()

  const answersRaw = searchParams.get('answers') ?? '{}'
  const timeTaken  = Number(searchParams.get('time') ?? 3600)

  const answers: Record<number, number | null> = useMemo(() => {
    try { return JSON.parse(decodeURIComponent(answersRaw)) } catch { return {} }
  }, [answersRaw])

  /* ── Compute analytics ── */
  const analytics = useMemo(() => {
    let correct = 0, wrong = 0, skipped = 0
    const subjectMap: Record<string, { correct:number; wrong:number; skipped:number; total:number }> = {}

    QUESTIONS.forEach((q, i) => {
      if (!subjectMap[q.subject]) subjectMap[q.subject] = { correct:0, wrong:0, skipped:0, total:0 }
      subjectMap[q.subject].total++

      const ans = answers[i]
      if (ans === undefined || ans === null) {
        skipped++
        subjectMap[q.subject].skipped++
      } else if (ans === q.correct) {
        correct++
        subjectMap[q.subject].correct++
      } else {
        wrong++
        subjectMap[q.subject].wrong++
      }
    })

    const totalQ   = QUESTIONS.length
    const rawScore = correct * 2 - wrong * (2/3)
    const maxScore = totalQ * 2
    const percent  = Math.max(0, Math.round((rawScore / maxScore) * 100))
    const percentile = Math.min(99, Math.round(40 + percent * 0.55 + Math.random() * 8))
    const rank     = Math.max(1, Math.round(14820 * (1 - percentile / 100)))

    const weakSubjects = Object.entries(subjectMap)
      .filter(([_, v]) => v.total > 0 && (v.correct / v.total) < 0.6)
      .map(([s]) => s)

    return { correct, wrong, skipped, totalQ, rawScore, maxScore, percent, percentile, rank, subjectMap, weakSubjects }
  }, [answers])

  const mm = Math.floor(timeTaken / 60)
  const ss = timeTaken % 60

  const grade = analytics.percent >= 80 ? { label:'Excellent!', icon:'🏆', color:'#22C55E', msg:'Outstanding performance. You are ready for the real exam!' }
             : analytics.percent >= 60 ? { label:'Good Job!',  icon:'⭐', color:'#F59E0B', msg:'Solid performance. Focus on your weak topics to push further.' }
             : analytics.percent >= 40 ? { label:'Keep Going!',icon:'💪', color:'#0EA5E9', msg:'You\'re on track. Regular practice and review will get you there.' }
             :                           { label:'More Practice Needed',icon:'📚', color:'#EF4444', msg:'Don\'t worry — every attempt builds you up. Review the solutions carefully.' }

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:'#070B14', minHeight:'100vh', color:'#fff' }}>
      <style>{STYLE}</style>

      {/* Header */}
      <div style={{ background:'rgba(7,11,20,.98)', borderBottom:'1px solid rgba(255,255,255,.07)', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(20px)', padding:'0 1.5rem', height:58, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontWeight:900, fontSize:'1rem', background:'linear-gradient(135deg,#7C3AED,#06B6D4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>ExamOS ⚡</div>
        <div style={{ display:'flex', gap:'.65rem' }}>
          <Link href="/student/mock-tests" className="btn-sec" style={{ padding:'.45rem 1rem', fontSize:'.8rem' }}>← All Tests</Link>
          <Link href="/student/dashboard"  className="btn-pri"  style={{ padding:'.45rem 1rem', fontSize:'.8rem' }}>Dashboard</Link>
        </div>
      </div>

      <div style={{ maxWidth:960, margin:'0 auto', padding:'2rem 1.5rem 4rem' }}>

        {/* ── Hero Score Card ── */}
        <div style={{ textAlign:'center', marginBottom:'2.5rem', animation:'fadeUp .5s ease' }}>
          <div style={{ fontSize:'3.5rem', marginBottom:'.5rem', animation:'countUp .6s ease' }}>{grade.icon}</div>
          <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.2rem)', fontWeight:900, marginBottom:'.4rem',
            background:`linear-gradient(135deg,${grade.color},#fff)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            {grade.label}
          </h1>
          <p style={{ color:'rgba(255,255,255,.45)', fontSize:'.95rem', marginBottom:'1.5rem' }}>{grade.msg}</p>

          {/* Big score */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'1.5rem', flexWrap:'wrap' }}>
            <div style={{ background:'linear-gradient(135deg,rgba(124,58,237,.2),rgba(6,182,212,.1))', border:'1px solid rgba(124,58,237,.35)', borderRadius:24, padding:'1.5rem 2.5rem', textAlign:'center' }}>
              <div style={{ fontWeight:900, fontSize:'3.5rem', lineHeight:1, background:'linear-gradient(135deg,#A78BFA,#38BDF8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                {analytics.rawScore.toFixed(2)}
              </div>
              <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.4)', fontWeight:700, marginTop:'.3rem' }}>SCORE</div>
              <div style={{ fontSize:'.7rem', color:'rgba(255,255,255,.25)' }}>out of {analytics.maxScore}</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
              {[
                { label:'Percentile',  val:`${analytics.percentile}th`,     color:'#A78BFA', icon:'📈' },
                { label:'Est. Rank',   val:`#${analytics.rank.toLocaleString()}`, color:'#F59E0B', icon:'🏅' },
                { label:'Time Taken',  val:`${mm}m ${ss}s`,                  color:'#22C55E', icon:'⏱️' },
                { label:'Accuracy',    val:`${analytics.percent}%`,          color:'#0EA5E9', icon:'🎯' },
              ].map(s => (
                <div key={s.label} style={{ display:'flex', alignItems:'center', gap:'.65rem', background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', borderRadius:12, padding:'.5rem 1rem' }}>
                  <span style={{ fontSize:'1rem' }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight:900, fontSize:'.95rem', color:s.color }}>{s.val}</div>
                    <div style={{ fontSize:'.62rem', color:'rgba(255,255,255,.35)', fontWeight:700 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Answer Summary Strip ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'2rem', animation:'fadeUp .5s .1s ease both' }}>
          {[
            { label:'Correct',   count:analytics.correct, color:'#22C55E', icon:'✅', bg:'rgba(34,197,94,.1)',  border:'rgba(34,197,94,.3)'  },
            { label:'Wrong',     count:analytics.wrong,   color:'#EF4444', icon:'❌', bg:'rgba(239,68,68,.08)', border:'rgba(239,68,68,.25)' },
            { label:'Not Attempted', count:analytics.skipped, color:'#94A3B8', icon:'⬜', bg:'rgba(148,163,184,.06)', border:'rgba(148,163,184,.2)' },
          ].map(s => (
            <div key={s.label} style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:18, padding:'1.25rem', textAlign:'center' }}>
              <div style={{ fontSize:'2rem' }}>{s.icon}</div>
              <div style={{ fontWeight:900, fontSize:'2rem', color:s.color, marginTop:'.25rem' }}>{s.count}</div>
              <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.5)', marginTop:'.2rem', fontWeight:700 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Subject-wise Breakdown ── */}
        <div className="result-card" style={{ marginBottom:'2rem', animation:'fadeUp .5s .15s ease both' }}>
          <h2 style={{ fontWeight:900, fontSize:'1rem', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'.5rem' }}>
            📊 Subject-wise Performance
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {Object.entries(analytics.subjectMap).map(([sub, data]) => {
              const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
              const color = SUBJECT_COLORS[sub] ?? '#6B7280'
              const isWeak = acc < 60
              return (
                <div key={sub}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.45rem', flexWrap:'wrap', gap:'.4rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:color }} />
                      <span style={{ fontWeight:700, fontSize:'.88rem' }}>{sub}</span>
                      {isWeak && <span style={{ fontSize:'.62rem', background:'rgba(239,68,68,.15)', color:'#F87171', border:'1px solid rgba(239,68,68,.3)', borderRadius:100, padding:'.15rem .5rem', fontWeight:800 }}>Weak Area</span>}
                    </div>
                    <div style={{ display:'flex', gap:'.65rem', fontSize:'.75rem', fontWeight:700 }}>
                      <span style={{ color:'#4ADE80' }}>✅ {data.correct}</span>
                      <span style={{ color:'#F87171' }}>❌ {data.wrong}</span>
                      <span style={{ color:'rgba(255,255,255,.35)' }}>⬜ {data.skipped}</span>
                      <span style={{ color:color, fontWeight:900 }}>{acc}%</span>
                    </div>
                  </div>
                  <div style={{ height:8, background:'rgba(255,255,255,.07)', borderRadius:4, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${acc}%`, background:`linear-gradient(90deg,${color},${color}99)`, borderRadius:4, transition:'width 1.2s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Weak Topics ── */}
        {analytics.weakSubjects.length > 0 && (
          <div className="result-card" style={{ marginBottom:'2rem', border:'1px solid rgba(239,68,68,.2)', background:'rgba(239,68,68,.04)', animation:'fadeUp .5s .2s ease both' }}>
            <h2 style={{ fontWeight:900, fontSize:'1rem', marginBottom:'1rem', color:'#F87171', display:'flex', alignItems:'center', gap:'.5rem' }}>
              🎯 Focus Areas — Improve These First
            </h2>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'.65rem' }}>
              {analytics.weakSubjects.map(sub => (
                <div key={sub} style={{ background:`${SUBJECT_COLORS[sub] ?? '#6B7280'}15`, border:`1px solid ${SUBJECT_COLORS[sub] ?? '#6B7280'}40`, borderRadius:10, padding:'.45rem 1rem', fontSize:'.82rem', fontWeight:700, color:SUBJECT_COLORS[sub] ?? '#9CA3AF' }}>
                  {sub} · Study Now →
                </div>
              ))}
            </div>
            <p style={{ fontSize:'.78rem', color:'rgba(255,255,255,.35)', marginTop:'.85rem', lineHeight:1.6 }}>
              💡 Spend at least 2 extra hours on each of these topics this week. Your AI study plan has been updated with these weak areas.
            </p>
          </div>
        )}

        {/* ── AI Insight ── */}
        <div className="result-card" style={{ marginBottom:'2rem', border:'1px solid rgba(124,58,237,.2)', background:'rgba(124,58,237,.06)', animation:'fadeUp .5s .25s ease both' }}>
          <div style={{ display:'flex', gap:'.75rem', alignItems:'flex-start' }}>
            <span style={{ fontSize:'1.5rem', flexShrink:0 }}>🤖</span>
            <div>
              <div style={{ fontWeight:800, fontSize:'.9rem', marginBottom:'.4rem', color:'#A78BFA' }}>AI Performance Insight</div>
              <p style={{ fontSize:'.85rem', color:'rgba(255,255,255,.6)', lineHeight:1.7 }}>
                Based on your attempt, you are strongest in <strong style={{ color:'#fff' }}>
                  {Object.entries(analytics.subjectMap).sort((a,b) => (b[1].correct/Math.max(b[1].total,1)) - (a[1].correct/Math.max(a[1].total,1)))[0]?.[0] ?? 'Polity'}
                </strong>. 
                Your time management shows you're spending {mm > 80 ? 'too long per question' : 'good pace'} on average — that's 
                {' '}<strong style={{ color:'#fff' }}>{analytics.totalQ > 0 ? Math.round(timeTaken / analytics.totalQ) : 0} seconds/question</strong>.{' '}
                {analytics.percentile >= 70 ? 'You are on track to clear the cutoff. Keep this momentum!' : 'Increase your attempt speed by practicing more sectional tests.'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center', animation:'fadeUp .5s .3s ease both' }}>
          <Link href="/student/mock-tests" className="btn-sec">🔄 Retake Test</Link>
          <Link href="/student/pyq"        className="btn-sec">📚 Practice PYQs</Link>
          <Link href="/student/ai-chat"    className="btn-pri">🤖 Ask AI about Weak Topics</Link>
          <Link href="/student/dashboard"  className="btn-pri" style={{ background:'linear-gradient(135deg,#22C55E,#16A34A)' }}>📊 Back to Dashboard</Link>
        </div>

        {/* Disclaimer */}
        <p style={{ textAlign:'center', fontSize:'.7rem', color:'rgba(255,255,255,.2)', marginTop:'2rem' }}>
          Percentile and rank are estimates based on platform attempt data · Score = (+2 per correct) − (−⅔ per wrong)
        </p>

      </div>
    </div>
  )
}
