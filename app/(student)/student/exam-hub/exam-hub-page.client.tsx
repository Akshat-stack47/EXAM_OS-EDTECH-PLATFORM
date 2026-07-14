'use client'

import { useState } from 'react'
import Link from 'next/link'

/* ─── Exam Hub Data ──────────────────────────────────────────────── */
type Exam = {
  code: string
  name: string
  fullName: string
  conductingBody: string
  emoji: string
  accent: string
  vacancies: string
  eligibility: string
  ageLimit: string
  category: string
  upcomingDates: { event: string; date: string }[]
  syllabus: { subject: string; topics: string[] }[]
  stages: string[]
  salary: string
}

const EXAMS: Exam[] = [
  {
    code:'UPSC', name:'UPSC CSE', fullName:'Union Public Service Commission Civil Services Examination',
    conductingBody:'Union Public Service Commission', emoji:'🏛️', accent:'#7C3AED',
    vacancies:'~1000/year', eligibility:'Graduation in any stream', ageLimit:'21–32 years (General)',
    category:'Central Government', salary:'₹56,100 – ₹2,50,000 (Grade Pay + HRA + DA)',
    upcomingDates:[
      { event:'Notification Release', date:'Feb 2026' },
      { event:'Application Last Date', date:'Mar 2026' },
      { event:'Prelims Exam', date:'May 2026' },
      { event:'Mains Exam', date:'Sep 2026' },
      { event:'Interview', date:'Jan–Mar 2027' },
    ],
    stages:['Prelims (GS-1 + CSAT)','Mains (GS-1 to GS-4 + Essay + Optional)','Personality Test (Interview)'],
    syllabus:[
      { subject:'General Studies 1', topics:['Indian History & Culture','World History','Society & Social Issues','Geography','Art & Architecture'] },
      { subject:'General Studies 2 (Polity)', topics:['Indian Constitution','Parliament','Governance','International Relations','Social Justice','Welfare Schemes'] },
      { subject:'General Studies 3 (Economy)', topics:['Indian Economy','Agriculture','Infrastructure','Science & Technology','Disaster Management','Environmental Issues'] },
      { subject:'General Studies 4 (Ethics)', topics:['Ethics & Integrity','Attitude','Aptitude','Emotional Intelligence','Case Studies','Public Service Values'] },
      { subject:'CSAT', topics:['Reading Comprehension','Interpersonal Skills','Logical Reasoning','Analytical Ability','Decision Making','Basic Numeracy'] },
    ],
  },
  {
    code:'SSC', name:'SSC CGL', fullName:'Staff Selection Commission Combined Graduate Level',
    conductingBody:'Staff Selection Commission', emoji:'📋', accent:'#06B6D4',
    vacancies:'~10,000–15,000/year', eligibility:'Bachelor\'s Degree (any stream)', ageLimit:'18–32 years',
    category:'Central Government', salary:'₹25,500 – ₹81,100 (Pay Level 4–8)',
    upcomingDates:[
      { event:'Notification Release', date:'Apr 2026' },
      { event:'Application Last Date', date:'May 2026' },
      { event:'Tier-1 Exam (CBE)', date:'Jul–Aug 2026' },
      { event:'Tier-2 Exam (CBE)', date:'Oct–Nov 2026' },
    ],
    stages:['Tier-1 (MCQ 200 marks, 60 min)','Tier-2 (Paper-1 Compulsory + Paper-2/3 for specific posts)','Document Verification'],
    syllabus:[
      { subject:'General Intelligence & Reasoning', topics:['Analogy','Classification','Series','Coding-Decoding','Puzzle','Matrix','Blood Relations','Direction Sense','Venn Diagrams'] },
      { subject:'Quantitative Aptitude', topics:['Number System','HCF & LCM','Percentage','Profit & Loss','Ratio & Proportion','Time & Work','Time & Distance','Geometry','Data Interpretation'] },
      { subject:'English Language', topics:['Reading Comprehension','Cloze Test','Para Jumbles','Error Detection','Fill in the Blanks','Vocabulary','Idioms & Phrases','One-word Substitution'] },
      { subject:'General Awareness', topics:['History','Geography','Polity','Economy','Science','Current Affairs','Sports','Awards','Books & Authors','Important Days'] },
    ],
  },
  {
    code:'BANK', name:'IBPS PO', fullName:'Institute of Banking Personnel Selection Probationary Officer',
    conductingBody:'IBPS', emoji:'🏦', accent:'#22C55E',
    vacancies:'~4,000–5,000/year', eligibility:'Graduation (any stream), 21–30 years', ageLimit:'21–30 years',
    category:'Banking', salary:'₹36,000 – ₹63,840 (Basic + DA + HRA)',
    upcomingDates:[
      { event:'Notification Release', date:'Jul 2026' },
      { event:'Application Last Date', date:'Aug 2026' },
      { event:'Prelims Exam', date:'Oct 2026' },
      { event:'Mains Exam', date:'Nov 2026' },
      { event:'Interview', date:'Jan–Feb 2027' },
    ],
    stages:['Prelims (3 sections, 60 min)','Mains (4 sections + Descriptive, 3.5 hours)','Interview (100 marks)'],
    syllabus:[
      { subject:'Reasoning Ability', topics:['Puzzle & Seating Arrangement','Syllogism','Coding-Decoding','Blood Relations','Direction Sense','Inequalities','Input-Output','Order & Ranking'] },
      { subject:'Quantitative Aptitude', topics:['Data Interpretation','Number Series','Quadratic Equations','Time & Work','Profit & Loss','Percentage','Simplification','Approximation','Mensuration'] },
      { subject:'English Language', topics:['Reading Comprehension','Cloze Test','Error Detection','Sentence Correction','Para Jumbles','Fill in the Blanks','Vocabulary','Inference Questions'] },
      { subject:'Banking Awareness', topics:['RBI & Monetary Policy','Financial Institutions','Banking Terms','NBFCs','Payment Systems','Government Schemes','Budget Highlights','Insurance & Capital Markets'] },
      { subject:'Computer Aptitude', topics:['Computer Basics','MS Office Suite','Internet & Networking','Keyboard Shortcuts','Database','Operating Systems','Computer Security','Input/Output Devices'] },
    ],
  },
  {
    code:'RAIL', name:'RRB NTPC', fullName:'Railway Recruitment Board Non-Technical Popular Category',
    conductingBody:'Railway Recruitment Boards', emoji:'🚂', accent:'#F59E0B',
    vacancies:'~35,000/year', eligibility:'12th Pass / Graduation', ageLimit:'18–33 years',
    category:'Railway', salary:'₹19,900 – ₹35,400 (Depending on post)',
    upcomingDates:[
      { event:'Notification Release', date:'Q1 2026' },
      { event:'Application Last Date', date:'Q2 2026' },
      { event:'CBT-1 Exam', date:'Q3 2026' },
      { event:'CBT-2 Exam', date:'Q4 2026' },
      { event:'Typing/Skill Test', date:'Q1 2027' },
    ],
    stages:['CBT Stage-1 (100 Qs, 90 min)','CBT Stage-2 (120 Qs, 90 min)','Typing/Skill Test (for applicable posts)','Document Verification & Medical'],
    syllabus:[
      { subject:'Mathematics', topics:['Number System','Decimal Fractions','LCM & HCF','Ratio & Proportion','Percentage','Mensuration','Time & Work','Time & Distance','Simple & Compound Interest','Profit & Loss'] },
      { subject:'General Intelligence & Reasoning', topics:['Analogy','Alphabetical & Number Series','Coding & Decoding','Mathematical Operations','Relationships','Syllogism','Jumbling','Venn Diagram','Data Interpretation','Conclusions'] },
      { subject:'General Awareness', topics:['Current Events','Indian Geography','History & Culture','Indian Polity','Economy','Environmental Issues','Science & Technology','Sports','Art & Culture','Famous Personalities'] },
      { subject:'General Science', topics:['Physics (10th Level)','Chemistry (10th Level)','Biology (10th Level)','Environmental Science','Basic Computer Concepts'] },
    ],
  },
  {
    code:'NDA', name:'NDA', fullName:'National Defence Academy Examination',
    conductingBody:'Union Public Service Commission', emoji:'⚔️', accent:'#F97316',
    vacancies:'~370–400/year', eligibility:'10+2 (PCM for Army/Navy/AF tech), any stream for AF non-tech', ageLimit:'16.5–19.5 years (Unmarried Males)',
    category:'Defence', salary:'₹56,100 during training; ₹67,700+ after commissioning',
    upcomingDates:[
      { event:'NDA-1 Notification', date:'Jan 2026' },
      { event:'NDA-1 Exam', date:'Apr 2026' },
      { event:'NDA-2 Notification', date:'Jun 2026' },
      { event:'NDA-2 Exam', date:'Sep 2026' },
      { event:'SSB Interview (NDA-1)', date:'Jul–Nov 2026' },
    ],
    stages:['Written Exam (Paper-1 Maths + Paper-2 GAT)','SSB Interview (5-day process)','Medical Examination','Merit List & Allotment'],
    syllabus:[
      { subject:'Mathematics (Paper-1)', topics:['Algebra','Matrices & Determinants','Trigonometry','Analytical Geometry (2D & 3D)','Differential Calculus','Integral Calculus','Vector Algebra','Statistics & Probability'] },
      { subject:'General Ability Test — English', topics:['Grammar & Usage','Vocabulary','Comprehension','Cohesion','Reading Unseen Passages','Basic Composition'] },
      { subject:'GAT — General Knowledge', topics:['Physics','Chemistry','General Science','History','Geography','Current Events','Indian Constitution','Sports & Awards'] },
    ],
  },
  {
    code:'GATE', name:'GATE CS', fullName:'Graduate Aptitude Test in Engineering — Computer Science',
    conductingBody:'IITs / IISc (rotational)', emoji:'💻', accent:'#06B6D4',
    vacancies:'N/A (PSU recruitment + PG admissions)', eligibility:'B.Tech/B.E. in CS/IT or related', ageLimit:'No age limit',
    category:'Engineering / PSU / IIT-M Tech', salary:'PSU: ₹30,000–₹80,000+ CTC depending on organisation',
    upcomingDates:[
      { event:'Registration Opens', date:'Sep 2026' },
      { event:'Registration Closes', date:'Oct 2026' },
      { event:'GATE 2027 Exam', date:'Feb 2027' },
      { event:'Result Declaration', date:'Mar 2027' },
    ],
    stages:['Single Paper (65 Qs, 3 hours, 100 marks)','Scorecard valid for 3 years','PSU/University shortlisting based on GATE score'],
    syllabus:[
      { subject:'Engineering Mathematics', topics:['Discrete Mathematics','Linear Algebra','Calculus','Probability & Statistics'] },
      { subject:'Digital Logic & Computer Organization', topics:['Boolean Algebra','Combinational & Sequential Circuits','Machine Instructions','Addressing','ALU & Memory'] },
      { subject:'Programming & Data Structures', topics:['C Programming','Recursion','Arrays, Stacks & Queues','Linked Lists','Trees & Graphs','Hashing'] },
      { subject:'Algorithms', topics:['Searching & Sorting','Greedy Algorithms','Dynamic Programming','Graph Algorithms (BFS/DFS/Dijkstra)','Complexity Analysis (Big-O)'] },
      { subject:'Theory of Computation', topics:['Finite Automata','Regular Languages','Context-Free Grammars','Turing Machines','Decidability','NP-Completeness'] },
      { subject:'Operating Systems', topics:['Processes & Threads','CPU Scheduling','Memory Management','File Systems','Deadlocks','Synchronization'] },
      { subject:'DBMS', topics:['ER Model','Relational Algebra & SQL','Normalization (1NF–3NF/BCNF)','Transactions & Concurrency','Indexing & B-Trees'] },
      { subject:'Computer Networks', topics:['OSI & TCP/IP Models','Data Link Layer','Network Layer & Routing','Transport Layer (TCP/UDP)','Application Layer (DNS/HTTP)'] },
    ],
  },
  {
    code:'PSC', name:'State PSC', fullName:'State Public Service Commission Civil Services',
    conductingBody:'State Public Service Commission', emoji:'🗺️', accent:'#E879F9',
    vacancies:'Varies by state (50–5000/year)', eligibility:'Graduation (any stream)', ageLimit:'21–40 years (varies by state)',
    category:'State Government', salary:'₹40,000 – ₹1,50,000 (varies by state & post)',
    upcomingDates:[
      { event:'Notification (varies by state)', date:'Throughout year' },
      { event:'Prelims', date:'Varies by state' },
      { event:'Mains', date:'Varies by state' },
      { event:'Interview', date:'Varies by state' },
    ],
    stages:['Prelims (State-specific pattern)','Mains (7–9 papers)','Interview/Personality Test'],
    syllabus:[
      { subject:'General Studies (GS-1)', topics:['State History & Culture','Indian History','Geography (National + State)','Art & Architecture','Society & Social Issues'] },
      { subject:'General Studies (GS-2)', topics:['Indian & State Polity','Parliament & State Legislature','Constitution','Governance','International Relations','Social Justice'] },
      { subject:'General Studies (GS-3)', topics:['Indian & State Economy','Agriculture','Infrastructure','Science & Technology','Disaster Management','Environment & Ecology'] },
      { subject:'General Studies (GS-4)', topics:['Ethics','Integrity','Aptitude','Emotional Intelligence','Attitude','Case Studies'] },
    ],
  },
]

