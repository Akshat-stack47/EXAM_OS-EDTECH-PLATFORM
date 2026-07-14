'use client'

import { useState } from 'react'

/* ─── Data ──────────────────────────────────────────────────────── */
const STUDENTS = [
  { id:1, name:'Riya Sharma',   exam:'UPSC',    avatar:'RS', score:82, prev:77, trend:'+5',  risk:'LOW',    burnout:12, sessions:14, lastActive:'Today',     weakSubject:'Geography',  weakScore:65 },
  { id:2, name:'Arjun Patel',   exam:'SSC CGL', avatar:'AP', score:74, prev:72, trend:'+2',  risk:'LOW',    burnout:28, sessions:9,  lastActive:'Yesterday', weakSubject:'English',    weakScore:68 },
  { id:3, name:'Priya Singh',   exam:'IBPS PO', avatar:'PS', score:91, prev:83, trend:'+8',  risk:'LOW',    burnout:8,  sessions:18, lastActive:'Today',     weakSubject:'Computers',  weakScore:80 },
  { id:4, name:'Rahul Kumar',   exam:'UPSC',    avatar:'RK', score:58, prev:61, trend:'-3',  risk:'HIGH',   burnout:78, sessions:5,  lastActive:'3 days ago',weakSubject:'Economy',    weakScore:42 },
  { id:5, name:'Neha Gupta',    exam:'NDA',     avatar:'NG', score:87, prev:83, trend:'+4',  risk:'LOW',    burnout:15, sessions:12, lastActive:'Today',     weakSubject:'Chemistry',  weakScore:75 },
  { id:6, name:'Vikram Singh',  exam:'UPSC',    avatar:'VS', score:62, prev:63, trend:'-1',  risk:'MEDIUM', burnout:55, sessions:7,  lastActive:'2 days ago',weakSubject:'Polity',     weakScore:50 },
  { id:7, name:'Anjali Mehta',  exam:'GATE',    avatar:'AM', score:79, prev:74, trend:'+5',  risk:'LOW',    burnout:22, sessions:11, lastActive:'Today',     weakSubject:'Networks',   weakScore:68 },
  { id:8, name:'Rohan Das',     exam:'SSC CGL', avatar:'RD', score:55, prev:59, trend:'-4',  risk:'HIGH',   burnout:82, sessions:3,  lastActive:'5 days ago',weakSubject:'Reasoning',  weakScore:40 },
]

const SCHEDULE = [
  { time:'09:00', student:'Riya Sharma',   topic:'Modern History — 1857 Revolt',      type:'Doubt',  icon:'💬', done:true  },
  { time:'11:30', student:'Arjun Patel',   topic:'Quant: Data Interpretation',         type:'Review', icon:'📊', done:true  },
  { time:'14:00', student:'Group (6)',     topic:'Current Affairs Weekly Round-up',    type:'Group',  icon:'👥', done:false },
  { time:'16:30', student:'Priya Singh',   topic:'IBPS Mock — Banking Awareness',      type:'Mock',   icon:'📝', done:false },
  { time:'18:00', student:'Vikram Singh',  topic:'Polity — Constitutional Amendments', type:'Doubt',  icon:'💬', done:false },
]

const ASSIGNMENTS = [
  { student:'Rahul Kumar',  topic:'Essay: Climate Change & India',       subj:'GS-3',  aiScore:72, criteria:{Content:68,Structure:78,Language:70},  feedback:'Good structure, but argument lacks depth in economic impact sections. Needs more data-backed analysis.', pending:true,  submitted:'2h ago'  },
  { student:'Vikram Singh', topic:'GS Paper 2: Polity Questions',        subj:'GS-2',  aiScore:65, criteria:{Content:60,Structure:72,Language:63},  feedback:'Several factual errors around 73rd Amendment — please review Panchayati Raj provisions carefully.',         pending:true,  submitted:'5h ago'  },
  { student:'Priya Singh',  topic:'IBPS PO Mock Analysis',               subj:'Quant', aiScore:88, criteria:{Content:90,Structure:85,Language:89},  feedback:'Excellent accuracy! Time management on Section 3 (Data Interpretation) can be further improved.',           pending:false, submitted:'1d ago'  },
  { student:'Arjun Patel',  topic:'SSC CGL: Reasoning Practice Set',     subj:'Reason',aiScore:79, criteria:{Content:81,Structure:76,Language:80},  feedback:'Strong analytical skills. Focus more on Matrix and Venn Diagram question types.',                          pending:true,  submitted:'3h ago'  },
]

const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct']
const EARNINGS = [32000,38000,41000,48000,44000,52000,55000]

const BURNOUT_WEEKS = ['W1','W2','W3','W4']
const BURNOUT_GRID = [
  { name:'Riya',    scores:[12,18,14,12], risk:'LOW' },
  { name:'Arjun',   scores:[25,30,28,28], risk:'LOW' },
  { name:'Priya',   scores:[10,8,12,8],   risk:'LOW' },
  { name:'Rahul',   scores:[60,70,75,78], risk:'HIGH' },
  { name:'Neha',    scores:[15,12,18,15], risk:'LOW' },
  { name:'Vikram',  scores:[40,48,52,55], risk:'MEDIUM' },
]

const SUBJECTS = ['History','Polity','Geography','Economy','Science']
const CLASS_HEATMAP = [
  { name:'Riya',   scores:[82,78,65,71,60] },
  { name:'Arjun',  scores:[74,81,72,65,70] },
  { name:'Priya',  scores:[90,88,85,91,87] },
  { name:'Rahul',  scores:[55,48,62,58,50] },
  { name:'Neha',   scores:[85,89,78,82,88] },
  { name:'Vikram', scores:[62,68,55,60,58] },
]

/* Trend sparkline data */
const TREND_DATA: Record<number, number[]> = {
  1:[65,70,72,77,82], 2:[68,69,70,72,74], 3:[75,80,83,85,91],
  4:[68,65,63,61,58], 5:[78,81,83,83,87], 6:[70,68,65,63,62],
  7:[68,70,73,74,79], 8:[65,63,60,59,55],
}

/* ─── Library Data ──────────────────────────────────────────────── */
const BOOKS = [
  { id:1,  title:'Indian Polity',              author:'M. Laxmikanth',         subject:'Polity',   exam:['UPSC','PSC'],  pages:700, edition:'6th Ed',  type:'FREE',  cover:'#7C3AED', rating:4.9, reads:128420, desc:'The most comprehensive book on Indian Polity for UPSC CSE. Covers Constitution, Parliament, Executive, Judiciary in detail.' },
  { id:2,  title:'Certificate Physical & Human Geography', author:'Goh Cheng Leong', subject:'Geography', exam:['UPSC'], pages:440, edition:'2019',  type:'FREE',  cover:'#0EA5E9', rating:4.7, reads:89302,  desc:'Essential geography textbook covering physical processes, climate, natural vegetation and human geography for competitive exams.' },
  { id:3,  title:'Modern India',               author:'Bipan Chandra',          subject:'History',  exam:['UPSC','PSC'],  pages:580, edition:'2022',  type:'FREE',  cover:'#F59E0B', rating:4.8, reads:102100, desc:'Authoritative text on modern Indian history from 1750 to independence. Covers all major movements, policies and personalities.' },
  { id:4,  title:'Indian Economy',             author:'Ramesh Singh',           subject:'Economy',  exam:['UPSC','SSC'],  pages:820, edition:'14th Ed',type:'FREE',  cover:'#22C55E', rating:4.6, reads:74500,  desc:'Complete coverage of Indian Economy including planning, agriculture, industry, banking, fiscal policy and external sector.' },
  { id:5,  title:'Spectrum: A Brief History',  author:'Rajiv Ahir',             subject:'History',  exam:['UPSC'],        pages:400, edition:'2023',  type:'FREE',  cover:'#EF4444', rating:4.5, reads:65200,  desc:'Brief yet comprehensive history of modern India. Ideal for quick revision before prelims and mains examination.' },
  { id:6,  title:'Quantitative Aptitude',      author:'R.S. Aggarwal',          subject:'Maths',    exam:['SSC','BANK'],  pages:1200,edition:'Latest',type:'FREE',  cover:'#06B6D4', rating:4.8, reads:210000, desc:'The definitive quantitative aptitude book for competitive exams. Covers all topics from basic arithmetic to advanced problems.' },
  { id:7,  title:'A Modern Approach to Verbal & Non-Verbal Reasoning', author:'R.S. Aggarwal', subject:'Reasoning', exam:['SSC','BANK','RAIL'], pages:930, edition:'Latest', type:'FREE', cover:'#8B5CF6', rating:4.7, reads:195000, desc:'Complete reasoning guide covering verbal reasoning, non-verbal reasoning and analytical reasoning for all competitive exams.' },
  { id:8,  title:'UPSC Mains GS Paper-4 Ethics', author:'Lexicon',             subject:'Ethics',   exam:['UPSC'],        pages:380, edition:'2023',  type:'PAID',  cover:'#F97316', rating:4.9, reads:42000,  price:'₹299', desc:'Premium ethics guide with case studies, philosophical frameworks and answer-writing techniques for UPSC GS-4.' },
  { id:9,  title:'Science & Technology for UPSC', author:'Ravi Agrahari',      subject:'Science',  exam:['UPSC','PSC'],  pages:520, edition:'2024',  type:'PAID',  cover:'#10B981', rating:4.6, reads:31200,  price:'₹249', desc:'Comprehensive coverage of science and technology topics including space, defence, biotech, AI, and recent developments.' },
  { id:10, title:'SSC CGL Previous Papers (10 Years)', author:'Arihant Expert', subject:'PYQ',     exam:['SSC'],         pages:660, edition:'2024',  type:'PAID',  cover:'#06B6D4', rating:4.8, reads:88000,  price:'₹199', desc:'Complete 10-year solved papers for SSC CGL with detailed explanations. Includes all shifts and sets of each year.' },
  { id:11, title:'IBPS PO Complete Guide',     author:'Disha Experts',          subject:'Banking',  exam:['BANK'],        pages:780, edition:'2024',  type:'PAID',  cover:'#22C55E', rating:4.5, reads:52000,  price:'₹349', desc:'All-in-one preparation guide for IBPS PO covering Reasoning, Quant, English, GA and Banking Awareness with solved papers.' },
  { id:12, title:'GATE CS 2025 Guide',         author:'GK Publications',        subject:'CS',       exam:['GATE'],        pages:900, edition:'2025',  type:'PAID',  cover:'#3B82F6', rating:4.7, reads:28000,  price:'₹499', desc:'Comprehensive GATE CS preparation guide covering all 8 subjects with previous year questions, practice sets and solutions.' },
]

