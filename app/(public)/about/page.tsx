'use client'
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  .team-card { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:18px; padding:1.25rem; text-align:center; transition:all .2s; }
  .team-card:hover { transform:translateY(-4px); border-color:rgba(124,58,237,.3); box-shadow:0 12px 32px rgba(0,0,0,.4); }
  .stat-pill { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); border-radius:16px; padding:1.25rem 1.5rem; text-align:center; }
  .value-card { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:16px; padding:1.25rem; }
  ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:3px}
`
const TEAM = [
  { name:'Akshat Kumar', role:'Founder & CEO', emoji:'👨‍💻', color:'#7C3AED', bio:'IIT passout. Vision: make quality exam prep accessible to every aspirant in India.' },
  { name:'Product Team', role:'Design & UX',   emoji:'🎨', color:'#0EA5E9', bio:'Dark-mode obsessed designers building premium exam experiences.' },
  { name:'AI/ML Team',   role:'AI Engineering',emoji:'🤖', color:'#22C55E', bio:'Building the AI mentor and study plan engine that powers ExamOS.' },
  { name:'Content Team', role:'PYQ & Curriculum',emoji:'📚', color:'#F59E0B', bio:'Subject experts curating UPSC, SSC, Banking PYQs and study materials.' },
]
const STATS = [
  { val:'200M+', label:'Aspirants in India', icon:'🇮🇳' },
  { val:'12',    label:'Exam Categories', icon:'📋' },
  { val:'4',     label:'Dashboards Built', icon:'⚡' },
  { val:'2026',  label:'Founded Year', icon:'🚀' },
]
const VALUES = [
  { icon:'🎯', title:'Access for All', desc:'World-class exam preparation should not depend on geography or income. Every aspirant deserves the same tools.' },
  { icon:'🤖', title:'AI-First Learning', desc:'Personalised study plans, weak-topic detection, and AI mentorship that adapts to every student\'s unique journey.' },
  { icon:'📊', title:'Data-Driven Insights', desc:'We turn raw test performance into actionable intelligence — not just scores, but deep subject-level analytics.' },
  { icon:'💚', title:'Student Wellbeing', desc:'Exam stress is real. Our health engine monitors burnout and connects at-risk students with counselors — no student left behind.' },
]
export default function AboutPage() {
  return (
    <div style={{ background:'#070B14', minHeight:'100vh', color:'#fff', fontFamily:"'Inter',system-ui,sans-serif" }}>
      <style>{STYLE}</style>
      <nav style={{ borderBottom:'1px solid rgba(255,255,255,.07)', padding:'1rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(7,11,20,.97)', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(20px)' }}>
        <a href="/" style={{ fontWeight:900, fontSize:'1rem', textDecoration:'none', background:'linear-gradient(135deg,#7C3AED,#06B6D4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>ExamOS ⚡</a>
        <div style={{ display:'flex', gap:'1.25rem', fontSize:'.82rem' }}>
          <a href="/contact" style={{ color:'rgba(255,255,255,.5)', textDecoration:'none' }}>Contact</a>
          <a href="/privacy-policy" style={{ color:'rgba(255,255,255,.5)', textDecoration:'none' }}>Privacy</a>
          <a href="/login" style={{ color:'#A78BFA', textDecoration:'none', fontWeight:700 }}>Sign In →</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign:'center', padding:'5rem 1.5rem 3rem', maxWidth:700, margin:'0 auto', animation:'fadeUp .5s ease' }}>
        <div style={{ fontSize:'3.5rem', marginBottom:'1rem', animation:'float 3s ease infinite' }}>⚡</div>
        <h1 style={{ fontSize:'clamp(2rem,5vw,3rem)', fontWeight:900, marginBottom:'.75rem',
          background:'linear-gradient(135deg,#A78BFA,#38BDF8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
          India's Unified Exam Intelligence Platform
        </h1>
        <p style={{ color:'rgba(255,255,255,.5)', fontSize:'1.05rem', lineHeight:1.75 }}>
          ExamOS was built with a single belief: every aspirant in India — whether from a metro or a Tier-3 town — deserves access to world-class exam preparation tools powered by AI.
        </p>
      </div>

      <div style={{ maxWidth:960, margin:'0 auto', padding:'0 1.5rem 5rem' }}>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'1rem', marginBottom:'3.5rem', animation:'fadeUp .5s .05s ease both' }}>
          {STATS.map(s => (
            <div key={s.label} className="stat-pill">
              <div style={{ fontSize:'1.5rem', marginBottom:'.4rem' }}>{s.icon}</div>
              <div style={{ fontWeight:900, fontSize:'2rem', background:'linear-gradient(135deg,#A78BFA,#38BDF8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{s.val}</div>
              <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.4)', marginTop:'.2rem', fontWeight:600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div style={{ background:'linear-gradient(135deg,rgba(124,58,237,.12),rgba(6,182,212,.07))', border:'1px solid rgba(124,58,237,.25)', borderRadius:24, padding:'2.5rem', marginBottom:'3rem', animation:'fadeUp .5s .1s ease both' }}>
          <h2 style={{ fontWeight:900, fontSize:'1.4rem', marginBottom:'1rem' }}>Our Mission</h2>
          <p style={{ color:'rgba(255,255,255,.6)', fontSize:'1rem', lineHeight:1.85 }}>
            India has over 200 million competitive exam aspirants. Most of them rely on expensive coaching centers, photocopied notes, and disconnected tools. 
            ExamOS changes that by putting an <strong style={{ color:'#fff' }}>AI-powered, data-driven, full-stack exam platform</strong> in every aspirant's hands — 
            free to start, powerful to scale. From daily current affairs to mock tests, from personalized study plans to a teacher who actually knows your weak topics — 
            we are building the platform we wish existed when we were preparing.
          </p>
        </div>

        {/* Values */}
        <h2 style={{ fontWeight:900, fontSize:'1.15rem', marginBottom:'1.25rem', animation:'fadeUp .5s .15s ease both' }}>What We Stand For</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1rem', marginBottom:'3rem', animation:'fadeUp .5s .15s ease both' }}>
          {VALUES.map(v => (
            <div key={v.title} className="value-card">
              <div style={{ fontSize:'1.5rem', marginBottom:'.5rem' }}>{v.icon}</div>
              <div style={{ fontWeight:800, fontSize:'.95rem', marginBottom:'.4rem' }}>{v.title}</div>
              <div style={{ fontSize:'.8rem', color:'rgba(255,255,255,.45)', lineHeight:1.65 }}>{v.desc}</div>
            </div>
          ))}
        </div>

        {/* Team */}
        <h2 style={{ fontWeight:900, fontSize:'1.15rem', marginBottom:'1.25rem', animation:'fadeUp .5s .2s ease both' }}>The Team</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'1rem', marginBottom:'3rem', animation:'fadeUp .5s .2s ease both' }}>
          {TEAM.map(t => (
            <div key={t.name} className="team-card">
              <div style={{ width:56, height:56, borderRadius:16, background:`${t.color}20`, border:`1px solid ${t.color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', margin:'0 auto .75rem' }}>{t.emoji}</div>
              <div style={{ fontWeight:900, fontSize:'.9rem', marginBottom:'.2rem' }}>{t.name}</div>
              <div style={{ fontSize:'.7rem', color:t.color, fontWeight:700, marginBottom:'.5rem' }}>{t.role}</div>
              <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.4)', lineHeight:1.6 }}>{t.bio}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign:'center', animation:'fadeUp .5s .25s ease both' }}>
          <div style={{ fontWeight:900, fontSize:'1.3rem', marginBottom:'.5rem' }}>Ready to start your journey?</div>
          <p style={{ color:'rgba(255,255,255,.45)', fontSize:'.9rem', marginBottom:'1.5rem' }}>Join thousands of aspirants already using ExamOS.</p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <a href="/register" style={{ background:'linear-gradient(135deg,#7C3AED,#4F46E5)', color:'#fff', padding:'.8rem 2rem', borderRadius:12, textDecoration:'none', fontWeight:800, fontSize:'.9rem' }}>Get Started Free →</a>
            <a href="/contact" style={{ background:'rgba(255,255,255,.08)', color:'rgba(255,255,255,.7)', padding:'.8rem 2rem', borderRadius:12, textDecoration:'none', fontWeight:800, fontSize:'.9rem', border:'1px solid rgba(255,255,255,.12)' }}>Contact Us</a>
          </div>
        </div>

      </div>
    </div>
  )
}
