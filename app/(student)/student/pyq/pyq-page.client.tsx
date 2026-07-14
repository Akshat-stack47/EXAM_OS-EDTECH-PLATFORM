'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'

/* ─── PYQ Data per Exam ─────────────────────────────────────────────
   Format: year, paper, topic path, question, options, correct, explanation, difficulty
─────────────────────────────────────────────────────────────────── */
type PYQ = {
  id: string
  year: number
  paper: string
  topicPath: string
  topic: string
  subject: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correct: 'A' | 'B' | 'C' | 'D'
  explanation: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  exams: string[]
}

const PYQ_DATA: PYQ[] = [
  // ── UPSC Prelims — Polity ──
  { id:'u1', year:2023, paper:'GS-1', topicPath:'polity.fundamental_rights', topic:'Fundamental Rights', subject:'Polity', exams:['UPSC','PSC'],
    question:'With reference to the Indian Constitution, consider the following statements:\n1. No person can be compelled to pay any taxes for the promotion of a particular religion.\n2. No religious instruction shall be provided in any educational institution maintained out of State funds.\nWhich of the above statements is/are correct?',
    optionA:'1 only', optionB:'2 only', optionC:'Both 1 and 2', optionD:'Neither 1 nor 2',
    correct:'C', difficulty:'Medium',
    explanation:'Article 27 prohibits compelling any person to pay taxes for promotion of a particular religion. Article 28(1) prohibits religious instruction in state-funded institutions. Both statements are correct per Articles 27 and 28 of the Constitution.' },

  { id:'u2', year:2023, paper:'GS-1', topicPath:'polity.parliament', topic:'Parliament', subject:'Polity', exams:['UPSC','PSC'],
    question:'Consider the following statements about the Speaker of Lok Sabha:\n1. The Speaker is elected by the members of Lok Sabha.\n2. The Speaker vacates office if they cease to be a member of Lok Sabha.\n3. No resolution for removal of the Speaker can be introduced when the Lok Sabha is in session.\nWhich of the above statements are correct?',
    optionA:'1 and 2 only', optionB:'1 and 3 only', optionC:'2 and 3 only', optionD:'1, 2 and 3',
    correct:'A', difficulty:'Medium',
    explanation:'Statements 1 and 2 are correct. Resolution for removal of Speaker requires 14-day advance notice (Art. 94), not that it cannot be introduced during session. Statement 3 is incorrect.' },

  { id:'u3', year:2022, paper:'GS-1', topicPath:'history.modern_india.movements', topic:'Freedom Struggle', subject:'History', exams:['UPSC','PSC','SSC'],
    question:'With reference to the Indian freedom struggle, which of the following events happened earliest?',
    optionA:'Partition of Bengal', optionB:'Champaran Satyagraha', optionC:'Lucknow Pact', optionD:'Jallianwala Bagh Massacre',
    correct:'A', difficulty:'Easy',
    explanation:'Partition of Bengal (1905) happened first, followed by Lucknow Pact (1916), Champaran Satyagraha (1917), and Jallianwala Bagh Massacre (1919).' },

  { id:'u4', year:2022, paper:'GS-1', topicPath:'geography.physical.rivers', topic:'Rivers of India', subject:'Geography', exams:['UPSC','PSC','SSC'],
    question:'Consider the following rivers:\n1. Barak\n2. Lohit\n3. Subansiri\nWhich of the above are tributaries of the Brahmaputra?',
    optionA:'1 and 2 only', optionB:'2 and 3 only', optionC:'1 and 3 only', optionD:'1, 2 and 3',
    correct:'B', difficulty:'Medium',
    explanation:'Lohit and Subansiri are major tributaries of the Brahmaputra in Assam. Barak is an independent river that flows into Bangladesh as Surma-Meghna.' },

  { id:'u5', year:2021, paper:'GS-1', topicPath:'economy.banking.rbi', topic:'RBI & Banking', subject:'Economy', exams:['UPSC','PSC','BANK'],
    question:'Which one of the following best describes the term "Merchant Discount Rate" sometimes seen in news?',
    optionA:'The incentive given by a bank to its merchants for using point-of-sale terminals',
    optionB:'The charge paid by a merchant to a bank for credit/debit card transactions',
    optionC:'The interest levied by a bank on a merchant loan',
    optionD:'The minimum transaction value for a merchant to accept card payments',
    correct:'B', difficulty:'Medium',
    explanation:'Merchant Discount Rate (MDR) is the rate charged from a merchant by a bank for providing credit/debit card services, covering processing costs, network fees, and bank margins.' },

  { id:'u6', year:2021, paper:'GS-1', topicPath:'environment.biodiversity.species', topic:'Biodiversity', subject:'Environment', exams:['UPSC','PSC'],
    question:'Which of the following are reasons for the decline of the Great Indian Bustard?\n1. Collision with power transmission lines\n2. Predation by feral cats and dogs\n3. Hunting for meat\n4. Climate change\nSelect the correct answer:',
    optionA:'1 and 2 only', optionB:'2, 3 and 4', optionC:'1, 2 and 3', optionD:'1, 2, 3 and 4',
    correct:'C', difficulty:'Hard',
    explanation:'The Great Indian Bustard (critically endangered) faces threats from power line collisions, predation by dogs/cats, and hunting. Climate change is not a primary documented threat for this species specifically.' },

  { id:'u7', year:2020, paper:'GS-1', topicPath:'science_tech.space', topic:'Space Technology', subject:'Science & Tech', exams:['UPSC','PSC'],
    question:'In the context of ISRO\'s launches, what is the GSLV Mk III primarily designed to carry?',
    optionA:'Communication satellites to low earth orbit', optionB:'Communication satellites to geostationary orbit',
    optionC:'Reconnaissance satellites to polar orbit', optionD:'Remote sensing satellites to sun-synchronous orbit',
    correct:'B', difficulty:'Easy',
    explanation:'GSLV Mk III (LVM3) is designed to carry heavier communication satellites (~4 tonnes) to Geostationary Transfer Orbit (GTO). It was used for Chandrayaan-2 and commercial launches.' },

  // ── SSC CGL ──
  { id:'s1', year:2023, paper:'Tier-1', topicPath:'reasoning.analogy', topic:'Analogy', subject:'Reasoning', exams:['SSC'],
    question:'Doctor : Hospital :: Teacher : ?',
    optionA:'Student', optionB:'School', optionC:'Book', optionD:'Class',
    correct:'B', difficulty:'Easy',
    explanation:'A Doctor works in a Hospital. Similarly, a Teacher works in a School. The relationship is person : place of work.' },

  { id:'s2', year:2023, paper:'Tier-1', topicPath:'quant.percentage', topic:'Percentage', subject:'Quantitative Aptitude', exams:['SSC','BANK'],
    question:'A shopkeeper marks his goods 30% above cost price and then gives a 10% discount. His profit percentage is:',
    optionA:'17%', optionB:'18%', optionC:'17.5%', optionD:'19%',
    correct:'A', difficulty:'Medium',
    explanation:'If CP = 100, MP = 130. SP = 130 × 0.9 = 117. Profit = 17%. Formula: Profit% = (1 + 0.30)(1 - 0.10) - 1 = 1.17 - 1 = 17%.' },

  { id:'s3', year:2022, paper:'Tier-1', topicPath:'english.spotting_errors', topic:'Spotting Errors', subject:'English', exams:['SSC','BANK'],
    question:'Find the part with an error:\n(A) He is working / (B) in this company / (C) since last five years. / (D) No error',
    optionA:'A', optionB:'B', optionC:'C', optionD:'D',
    correct:'A', difficulty:'Easy',
    explanation:'"He has been working" is correct as "since last five years" requires Present Perfect Continuous tense, not Present Continuous.' },

  { id:'s4', year:2022, paper:'Tier-1', topicPath:'gk.history', topic:'History GK', subject:'General Awareness', exams:['SSC','RAIL'],
    question:'The "Doctrine of Lapse" was introduced by which Governor-General of India?',
    optionA:'Lord Dalhousie', optionB:'Lord Wellesley', optionC:'Lord Curzon', optionD:'Lord Rippon',
    correct:'A', difficulty:'Medium',
    explanation:'The Doctrine of Lapse was introduced by Lord Dalhousie (1848–1856) to annex Indian states if the ruler died without a natural heir. Satara, Jhansi, Nagpur were annexed under it.' },

  { id:'s5', year:2021, paper:'Tier-1', topicPath:'reasoning.series', topic:'Number Series', subject:'Reasoning', exams:['SSC','BANK','RAIL'],
    question:'What comes next in the series: 2, 6, 12, 20, 30, ?',
    optionA:'40', optionB:'42', optionC:'44', optionD:'46',
    correct:'B', difficulty:'Easy',
    explanation:'Differences: 4, 6, 8, 10, 12. Next difference = 12. So 30 + 12 = 42. Alternatively, the series is n(n+1): 1×2, 2×3, 3×4, 4×5, 5×6, 6×7 = 42.' },

  // ── Banking (IBPS/SBI) ──
  { id:'b1', year:2023, paper:'IBPS PO Prelims', topicPath:'reasoning.puzzles', topic:'Puzzle', subject:'Reasoning', exams:['BANK'],
    question:'Five persons A, B, C, D, E sit in a row. A sits to the right of B. C sits to the left of E. D sits between A and E. Who sits in the middle?',
    optionA:'A', optionB:'D', optionC:'C', optionD:'E',
    correct:'B', difficulty:'Medium',
    explanation:'Arranging: B-A on right, C on left of E, D between A and E. Order: B, A, D, E, C. D is in the middle (3rd position).' },

  { id:'b2', year:2023, paper:'SBI PO Prelims', topicPath:'banking_awareness.rbi_policy', topic:'Monetary Policy', subject:'Banking Awareness', exams:['BANK'],
    question:'Which rate is used by the RBI to lend money to commercial banks for a very short period against government securities?',
    optionA:'Repo Rate', optionB:'Reverse Repo Rate', optionC:'Marginal Standing Facility Rate', optionD:'Bank Rate',
    correct:'A', difficulty:'Easy',
    explanation:'Repo Rate (Repurchase Agreement Rate) is the rate at which RBI lends money to commercial banks for short-term needs against government securities. As of 2024, it is 6.50%.' },

  { id:'b3', year:2022, paper:'IBPS PO Mains', topicPath:'quant.data_interpretation', topic:'Data Interpretation', subject:'Quantitative Aptitude', exams:['BANK'],
    question:'If the ratio of A\'s age to B\'s age is 3:4 and the sum of their ages is 42, what is B\'s age?',
    optionA:'18', optionB:'24', optionC:'20', optionD:'22',
    correct:'B', difficulty:'Easy',
    explanation:'A:B = 3:4. Total parts = 7. B\'s age = (4/7) × 42 = 24 years.' },

  // ── Railway ──
  { id:'r1', year:2022, paper:'RRB NTPC CBT-1', topicPath:'science.physics.motion', topic:'Physics', subject:'General Science', exams:['RAIL'],
    question:'The unit of electrical resistance is:',
    optionA:'Ampere', optionB:'Volt', optionC:'Ohm', optionD:'Watt',
    correct:'C', difficulty:'Easy',
    explanation:'Electrical resistance is measured in Ohms (Ω), named after German physicist Georg Ohm. Ampere = current, Volt = potential difference, Watt = power.' },

  { id:'r2', year:2022, paper:'RRB NTPC CBT-1', topicPath:'gk.railway_history', topic:'Railway GK', subject:'General Awareness', exams:['RAIL'],
    question:'When was the first passenger railway line opened in India?',
    optionA:'1853', optionB:'1850', optionC:'1856', optionD:'1848',
    correct:'A', difficulty:'Easy',
    explanation:'India\'s first passenger railway line was opened on 16 April 1853, between Bombay (Bori Bunder) and Thane, a distance of 34 km, inaugurated by Great Indian Peninsula Railway.' },

  { id:'r3', year:2021, paper:'RRB Group D', topicPath:'maths.time_work', topic:'Time & Work', subject:'Mathematics', exams:['RAIL','SSC'],
    question:'A can do a piece of work in 10 days and B in 15 days. In how many days can both together complete the work?',
    optionA:'4 days', optionB:'5 days', optionC:'6 days', optionD:'8 days',
    correct:'C', difficulty:'Easy',
    explanation:'A\'s rate = 1/10, B\'s rate = 1/15. Combined rate = 1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6. Together they complete in 6 days.' },

  // ── NDA ──
  { id:'n1', year:2023, paper:'NDA Paper-2', topicPath:'history.world_history', topic:'World History', subject:'History', exams:['NDA'],
    question:'Which battle ended Napoleon Bonaparte\'s rule and led to his final exile to Saint Helena?',
    optionA:'Battle of Austerlitz', optionB:'Battle of Leipzig', optionC:'Battle of Waterloo', optionD:'Battle of Borodino',
    correct:'C', difficulty:'Easy',
    explanation:'The Battle of Waterloo (18 June 1815) in Belgium ended Napoleon\'s rule. He was defeated by the Duke of Wellington (British) and Blücher (Prussian) forces and exiled to Saint Helena.' },

  // ── GATE ──
  { id:'g1', year:2023, paper:'GATE CS', topicPath:'ds.trees.binary_search_tree', topic:'Data Structures', subject:'Data Structures', exams:['GATE'],
    question:'The number of binary trees with 3 nodes is:',
    optionA:'4', optionB:'5', optionC:'6', optionD:'7',
    correct:'B', difficulty:'Medium',
    explanation:'The number of structurally different binary trees with n nodes is the Catalan number C(n). For n=3: C(3) = (1/(3+1)) × C(6,3) = (1/4) × 20 = 5. These correspond to 5 different tree shapes.' },
]