/* ─── Class Notes Initial Data ─────────────────────────────────── */
const INITIAL_NOTES = [
  { id:1, text:'Explain Art. 370 abrogation — constitutional validity & SC judgement 2023',  cat:'Polity',   priority:'HIGH',   done:false, time:'09:30 AM' },
  { id:2, text:'Cover Chandrayaan-3 mission details — ISRO, propulsion, landing site (Shiv Shakti Point)', cat:'Science', priority:'HIGH', done:false, time:'10:15 AM' },
  { id:3, text:'Income vs Substitution effect — diagram on board with real examples',          cat:'Economy',  priority:'MEDIUM', done:true,  time:'11:00 AM' },
  { id:4, text:'Discuss The Hindu editorial — India-China border developments LAC update',     cat:'Current',  priority:'MEDIUM', done:false, time:'11:30 AM' },
  { id:5, text:'Quiz students on fundamental duties vs rights — surprise 5-min quiz',          cat:'Polity',   priority:'LOW',    done:false, time:'12:00 PM' },
]

/* ─── Student Doubt Data ────────────────────────────────────────── */
const INITIAL_DOUBTS = [
  { id:1, student:'Rahul Kumar',   avatar:'RK', exam:'UPSC',    subject:'Economy',  urgency:'HIGH',   time:'2h ago',   resolved:false, doubt:'I am confused about the difference between Fiscal Deficit and Revenue Deficit. Can you explain with numbers and their impact on economy?', reply:'' },
  { id:2, student:'Vikram Singh',  avatar:'VS', exam:'UPSC',    subject:'Polity',   urgency:'HIGH',   time:'3h ago',   resolved:false, doubt:'In 73rd Amendment, what exactly is the difference between Schedule 11 and Schedule 12? Which one covers Panchayats and which covers Municipalities?', reply:'' },
  { id:3, student:'Arjun Patel',   avatar:'AP', exam:'SSC CGL', subject:'Reasoning',urgency:'MEDIUM', time:'5h ago',   resolved:false, doubt:'In the question about Blood Relations — if A is the sister of B, and B is the son of C, how do we determine C\'s relation to A? I keep getting confused with these.', reply:'' },
  { id:4, student:'Riya Sharma',   avatar:'RS', exam:'UPSC',    subject:'History',  urgency:'MEDIUM', time:'1d ago',   resolved:true,  doubt:'What are the major differences between the Government of India Act 1935 and the Indian Constitution 1950? How much was borrowed?', reply:'Great question Riya! About 250 out of 395 articles in our original Constitution were borrowed from the GoI Act 1935. Key borrowings include: Federal scheme, Governor\'s office, Judiciary, Public Service Commissions, Emergency provisions, and Administrative details. The major difference is that our Constitution added Fundamental Rights (from USA), DPSP (from Ireland), and a full Chapter on citizenship — all absent in 1935 Act.' },
  { id:5, student:'Rohan Das',     avatar:'RD', exam:'SSC CGL', subject:'Maths',    urgency:'LOW',    time:'1d ago',   resolved:false, doubt:'In Time & Work problems, when two pipes fill and one drains, do we always take LCM of all three? I saw a solution where they used fractions directly instead.', reply:'' },
  { id:6, student:'Neha Gupta',    avatar:'NG', exam:'NDA',     subject:'Physics',  urgency:'MEDIUM', time:'2d ago',   resolved:false, doubt:'Explain the concept of Simple Harmonic Motion and why the restoring force must be proportional to displacement. Also what is the condition for SHM in a pendulum?', reply:'' },
]

/* ─── Helpers ───────────────────────────────────────────────────── */
const heatBg = (v: number, isBurnout: boolean) => {
  if (isBurnout) return v>=70?'#DC2626':v>=50?'#F59E0B':v>=30?'#FDE68A':'#22C55E'
  return v>=80?'#22C55E':v>=65?'#86EFAC':v>=50?'#F59E0B':'#EF4444'
}
const scoreColor = (s: number) => s>=80?'#22C55E':s>=65?'#A3E635':s>=50?'#F59E0B':'#EF4444'

/* ─── Sparkline ─────────────────────────────────────────────────── */
const Spark = ({ data, color }: { data: number[]; color: string }) => {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1
  const w = 80, h = 30, pts = data.map((v,i) => `${(i/(data.length-1))*w},${h - ((v-min)/range)*h}`)
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow:'visible' }}>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={+pts[pts.length-1].split(',')[0]} cy={+pts[pts.length-1].split(',')[1]} r="3" fill={color} />
    </svg>
  )
}

