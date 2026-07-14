'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/* ─── Data ────────────────────────────────────────────────────────── */
const EXAMS = [
  { id: 'UPSC',     label: 'UPSC CSE',       icon: '🏛️', body: 'Civil Services',      color: '#7C3AED', students: '2.1L+' },
  { id: 'SSC',      label: 'SSC CGL/CHSL',   icon: '📋', body: 'Staff Selection',     color: '#0EA5E9', students: '4.8L+' },
  { id: 'BANKING',  label: 'IBPS / SBI PO',  icon: '🏦', body: 'Banking Sector',      color: '#22C55E', students: '3.2L+' },
  { id: 'RAILWAY',  label: 'RRB NTPC/ALP',   icon: '🚂', body: 'Indian Railways',     color: '#F59E0B', students: '5.6L+' },
  { id: 'NDA',      label: 'NDA / CDS',       icon: '⚔️', body: 'Defence Services',   color: '#EF4444', students: '1.4L+' },
  { id: 'STATE_PSC',label: 'State PCS',       icon: '🗺️', body: 'State Services',     color: '#8B5CF6', students: '2.9L+' },
  { id: 'GATE',     label: 'GATE',            icon: '⚙️', body: 'Engineering PG',     color: '#06B6D4', students: '8.5L+' },
  { id: 'POLICE',   label: 'Police / SSC GD', icon: '👮', body: 'Central Armed Police',color: '#F97316', students: '3.7L+' },
]

const CATEGORIES = [
  { id: 'GENERAL', label: 'General',   desc: 'No reservation benefit',              color: '#6B7280' },
  { id: 'OBC',     label: 'OBC',       desc: 'Other Backward Classes',              color: '#0EA5E9' },
  { id: 'SC',      label: 'SC',        desc: 'Scheduled Caste',                     color: '#8B5CF6' },
  { id: 'ST',      label: 'ST',        desc: 'Scheduled Tribe',                     color: '#22C55E' },
  { id: 'EWS',     label: 'EWS',       desc: 'Economically Weaker Section',         color: '#F59E0B' },
  { id: 'PWD',     label: 'PwD',       desc: 'Persons with Disability',             color: '#EC4899' },
]

const LEVELS = [
  { id: 'BEGINNER',     label: 'Fresh Start 🌱',    desc: 'Just beginning my preparation journey',     color: '#22C55E' },
  { id: 'INTERMEDIATE', label: 'Some Prep 📚',       desc: '3-6 months into preparation',               color: '#0EA5E9' },
  { id: 'ADVANCED',     label: 'Well Prepared 🔥',   desc: '1+ year of serious study',                  color: '#F59E0B' },
  { id: 'REPEATER',     label: 'Previous Attempt 🎯',desc: 'Have appeared before, revising gaps',       color: '#7C3AED' },
]

const STUDY_HOURS = [
  { id: '2', label: '2 hrs / day',  desc: 'Working professional / college',    icon: '💼' },
  { id: '4', label: '4 hrs / day',  desc: 'Part-time preparation',             icon: '📖' },
  { id: '6', label: '6 hrs / day',  desc: 'Serious aspirant',                  icon: '⚡' },
  { id: '8', label: '8+ hrs / day', desc: 'Full-time dedicated preparation',   icon: '🏆' },
]