const STYLE = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .exam-card { background:rgba(255,255,255,0.035); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:1.5rem; cursor:pointer; transition:all 0.2s ease; }
  .exam-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,0.45); }
  .topic-pill { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:7px; padding:0.22rem 0.6rem; font-size:0.7rem; color:rgba(255,255,255,0.5); }
`

export default function ExamHubPageClient() {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [activeSection, setActiveSection] = useState<'overview'|'syllabus'|'dates'>('overview')

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:'#0D0D1A', minHeight:'100vh', color:'#fff' }}>
      <style>{STYLE}</style>

      {/* ── Header ── */}
      <div style={{ background:'rgba(13,13,26,0.97)', borderBottom:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth:1300, margin:'0 auto', padding:'0 2rem', display:'flex', alignItems:'center', gap:'1rem', height:64 }}>
          {selectedExam ? (
            <button onClick={() => setSelectedExam(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.4)', fontSize:'0.9rem', fontFamily:'inherit', transition:'color 0.15s' }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='#fff'}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.4)'}>
              ← All Exams
            </button>
          ) : (
            <Link href="/student/dashboard" style={{ color:'rgba(255,255,255,0.4)', textDecoration:'none', fontSize:'0.9rem' }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='#fff'}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.4)'}>
              ← Dashboard
            </Link>
          )}
          <div style={{ width:1, height:20, background:'rgba(255,255,255,0.12)' }} />
          <span style={{ fontSize:'1.3rem' }}>🎓</span>
          <div>
            <div style={{ fontWeight:800, fontSize:'0.95rem' }}>Exam Hub</div>
            <div style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.4)', fontWeight:600 }}>
              {selectedExam ? selectedExam.fullName : `${EXAMS.length} major government exams`}
            </div>
          </div>
          {selectedExam && (
            <div style={{ marginLeft:'auto', display:'flex', gap:'0.35rem' }}>
              {(['overview','syllabus','dates'] as const).map(s => (
                <button key={s} onClick={() => setActiveSection(s)}
                  style={{ border:'none', borderRadius:9, padding:'0.45rem 0.9rem', fontSize:'0.78rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'all 0.18s',
                    background: activeSection===s ? `${selectedExam.accent}22` : 'transparent',
                    color: activeSection===s ? selectedExam.accent : 'rgba(255,255,255,0.4)' }}>
                  {s==='overview'?'📋 Overview':s==='syllabus'?'📚 Syllabus':'📅 Key Dates'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth:1300, margin:'0 auto', padding:'2rem' }}>

        {/* ══ EXAM GRID ══ */}
        {!selectedExam && (
          <div>
            <div style={{ marginBottom:'1.75rem' }}>
              <h1 style={{ fontSize:'1.5rem', fontWeight:900, margin:'0 0 0.4rem' }}>🎓 Exam Hub</h1>
              <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.88rem', margin:0 }}>Explore eligibility, syllabus, vacancies and upcoming dates for all major government exams</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'1.25rem' }}>
              {EXAMS.map((exam, i) => (
                <div key={exam.code} className="exam-card" style={{ animation:`fadeUp 0.4s ${i*0.06}s ease both`, position:'relative', overflow:'hidden' }}
                  onClick={() => { setSelectedExam(exam); setActiveSection('overview') }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${exam.accent},transparent)` }} />
                  <div style={{ display:'flex', alignItems:'flex-start', gap:'0.85rem', marginBottom:'0.9rem' }}>
                    <span style={{ fontSize:'2rem' }}>{exam.emoji}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:900, fontSize:'1rem' }}>{exam.name}</div>
                      <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)', marginTop:'0.15rem', lineHeight:1.4 }}>{exam.conductingBody}</div>
                    </div>
                    <span style={{ fontSize:'0.65rem', fontWeight:800, padding:'0.2rem 0.6rem', borderRadius:100, background:`${exam.accent}22`, color:exam.accent, border:`1px solid ${exam.accent}44`, whiteSpace:'nowrap' }}>{exam.category}</span>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'0.85rem' }}>
                    {[['👥 Vacancies', exam.vacancies],['🎂 Age Limit', exam.ageLimit],['🎓 Eligibility', exam.eligibility],['💰 Salary', exam.salary]].map(([l,v]) => (
                      <div key={l as string} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, padding:'0.5rem 0.7rem' }}>
                        <div style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.35)', marginBottom:'0.2rem' }}>{l}</div>
                        <div style={{ fontSize:'0.73rem', fontWeight:700 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.35)' }}>{exam.stages.length} stage{exam.stages.length!==1?'s':''} · {exam.syllabus.length} subjects</span>
                    <span style={{ fontSize:'0.75rem', fontWeight:700, color:exam.accent }}>View Details →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ EXAM DETAIL ══ */}
        {selectedExam && (
          <div style={{ animation:'fadeUp 0.3s ease' }}>
            {/* Hero */}
            <div style={{ background:`${selectedExam.accent}10`, border:`1px solid ${selectedExam.accent}28`, borderRadius:20, padding:'1.75rem', marginBottom:'1.5rem' }}>
              <div style={{ display:'flex', gap:'1rem', alignItems:'center', flexWrap:'wrap', marginBottom:'1rem' }}>
                <span style={{ fontSize:'2.5rem' }}>{selectedExam.emoji}</span>
                <div>
                  <h2 style={{ margin:0, fontSize:'1.3rem', fontWeight:900 }}>{selectedExam.name}</h2>
                  <p style={{ margin:'0.2rem 0 0', fontSize:'0.8rem', color:'rgba(255,255,255,0.45)' }}>{selectedExam.fullName}</p>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'0.75rem' }}>
                {[['🏢 Conducting Body', selectedExam.conductingBody],['👥 Vacancies', selectedExam.vacancies],['🎂 Age Limit', selectedExam.ageLimit],['🎓 Eligibility', selectedExam.eligibility],['💰 Salary', selectedExam.salary]].map(([l,v]) => (
                  <div key={l as string} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'0.7rem 1rem' }}>
                    <div style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.35)', marginBottom:'0.25rem' }}>{l}</div>
                    <div style={{ fontSize:'0.8rem', fontWeight:700 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Overview ── */}
            {activeSection === 'overview' && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
                {/* Stages */}
                <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, padding:'1.5rem' }}>
                  <h3 style={{ margin:'0 0 1rem', fontSize:'0.9rem', fontWeight:800 }}>📋 Exam Stages</h3>
                  {selectedExam.stages.map((s, i) => (
                    <div key={i} style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start', marginBottom:'0.75rem' }}>
                      <div style={{ width:26, height:26, borderRadius:'50%', background:`${selectedExam.accent}22`, border:`1px solid ${selectedExam.accent}55`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem', fontWeight:900, color:selectedExam.accent, flexShrink:0 }}>{i+1}</div>
                      <div style={{ fontSize:'0.83rem', color:'rgba(255,255,255,0.75)', paddingTop:'0.2rem', lineHeight:1.5 }}>{s}</div>
                    </div>
                  ))}
                </div>
                {/* CTA */}
                <div style={{ background:'rgba(124,58,237,0.06)', border:'1px solid rgba(124,58,237,0.15)', borderRadius:18, padding:'1.5rem', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                  <h3 style={{ margin:'0 0 0.5rem', fontSize:'0.9rem', fontWeight:800 }}>🚀 Start Preparing</h3>
                  {[
                    { label:'📝 Mock Tests', href:'/student/mock-tests', desc:'Practice with full-length mocks' },
                    { label:'📄 PYQ Browser', href:'/student/pyq', desc:'Solve previous year questions' },
                    { label:'📚 Syllabus Tracker', href:'/student/syllabus', desc:'Track your subject coverage' },
                    { label:'▶️ Video Lectures', href:'/student/video-lectures', desc:'YouTube playlists by subject' },
                    { label:'🧠 AI Study Plan', href:'/student/ai-chat', desc:'Get personalised 7-day plan' },
                  ].map(a => (
                    <Link key={a.href} href={a.href} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:11, padding:'0.7rem 1rem', textDecoration:'none', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'all 0.18s' }}
                      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(124,58,237,0.12)';(e.currentTarget as HTMLElement).style.borderColor='rgba(124,58,237,0.35)';}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)';(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.08)';}}>
                      <div>
                        <div style={{ fontSize:'0.82rem', fontWeight:700, color:'#fff' }}>{a.label}</div>
                        <div style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.4)', marginTop:'0.1rem' }}>{a.desc}</div>
                      </div>
                      <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.8rem' }}>→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ── Syllabus ── */}
            {activeSection === 'syllabus' && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'1.1rem' }}>
                {selectedExam.syllabus.map((sub, i) => (
                  <div key={sub.subject} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, padding:'1.4rem', animation:`fadeUp 0.3s ${i*0.05}s ease both` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.9rem' }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:selectedExam.accent, flexShrink:0 }} />
                      <h3 style={{ margin:0, fontSize:'0.88rem', fontWeight:800 }}>{sub.subject}</h3>
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'0.35rem' }}>
                      {sub.topics.map(t => (
                        <span key={t} className="topic-pill">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Dates ── */}
            {activeSection === 'dates' && (
              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, overflow:'hidden', maxWidth:700 }}>
                <div style={{ padding:'1rem 1.5rem', borderBottom:'1px solid rgba(255,255,255,0.07)', fontWeight:800, fontSize:'0.9rem' }}>📅 Upcoming Important Dates — {selectedExam.name}</div>
                {selectedExam.upcomingDates.map((d, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.9rem 1.5rem', borderBottom:'1px solid rgba(255,255,255,0.05)', background: i%2===0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:selectedExam.accent, flexShrink:0 }} />
                      <span style={{ fontSize:'0.85rem', fontWeight:600 }}>{d.event}</span>
                    </div>
                    <span style={{ fontSize:'0.82rem', fontWeight:800, color:selectedExam.accent }}>{d.date}</span>
                  </div>
                ))}
                <div style={{ padding:'1rem 1.5rem', fontSize:'0.72rem', color:'rgba(255,255,255,0.3)' }}>
                  ⚠️ Dates are approximate. Always verify from the official {selectedExam.conductingBody} website before applying.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