/* ─── Bar Chart ─────────────────────────────────────────────────── */
const BarChart = ({ data, labels }: { data: number[]; labels: string[] }) => {
  const max = Math.max(...data)
  return (
    <svg viewBox={`0 0 ${data.length*44} 90`} style={{ width:'100%', height:90 }}>
      {data.map((v, i) => {
        const bH = (v/max)*62, x = i*44+6
        const isCur = i === data.length-1
        return (
          <g key={i}>
            <rect x={x} y={72-bH} width={28} height={bH} rx={5}
              fill={isCur?'#22C55E':'rgba(34,197,94,0.35)'} />
            <text x={x+14} y={88} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.35)">{labels[i]}</text>
            <text x={x+14} y={72-bH-4} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.7)" fontWeight="700">
              {(v/1000).toFixed(0)}k
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ─── CSS ───────────────────────────────────────────────────────── */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { overflow-x: hidden; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes slideIn{ from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
  .tab-btn  { background:transparent; border:none; cursor:pointer; font-family:inherit; padding:.45rem .85rem;
              border-radius:9px; font-size:.78rem; font-weight:700; color:rgba(255,255,255,.4);
              transition:all .18s; white-space:nowrap; border:1px solid transparent; }
  .tab-btn.active { background:rgba(14,165,233,.14); color:#38BDF8; border-color:rgba(14,165,233,.3); }
  .tab-btn:hover:not(.active) { background:rgba(255,255,255,.06); color:#fff; }
  .card  { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07); border-radius:16px; }
  .row-h { transition:background .15s; border-bottom:1px solid rgba(255,255,255,.04); }
  .row-h:hover { background:rgba(255,255,255,.04); }
  .btn-pri { background:linear-gradient(135deg,#0EA5E9,#0284C7); color:#fff; border:none; border-radius:9px;
             font-family:inherit; font-weight:700; cursor:pointer; transition:all .18s; }
  .btn-pri:hover { filter:brightness(1.1); transform:translateY(-1px); }
  .btn-sec { background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12); color:rgba(255,255,255,.6);
             border-radius:9px; font-family:inherit; font-weight:700; cursor:pointer; transition:all .18s; }
  .btn-sec:hover { background:rgba(255,255,255,.1); color:#fff; }
  .stat-card { background:rgba(255,255,255,.05); border-radius:14px; padding:1.1rem 1.25rem;
               position:relative; overflow:hidden; border:1px solid rgba(255,255,255,.07);
               transition:transform .2s, box-shadow .2s; }
  .stat-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.35); }
  .crit-bar { height:6px; border-radius:3px; background:rgba(255,255,255,.08); overflow:hidden; }
  .crit-fill { height:100%; border-radius:3px; transition:width .6s ease; }
  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.12); border-radius:3px; }
`

/* ─── Main Component ─────────────────────────────────────────────── */
export const TeacherDashboardView = ({ data }: { data: any }) => {
  const [liveOpen,  setLiveOpen]  = useState(false)
  const [tab,       setTab]       = useState('overview')
  const [selStudent,setSelStudent]= useState<typeof STUDENTS[0]|null>(null)
  const [sessionLink] = useState(`https://examos.in/live/${Math.random().toString(36).slice(2,8)}`)
  const [copied,    setCopied]    = useState(false)

  // Library
  const [libFilter,  setLibFilter]  = useState<'ALL'|'FREE'|'PAID'>('ALL')
  const [libSubject, setLibSubject] = useState('All')
  const [libSearch,  setLibSearch]  = useState('')
  const [selBook,    setSelBook]    = useState<typeof BOOKS[0]|null>(null)

  // Class Notes
  const [notes,    setNotes]    = useState(INITIAL_NOTES)
  const [newNote,  setNewNote]  = useState('')
  const [noteCat,  setNoteCat]  = useState('General')
  const [notePri,  setNotePri]  = useState<'HIGH'|'MEDIUM'|'LOW'>('MEDIUM')
  const [noteTime, setNoteTime] = useState('')

  // Doubts
  const [doubts,      setDoubts]      = useState(INITIAL_DOUBTS)
  const [activeDoubt, setActiveDoubt] = useState<number|null>(null)
  const [replyText,   setReplyText]   = useState('')
  const [doubtFilter, setDoubtFilter] = useState<'ALL'|'PENDING'|'RESOLVED'>('ALL')

  const teacherName = data?.name ?? 'Dr. Amit Verma'
  const specialization = data?.specialization ?? 'History & Polity'
  const email = data?.email ?? 'educator@examos.in'
  const atRisk = STUDENTS.filter(s => s.risk !== 'LOW')
  const todayEarning = 3200

  const copyLink = () => { navigator.clipboard.writeText(sessionLink).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2000) }

  const TABS = [
    { id:'overview',   label:'🏠 Overview'         },
    { id:'students',   label:'👥 My Students'      },
    { id:'assignments',label:'📝 AI Grading'        },
    { id:'burnout',    label:'🔥 Burnout Map'       },
    { id:'heatmap',    label:'📊 Class Performance' },
    { id:'revenue',    label:'💰 Revenue'           },
    { id:'schedule',   label:'📅 Schedule'          },
    { id:'library',    label:'📚 Library'           },
    { id:'notes',      label:'✏️ Class Notes'        },
    { id:'doubts',     label:'❓ Student Doubts'    },
  ]

  // Library helpers
  const libSubjects = ['All',...Array.from(new Set(BOOKS.map(b=>b.subject)))]
  const filteredBooks = BOOKS.filter(b => {
    if (libFilter!=='ALL' && b.type!==libFilter) return false
    if (libSubject!=='All' && b.subject!==libSubject) return false
    if (libSearch && !b.title.toLowerCase().includes(libSearch.toLowerCase()) && !b.author.toLowerCase().includes(libSearch.toLowerCase())) return false
    return true
  })

  // Notes helpers
  const addNote = () => {
    if (!newNote.trim()) return
    setNotes(prev => [{ id:Date.now(), text:newNote.trim(), cat:noteCat, priority:notePri, done:false, time:noteTime||'Now' }, ...prev])
    setNewNote(''); setNoteTime('')
  }
  const toggleNote = (id:number) => setNotes(prev=>prev.map(n=>n.id===id?{...n,done:!n.done}:n))
  const deleteNote = (id:number) => setNotes(prev=>prev.filter(n=>n.id!==id))

  // Doubts helpers
  const sendReply = (id:number) => {
    if (!replyText.trim()) return
    setDoubts(prev=>prev.map(d=>d.id===id?{...d,reply:replyText.trim(),resolved:true}:d))
    setReplyText(''); setActiveDoubt(null)
  }
  const priColor = (p:string) => p==='HIGH'?'#EF4444':p==='MEDIUM'?'#F59E0B':'#22C55E'
  const notePriColor = (p:string) => p==='HIGH'?'rgba(239,68,68,.15)':p==='MEDIUM'?'rgba(245,158,11,.1)':'rgba(34,197,94,.1)'
  const notePriBorder = (p:string) => p==='HIGH'?'rgba(239,68,68,.3)':p==='MEDIUM'?'rgba(245,158,11,.25)':'rgba(34,197,94,.25)'

  /* ── Student Detail Modal ── */
  const StudentModal = () => {
    if (!selStudent) return null
    const tData = TREND_DATA[selStudent.id] ?? []
    return (
      <div style={{ position:'fixed', inset:0, zIndex:999, background:'rgba(0,0,0,.75)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}
        onClick={() => setSelStudent(null)}>
        <div style={{ background:'#111827', border:'1px solid rgba(14,165,233,.25)', borderRadius:20, padding:'2rem', maxWidth:540, width:'100%', animation:'fadeUp .25s ease' }}
          onClick={e => e.stopPropagation()}>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem' }}>
            <div style={{ width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,#0EA5E9,#6366F1)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'1.1rem' }}>
              {selStudent.avatar}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:'1.05rem' }}>{selStudent.name}</div>
              <div style={{ fontSize:'.78rem', color:'rgba(255,255,255,.45)', marginTop:'.1rem' }}>{selStudent.exam} · Last active: {selStudent.lastActive}</div>
            </div>
            <button onClick={() => setSelStudent(null)} className="btn-sec" style={{ padding:'.35rem .7rem', fontSize:'.8rem' }}>✕</button>
          </div>

          {/* Score trend */}
          <div className="card" style={{ padding:'1rem', marginBottom:'1rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'.75rem' }}>
              <span style={{ fontSize:'.75rem', fontWeight:700, color:'rgba(255,255,255,.4)', textTransform:'uppercase' }}>Score Trend (5 sessions)</span>
              <span style={{ fontWeight:900, fontSize:'1.1rem', color:scoreColor(selStudent.score) }}>{selStudent.score}%</span>
            </div>
            <Spark data={tData} color={scoreColor(selStudent.score)} />
          </div>

          {/* Stats grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'.65rem', marginBottom:'1rem' }}>
            {[
              ['Sessions','#0EA5E9',String(selStudent.sessions)+'  total'],
              ['Burnout Risk',selStudent.burnout>=70?'#EF4444':selStudent.burnout>=40?'#F59E0B':'#22C55E',String(selStudent.burnout)+'%'],
              ['Weakest',  '#F59E0B', selStudent.weakSubject+' '+selStudent.weakScore+'%'],
            ].map(([l,c,v]) => (
              <div key={l as string} style={{ background:'rgba(255,255,255,.04)', borderRadius:12, padding:'.75rem', border:'1px solid rgba(255,255,255,.07)' }}>
                <div style={{ fontSize:'.62rem', color:'rgba(255,255,255,.35)', fontWeight:700, textTransform:'uppercase', marginBottom:'.25rem' }}>{l}</div>
                <div style={{ fontWeight:800, color:c as string, fontSize:'.82rem' }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', gap:'.6rem' }}>
            <button className="btn-pri" style={{ flex:1, padding:'.6rem' }}>💬 Send Message</button>
            <button className="btn-sec" style={{ flex:1, padding:'.6rem' }}>📅 Schedule Session</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:'linear-gradient(160deg,#0A0F1E 0%,#0F1A2E 60%,#111827 100%)', minHeight:'100vh', color:'#fff' }}>
      <style>{STYLE}</style>
      <StudentModal />

      {/* ══════════════════════════════════════════════════════════
          HEADER — FULL WIDTH
      ══════════════════════════════════════════════════════════ */}
      <div style={{ background:'rgba(10,15,30,.95)', borderBottom:'1px solid rgba(255,255,255,.07)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ padding:'0 1.5rem', display:'flex', alignItems:'center', gap:'1rem', height:64 }}>
          {/* Avatar + name */}
          <div style={{ display:'flex', alignItems:'center', gap:'.85rem', flex:1, minWidth:0 }}>
            <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#0EA5E9,#6366F1)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'.95rem', border:'2px solid rgba(14,165,233,.4)', flexShrink:0 }}>
              {teacherName[0]}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontWeight:800, fontSize:'.92rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {teacherName}
              </div>
              <div style={{ fontSize:'.68rem', color:'rgba(255,255,255,.4)' }}>{specialization} · {email}</div>
            </div>
          </div>

          {/* Today's quick stats */}
          <div style={{ display:'flex', gap:'1.25rem', alignItems:'center' }}>
            {[['👥',String(data?.studentCount??0),'Students'],['⭐',(data?.rating??4.8).toFixed(1),'Rating'],['₹',todayEarning.toLocaleString(),'Today']].map(([icon,val,lbl]) => (
              <div key={lbl as string} style={{ textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center' }}>
                <div style={{ fontSize:'.9rem', fontWeight:900 }}>{icon}{val}</div>
                <div style={{ fontSize:'.58rem', color:'rgba(255,255,255,.3)', textTransform:'uppercase' }}>{lbl}</div>
              </div>
            ))}
          </div>

          {/* Live button */}
          <button className="btn-pri" style={{ padding:'.55rem 1.1rem', fontSize:'.82rem', display:'flex', alignItems:'center', gap:'.4rem', flexShrink:0 }}
            onClick={() => setLiveOpen(o => !o)}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'#fff', animation:'pulse 1.5s infinite', flexShrink:0 }} />
            {liveOpen ? 'Close Live' : 'Go Live'}
          </button>
        </div>

        {/* Live session bar */}
        {liveOpen && (
          <div style={{ background:'rgba(14,165,233,.08)', borderTop:'1px solid rgba(14,165,233,.2)', padding:'.75rem 1.5rem', display:'flex', gap:'.75rem', alignItems:'center', flexWrap:'wrap' }}>
            <span style={{ fontSize:'.75rem', fontWeight:800, color:'#38BDF8', display:'flex', alignItems:'center', gap:'.4rem' }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:'#EF4444', animation:'pulse 1.2s infinite', flexShrink:0 }} />
              LIVE SESSION READY
            </span>
            <div style={{ flex:1, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, padding:'.4rem .85rem', fontSize:'.78rem', color:'#38BDF8', fontFamily:'monospace', minWidth:200 }}>
              {sessionLink}
            </div>
            <button className="btn-pri" style={{ padding:'.4rem .9rem', fontSize:'.75rem' }} onClick={copyLink}>
              {copied ? '✅ Copied!' : '📋 Copy Link'}
            </button>
            <button style={{ padding:'.4rem .9rem', background:'rgba(34,197,94,.15)', color:'#22C55E', border:'1px solid rgba(34,197,94,.3)', borderRadius:9, fontFamily:'inherit', fontSize:'.75rem', fontWeight:700, cursor:'pointer' }}>
              🎥 Launch Agora
            </button>
          </div>
        )}

        {/* Nav tabs */}
        <div style={{ padding:'0 1.5rem', display:'flex', gap:'.25rem', overflowX:'auto', paddingBottom:'.5rem', paddingTop:'.35rem' }}>
          {TABS.map(t => (
            <button key={t.id} className={`tab-btn${tab===t.id?' active':''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          CONTENT AREA
      ══════════════════════════════════════════════════════════ */}
      <div style={{ padding:'1.5rem' }}>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div style={{ animation:'fadeUp .3s ease' }}>
            {/* Stats row */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(145px,1fr))', gap:'.85rem', marginBottom:'1.25rem' }}>
              {[
                { v:String(data?.studentCount??0),       l:'Active Students',  c:'#0EA5E9', bg:'rgba(14,165,233,.12)',  icon:'👥' },
                { v:`₹${(data?.earnings??48000).toLocaleString()}`, l:'Total Earnings',  c:'#22C55E', bg:'rgba(34,197,94,.1)',   icon:'💰' },
                { v:`${(data?.rating??4.8).toFixed(1)}⭐`, l:'Rating',           c:'#F59E0B', bg:'rgba(245,158,11,.1)',  icon:'⭐' },
                { v:String(atRisk.length),                l:'At-Risk Students', c:'#EF4444', bg:'rgba(239,68,68,.1)',   icon:'⚠️' },
                { v:'3',                                  l:"Today's Sessions", c:'#A78BFA', bg:'rgba(167,139,250,.1)', icon:'📅' },
                { v:`₹${todayEarning.toLocaleString()}`, l:"Today's Earning",  c:'#34D399', bg:'rgba(52,211,153,.1)',  icon:'🪙' },
              ].map(s => (
                <div key={s.l} className="stat-card">
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${s.c},transparent)` }} />
                  <div style={{ fontSize:'1.4rem', fontWeight:900, color:'#fff', letterSpacing:'-.02em' }}>{s.v}</div>
                  <div style={{ fontSize:'.64rem', color:'rgba(255,255,255,.4)', textTransform:'uppercase', letterSpacing:'.08em', marginTop:'.2rem', fontWeight:600 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* 2-col: Student perf + Schedule */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.1rem', marginBottom:'1.1rem' }}>

              {/* Student Performance with sparklines */}
              <div className="card" style={{ padding:'1.25rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
                  <h2 style={{ fontSize:'.82rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'.07em', color:'rgba(255,255,255,.5)' }}>Student Performance</h2>
                  <button className="tab-btn" style={{ fontSize:'.7rem', padding:'.25rem .55rem' }} onClick={() => setTab('students')}>All →</button>
                </div>
                {STUDENTS.slice(0,6).map(s => (
                  <div key={s.id} className="row-h" style={{ display:'flex', alignItems:'center', gap:'.65rem', padding:'.6rem 0', cursor:'pointer' }}
                    onClick={() => setSelStudent(s)}>
                    <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#0EA5E9,#6366F1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.7rem', fontWeight:800, flexShrink:0 }}>{s.avatar}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'.83rem', fontWeight:700, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.name}</div>
                      <div style={{ fontSize:'.68rem', color:'rgba(255,255,255,.4)' }}>{s.exam}</div>
                    </div>
                    <Spark data={TREND_DATA[s.id]??[]} color={scoreColor(s.score)} />
                    <div style={{ textAlign:'right', minWidth:42 }}>
                      <div style={{ fontSize:'.9rem', fontWeight:900, color:scoreColor(s.score) }}>{s.score}%</div>
                      <div style={{ fontSize:'.68rem', fontWeight:700, color:s.trend.startsWith('+')?'#22C55E':'#EF4444' }}>{s.trend}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Today's Schedule */}
              <div className="card" style={{ padding:'1.25rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
                  <h2 style={{ fontSize:'.82rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'.07em', color:'rgba(255,255,255,.5)' }}>Today's Schedule</h2>
                  <button className="tab-btn" style={{ fontSize:'.7rem', padding:'.25rem .55rem' }} onClick={() => setTab('schedule')}>Full →</button>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'.6rem' }}>
                  {SCHEDULE.map((s,i) => (
                    <div key={i} style={{ display:'flex', gap:'.75rem', alignItems:'flex-start', padding:'.65rem .85rem', background:s.done?'rgba(255,255,255,.02)':'rgba(14,165,233,.06)', border:`1px solid ${s.done?'rgba(255,255,255,.05)':'rgba(14,165,233,.15)'}`, borderRadius:10, opacity:s.done?.6:1 }}>
                      <span style={{ fontSize:'1rem', flexShrink:0 }}>{s.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.15rem' }}>
                          <span style={{ fontSize:'.8rem', fontWeight:700, color:s.done?'rgba(255,255,255,.4)':'#38BDF8' }}>{s.time}</span>
                          <span style={{ fontSize:'.62rem', background:s.done?'rgba(255,255,255,.06)':'rgba(14,165,233,.15)', color:s.done?'rgba(255,255,255,.3)':'#38BDF8', padding:'.1rem .45rem', borderRadius:100, fontWeight:700 }}>{s.type}</span>
                        </div>
                        <div style={{ fontSize:'.82rem', fontWeight:600 }}>{s.student}</div>
                        <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.4)', marginTop:'.1rem' }}>{s.topic}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* At-risk alerts */}
            {atRisk.length > 0 && (
              <div style={{ background:'rgba(239,68,68,.05)', border:'1px solid rgba(239,68,68,.18)', borderRadius:16, padding:'1.25rem' }}>
                <div style={{ fontSize:'.82rem', fontWeight:800, color:'#F87171', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:'.85rem' }}>⚠️ At-Risk Student Alerts</div>
                <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
                  {atRisk.map(s => (
                    <div key={s.id} style={{ flex:'1 1 260px', background:s.risk==='HIGH'?'rgba(239,68,68,.08)':'rgba(245,158,11,.08)', border:`1px solid ${s.risk==='HIGH'?'rgba(239,68,68,.25)':'rgba(245,158,11,.25)'}`, borderRadius:12, padding:'1rem', cursor:'pointer', transition:'all .18s' }}
                      onClick={() => setSelStudent(s)}
                      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform='translateY(-2px)'}
                      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform='none'}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.5rem' }}>
                        <div style={{ fontWeight:800 }}>{s.name}</div>
                        <span style={{ fontSize:'.65rem', fontWeight:800, padding:'.2rem .5rem', borderRadius:100, background:s.risk==='HIGH'?'rgba(239,68,68,.2)':'rgba(245,158,11,.2)', color:s.risk==='HIGH'?'#F87171':'#FBBF24' }}>{s.risk}</span>
                      </div>
                      <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.5)' }}>{s.exam} · Score: {s.score}% ({s.trend}) · Burnout: {s.burnout}%</div>
                      <div style={{ marginTop:'.65rem', display:'flex', gap:'.45rem' }}>
                        <button className="btn-sec" style={{ fontSize:'.7rem', padding:'.3rem .65rem' }}>💬 Encourage</button>
                        <button className="btn-sec" style={{ fontSize:'.7rem', padding:'.3rem .65rem' }}>📅 Schedule</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MY STUDENTS ── */}
        {tab === 'students' && (
          <div style={{ animation:'fadeUp .3s ease' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.1rem' }}>
              <h2 style={{ fontWeight:900, fontSize:'1rem' }}>👥 All My Students ({STUDENTS.length})</h2>
              <button className="btn-pri" style={{ padding:'.5rem 1rem', fontSize:'.8rem' }}>+ Add Student</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'.6rem' }}>
              {STUDENTS.map(s => (
                <div key={s.id} className="card row-h" style={{ padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:'1rem', cursor:'pointer' }}
                  onClick={() => setSelStudent(s)}>
                  <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#0EA5E9,#6366F1)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, flexShrink:0 }}>{s.avatar}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:'.9rem' }}>{s.name}</div>
                    <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.4)', marginTop:'.1rem' }}>{s.exam} · {s.sessions} sessions · Last active: {s.lastActive}</div>
                  </div>
                  <div style={{ minWidth:80 }}>
                    <Spark data={TREND_DATA[s.id]??[]} color={scoreColor(s.score)} />
                  </div>
                  <div style={{ textAlign:'right', minWidth:55 }}>
                    <div style={{ fontWeight:900, fontSize:'1rem', color:scoreColor(s.score) }}>{s.score}%</div>
                    <div style={{ fontSize:'.7rem', fontWeight:700, color:s.trend.startsWith('+')?'#22C55E':'#EF4444' }}>{s.trend}</div>
                  </div>
                  <div style={{ minWidth:90, textAlign:'center' }}>
                    <span style={{ fontSize:'.65rem', fontWeight:800, padding:'.22rem .6rem', borderRadius:100,
                      background:s.risk==='HIGH'?'rgba(239,68,68,.15)':s.risk==='MEDIUM'?'rgba(245,158,11,.15)':'rgba(34,197,94,.12)',
                      color:s.risk==='HIGH'?'#F87171':s.risk==='MEDIUM'?'#FBBF24':'#4ADE80',
                      border:`1px solid ${s.risk==='HIGH'?'rgba(239,68,68,.3)':s.risk==='MEDIUM'?'rgba(245,158,11,.3)':'rgba(34,197,94,.25)'}` }}>
                      {s.risk==='HIGH'?'🔴':s.risk==='MEDIUM'?'🟡':'🟢'} {s.risk}
                    </span>
                  </div>
                  <button className="btn-sec" style={{ padding:'.4rem .75rem', fontSize:'.75rem', flexShrink:0 }} onClick={e => { e.stopPropagation(); setSelStudent(s) }}>
                    View →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── AI GRADING ── */}
        {tab === 'assignments' && (
          <div style={{ animation:'fadeUp .3s ease' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.1rem', flexWrap:'wrap', gap:'.5rem' }}>
              <h2 style={{ fontWeight:900, fontSize:'1rem' }}>📝 AI Graded Assignments</h2>
              <span style={{ fontSize:'.78rem', color:'#A78BFA', fontWeight:700 }}>⚡ Grading time reduced 70%</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'.85rem' }}>
              {ASSIGNMENTS.map((a, i) => (
                <div key={i} className="card" style={{ padding:'1.25rem', border:`1px solid ${a.pending?'rgba(167,139,250,.18)':'rgba(34,197,94,.15)'}`, animation:`fadeUp .3s ${i*.06}s ease both` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'.85rem', flexWrap:'wrap', gap:'.5rem' }}>
                    <div>
                      <div style={{ fontWeight:800, fontSize:'.95rem' }}>{a.student}</div>
                      <div style={{ fontSize:'.78rem', color:'rgba(255,255,255,.45)', marginTop:'.15rem' }}>{a.topic}</div>
                      <div style={{ fontSize:'.65rem', color:'rgba(255,255,255,.3)', marginTop:'.1rem' }}>Submitted {a.submitted} · {a.subj}</div>
                    </div>
                    <div style={{ display:'flex', gap:'.5rem', alignItems:'center' }}>
                      <div style={{ padding:'.3rem .85rem', background:a.aiScore>=80?'rgba(34,197,94,.15)':'rgba(245,158,11,.15)', borderRadius:100, fontSize:'.82rem', fontWeight:800, color:a.aiScore>=80?'#22C55E':'#F59E0B' }}>
                        AI: {a.aiScore}/100
                      </div>
                      {a.pending && <span style={{ padding:'.2rem .55rem', background:'rgba(167,139,250,.15)', border:'1px solid rgba(167,139,250,.3)', borderRadius:100, fontSize:'.62rem', fontWeight:800, color:'#A78BFA', textTransform:'uppercase' }}>REVIEW</span>}
                    </div>
                  </div>

                  {/* Criteria bars — like video shows */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'.6rem', marginBottom:'1rem' }}>
                    {Object.entries(a.criteria).map(([k,v]) => (
                      <div key={k}>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.65rem', color:'rgba(255,255,255,.4)', marginBottom:'.3rem', fontWeight:600 }}>
                          <span>{k}</span><span style={{ color:scoreColor(v as number) }}>{v}%</span>
                        </div>
                        <div className="crit-bar">
                          <div className="crit-fill" style={{ width:`${v}%`, background:scoreColor(v as number) }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize:'.8rem', color:'rgba(255,255,255,.55)', background:'rgba(255,255,255,.03)', borderRadius:10, padding:'.65rem .9rem', marginBottom:'.85rem', lineHeight:1.6, borderLeft:'3px solid rgba(167,139,250,.4)' }}>
                    💡 {a.feedback}
                  </div>

                  {a.pending && (
                    <div style={{ display:'flex', gap:'.5rem' }}>
                      <button className="btn-pri" style={{ padding:'.45rem 1rem', fontSize:'.78rem' }}>✅ Approve Grade</button>
                      <button className="btn-sec" style={{ padding:'.45rem 1rem', fontSize:'.78rem' }}>✏️ Override Score</button>
                      <button className="btn-sec" style={{ padding:'.45rem 1rem', fontSize:'.78rem' }}>💬 Add Feedback</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BURNOUT MAP ── */}
        {tab === 'burnout' && (
          <div style={{ animation:'fadeUp .3s ease' }}>
            <h2 style={{ fontWeight:900, fontSize:'1rem', marginBottom:'1rem' }}>🔥 AI Burnout Detector</h2>
            <p style={{ fontSize:'.8rem', color:'rgba(255,255,255,.4)', marginBottom:'1.25rem' }}>
              Weekly burnout risk score per student (%). Powered by study hour patterns, test anxiety signals, and inactivity streaks.
            </p>
            <div className="card" style={{ padding:'1.25rem', overflowX:'auto', marginBottom:'1.1rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:`100px repeat(${BURNOUT_WEEKS.length},44px)`, gap:'5px', alignItems:'center', minWidth:280 }}>
                <div />
                {BURNOUT_WEEKS.map(w => (
                  <div key={w} style={{ fontSize:'.7rem', color:'rgba(255,255,255,.35)', textAlign:'center', fontWeight:700 }}>{w}</div>
                ))}
                {BURNOUT_GRID.map(row => (
                  <>
                    <div key={row.name+'l'} style={{ fontSize:'.82rem', color:'rgba(255,255,255,.65)', fontWeight:600, display:'flex', alignItems:'center', gap:'.4rem' }}>
                      {row.name}
                      <span style={{ fontSize:'.58rem', padding:'.1rem .4rem', borderRadius:100,
                        background:row.risk==='HIGH'?'rgba(239,68,68,.15)':row.risk==='MEDIUM'?'rgba(245,158,11,.15)':'rgba(34,197,94,.12)',
                        color:row.risk==='HIGH'?'#F87171':row.risk==='MEDIUM'?'#FBBF24':'#4ADE80' }}>
                        {row.risk}
                      </span>
                    </div>
                    {row.scores.map((v,i) => (
                      <div key={i} style={{ width:38, height:38, borderRadius:8, background:heatBg(v,true), display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.7rem', fontWeight:700, color:v>=50?'#fff':'#1A1A1A' }}>{v}</div>
                    ))}
                  </>
                ))}
              </div>
              <div style={{ marginTop:'1rem', display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                {[['#22C55E','<30 Low'],['#FDE68A','30–49 Watch'],['#F59E0B','50–69 Medium'],['#DC2626','≥70 High']].map(([c,l]) => (
                  <div key={l} style={{ display:'flex', alignItems:'center', gap:'.4rem', fontSize:'.72rem', color:'rgba(255,255,255,.45)' }}>
                    <div style={{ width:12, height:12, borderRadius:3, background:c as string }} />{l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CLASS PERFORMANCE HEATMAP ── */}
        {tab === 'heatmap' && (
          <div style={{ animation:'fadeUp .3s ease' }}>
            <h2 style={{ fontWeight:900, fontSize:'1rem', marginBottom:'1rem' }}>📊 Class Performance Heatmap</h2>
            <div className="card" style={{ padding:'1.25rem', overflowX:'auto' }}>
              <div style={{ display:'grid', gridTemplateColumns:`100px repeat(${SUBJECTS.length},44px)`, gap:'5px', alignItems:'center', minWidth:350 }}>
                <div />
                {SUBJECTS.map(s => (
                  <div key={s} style={{ fontSize:'.68rem', color:'rgba(255,255,255,.4)', textAlign:'center', fontWeight:700, lineHeight:1.2 }}>{s.slice(0,4)}</div>
                ))}
                {CLASS_HEATMAP.map(row => (
                  <>
                    <div key={row.name+'l'} style={{ fontSize:'.82rem', color:'rgba(255,255,255,.65)', fontWeight:600 }}>{row.name}</div>
                    {row.scores.map((v,i) => (
                      <div key={i} style={{ width:38, height:38, borderRadius:8, background:heatBg(v,false), display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.7rem', fontWeight:700, color:'#1A1A1A' }}>{v}</div>
                    ))}
                  </>
                ))}
              </div>
              <div style={{ marginTop:'1rem', display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                {[['#22C55E','≥80 Strong'],['#86EFAC','65–79 Good'],['#F59E0B','50–64 Review'],['#EF4444','<50 Weak']].map(([c,l]) => (
                  <div key={l} style={{ display:'flex', alignItems:'center', gap:'.4rem', fontSize:'.72rem', color:'rgba(255,255,255,.45)' }}>
                    <div style={{ width:12, height:12, borderRadius:3, background:c as string }} />{l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── REVENUE ── */}
        {tab === 'revenue' && (
          <div style={{ animation:'fadeUp .3s ease' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.1rem', flexWrap:'wrap', gap:'.5rem' }}>
              <h2 style={{ fontWeight:900, fontSize:'1rem' }}>💰 Revenue Dashboard</h2>
              <button className="btn-sec" style={{ padding:'.45rem .95rem', fontSize:'.78rem' }}>📄 Export GST Report</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(155px,1fr))', gap:'.85rem', marginBottom:'1.25rem' }}>
              {[
                { l:'Gross Earnings',          v:'₹55,000', c:'#22C55E' },
                { l:'Platform Commission (15%)',v:'₹8,250',  c:'#F59E0B' },
                { l:'GST (18%)',                v:'₹8,415',  c:'#EF4444' },
                { l:'Net Payout',              v:'₹38,335', c:'#22C55E' },
              ].map(i => (
                <div key={i.l} className="stat-card">
                  <div style={{ fontSize:'1.35rem', fontWeight:900, color:i.c }}>{i.v}</div>
                  <div style={{ fontSize:'.64rem', color:'rgba(255,255,255,.4)', textTransform:'uppercase', letterSpacing:'.06em', marginTop:'.25rem', fontWeight:600 }}>{i.l}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding:'1.25rem' }}>
              <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.4)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.85rem', fontWeight:700 }}>Monthly Earnings (₹)</div>
              <BarChart data={EARNINGS} labels={MONTHS} />
            </div>
          </div>
        )}

        {/* ── SCHEDULE ── */}
        {tab === 'schedule' && (
          <div style={{ animation:'fadeUp .3s ease' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.1rem' }}>
              <h2 style={{ fontWeight:900, fontSize:'1rem' }}>📅 Today's Schedule</h2>
              <button className="btn-pri" style={{ padding:'.5rem 1rem', fontSize:'.8rem' }}>+ Book Session</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'.65rem' }}>
              {SCHEDULE.map((s,i) => (
                <div key={i} className="card" style={{ padding:'1.1rem 1.35rem', display:'flex', alignItems:'center', gap:'1.25rem', opacity:s.done?.65:1, borderLeft:`3px solid ${s.done?'rgba(255,255,255,.1)':'#0EA5E9'}` }}>
                  <div style={{ textAlign:'center', minWidth:52 }}>
                    <div style={{ fontWeight:900, fontSize:'.92rem', color:s.done?'rgba(255,255,255,.35)':'#38BDF8' }}>{s.time}</div>
                  </div>
                  <span style={{ fontSize:'1.3rem' }}>{s.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:'.9rem' }}>{s.student}</div>
                    <div style={{ fontSize:'.78rem', color:'rgba(255,255,255,.45)', marginTop:'.1rem' }}>{s.topic}</div>
                  </div>
                  <span style={{ fontSize:'.68rem', fontWeight:700, padding:'.25rem .65rem', borderRadius:100, background:'rgba(14,165,233,.12)', color:'#38BDF8', border:'1px solid rgba(14,165,233,.25)' }}>{s.type}</span>
                  {!s.done && <button className="btn-pri" style={{ padding:'.4rem .85rem', fontSize:'.75rem' }}>🔴 Start</button>}
                  {s.done && <span style={{ fontSize:'.72rem', color:'rgba(255,255,255,.3)', fontWeight:700 }}>Done ✅</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            📚  LIBRARY
        ════════════════════════════════════════════════════════ */}
        {tab === 'library' && (
          <div style={{ animation:'fadeUp .3s ease' }}>

            {/* Book detail modal */}
            {selBook && (
              <div style={{ position:'fixed', inset:0, zIndex:999, background:'rgba(0,0,0,.8)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}
                onClick={()=>setSelBook(null)}>
                <div style={{ background:'#111827', border:'1px solid rgba(255,255,255,.12)', borderRadius:22, padding:'2rem', maxWidth:600, width:'100%', animation:'fadeUp .25s ease' }}
                  onClick={e=>e.stopPropagation()}>
                  <div style={{ display:'flex', gap:'1.25rem', marginBottom:'1.5rem' }}>
                    <div style={{ width:80, height:110, borderRadius:12, background:`linear-gradient(160deg,${selBook.cover},${selBook.cover}88)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', flexShrink:0, border:'1px solid rgba(255,255,255,.1)' }}>📖</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:900, fontSize:'1.1rem', lineHeight:1.35, marginBottom:'.35rem' }}>{selBook.title}</div>
                      <div style={{ fontSize:'.82rem', color:'rgba(255,255,255,.5)', marginBottom:'.5rem' }}>by {selBook.author} · {selBook.edition}</div>
                      <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
                        <span style={{ fontSize:'.65rem', padding:'.2rem .6rem', borderRadius:100, background:`${selBook.cover}22`, color:selBook.cover, border:`1px solid ${selBook.cover}44`, fontWeight:700 }}>{selBook.subject}</span>
                        <span style={{ fontSize:'.65rem', padding:'.2rem .6rem', borderRadius:100, background:selBook.type==='FREE'?'rgba(34,197,94,.15)':'rgba(245,158,11,.15)', color:selBook.type==='FREE'?'#22C55E':'#F59E0B', border:`1px solid ${selBook.type==='FREE'?'rgba(34,197,94,.3)':'rgba(245,158,11,.3)'}`, fontWeight:800 }}>{selBook.type==='FREE'?'🆓 FREE':selBook.price+' PAID'}</span>
                        <span style={{ fontSize:'.65rem', padding:'.2rem .6rem', borderRadius:100, background:'rgba(255,255,255,.06)', color:'rgba(255,255,255,.5)', fontWeight:600 }}>{selBook.pages} pages</span>
                      </div>
                    </div>
                    <button className="btn-sec" style={{ padding:'.35rem .7rem', fontSize:'.8rem', alignSelf:'flex-start' }} onClick={()=>setSelBook(null)}>✕</button>
                  </div>
                  <div style={{ fontSize:'.85rem', color:'rgba(255,255,255,.6)', lineHeight:1.7, marginBottom:'1.25rem', background:'rgba(255,255,255,.03)', borderRadius:12, padding:'1rem', border:'1px solid rgba(255,255,255,.06)' }}>
                    {selBook.desc}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'.65rem', marginBottom:'1.25rem' }}>
                    {[['⭐ Rating',selBook.rating+'/5'],['👁️ Total Reads',(selBook.reads/1000).toFixed(0)+'K'],['📋 Exams',selBook.exam.join(' · ')]].map(([l,v])=>(
                      <div key={l as string} style={{ background:'rgba(255,255,255,.04)', borderRadius:10, padding:'.65rem .85rem', border:'1px solid rgba(255,255,255,.07)' }}>
                        <div style={{ fontSize:'.62rem', color:'rgba(255,255,255,.35)', marginBottom:'.2rem', fontWeight:700 }}>{l}</div>
                        <div style={{ fontWeight:800, fontSize:'.85rem' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'flex', gap:'.65rem' }}>
                    {selBook.type==='FREE'
                      ? <>
                          <button className="btn-pri" style={{ flex:1, padding:'.65rem' }}>📥 Download PDF</button>
                          <button className="btn-sec" style={{ flex:1, padding:'.65rem' }}>👁️ Read Online</button>
                        </>
                      : <>
                          <button className="btn-pri" style={{ flex:1, padding:'.65rem' }}>🔓 Unlock — {selBook.price}</button>
                          <button className="btn-sec" style={{ flex:1, padding:'.65rem' }}>👁️ Preview (3 pages)</button>
                        </>
                    }
                    <button className="btn-sec" style={{ padding:'.65rem 1rem' }}>📤 Share</button>
                  </div>
                </div>
              </div>
            )}

            {/* Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.1rem', flexWrap:'wrap', gap:'.65rem' }}>
              <div>
                <h2 style={{ fontWeight:900, fontSize:'1rem', marginBottom:'.2rem' }}>📚 Teacher Library</h2>
                <p style={{ fontSize:'.78rem', color:'rgba(255,255,255,.4)' }}>{filteredBooks.length} books available · Free PDFs + Premium Resources</p>
              </div>
              <input value={libSearch} onChange={e=>setLibSearch(e.target.value)}
                placeholder="🔍 Search books or authors…"
                style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:10, padding:'.55rem 1rem', color:'#fff', fontSize:'.82rem', outline:'none', width:240 }}
                onFocus={e=>(e.target as HTMLInputElement).style.borderColor='rgba(14,165,233,.5)'}
                onBlur={e=>(e.target as HTMLInputElement).style.borderColor='rgba(255,255,255,.1)'} />
            </div>

            {/* Filter bar */}
            <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'1.25rem', alignItems:'center' }}>
              <span style={{ fontSize:'.7rem', color:'rgba(255,255,255,.3)', fontWeight:700, textTransform:'uppercase' }}>Type:</span>
              {(['ALL','FREE','PAID'] as const).map(f=>(
                <button key={f} className={`tab-btn${libFilter===f?' active':''}`} style={{ padding:'.3rem .75rem', fontSize:'.73rem' }} onClick={()=>setLibFilter(f)}>
                  {f==='FREE'?'🆓 Free':f==='PAID'?'💎 Paid':'All Books'}
                </button>
              ))}
              <div style={{ width:1, height:16, background:'rgba(255,255,255,.1)', margin:'0 .25rem' }} />
              <span style={{ fontSize:'.7rem', color:'rgba(255,255,255,.3)', fontWeight:700, textTransform:'uppercase' }}>Subject:</span>
              {libSubjects.map(s=>(
                <button key={s} className={`tab-btn${libSubject===s?' active':''}`} style={{ padding:'.3rem .75rem', fontSize:'.73rem' }} onClick={()=>setLibSubject(s)}>{s}</button>
              ))}
            </div>

            {/* Books grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1rem' }}>
              {filteredBooks.map((book,i)=>(
                <div key={book.id} className="card" style={{ padding:'1.25rem', cursor:'pointer', transition:'all .2s', position:'relative', overflow:'hidden', animation:`fadeUp .3s ${i*.04}s ease both` }}
                  onClick={()=>setSelBook(book)}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-4px)';(e.currentTarget as HTMLElement).style.borderColor=book.cover+'55'}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='none';(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,.07)'}}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${book.cover},transparent)` }} />
                  <div style={{ display:'flex', gap:'.85rem', marginBottom:'.85rem' }}>
                    <div style={{ width:52, height:68, borderRadius:9, background:`linear-gradient(160deg,${book.cover},${book.cover}66)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0 }}>📖</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:800, fontSize:'.88rem', lineHeight:1.35, marginBottom:'.2rem', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' as any }}>{book.title}</div>
                      <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.4)' }}>{book.author}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:'.4rem', flexWrap:'wrap', marginBottom:'.85rem' }}>
                    <span style={{ fontSize:'.62rem', padding:'.18rem .55rem', borderRadius:100, background:`${book.cover}18`, color:book.cover, border:`1px solid ${book.cover}33`, fontWeight:700 }}>{book.subject}</span>
                    <span style={{ fontSize:'.62rem', padding:'.18rem .55rem', borderRadius:100, background:book.type==='FREE'?'rgba(34,197,94,.12)':'rgba(245,158,11,.12)', color:book.type==='FREE'?'#22C55E':'#F59E0B', border:`1px solid ${book.type==='FREE'?'rgba(34,197,94,.25)':'rgba(245,158,11,.25)'}`, fontWeight:800 }}>{book.type==='FREE'?'🆓 FREE':book.price}</span>
                    <span style={{ fontSize:'.62rem', padding:'.18rem .55rem', borderRadius:100, background:'rgba(255,255,255,.05)', color:'rgba(255,255,255,.4)', fontWeight:600 }}>{book.pages}p</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'.3rem', fontSize:'.72rem', color:'rgba(255,255,255,.4)' }}>
                      <span>⭐ {book.rating}</span>
                      <span>·</span>
                      <span>👁️ {(book.reads/1000).toFixed(0)}K reads</span>
                    </div>
                    <button className="btn-pri" style={{ padding:'.3rem .75rem', fontSize:'.72rem' }}>
                      {book.type==='FREE'?'📥 Download':'🔓 Unlock'}
                    </button>
                  </div>
                </div>
              ))}
              {filteredBooks.length===0 && (
                <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'3rem', color:'rgba(255,255,255,.3)' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:'.75rem' }}>📚</div>
                  <p style={{ fontWeight:700 }}>No books found</p>
                  <p style={{ fontSize:'.82rem', marginTop:'.35rem' }}>Try changing your filters</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            ✏️  CLASS NOTES — Today's Discussion Points
        ════════════════════════════════════════════════════════ */}
        {tab === 'notes' && (
          <div style={{ animation:'fadeUp .3s ease' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem', flexWrap:'wrap', gap:'.65rem' }}>
              <div>
                <h2 style={{ fontWeight:900, fontSize:'1rem', marginBottom:'.2rem' }}>✏️ Today's Class Notes</h2>
                <p style={{ fontSize:'.78rem', color:'rgba(255,255,255,.4)' }}>
                  {notes.filter(n=>n.done).length}/{notes.length} points covered today
                </p>
              </div>
              <div style={{ display:'flex', gap:'.5rem', alignItems:'center', fontSize:'.75rem', color:'rgba(255,255,255,.4)', fontWeight:700 }}>
                <span>Progress:</span>
                <div style={{ width:120, height:7, background:'rgba(255,255,255,.08)', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${notes.length?Math.round((notes.filter(n=>n.done).length/notes.length)*100):0}%`, background:'linear-gradient(90deg,#0EA5E9,#22C55E)', borderRadius:4, transition:'width .4s ease' }} />
                </div>
                <span style={{ color:'#22C55E', fontWeight:800 }}>{notes.length?Math.round((notes.filter(n=>n.done).length/notes.length)*100):0}%</span>
              </div>
            </div>

            {/* Add new point */}
            <div className="card" style={{ padding:'1.25rem', marginBottom:'1.25rem', border:'1px solid rgba(14,165,233,.18)' }}>
              <div style={{ fontSize:'.8rem', fontWeight:800, color:'#38BDF8', marginBottom:'.85rem', textTransform:'uppercase', letterSpacing:'.06em' }}>➕ Add Discussion Point</div>
              <textarea value={newNote} onChange={e=>setNewNote(e.target.value)}
                placeholder="What do you want to cover in today's class? Be specific…"
                rows={3}
                style={{ width:'100%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:10, padding:'.75rem 1rem', color:'#fff', fontSize:'.85rem', outline:'none', resize:'vertical', fontFamily:'inherit', lineHeight:1.6, marginBottom:'.85rem', transition:'border-color .2s' }}
                onFocus={e=>(e.target as HTMLTextAreaElement).style.borderColor='rgba(14,165,233,.5)'}
                onBlur={e=>(e.target as HTMLTextAreaElement).style.borderColor='rgba(255,255,255,.1)'} />
              <div style={{ display:'flex', gap:'.65rem', flexWrap:'wrap', alignItems:'center' }}>
                <select value={noteCat} onChange={e=>setNoteCat(e.target.value)}
                  style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:9, padding:'.45rem .85rem', color:'#fff', fontSize:'.8rem', outline:'none', fontFamily:'inherit' }}>
                  {['General','Polity','History','Geography','Economy','Science','Current','Ethics','Maths','Reasoning','English'].map(c=>(
                    <option key={c} value={c} style={{ background:'#111827' }}>{c}</option>
                  ))}
                </select>
                <select value={notePri} onChange={e=>setNotePri(e.target.value as any)}
                  style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:9, padding:'.45rem .85rem', color:'#fff', fontSize:'.8rem', outline:'none', fontFamily:'inherit' }}>
                  <option value="HIGH" style={{ background:'#111827' }}>🔴 High Priority</option>
                  <option value="MEDIUM" style={{ background:'#111827' }}>🟡 Medium</option>
                  <option value="LOW" style={{ background:'#111827' }}>🟢 Low</option>
                </select>
                <input type="time" value={noteTime} onChange={e=>setNoteTime(e.target.value)}
                  style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:9, padding:'.45rem .85rem', color:'#fff', fontSize:'.8rem', outline:'none', fontFamily:'inherit' }} />
                <button className="btn-pri" style={{ padding:'.5rem 1.25rem', fontSize:'.82rem', marginLeft:'auto' }} onClick={addNote}>+ Add Point</button>
              </div>
            </div>

            {/* Notes list — sorted HIGH first */}
            <div style={{ display:'flex', flexDirection:'column', gap:'.65rem' }}>
              {[...notes].sort((a,b)=>{
                const ord = {HIGH:0,MEDIUM:1,LOW:2}
                if (a.done!==b.done) return a.done?1:-1
                return ord[a.priority as keyof typeof ord]-ord[b.priority as keyof typeof ord]
              }).map((n,i)=>(
                <div key={n.id} style={{ display:'flex', gap:'.85rem', alignItems:'flex-start', background:n.done?'rgba(255,255,255,.02)':notePriColor(n.priority), border:`1px solid ${n.done?'rgba(255,255,255,.05)':notePriBorder(n.priority)}`, borderRadius:14, padding:'1rem 1.1rem', opacity:n.done?.65:1, transition:'all .2s', animation:`fadeUp .25s ${i*.04}s ease both` }}>
                  {/* Checkbox */}
                  <button onClick={()=>toggleNote(n.id)}
                    style={{ width:22, height:22, borderRadius:6, border:`2px solid ${n.done?'#22C55E':priColor(n.priority)}`, background:n.done?'rgba(34,197,94,.2)':'transparent', cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.75rem', marginTop:'.1rem', transition:'all .18s' }}>
                    {n.done?'✓':''}
                  </button>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:'.5rem', alignItems:'center', flexWrap:'wrap', marginBottom:'.35rem' }}>
                      <span style={{ fontSize:'.65rem', fontWeight:800, padding:'.18rem .55rem', borderRadius:100, background:notePriColor(n.priority), color:priColor(n.priority), border:`1px solid ${notePriBorder(n.priority)}` }}>{n.priority}</span>
                      <span style={{ fontSize:'.65rem', fontWeight:700, padding:'.18rem .55rem', borderRadius:100, background:'rgba(255,255,255,.06)', color:'rgba(255,255,255,.45)', border:'1px solid rgba(255,255,255,.1)' }}>{n.cat}</span>
                      {n.time && <span style={{ fontSize:'.62rem', color:'rgba(255,255,255,.3)', fontWeight:600 }}>🕐 {n.time}</span>}
                      {n.done && <span style={{ fontSize:'.62rem', color:'#22C55E', fontWeight:700 }}>✅ Covered</span>}
                    </div>
                    <div style={{ fontSize:'.87rem', color:n.done?'rgba(255,255,255,.35)':'rgba(255,255,255,.8)', lineHeight:1.55, textDecoration:n.done?'line-through':'none' }}>{n.text}</div>
                  </div>
                  <button onClick={()=>deleteNote(n.id)}
                    style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,.2)', fontSize:'.85rem', flexShrink:0, padding:'.15rem', borderRadius:6, transition:'color .15s' }}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='#EF4444'}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,.2)'}>✕</button>
                </div>
              ))}
              {notes.length===0 && (
                <div style={{ textAlign:'center', padding:'3rem', color:'rgba(255,255,255,.3)' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:'.75rem' }}>✏️</div>
                  <p style={{ fontWeight:700 }}>No notes yet</p>
                  <p style={{ fontSize:'.82rem', marginTop:'.35rem' }}>Add your first discussion point above</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            ❓  STUDENT DOUBTS QUEUE
        ════════════════════════════════════════════════════════ */}
        {tab === 'doubts' && (
          <div style={{ animation:'fadeUp .3s ease' }}>

            {/* Stats row */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:'.75rem', marginBottom:'1.25rem' }}>
              {[
                { l:'Total Doubts',  v:doubts.length,                         c:'#0EA5E9' },
                { l:'Pending',       v:doubts.filter(d=>!d.resolved).length,  c:'#F59E0B' },
                { l:'Resolved',      v:doubts.filter(d=>d.resolved).length,   c:'#22C55E' },
                { l:'High Urgency',  v:doubts.filter(d=>d.urgency==='HIGH'&&!d.resolved).length, c:'#EF4444' },
              ].map(s=>(
                <div key={s.l} className="stat-card">
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${s.c},transparent)` }} />
                  <div style={{ fontSize:'1.5rem', fontWeight:900, color:s.c }}>{s.v}</div>
                  <div style={{ fontSize:'.62rem', color:'rgba(255,255,255,.4)', textTransform:'uppercase', letterSpacing:'.07em', marginTop:'.2rem', fontWeight:600 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div style={{ display:'flex', gap:'.5rem', marginBottom:'1.1rem', alignItems:'center' }}>
              <span style={{ fontSize:'.7rem', color:'rgba(255,255,255,.3)', fontWeight:700, textTransform:'uppercase' }}>Show:</span>
              {(['ALL','PENDING','RESOLVED'] as const).map(f=>(
                <button key={f} className={`tab-btn${doubtFilter===f?' active':''}`} style={{ padding:'.3rem .75rem', fontSize:'.73rem' }} onClick={()=>setDoubtFilter(f)}>{f}</button>
              ))}
              <span style={{ marginLeft:'auto', fontSize:'.72rem', color:'rgba(255,255,255,.3)' }}>Sorted by urgency · newest first</span>
            </div>

            {/* Doubt cards */}
            <div style={{ display:'flex', flexDirection:'column', gap:'.85rem' }}>
              {[...doubts]
                .filter(d=>doubtFilter==='ALL'||(doubtFilter==='PENDING'&&!d.resolved)||(doubtFilter==='RESOLVED'&&d.resolved))
                .sort((a,b)=>{ const u={HIGH:0,MEDIUM:1,LOW:2}; if(a.resolved!==b.resolved)return a.resolved?1:-1; return u[a.urgency as keyof typeof u]-u[b.urgency as keyof typeof u] })
                .map((d,i)=>(
                <div key={d.id} className="card" style={{ padding:'1.25rem', border:`1px solid ${d.resolved?'rgba(34,197,94,.15)':d.urgency==='HIGH'?'rgba(239,68,68,.2)':'rgba(255,255,255,.07)'}`, opacity:d.resolved?.75:1, animation:`fadeUp .25s ${i*.05}s ease both` }}>

                  {/* Header row */}
                  <div style={{ display:'flex', alignItems:'flex-start', gap:'.85rem', marginBottom:'.85rem' }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#0EA5E9,#6366F1)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'.85rem', flexShrink:0 }}>{d.avatar}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', gap:'.5rem', alignItems:'center', flexWrap:'wrap', marginBottom:'.25rem' }}>
                        <span style={{ fontWeight:800, fontSize:'.9rem' }}>{d.student}</span>
                        <span style={{ fontSize:'.62rem', fontWeight:700, padding:'.18rem .55rem', borderRadius:100,
                          background:d.urgency==='HIGH'?'rgba(239,68,68,.15)':d.urgency==='MEDIUM'?'rgba(245,158,11,.12)':'rgba(34,197,94,.1)',
                          color:priColor(d.urgency),
                          border:`1px solid ${priColor(d.urgency)}44` }}>{d.urgency}</span>
                        <span style={{ fontSize:'.62rem', padding:'.18rem .55rem', borderRadius:100, background:'rgba(255,255,255,.06)', color:'rgba(255,255,255,.45)' }}>{d.subject}</span>
                        <span style={{ fontSize:'.62rem', padding:'.18rem .55rem', borderRadius:100, background:'rgba(14,165,233,.1)', color:'#38BDF8' }}>{d.exam}</span>
                        {d.resolved && <span style={{ fontSize:'.62rem', fontWeight:700, color:'#22C55E' }}>✅ Resolved</span>}
                      </div>
                      <div style={{ fontSize:'.68rem', color:'rgba(255,255,255,.3)', fontWeight:600 }}>Asked {d.time}</div>
                    </div>
                    {!d.resolved && (
                      <button className="btn-pri" style={{ padding:'.35rem .8rem', fontSize:'.73rem', flexShrink:0 }}
                        onClick={()=>setActiveDoubt(activeDoubt===d.id?null:d.id)}>
                        {activeDoubt===d.id?'✕ Cancel':'💬 Reply'}
                      </button>
                    )}
                  </div>

                  {/* Question box */}
                  <div style={{ background:'rgba(255,255,255,.04)', borderRadius:12, padding:'.85rem 1rem', marginBottom:'.85rem', borderLeft:'3px solid rgba(14,165,233,.4)', fontSize:'.85rem', color:'rgba(255,255,255,.75)', lineHeight:1.65 }}>
                    <span style={{ fontSize:'.65rem', fontWeight:800, color:'rgba(255,255,255,.3)', textTransform:'uppercase', display:'block', marginBottom:'.35rem' }}>❓ Student's Doubt</span>
                    {d.doubt}
                  </div>

                  {/* Existing reply */}
                  {d.reply && (
                    <div style={{ background:'rgba(34,197,94,.07)', borderRadius:12, padding:'.85rem 1rem', marginBottom:'.85rem', borderLeft:'3px solid rgba(34,197,94,.4)', fontSize:'.85rem', color:'rgba(255,255,255,.75)', lineHeight:1.65 }}>
                      <span style={{ fontSize:'.65rem', fontWeight:800, color:'#22C55E', textTransform:'uppercase', display:'block', marginBottom:'.35rem' }}>✅ Your Answer</span>
                      {d.reply}
                    </div>
                  )}

                  {/* Reply compose box */}
                  {activeDoubt===d.id && !d.resolved && (
                    <div style={{ animation:'fadeUp .2s ease', marginTop:'.5rem' }}>
                      <div style={{ display:'flex', gap:'.65rem', marginBottom:'.65rem' }}>
                        <button className="btn-sec" style={{ fontSize:'.72rem', padding:'.35rem .75rem' }}
                          onClick={()=>setReplyText(prev=>prev+' The key concept here is ')}>
                          🧠 AI Suggest
                        </button>
                        <button className="btn-sec" style={{ fontSize:'.72rem', padding:'.35rem .75rem' }}
                          onClick={()=>setReplyText(prev=>prev+' Refer to NCERT Chapter — ')}>
                          📚 Add Reference
                        </button>
                        <button className="btn-sec" style={{ fontSize:'.72rem', padding:'.35rem .75rem' }}
                          onClick={()=>setReplyText(prev=>prev+' Example: ')}>
                          💡 Add Example
                        </button>
                      </div>
                      <textarea value={replyText} onChange={e=>setReplyText(e.target.value)}
                        placeholder={`Type your answer to ${d.student}'s doubt here… Be thorough and use examples.`}
                        rows={5}
                        style={{ width:'100%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(14,165,233,.3)', borderRadius:12, padding:'.75rem 1rem', color:'#fff', fontSize:'.85rem', outline:'none', resize:'vertical', fontFamily:'inherit', lineHeight:1.65, marginBottom:'.75rem' }}
                        onFocus={e=>(e.target as HTMLTextAreaElement).style.borderColor='rgba(14,165,233,.6)'}
                        onBlur={e=>(e.target as HTMLTextAreaElement).style.borderColor='rgba(14,165,233,.3)'} />
                      <div style={{ display:'flex', gap:'.5rem', justifyContent:'flex-end' }}>
                        <button className="btn-sec" style={{ padding:'.5rem 1rem', fontSize:'.8rem' }} onClick={()=>{setActiveDoubt(null);setReplyText('')}}>Cancel</button>
                        <button className="btn-pri" style={{ padding:'.5rem 1.25rem', fontSize:'.82rem' }} onClick={()=>sendReply(d.id)}>✅ Send & Mark Resolved</button>
                      </div>
                    </div>
                  )}

                  {/* Bottom quick actions for unresolved */}
                  {!d.resolved && activeDoubt!==d.id && (
                    <div style={{ display:'flex', gap:'.5rem', marginTop:'.25rem' }}>
                      <button className="btn-sec" style={{ fontSize:'.72rem', padding:'.3rem .75rem' }}
                        onClick={()=>setDoubts(prev=>prev.map(x=>x.id===d.id?{...x,resolved:true,reply:'Addressed in today\'s class session. Please check the session recording for the full explanation.'}:x))}>
                        📌 Addressed in Class
                      </button>
                      <button className="btn-sec" style={{ fontSize:'.72rem', padding:'.3rem .75rem' }}
                        onClick={()=>setDoubts(prev=>prev.map(x=>x.id===d.id?{...x,urgency:'HIGH'}:x))}>
                        ⬆️ Mark Urgent
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {doubts.filter(d=>doubtFilter==='ALL'||(doubtFilter==='PENDING'&&!d.resolved)||(doubtFilter==='RESOLVED'&&d.resolved)).length===0 && (
                <div style={{ textAlign:'center', padding:'3rem', color:'rgba(255,255,255,.3)' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:'.75rem' }}>❓</div>
                  <p style={{ fontWeight:700 }}>{doubtFilter==='RESOLVED'?'No resolved doubts yet':'No pending doubts! 🎉'}</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