const EXAM_YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i)

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes shimmer  { 0%{opacity:.6} 50%{opacity:1} 100%{opacity:.6} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes checkPop { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
  .ob-card {
    border: 2px solid rgba(255,255,255,.08); border-radius:16px; padding:1.1rem 1rem;
    cursor:pointer; transition:all .18s ease; background:rgba(255,255,255,.04);
    position:relative; overflow:hidden; text-align:left;
  }
  .ob-card:hover { border-color:rgba(255,255,255,.25); background:rgba(255,255,255,.07); transform:translateY(-2px); }
  .ob-card.selected { background:rgba(255,255,255,.07); transform:translateY(-2px); }
  .ob-btn-pri {
    background:linear-gradient(135deg,#7C3AED,#4F46E5); color:#fff; border:none;
    border-radius:14px; font-family:inherit; font-weight:800; cursor:pointer;
    transition:all .2s; padding:1rem 2rem; font-size:1rem;
  }
  .ob-btn-pri:hover { filter:brightness(1.12); transform:translateY(-2px); box-shadow:0 8px 28px rgba(124,58,237,.5); }
  .ob-btn-pri:disabled { opacity:.45; cursor:not-allowed; transform:none; filter:none; }
  .ob-btn-sec {
    background:rgba(255,255,255,.07); color:rgba(255,255,255,.55); border:1px solid rgba(255,255,255,.12);
    border-radius:14px; font-family:inherit; font-weight:700; cursor:pointer;
    transition:all .2s; padding:1rem 1.5rem; font-size:.9rem;
  }
  .ob-btn-sec:hover { background:rgba(255,255,255,.12); color:#fff; }
  .step-dot { width:10px; height:10px; border-radius:50%; transition:all .3s ease; }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.15); border-radius:3px; }
`

/* ─── Step indicator ─────────────────────────────────────────────── */
const STEPS = [
  { n: 1, label: 'Target Exam'  },
  { n: 2, label: 'Category'     },
  { n: 3, label: 'Your Level'   },
  { n: 4, label: 'Study Hours'  },
  { n: 5, label: 'Exam Year'    },
  { n: 6, label: 'All Set!'     },
]

/* ─── Main ───────────────────────────────────────────────────────── */
export default function OnboardingPageClient() {
  const router = useRouter()
  const [step,       setStep]       = useState(1)
  const [exam,       setExam]       = useState<string | null>(null)
  const [category,   setCategory]   = useState<string | null>(null)
  const [level,      setLevel]      = useState<string | null>(null)
  const [studyHours, setStudyHours] = useState<string | null>(null)
  const [examYear,   setExamYear]   = useState<number>(new Date().getFullYear() + 1)
  const [saving,     setSaving]     = useState(false)

  const selectedExam = EXAMS.find(e => e.id === exam)

  const next = () => setStep(s => Math.min(s + 1, 6))
  const back = () => setStep(s => Math.max(s - 1, 1))

  const finish = async () => {
    setSaving(true)
    // Simulate saving (in production: POST /api/onboarding with the data)
    await new Promise(r => setTimeout(r, 1500))
    router.push('/student/dashboard')
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", minHeight:'100vh',
      background:'linear-gradient(160deg,#060B14 0%,#0D1225 50%,#0A0F1E 100%)',
      color:'#fff', display:'flex', flexDirection:'column' }}>
      <style>{STYLE}</style>

      {/* Ambient glows */}
      <div style={{ position:'fixed', top:'10%', right:'5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,.08) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', bottom:'15%', left:'2%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(6,182,212,.06) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }} />

      {/* Header */}
      <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(6,11,20,.92)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,.06)', padding:'1rem 2rem' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'flex', alignItems:'center', gap:'1.25rem', flexWrap:'wrap' }}>
          {/* Logo */}
          <div style={{ fontWeight:900, fontSize:'1.1rem', background:'linear-gradient(135deg,#7C3AED,#06B6D4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', flexShrink:0 }}>
            ExamOS ⚡
          </div>

          {/* Progress bar */}
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.68rem', color:'rgba(255,255,255,.35)', fontWeight:700, marginBottom:'.4rem' }}>
              <span>Step {step} of {STEPS.length}</span>
              <span>{STEPS[step-1].label}</span>
            </div>
            <div style={{ height:5, background:'rgba(255,255,255,.08)', borderRadius:3, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#7C3AED,#06B6D4)', borderRadius:3, transition:'width .4s ease' }} />
            </div>
          </div>

          {/* Step dots */}
          <div style={{ display:'flex', gap:'.4rem', flexShrink:0 }}>
            {STEPS.map(s => (
              <div key={s.n} className="step-dot"
                style={{ background: s.n < step ? '#22C55E' : s.n === step ? '#7C3AED' : 'rgba(255,255,255,.12)',
                  width: s.n === step ? 24 : 10, borderRadius: s.n === step ? 5 : '50%' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem 1.5rem', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:860, width:'100%' }}>

          {/* ── STEP 1: Target Exam ── */}
          {step === 1 && (
            <div style={{ animation:'fadeUp .4s ease' }}>
              <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:'.75rem', animation:'float 3s ease-in-out infinite' }}>🎯</div>
                <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.2rem)', fontWeight:900, marginBottom:'.65rem',
                  background:'linear-gradient(135deg,#fff,#A78BFA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  Which exam are you targeting?
                </h1>
                <p style={{ color:'rgba(255,255,255,.45)', fontSize:'.95rem' }}>We'll personalise everything — mocks, PYQs, syllabus &amp; study plan for your exam.</p>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
                {EXAMS.map((e, i) => (
                  <button key={e.id} className={`ob-card${exam===e.id?' selected':''}`}
                    style={{ border:`2px solid ${exam===e.id?e.color:'rgba(255,255,255,.08)'}`,
                      background: exam===e.id?`${e.color}18`:'rgba(255,255,255,.04)',
                      boxShadow: exam===e.id?`0 0 24px ${e.color}25`:'none',
                      animation:`fadeUp .35s ${i*.04}s ease both` }}
                    onClick={() => setExam(e.id)}>
                    {/* Glow on selected */}
                    {exam===e.id && <div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at 30% 30%,${e.color}12,transparent 65%)`, pointerEvents:'none' }} />}
                    <div style={{ fontSize:'2rem', marginBottom:'.5rem' }}>{e.icon}</div>
                    <div style={{ fontWeight:800, fontSize:'.95rem', marginBottom:'.2rem' }}>{e.label}</div>
                    <div style={{ fontSize:'.7rem', color:'rgba(255,255,255,.45)', marginBottom:'.35rem' }}>{e.body}</div>
                    <div style={{ fontSize:'.65rem', color:e.color, fontWeight:700 }}>👥 {e.students} aspirants</div>
                    {exam===e.id && (
                      <div style={{ position:'absolute', top:10, right:10, width:22, height:22, borderRadius:'50%', background:e.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.72rem', animation:'checkPop .25s ease' }}>✓</div>
                    )}
                  </button>
                ))}
              </div>

              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <button className="ob-btn-pri" disabled={!exam} onClick={next}>
                  Continue → {exam ? `(${EXAMS.find(e=>e.id===exam)?.label})` : ''}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Category ── */}
          {step === 2 && (
            <div style={{ animation:'fadeUp .4s ease' }}>
              <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:'.75rem' }}>📋</div>
                <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.2rem)', fontWeight:900, marginBottom:'.65rem',
                  background:'linear-gradient(135deg,#fff,#A78BFA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  Your reservation category
                </h1>
                <p style={{ color:'rgba(255,255,255,.45)', fontSize:'.95rem' }}>Helps us show correct cut-offs, eligibility and vacancy data for {selectedExam?.label}.</p>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1rem', marginBottom:'2.5rem', maxWidth:700, margin:'0 auto 2.5rem' }}>
                {CATEGORIES.map((c, i) => (
                  <button key={c.id} className={`ob-card${category===c.id?' selected':''}`}
                    style={{ border:`2px solid ${category===c.id?c.color:'rgba(255,255,255,.08)'}`,
                      background: category===c.id?`${c.color}18`:'rgba(255,255,255,.04)',
                      display:'flex', alignItems:'center', gap:'.85rem',
                      animation:`fadeUp .3s ${i*.05}s ease both` }}
                    onClick={() => setCategory(c.id)}>
                    <div style={{ width:42, height:42, borderRadius:12, background:`${c.color}22`, border:`1px solid ${c.color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'.9rem', color:c.color, flexShrink:0 }}>
                      {c.label}
                    </div>
                    <div>
                      <div style={{ fontWeight:800, fontSize:'.92rem' }}>{c.label}</div>
                      <div style={{ fontSize:'.73rem', color:'rgba(255,255,255,.45)', marginTop:'.15rem' }}>{c.desc}</div>
                    </div>
                    {category===c.id && <div style={{ marginLeft:'auto', width:20, height:20, borderRadius:'50%', background:c.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.7rem', flexShrink:0, animation:'checkPop .25s ease' }}>✓</div>}
                  </button>
                ))}
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', maxWidth:700, margin:'0 auto' }}>
                <button className="ob-btn-sec" onClick={back}>← Back</button>
                <button className="ob-btn-pri" disabled={!category} onClick={next}>Continue →</button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Level ── */}
          {step === 3 && (
            <div style={{ animation:'fadeUp .4s ease' }}>
              <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:'.75rem' }}>📊</div>
                <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.2rem)', fontWeight:900, marginBottom:'.65rem',
                  background:'linear-gradient(135deg,#fff,#A78BFA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  Where are you in your prep?
                </h1>
                <p style={{ color:'rgba(255,255,255,.45)', fontSize:'.95rem' }}>Honest answer helps us calibrate your study plan and difficulty levels.</p>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1rem', marginBottom:'2.5rem', maxWidth:700, margin:'0 auto 2.5rem' }}>
                {LEVELS.map((l, i) => (
                  <button key={l.id} className={`ob-card${level===l.id?' selected':''}`}
                    style={{ border:`2px solid ${level===l.id?l.color:'rgba(255,255,255,.08)'}`,
                      background: level===l.id?`${l.color}18`:'rgba(255,255,255,.04)',
                      animation:`fadeUp .3s ${i*.06}s ease both` }}
                    onClick={() => setLevel(l.id)}>
                    <div style={{ fontWeight:900, fontSize:'1.05rem', marginBottom:'.35rem' }}>{l.label}</div>
                    <div style={{ fontSize:'.82rem', color:'rgba(255,255,255,.5)', lineHeight:1.5 }}>{l.desc}</div>
                    {level===l.id && <div style={{ position:'absolute', top:12, right:12, width:22, height:22, borderRadius:'50%', background:l.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.72rem', animation:'checkPop .25s ease' }}>✓</div>}
                  </button>
                ))}
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', maxWidth:700, margin:'0 auto' }}>
                <button className="ob-btn-sec" onClick={back}>← Back</button>
                <button className="ob-btn-pri" disabled={!level} onClick={next}>Continue →</button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Study Hours ── */}
          {step === 4 && (
            <div style={{ animation:'fadeUp .4s ease' }}>
              <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:'.75rem' }}>⏰</div>
                <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.2rem)', fontWeight:900, marginBottom:'.65rem',
                  background:'linear-gradient(135deg,#fff,#A78BFA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  How many hours can you study daily?
                </h1>
                <p style={{ color:'rgba(255,255,255,.45)', fontSize:'.95rem' }}>We'll build a realistic study plan that fits your actual schedule.</p>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1rem', marginBottom:'2.5rem', maxWidth:700, margin:'0 auto 2.5rem' }}>
                {STUDY_HOURS.map((h, i) => (
                  <button key={h.id} className={`ob-card${studyHours===h.id?' selected':''}`}
                    style={{ border:`2px solid ${studyHours===h.id?'#0EA5E9':'rgba(255,255,255,.08)'}`,
                      background: studyHours===h.id?'rgba(14,165,233,.12)':'rgba(255,255,255,.04)',
                      display:'flex', alignItems:'center', gap:'1rem',
                      animation:`fadeUp .3s ${i*.06}s ease both` }}
                    onClick={() => setStudyHours(h.id)}>
                    <div style={{ fontSize:'2rem', flexShrink:0 }}>{h.icon}</div>
                    <div>
                      <div style={{ fontWeight:900, fontSize:'1rem', marginBottom:'.2rem' }}>{h.label}</div>
                      <div style={{ fontSize:'.78rem', color:'rgba(255,255,255,.5)' }}>{h.desc}</div>
                    </div>
                    {studyHours===h.id && <div style={{ marginLeft:'auto', width:22, height:22, borderRadius:'50%', background:'#0EA5E9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.72rem', flexShrink:0, animation:'checkPop .25s ease' }}>✓</div>}
                  </button>
                ))}
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', maxWidth:700, margin:'0 auto' }}>
                <button className="ob-btn-sec" onClick={back}>← Back</button>
                <button className="ob-btn-pri" disabled={!studyHours} onClick={next}>Continue →</button>
              </div>
            </div>
          )}

          {/* ── STEP 5: Exam Year ── */}
          {step === 5 && (
            <div style={{ animation:'fadeUp .4s ease' }}>
              <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:'.75rem' }}>📅</div>
                <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.2rem)', fontWeight:900, marginBottom:'.65rem',
                  background:'linear-gradient(135deg,#fff,#A78BFA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  Which attempt are you targeting?
                </h1>
                <p style={{ color:'rgba(255,255,255,.45)', fontSize:'.95rem' }}>Sets your countdown timer and helps us pace your study plan accordingly.</p>
              </div>

              <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center', marginBottom:'2.5rem' }}>
                {EXAM_YEARS.map((yr, i) => {
                  const monthsLeft = Math.round(((new Date(yr, 5, 1)).getTime() - Date.now()) / (1000*60*60*24*30))
                  return (
                    <button key={yr} className={`ob-card${examYear===yr?' selected':''}`}
                      style={{ border:`2px solid ${examYear===yr?'#F59E0B':'rgba(255,255,255,.08)'}`,
                        background: examYear===yr?'rgba(245,158,11,.12)':'rgba(255,255,255,.04)',
                        minWidth:160, textAlign:'center', animation:`fadeUp .3s ${i*.07}s ease both` }}
                      onClick={() => setExamYear(yr)}>
                      <div style={{ fontSize:'2rem', fontWeight:900, marginBottom:'.3rem' }}>{yr}</div>
                      <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.45)' }}>~{monthsLeft > 0 ? `${monthsLeft} months away` : 'This year'}</div>
                      {examYear===yr && <div style={{ marginTop:'.5rem', fontSize:'.68rem', color:'#F59E0B', fontWeight:800 }}>✓ Selected</div>}
                    </button>
                  )
                })}
              </div>

              {/* Countdown badge */}
              <div style={{ maxWidth:500, margin:'0 auto 2rem', background:'rgba(245,158,11,.08)', border:'1px solid rgba(245,158,11,.25)', borderRadius:14, padding:'1rem 1.25rem', textAlign:'center' }}>
                <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.4)', fontWeight:700, marginBottom:'.3rem' }}>YOUR EXAM COUNTDOWN</div>
                <div style={{ fontWeight:900, fontSize:'1.3rem', color:'#F59E0B' }}>
                  {Math.round(((new Date(examYear, 5, 1)).getTime() - Date.now()) / (1000*60*60*24))} days left
                </div>
                <div style={{ fontSize:'.78rem', color:'rgba(255,255,255,.4)', marginTop:'.25rem' }}>Target: {selectedExam?.label} {examYear}</div>
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', maxWidth:500, margin:'0 auto' }}>
                <button className="ob-btn-sec" onClick={back}>← Back</button>
                <button className="ob-btn-pri" onClick={next}>Continue →</button>
              </div>
            </div>
          )}

          {/* ── STEP 6: All Set / Summary ── */}
          {step === 6 && (
            <div style={{ animation:'fadeUp .4s ease', textAlign:'center' }}>
              <div style={{ fontSize:'4rem', marginBottom:'1rem', animation:'float 2s ease-in-out infinite' }}>🚀</div>
              <h1 style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', fontWeight:900, marginBottom:'.75rem',
                background:'linear-gradient(135deg,#22C55E,#06B6D4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                You're all set!
              </h1>
              <p style={{ color:'rgba(255,255,255,.5)', fontSize:'1rem', marginBottom:'2rem', maxWidth:520, margin:'0 auto 2rem' }}>
                Your personalized dashboard is ready. Here's what we've prepared for you:
              </p>

              {/* Profile summary card */}
              <div style={{ maxWidth:540, margin:'0 auto 2.5rem', background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.1)', borderRadius:22, padding:'1.75rem', textAlign:'left' }}>
                <div style={{ display:'flex', gap:'.65rem', alignItems:'center', marginBottom:'1.25rem', paddingBottom:'1rem', borderBottom:'1px solid rgba(255,255,255,.06)' }}>
                  <div style={{ width:48, height:48, borderRadius:'50%', background:`linear-gradient(135deg,${selectedExam?.color ?? '#7C3AED'},#4F46E5)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0 }}>
                    {selectedExam?.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight:900, fontSize:'1rem' }}>{selectedExam?.label} Aspirant</div>
                    <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.4)', marginTop:'.15rem' }}>{selectedExam?.body} · {examYear} Batch</div>
                  </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
                  {[
                    ['🎯 Target Exam',  selectedExam?.label ?? '—'],
                    ['📋 Category',     CATEGORIES.find(c=>c.id===category)?.label ?? '—'],
                    ['📊 Current Level',LEVELS.find(l=>l.id===level)?.label.replace(/ [🌱📚🔥🎯]/,'') ?? '—'],
                    ['⏰ Daily Study',   `${studyHours} hours/day`],
                    ['📅 Target Year',  String(examYear)],
                    ['🗓️ Days Left',    `${Math.round(((new Date(examYear, 5, 1)).getTime() - Date.now()) / (1000*60*60*24))} days`],
                  ].map(([l, v]) => (
                    <div key={l as string} style={{ background:'rgba(255,255,255,.04)', borderRadius:12, padding:'.65rem .85rem', border:'1px solid rgba(255,255,255,.06)' }}>
                      <div style={{ fontSize:'.65rem', color:'rgba(255,255,255,.35)', fontWeight:700, marginBottom:'.2rem' }}>{l}</div>
                      <div style={{ fontWeight:800, fontSize:'.88rem' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's waiting for them */}
              <div style={{ maxWidth:540, margin:'0 auto 2.5rem', display:'flex', flexDirection:'column', gap:'.55rem' }}>
                {[
                  ['✅', 'Personalised 7-day study plan generated'],
                  ['✅', `${selectedExam?.label}-specific mock tests unlocked`],
                  ['✅', 'PYQ browser filtered to your target exam'],
                  ['✅', 'Syllabus tracker configured for your level'],
                  ['✅', 'Daily missions & streak tracker activated'],
                ].map(([icon, txt], i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'.75rem', background:'rgba(34,197,94,.05)', border:'1px solid rgba(34,197,94,.15)', borderRadius:12, padding:'.65rem 1rem', animation:`fadeUp .3s ${i*.08}s ease both` }}>
                    <span style={{ fontSize:'1rem', flexShrink:0 }}>{icon}</span>
                    <span style={{ fontSize:'.88rem', color:'rgba(255,255,255,.75)', fontWeight:600 }}>{txt}</span>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
                <button className="ob-btn-sec" onClick={back} style={{ padding:'.85rem 1.5rem' }}>← Review</button>
                <button className="ob-btn-pri" disabled={saving} onClick={finish}
                  style={{ padding:'.95rem 2.5rem', fontSize:'1.05rem', minWidth:220,
                    background: saving ? 'rgba(124,58,237,.5)' : 'linear-gradient(135deg,#7C3AED,#06B6D4)',
                    boxShadow:'0 0 40px rgba(124,58,237,.35)' }}>
                  {saving ? (
                    <span style={{ display:'flex', alignItems:'center', gap:'.5rem', justifyContent:'center' }}>
                      <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,.4)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin .6s linear infinite' }} />
                      Launching Dashboard…
                    </span>
                  ) : '🚀 Go to My Dashboard'}
                </button>
              </div>

              <p style={{ marginTop:'1.25rem', fontSize:'.72rem', color:'rgba(255,255,255,.25)' }}>You can update these preferences anytime from Settings</p>
            </div>
          )}

        </div>
      </div>

      {/* Bottom progress text */}
      <div style={{ textAlign:'center', padding:'.85rem', fontSize:'.72rem', color:'rgba(255,255,255,.2)', fontWeight:600, position:'relative', zIndex:1 }}>
        ExamOS · Trusted by 2 Lakh+ Aspirants across India
      </div>

      {/* spin keyframes inline (can't put in STYLE easily) */}
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  )
}
