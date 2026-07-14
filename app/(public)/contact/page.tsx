'use client'
import { useState } from 'react'
const STYLE = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.input{width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:.75rem 1rem;color:#fff;font-size:.9rem;outline:none;font-family:inherit;transition:border-color .2s}.input:focus{border-color:rgba(124,58,237,.5)}.btn{background:linear-gradient(135deg,#7C3AED,#4F46E5);color:#fff;border:none;border-radius:12px;font-family:inherit;font-weight:800;cursor:pointer;padding:.8rem 2rem;font-size:.9rem;transition:all .18s;width:100%}.btn:hover{filter:brightness(1.1);transform:translateY(-1px)}.contact-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:1.25rem 1.5rem;display:flex;align-items:flex-start;gap:1rem}`
export default function ContactPage() {
  const [form, setForm]   = useState({ name:'', email:'', type:'General', message:'' })
  const [sent, setSent]   = useState(false)
  const [loading, setLoading] = useState(false)
  const submit = async (e: any) => {
    e.preventDefault(); setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setSent(true); setLoading(false)
  }
  return (
    <div style={{ background:'#070B14', minHeight:'100vh', color:'#fff', fontFamily:"'Inter',system-ui,sans-serif" }}>
      <style>{STYLE}</style>
      <nav style={{ borderBottom:'1px solid rgba(255,255,255,.07)', padding:'1rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(7,11,20,.97)', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(20px)' }}>
        <a href="/" style={{ fontWeight:900, fontSize:'1rem', textDecoration:'none', background:'linear-gradient(135deg,#7C3AED,#06B6D4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>ExamOS ⚡</a>
        <div style={{ display:'flex', gap:'1.25rem', fontSize:'.82rem' }}>
          <a href="/privacy-policy" style={{ color:'rgba(255,255,255,.5)', textDecoration:'none' }}>Privacy</a>
          <a href="/terms-of-service" style={{ color:'rgba(255,255,255,.5)', textDecoration:'none' }}>Terms</a>
          <a href="/login" style={{ color:'#A78BFA', textDecoration:'none', fontWeight:700 }}>Sign In →</a>
        </div>
      </nav>
      <div style={{ maxWidth:900, margin:'0 auto', padding:'2.5rem 1.5rem 5rem' }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem', animation:'fadeUp .4s ease' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'.75rem' }}>💬</div>
          <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.2rem)', fontWeight:900, marginBottom:'.5rem' }}>Contact & Support</h1>
          <p style={{ color:'rgba(255,255,255,.45)', maxWidth:480, margin:'0 auto' }}>We typically respond within 4 hours on weekdays. For urgent exam-related issues, use WhatsApp support.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem', alignItems:'start' }}>
          {/* Contact Form */}
          <div style={{ animation:'fadeUp .4s .05s ease both' }}>
            {sent ? (
              <div style={{ textAlign:'center', padding:'3rem 1.5rem', background:'rgba(34,197,94,.06)', border:'1px solid rgba(34,197,94,.2)', borderRadius:20 }}>
                <div style={{ fontSize:'3rem', marginBottom:'.75rem' }}>✅</div>
                <div style={{ fontWeight:900, fontSize:'1.1rem', marginBottom:'.4rem' }}>Message Sent!</div>
                <div style={{ color:'rgba(255,255,255,.45)', fontSize:'.88rem', lineHeight:1.6 }}>We'll reply to <strong style={{ color:'#fff' }}>{form.email}</strong> within 4 hours.<br />Check your spam folder if you don't hear back.</div>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <h2 style={{ fontWeight:900, fontSize:'1rem', marginBottom:'.25rem' }}>Send us a message</h2>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
                  <div>
                    <label style={{ fontSize:'.7rem', fontWeight:700, color:'rgba(255,255,255,.35)', display:'block', marginBottom:'.35rem', textTransform:'uppercase', letterSpacing:'.06em' }}>Your Name</label>
                    <input className="input" required value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))} placeholder="Riya Sharma" />
                  </div>
                  <div>
                    <label style={{ fontSize:'.7rem', fontWeight:700, color:'rgba(255,255,255,.35)', display:'block', marginBottom:'.35rem', textTransform:'uppercase', letterSpacing:'.06em' }}>Email</label>
                    <input className="input" required type="email" value={form.email} onChange={e => setForm(f => ({...f, email:e.target.value}))} placeholder="you@email.com" />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:'.7rem', fontWeight:700, color:'rgba(255,255,255,.35)', display:'block', marginBottom:'.35rem', textTransform:'uppercase', letterSpacing:'.06em' }}>Query Type</label>
                  <select className="input" style={{ cursor:'pointer' }} value={form.type} onChange={e => setForm(f => ({...f, type:e.target.value}))}>
                    {['General','Payment Issue','Technical Bug','Account Problem','Content Feedback','Partnership','Careers'].map(t => (
                      <option key={t} value={t} style={{ background:'#111827' }}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:'.7rem', fontWeight:700, color:'rgba(255,255,255,.35)', display:'block', marginBottom:'.35rem', textTransform:'uppercase', letterSpacing:'.06em' }}>Message</label>
                  <textarea className="input" required rows={5} style={{ resize:'vertical' }} value={form.message} onChange={e => setForm(f => ({...f, message:e.target.value}))} placeholder="Describe your issue or question in detail..." />
                </div>
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? '⏳ Sending…' : '📨 Send Message'}
                </button>
              </form>
            )}
          </div>
          {/* Contact Details */}
          <div style={{ display:'flex', flexDirection:'column', gap:'.9rem', animation:'fadeUp .4s .1s ease both' }}>
            <h2 style={{ fontWeight:900, fontSize:'1rem', marginBottom:'.25rem' }}>Other ways to reach us</h2>
            {[
              { icon:'💬', title:'WhatsApp Support', sub:'Fastest response — for payment & login issues', detail:'+91 98765 43210', link:'https://wa.me/919876543210', color:'#22C55E', btn:'Open WhatsApp' },
              { icon:'📧', title:'Email Support',    sub:'General queries & feedback', detail:'support@examos.in', link:'mailto:support@examos.in', color:'#0EA5E9', btn:'Send Email' },
              { icon:'🔐', title:'Security Reports', sub:'Responsible disclosure of vulnerabilities', detail:'security@examos.in', link:'mailto:security@examos.in', color:'#F59E0B', btn:'Report Issue' },
              { icon:'⚖️', title:'Legal & Privacy',  sub:'Data requests under DPDP Act 2023', detail:'privacy@examos.in', link:'mailto:privacy@examos.in', color:'#A78BFA', btn:'Contact DPO' },
            ].map(c => (
              <div key={c.title} className="contact-card">
                <div style={{ width:40, height:40, borderRadius:12, background:`${c.color}18`, border:`1px solid ${c.color}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>{c.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:'.9rem', marginBottom:'.15rem' }}>{c.title}</div>
                  <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.4)', marginBottom:'.4rem' }}>{c.sub}</div>
                  <a href={c.link} style={{ fontSize:'.82rem', color:c.color, fontWeight:700, textDecoration:'none' }}>{c.detail}</a>
                </div>
              </div>
            ))}
            <div style={{ background:'rgba(124,58,237,.06)', border:'1px solid rgba(124,58,237,.18)', borderRadius:14, padding:'1rem 1.25rem' }}>
              <div style={{ fontWeight:800, fontSize:'.88rem', marginBottom:'.35rem' }}>🏢 Office Address</div>
              <div style={{ fontSize:'.78rem', color:'rgba(255,255,255,.45)', lineHeight:1.7 }}>
                ExamOS Technologies Pvt. Ltd.<br />
                Connaught Place, New Delhi<br />
                Delhi — 110001, India<br />
                <span style={{ color:'rgba(255,255,255,.25)' }}>Mon–Fri: 9AM–7PM IST</span>
              </div>
            </div>
          </div>
        </div>
        {/* FAQ strip */}
        <div style={{ marginTop:'3rem', animation:'fadeUp .4s .15s ease both' }}>
          <h2 style={{ fontWeight:900, fontSize:'1rem', marginBottom:'1rem' }}>Frequently Asked Questions</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'.75rem' }}>
            {[
              ['I forgot my password', 'Click "Forgot Password" on the login page and enter your registered phone number to receive an OTP.'],
              ['My payment failed but money deducted', 'This usually auto-reverses in 3–5 days. Contact support@examos.in with your transaction ID.'],
              ['Can I change my target exam?', 'Yes — go to Settings → Profile and update your Target Exam. Your study plan will regenerate.'],
              ['How do I get a refund?', 'Monthly plans: cancel before renewal. Annual plans: eligible within 7 days of purchase. Email billing@examos.in.'],
            ].map(([q, a]) => (
              <div key={q as string} style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', borderRadius:14, padding:'1rem 1.25rem' }}>
                <div style={{ fontWeight:800, fontSize:'.85rem', marginBottom:'.4rem' }}>{q}</div>
                <div style={{ fontSize:'.78rem', color:'rgba(255,255,255,.45)', lineHeight:1.6 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