const SUBJECTS_BY_EXAM: Record<string, string[]> = {
  UPSC: ['All Subjects','Polity','History','Geography','Economy','Science & Tech','Environment','Art & Culture','Ethics'],
  SSC:  ['All Subjects','Reasoning','Quantitative Aptitude','English','General Awareness'],
  BANK: ['All Subjects','Reasoning','Quantitative Aptitude','English','Banking Awareness'],
  RAIL: ['All Subjects','Mathematics','Reasoning','General Science','General Awareness'],
  NDA:  ['All Subjects','Mathematics','Physics','Chemistry','History','Geography','English'],
  GATE: ['All Subjects','Data Structures','Algorithms','Mathematics','Operating Systems','Networks','DBMS'],
  PSC:  ['All Subjects','Polity','History','Geography','Economy','Environment'],
}

const DIFF_COLOR = { Easy: '#22C55E', Medium: '#F59E0B', Hard: '#EF4444' }
const EXAM_ACCENT: Record<string, string> = {
  UPSC:'#7C3AED', SSC:'#06B6D4', BANK:'#22C55E', RAIL:'#F59E0B', NDA:'#F97316', PSC:'#E879F9', GATE:'#06B6D4',
}

const STYLE = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .pyq-card { background:rgba(255,255,255,0.033); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:1.4rem; transition:border-color 0.2s, box-shadow 0.2s; }
  .pyq-card:hover { border-color:rgba(124,58,237,0.3); box-shadow:0 8px 28px rgba(0,0,0,0.35); }
  .tab-btn { border:none; background:transparent; cursor:pointer; font-family:inherit; padding:0.5rem 0.9rem; border-radius:9px; font-size:0.8rem; font-weight:700; color:rgba(255,255,255,0.4); transition:all 0.18s; white-space:nowrap; }
  .tab-btn.active { background:rgba(124,58,237,0.18); color:#A78BFA; }
  .tab-btn:hover:not(.active) { background:rgba(255,255,255,0.06); color:#fff; }
  .filter-btn { border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.04); cursor:pointer; font-family:inherit; padding:0.32rem 0.75rem; border-radius:100px; font-size:0.72rem; font-weight:700; color:rgba(255,255,255,0.45); transition:all 0.18s; }
  .filter-btn.active { background:rgba(124,58,237,0.18); border-color:rgba(124,58,237,0.45); color:#A78BFA; }
  .opt-btn { width:100%; text-align:left; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.03); borderRadius:10px; padding:0.65rem 1rem; font-size:0.85rem; color:rgba(255,255,255,0.75); cursor:pointer; font-family:inherit; transition:all 0.18s; }
  .opt-btn:hover { background:rgba(124,58,237,0.1); border-color:rgba(124,58,237,0.3); color:#fff; }
  .opt-btn.correct { background:rgba(34,197,94,0.12) !important; border-color:rgba(34,197,94,0.5) !important; color:#22C55E !important; font-weight:800; }
  .opt-btn.wrong   { background:rgba(239,68,68,0.12) !important; border-color:rgba(239,68,68,0.5) !important; color:#EF4444 !important; font-weight:800; }
  .opt-btn.revealed{ background:rgba(34,197,94,0.08) !important; border-color:rgba(34,197,94,0.3) !important; color:#22C55E !important; }
`

export default function PYQBrowserPageClient() {
  const { data } = trpc.student.getDashboard.useQuery()
  const targetExam = (data?.profile?.targetExam ?? 'UPSC').toUpperCase()
  const accent = EXAM_ACCENT[targetExam] ?? '#7C3AED'

  const [selectedSubject, setSelectedSubject] = useState('All Subjects')
  const [selectedYear, setSelectedYear] = useState(0)
  const [difficulty, setDifficulty] = useState<'All'|'Easy'|'Medium'|'Hard'>('All')
  const [search, setSearch] = useState('')
  const [revealed, setRevealed] = useState<Record<string, string>>({})  // id → selected option
  const [expandedId, setExpandedId] = useState<string|null>(null)

  const subjects = SUBJECTS_BY_EXAM[targetExam] ?? SUBJECTS_BY_EXAM['UPSC']
  const years = [0, 2023, 2022, 2021, 2020, 2019]

  const filtered = useMemo(() => PYQ_DATA.filter(q => {
    if (!q.exams.includes(targetExam)) return false
    if (selectedSubject !== 'All Subjects' && q.subject !== selectedSubject) return false
    if (selectedYear && q.year !== selectedYear) return false
    if (difficulty !== 'All' && q.difficulty !== difficulty) return false
    if (search && !q.question.toLowerCase().includes(search.toLowerCase()) && !q.topic.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [targetExam, selectedSubject, selectedYear, difficulty, search])

  const handleOption = (id: string, opt: string) => {
    if (revealed[id]) return
    setRevealed(prev => ({ ...prev, [id]: opt }))
    setExpandedId(id)
  }

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:'#0D0D1A', minHeight:'100vh', color:'#fff' }}>
      <style>{STYLE}</style>

      {/* ── Header ── */}
      <div style={{ background:'rgba(13,13,26,0.97)', borderBottom:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 2rem', display:'flex', alignItems:'center', gap:'1rem', height:64, flexWrap:'wrap' }}>
          <Link href="/student/dashboard" style={{ color:'rgba(255,255,255,0.4)', textDecoration:'none', fontSize:'0.9rem' }}
            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='#fff'}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.4)'}>
            ← Dashboard
          </Link>
          <div style={{ width:1, height:20, background:'rgba(255,255,255,0.12)' }} />
          <span style={{ fontSize:'1.3rem' }}>📄</span>
          <div>
            <div style={{ fontWeight:800, fontSize:'0.95rem' }}>PYQ Browser</div>
            <div style={{ fontSize:'0.68rem', fontWeight:700, color:accent }}>
              🎯 Previous Year Questions — {targetExam}
            </div>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:'1.25rem', alignItems:'center' }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'1rem', fontWeight:900, color:accent }}>{filtered.length}</div>
              <div style={{ fontSize:'0.58rem', color:'rgba(255,255,255,0.3)', textTransform:'uppercase' }}>Questions</div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'1rem', fontWeight:900, color:'#22C55E' }}>{Object.keys(revealed).length}</div>
              <div style={{ fontSize:'0.58rem', color:'rgba(255,255,255,0.3)', textTransform:'uppercase' }}>Attempted</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'2rem' }}>

        {/* ── Subject Tabs ── */}
        <div style={{ overflowX:'auto', marginBottom:'1.25rem', paddingBottom:'0.25rem' }}>
          <div style={{ display:'flex', gap:'0.3rem', minWidth:'max-content' }}>
            {subjects.map(s => (
              <button key={s} className={`tab-btn${selectedSubject===s?' active':''}`} onClick={() => setSelectedSubject(s)}>{s}</button>
            ))}
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'1rem 1.25rem', marginBottom:'1.5rem', display:'flex', gap:'0.7rem', flexWrap:'wrap', alignItems:'center' }}>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="🔍 Search by keyword or topic…"
            style={{ flex:'1 1 200px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:9, padding:'0.5rem 0.9rem', color:'#fff', fontSize:'0.83rem', outline:'none', transition:'border-color 0.2s' }}
            onFocus={e=>(e.target.style.borderColor='rgba(124,58,237,0.55)')}
            onBlur={e=>(e.target.style.borderColor='rgba(255,255,255,0.1)')} />

          <div style={{ width:1, height:18, background:'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.35)', fontWeight:700, textTransform:'uppercase' }}>Year:</span>
          {years.map(y => (
            <button key={y} className={`filter-btn${selectedYear===y?' active':''}`} onClick={() => setSelectedYear(y)}>{y === 0 ? 'All' : y}</button>
          ))}

          <div style={{ width:1, height:18, background:'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.35)', fontWeight:700, textTransform:'uppercase' }}>Level:</span>
          {(['All','Easy','Medium','Hard'] as const).map(d => (
            <button key={d} className={`filter-btn${difficulty===d?' active':''}`} onClick={() => setDifficulty(d)}>{d}</button>
          ))}
        </div>

        {/* ── Results info ── */}
        <div style={{ marginBottom:'1.25rem', fontSize:'0.8rem', color:'rgba(255,255,255,0.35)', fontWeight:600 }}>
          {filtered.length} question{filtered.length!==1?'s':''} found for <span style={{ color:accent }}>{targetExam}</span>
          {selectedSubject!=='All Subjects' && <> · {selectedSubject}</>}
          {selectedYear !== 0 && <> · {selectedYear}</>}
        </div>

        {/* ── Questions ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem', color:'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize:'3rem', marginBottom:'0.75rem' }}>📄</div>
            <p style={{ fontSize:'1rem', fontWeight:700 }}>No questions found</p>
            <p style={{ fontSize:'0.85rem', marginTop:'0.5rem' }}>Try changing filters or selecting a different subject</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'1.1rem' }}>
            {filtered.map((q, i) => {
              const selectedOpt = revealed[q.id]
              const isCorrect = selectedOpt === q.correct
              const isExpanded = expandedId === q.id

              return (
                <div key={q.id} className="pyq-card" style={{ animation:`fadeUp 0.4s ${Math.min(i*0.04,0.5)}s ease both` }}>
                  {/* Meta row */}
                  <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'0.85rem', alignItems:'center' }}>
                    <span style={{ fontSize:'0.62rem', fontWeight:800, padding:'0.15rem 0.55rem', borderRadius:100, background:`${accent}22`, color:accent, border:`1px solid ${accent}44` }}>{q.year}</span>
                    <span style={{ fontSize:'0.62rem', fontWeight:700, padding:'0.15rem 0.55rem', borderRadius:100, background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.5)', border:'1px solid rgba(255,255,255,0.1)' }}>{q.paper}</span>
                    <span style={{ fontSize:'0.62rem', fontWeight:700, padding:'0.15rem 0.55rem', borderRadius:100, background:`${DIFF_COLOR[q.difficulty]}18`, color:DIFF_COLOR[q.difficulty], border:`1px solid ${DIFF_COLOR[q.difficulty]}33` }}>{q.difficulty}</span>
                    <span style={{ fontSize:'0.62rem', fontWeight:700, padding:'0.15rem 0.55rem', borderRadius:100, background:'rgba(124,58,237,0.12)', color:'#A78BFA', border:'1px solid rgba(124,58,237,0.25)' }}>{q.topic}</span>
                    {selectedOpt && (
                      <span style={{ marginLeft:'auto', fontSize:'0.7rem', fontWeight:800, color: isCorrect?'#22C55E':'#EF4444' }}>
                        {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                      </span>
                    )}
                  </div>

                  {/* Question */}
                  <p style={{ fontSize:'0.9rem', fontWeight:600, lineHeight:1.65, margin:'0 0 1rem', whiteSpace:'pre-wrap' }}>{q.question}</p>

                  {/* Options */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'0.85rem' }}>
                    {(['A','B','C','D'] as const).map(opt => {
                      const text = q[`option${opt}` as keyof PYQ] as string
                      let cls = 'opt-btn'
                      if (selectedOpt) {
                        if (opt === q.correct) cls += ' correct'
                        else if (opt === selectedOpt) cls += ' wrong'
                      }
                      return (
                        <button key={opt} className={cls} onClick={() => handleOption(q.id, opt)}
                          style={{ borderRadius:10, padding:'0.65rem 1rem', fontSize:'0.83rem', display:'flex', gap:'0.5rem', alignItems:'flex-start' }}>
                          <span style={{ fontWeight:800, flexShrink:0 }}>{opt}.</span>
                          <span>{text}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Explanation (shown after attempt) */}
                  {selectedOpt && (
                    <div style={{ background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:12, padding:'1rem', fontSize:'0.82rem', lineHeight:1.65, color:'rgba(255,255,255,0.75)', animation:'fadeUp 0.25s ease' }}>
                      <div style={{ fontWeight:800, color:'#A78BFA', marginBottom:'0.35rem' }}>💡 Explanation</div>
                      {q.explanation}
                    </div>
                  )}

                  {/* Bottom actions */}
                  <div style={{ marginTop:'0.75rem', display:'flex', gap:'0.5rem' }}>
                    {!selectedOpt && (
                      <button onClick={() => { setRevealed(prev=>({...prev,[q.id]:q.correct})); setExpandedId(q.id) }}
                        style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'0.3rem 0.75rem', fontSize:'0.72rem', fontWeight:700, color:'rgba(255,255,255,0.4)', cursor:'pointer' }}>
                        Show Answer
                      </button>
                    )}
                    <Link href="/student/ai-chat"
                      style={{ fontSize:'0.72rem', color:'#A78BFA', fontWeight:700, textDecoration:'none', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:8, padding:'0.3rem 0.75rem' }}>
                      🧠 Ask AI →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
