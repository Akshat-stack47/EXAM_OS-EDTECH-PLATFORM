'use client'

import { useState } from 'react'
import Link from 'next/link'

/* ─── Plan Data ──────────────────────────────────────────────────── */
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Start your journey',
    price: { monthly: 0, yearly: 0 },
    badge: '',
    accent: '#6B7280',
    gradient: 'linear-gradient(135deg,#374151,#1F2937)',
    cta: 'Current Plan',
    ctaStyle: 'sec',
    features: [
      { text: '5 Mock Tests / month',         ok: true  },
      { text: '50 PYQ Questions / day',        ok: true  },
      { text: 'AI Chat (10 queries / day)',     ok: true  },
      { text: 'Basic Syllabus Tracker',         ok: true  },
      { text: 'Study Timer (Pomodoro)',         ok: true  },
      { text: 'Exam Hub (all exams)',           ok: true  },
      { text: 'Unlimited Mock Tests',           ok: false },
      { text: 'Full PYQ Archive (5000+)',       ok: false },
      { text: 'AI Mentor (unlimited)',          ok: false },
      { text: 'National Leaderboard rank',      ok: false },
      { text: 'Video Lectures (all subjects)',  ok: false },
      { text: 'Burnout & Performance Reports',  ok: false },
      { text: 'Offline PDF Downloads',         ok: false },
      { text: 'Priority Teacher Access',       ok: false },
    ],
  },
  {
    id: 'aspirant',
    name: 'Aspirant',
    tagline: 'For serious students',
    price: { monthly: 299, yearly: 199 },
    badge: '🔥 MOST POPULAR',
    accent: '#7C3AED',
    gradient: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
    cta: 'Start 7-Day Free Trial',
    ctaStyle: 'pri',
    features: [
      { text: '5 Mock Tests / month',         ok: true  },
      { text: '50 PYQ Questions / day',        ok: true  },
      { text: 'AI Chat (10 queries / day)',     ok: true  },
      { text: 'Basic Syllabus Tracker',         ok: true  },
      { text: 'Study Timer (Pomodoro)',         ok: true  },
      { text: 'Exam Hub (all exams)',           ok: true  },
      { text: 'Unlimited Mock Tests',           ok: true  },
      { text: 'Full PYQ Archive (5000+)',       ok: true  },
      { text: 'AI Mentor (unlimited)',          ok: true  },
      { text: 'National Leaderboard rank',      ok: true  },
      { text: 'Video Lectures (all subjects)',  ok: true  },
      { text: 'Burnout & Performance Reports',  ok: true  },
      { text: 'Offline PDF Downloads',         ok: false },
      { text: 'Priority Teacher Access',       ok: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For rank aspirants',
    price: { monthly: 599, yearly: 399 },
    badge: '👑 BEST VALUE',
    accent: '#F59E0B',
    gradient: 'linear-gradient(135deg,#F59E0B,#EF4444)',
    cta: 'Go Pro Now',
    ctaStyle: 'gold',
    features: [
      { text: '5 Mock Tests / month',         ok: true  },
      { text: '50 PYQ Questions / day',        ok: true  },
      { text: 'AI Chat (10 queries / day)',     ok: true  },
      { text: 'Basic Syllabus Tracker',         ok: true  },
      { text: 'Study Timer (Pomodoro)',         ok: true  },
      { text: 'Exam Hub (all exams)',           ok: true  },
      { text: 'Unlimited Mock Tests',           ok: true  },
      { text: 'Full PYQ Archive (5000+)',       ok: true  },
      { text: 'AI Mentor (unlimited)',          ok: true  },
      { text: 'National Leaderboard rank',      ok: true  },
      { text: 'Video Lectures (all subjects)',  ok: true  },
      { text: 'Burnout & Performance Reports',  ok: true  },
      { text: 'Offline PDF Downloads',         ok: true  },
      { text: 'Priority Teacher Access',       ok: true  },
    ],
  },
]

const FAQS = [
  { q: 'Can I cancel anytime?',          a: 'Yes! Cancel anytime from your account settings. No questions asked. If you cancel within 7 days of your first payment, we offer a full refund.' },
  { q: 'Is the 7-day trial really free?', a: 'Absolutely. The Aspirant trial requires no credit card. You get full access for 7 days and are only billed if you choose to continue.' },
  { q: 'How do mock tests work?',        a: 'Mock tests are exam-specific full-length simulations with AI-powered analysis. Results include subject-wise performance, time management, and peer comparison.' },
  { q: 'What payment methods are accepted?', a: 'We accept UPI, Credit/Debit cards, Net Banking, and Wallets (Paytm, PhonePe) via Razorpay. All payments are 100% secure.' },
  { q: 'Can I switch plans later?',      a: 'Yes. You can upgrade or downgrade at any time. Upgrades are effective immediately. Downgrades take effect at the end of your billing cycle.' },
  { q: 'Is there a student discount?',   a: 'Yes! Students with a valid college ID get an additional 20% off on yearly plans. Email support@examos.in with your ID to claim.' },
]

const TESTIMONIALS = [
  { name: 'Ananya Mishra', exam: 'UPSC CSE 2024', rank: 'AIR 47', text: 'The AI mock analysis and burnout tracker helped me optimise my last 3 months of preparation. Worth every rupee.' },
  { name: 'Rohit Yadav',   exam: 'SSC CGL 2024',  rank: 'Tier 2 Topper', text: 'Unlimited PYQs with explanations changed my preparation completely. I solved 3000+ questions in 2 months.' },
  { name: 'Priya Nair',    exam: 'IBPS PO 2024',  rank: 'Selected', text: 'The video lectures + AI chat combination is unbeatable. I cleared prelims and mains on my first attempt.' },
]

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.55} }
  @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  .plan-card { border-radius:22px; padding:2rem; position:relative; overflow:hidden;
               transition:transform .25s ease, box-shadow .25s ease; cursor:default; }
  .plan-card:hover { transform:translateY(-6px); box-shadow:0 24px 60px rgba(0,0,0,.5); }
  .toggle-pill { display:flex; background:rgba(255,255,255,.06); border-radius:100px; padding:4px; border:1px solid rgba(255,255,255,.1); }
  .toggle-opt { padding:.45rem 1.25rem; border-radius:100px; font-size:.82rem; font-weight:800;
                cursor:pointer; transition:all .2s; color:rgba(255,255,255,.4); border:none; background:none;
                font-family:inherit; white-space:nowrap; }
  .toggle-opt.active { background:#fff; color:#0A0F1E; }
  .feature-row { display:flex; align-items:center; gap:.65rem; padding:.45rem 0; border-bottom:1px solid rgba(255,255,255,.04); font-size:.83rem; }
  .feature-row:last-child { border-bottom:none; }
  .check-yes { width:20px; height:20px; border-radius:'50%'; display:flex; align-items:center; justify-content:center; font-size:.78rem; flex-shrink:0; }
  .faq-item { border:1px solid rgba(255,255,255,.07); border-radius:14px; overflow:hidden; transition:border-color .2s; }
  .faq-item:hover { border-color:rgba(255,255,255,.14); }
  .faq-q { width:100%; background:none; border:none; color:#fff; text-align:left; font-family:inherit;
            padding:1.1rem 1.35rem; cursor:pointer; font-weight:700; font-size:.88rem; display:flex;
            justify-content:space-between; align-items:center; gap:1rem; }
  .faq-a { font-size:.83rem; color:rgba(255,255,255,.55); line-height:1.7; padding:0 1.35rem 1.1rem; }
  .testi-card { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:18px;
                padding:1.5rem; transition:transform .2s, border-color .2s; }
  .testi-card:hover { transform:translateY(-3px); border-color:rgba(255,255,255,.15); }
  .btn-gold { background:linear-gradient(135deg,#F59E0B,#EF4444); color:#fff; border:none; border-radius:11px;
              font-family:inherit; font-weight:800; cursor:pointer; transition:all .2s; }
  .btn-gold:hover { filter:brightness(1.1); transform:translateY(-1px); box-shadow:0 8px 24px rgba(245,158,11,.4); }
  .btn-purple { background:linear-gradient(135deg,#7C3AED,#4F46E5); color:#fff; border:none; border-radius:11px;
                font-family:inherit; font-weight:800; cursor:pointer; transition:all .2s; }
  .btn-purple:hover { filter:brightness(1.1); transform:translateY(-1px); box-shadow:0 8px 24px rgba(124,58,237,.4); }
  .btn-outline { background:transparent; border:1px solid rgba(255,255,255,.2); color:rgba(255,255,255,.6);
                 border-radius:11px; font-family:inherit; font-weight:700; cursor:pointer; transition:all .2s; }
  .btn-outline:hover { background:rgba(255,255,255,.06); color:#fff; border-color:rgba(255,255,255,.35); }
  ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.12); border-radius:3px; }
`

export default function SubscriptionPageClient() {
  const [billing, setBilling] = useState<'monthly'|'yearly'>('yearly')
  const [openFaq,  setOpenFaq]  = useState<number|null>(null)
  const [activePlan, setActivePlan] = useState<string|null>(null)

  const savings = (p: typeof PLANS[0]) =>
    p.price.monthly > 0 ? Math.round(((p.price.monthly - p.price.yearly) / p.price.monthly) * 100) : 0

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:'#0A0F1E', minHeight:'100vh', color:'#fff' }}>
      <style>{STYLE}</style>

      {/* ── Sticky nav ── */}
      <div style={{ background:'rgba(10,15,30,.97)', borderBottom:'1px solid rgba(255,255,255,.07)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 1.5rem', height:60, display:'flex', alignItems:'center', gap:'1rem' }}>
          <Link href="/student/dashboard" style={{ color:'rgba(255,255,255,.4)', textDecoration:'none', fontSize:'.88rem', display:'flex', alignItems:'center', gap:'.4rem' }}
            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='#fff'}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,.4)'}>
            ← Dashboard
          </Link>
          <div style={{ width:1, height:18, background:'rgba(255,255,255,.12)' }} />
          <span style={{ fontWeight:900, fontSize:'.95rem' }}>⚡ Upgrade Plan</span>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'.5rem', background:'rgba(34,197,94,.1)', border:'1px solid rgba(34,197,94,.25)', borderRadius:100, padding:'.22rem .75rem' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#22C55E', animation:'pulse 2s infinite', flexShrink:0 }} />
            <span style={{ fontSize:'.65rem', fontWeight:800, color:'#22C55E' }}>7-DAY FREE TRIAL AVAILABLE</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'3rem 1.5rem' }}>

        {/* ── Hero ── */}
        <div style={{ textAlign:'center', marginBottom:'3rem', animation:'fadeUp .5s ease' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', background:'rgba(124,58,237,.15)', border:'1px solid rgba(124,58,237,.3)', borderRadius:100, padding:'.3rem .9rem', marginBottom:'1.25rem' }}>
            <span style={{ fontSize:'.68rem', fontWeight:800, color:'#A78BFA' }}>🏆 INDIA'S #1 EXAM PREP PLATFORM</span>
          </div>
          <h1 style={{ fontSize:'clamp(2rem,5vw,3rem)', fontWeight:900, lineHeight:1.15, marginBottom:'1rem',
            background:'linear-gradient(135deg,#fff 0%,#A78BFA 50%,#38BDF8 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            Unlock Your Full Potential
          </h1>
          <p style={{ fontSize:'1.05rem', color:'rgba(255,255,255,.5)', maxWidth:560, margin:'0 auto 2rem', lineHeight:1.7 }}>
            Join 2 lakh+ aspirants already cracking UPSC, SSC, Banking & Railway exams with ExamOS.
          </p>

          {/* Billing toggle */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'.6rem' }}>
            <div className="toggle-pill">
              <button className={`toggle-opt${billing==='monthly'?' active':''}`} onClick={()=>setBilling('monthly')}>Monthly</button>
              <button className={`toggle-opt${billing==='yearly'?' active':''}`} onClick={()=>setBilling('yearly')}>
                Yearly&nbsp;
                <span style={{ background:'#22C55E', color:'#fff', fontSize:'.6rem', padding:'.1rem .4rem', borderRadius:100, fontWeight:800 }}>SAVE 33%</span>
              </button>
            </div>
            {billing==='yearly' && <p style={{ fontSize:'.72rem', color:'#4ADE80', fontWeight:700 }}>✅ You save up to ₹2,400/year on yearly billing</p>}
          </div>
        </div>

        {/* ── Plan cards ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'1.25rem', marginBottom:'4rem' }}>
          {PLANS.map((plan, idx) => {
            const price = plan.price[billing]
            const isPopular = plan.id === 'aspirant'
            const isPro = plan.id === 'pro'
            return (
              <div key={plan.id} className="plan-card"
                style={{ background: plan.id==='free' ? 'rgba(255,255,255,.04)' : plan.gradient, border:`1px solid ${plan.id==='free'?'rgba(255,255,255,.08)':plan.accent+'44'}`,
                  transform: isPopular ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: isPopular ? `0 0 60px ${plan.accent}22` : 'none',
                  animation: `fadeUp .4s ${idx*.1}s ease both` }}>

                {/* Glow overlay for non-free */}
                {plan.id !== 'free' && <div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at 70% 0%,${plan.accent}18,transparent 60%)`, pointerEvents:'none' }} />}

                {/* Badge */}
                {plan.badge && (
                  <div style={{ position:'absolute', top:-1, left:'50%', transform:'translateX(-50%)',
                    background: isPro ? 'linear-gradient(90deg,#F59E0B,#EF4444)' : 'linear-gradient(90deg,#7C3AED,#4F46E5)',
                    padding:'.3rem 1rem', borderRadius:'0 0 12px 12px', fontSize:'.62rem', fontWeight:900, letterSpacing:'.06em', whiteSpace:'nowrap' }}>
                    {plan.badge}
                  </div>
                )}

                <div style={{ marginTop: plan.badge ? '1.25rem' : 0 }}>
                  {/* Plan name */}
                  <div style={{ marginBottom:'.5rem' }}>
                    <div style={{ fontWeight:900, fontSize:'1.15rem' }}>{plan.name}</div>
                    <div style={{ fontSize:'.78rem', color: plan.id==='free' ? 'rgba(255,255,255,.4)' : 'rgba(255,255,255,.65)', marginTop:'.15rem' }}>{plan.tagline}</div>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom:'1.5rem', marginTop:'1rem' }}>
                    {price === 0 ? (
                      <div style={{ fontSize:'2.2rem', fontWeight:900 }}>Free</div>
                    ) : (
                      <div style={{ display:'flex', alignItems:'flex-end', gap:'.35rem' }}>
                        <div style={{ fontSize:'2.5rem', fontWeight:900, lineHeight:1 }}>₹{price}</div>
                        <div style={{ fontSize:'.78rem', color:'rgba(255,255,255,.5)', paddingBottom:'.25rem' }}>/ month</div>
                      </div>
                    )}
                    {billing==='yearly' && price>0 && (
                      <div style={{ fontSize:'.72rem', color:'#4ADE80', fontWeight:700, marginTop:'.2rem' }}>
                        Save {savings(plan)}% vs monthly · Billed ₹{price*12}/year
                      </div>
                    )}
                  </div>

                  {/* CTA button */}
                  <button
                    className={plan.ctaStyle==='gold'?'btn-gold':plan.ctaStyle==='pri'?'btn-purple':'btn-outline'}
                    style={{ width:'100%', padding:'.85rem', fontSize:'.9rem', marginBottom:'1.5rem' }}
                    onClick={() => setActivePlan(plan.id)}>
                    {activePlan===plan.id ? '✅ Selected — Pay via Razorpay →' : plan.cta}
                  </button>

                  {/* Features */}
                  <div>
                    {plan.features.map((f, i) => (
                      <div key={i} className="feature-row"
                        style={{ color: f.ok ? (plan.id==='free'?'rgba(255,255,255,.75)':'rgba(255,255,255,.9)') : 'rgba(255,255,255,.2)' }}>
                        <span style={{ width:20, height:20, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.78rem', flexShrink:0,
                          background: f.ok ? (plan.id==='free'?'rgba(107,114,128,.2)': plan.id==='aspirant'?'rgba(124,58,237,.25)':'rgba(245,158,11,.2)') : 'rgba(255,255,255,.04)',
                          color: f.ok ? (plan.id==='free'?'#9CA3AF':plan.id==='aspirant'?'#A78BFA':'#FCD34D') : 'rgba(255,255,255,.15)' }}>
                          {f.ok ? '✓' : '✕'}
                        </span>
                        {f.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Trust badges ── */}
        <div style={{ display:'flex', gap:'1.5rem', justifyContent:'center', flexWrap:'wrap', marginBottom:'4rem', padding:'1.5rem', background:'rgba(255,255,255,.03)', borderRadius:20, border:'1px solid rgba(255,255,255,.07)' }}>
          {[['🔐','100% Secure Payments','Razorpay Encrypted'],['🔄','Cancel Anytime','No Questions Asked'],['🎁','7-Day Free Trial','No Credit Card Needed'],['📞','24×7 Support','WhatsApp + Email'],['🏆','2 Lakh+ Students','Cleared Their Exams']].map(([icon,title,sub])=>(
            <div key={title as string} style={{ textAlign:'center', minWidth:130 }}>
              <div style={{ fontSize:'1.5rem', marginBottom:'.3rem' }}>{icon}</div>
              <div style={{ fontWeight:800, fontSize:'.82rem' }}>{title}</div>
              <div style={{ fontSize:'.68rem', color:'rgba(255,255,255,.4)', marginTop:'.1rem' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Testimonials ── */}
        <div style={{ marginBottom:'4rem' }}>
          <h2 style={{ textAlign:'center', fontSize:'1.4rem', fontWeight:900, marginBottom:'.5rem' }}>
            Toppers Who Used ExamOS 🏆
          </h2>
          <p style={{ textAlign:'center', color:'rgba(255,255,255,.4)', fontSize:'.88rem', marginBottom:'2rem' }}>Real results from real aspirants</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1.1rem' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testi-card" style={{ animation:`fadeUp .4s ${i*.1}s ease both` }}>
                <div style={{ display:'flex', gap:'.75rem', alignItems:'center', marginBottom:'1rem' }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:`linear-gradient(135deg,${['#7C3AED','#06B6D4','#22C55E'][i]},${['#4F46E5','#0EA5E9','#16A34A'][i]})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'.9rem', flexShrink:0 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:'.9rem' }}>{t.name}</div>
                    <div style={{ fontSize:'.7rem', color:'rgba(255,255,255,.45)', marginTop:'.1rem' }}>{t.exam}</div>
                    <div style={{ fontSize:'.7rem', color:'#F59E0B', fontWeight:800 }}>{t.rank}</div>
                  </div>
                  <div style={{ marginLeft:'auto', fontSize:.82+'rem', color:'#F59E0B' }}>★★★★★</div>
                </div>
                <p style={{ fontSize:'.83rem', color:'rgba(255,255,255,.65)', lineHeight:1.7, fontStyle:'italic' }}>"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ maxWidth:780, margin:'0 auto 4rem' }}>
          <h2 style={{ textAlign:'center', fontSize:'1.4rem', fontWeight:900, marginBottom:'.5rem' }}>Frequently Asked Questions</h2>
          <p style={{ textAlign:'center', color:'rgba(255,255,255,.4)', fontSize:'.88rem', marginBottom:'2rem' }}>Everything you need to know</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'.6rem' }}>
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-q" onClick={() => setOpenFaq(openFaq===i?null:i)}>
                  <span>{faq.q}</span>
                  <span style={{ fontSize:'1.1rem', color:'rgba(255,255,255,.4)', transition:'transform .2s', transform:openFaq===i?'rotate(45deg)':'rotate(0deg)', flexShrink:0 }}>+</span>
                </button>
                {openFaq===i && (
                  <div className="faq-a" style={{ animation:'fadeUp .2s ease' }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA banner ── */}
        <div style={{ background:'linear-gradient(135deg,#7C3AED22,#06B6D422)', border:'1px solid rgba(124,58,237,.25)', borderRadius:24, padding:'2.5rem 2rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-30%', right:'-5%', width:300, height:300, borderRadius:'50%', background:'rgba(124,58,237,.08)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-30%', left:'-5%', width:250, height:250, borderRadius:'50%', background:'rgba(6,182,212,.06)', pointerEvents:'none' }} />
          <h2 style={{ fontSize:'1.6rem', fontWeight:900, marginBottom:'.65rem', position:'relative' }}>Start Free. Upgrade Anytime.</h2>
          <p style={{ color:'rgba(255,255,255,.5)', fontSize:'.9rem', marginBottom:'1.75rem', maxWidth:480, margin:'0 auto 1.75rem', lineHeight:1.7, position:'relative' }}>
            No credit card needed for the free plan. Upgrade when you're ready to unlock full exam preparation power.
          </p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap', position:'relative' }}>
            <button className="btn-purple" style={{ padding:'.85rem 2rem', fontSize:'.95rem' }}>
              🚀 Start 7-Day Aspirant Trial
            </button>
            <Link href="/student/dashboard" style={{ display:'flex', alignItems:'center' }}>
              <button className="btn-outline" style={{ padding:'.85rem 1.5rem', fontSize:'.9rem' }}>
                Continue with Free Plan
              </button>
            </Link>
          </div>
          <p style={{ fontSize:'.72rem', color:'rgba(255,255,255,.3)', marginTop:'1rem', position:'relative' }}>
            Secured by Razorpay · 256-bit SSL · PCI DSS Compliant
          </p>
        </div>

      </div>
    </div>
  )
}
