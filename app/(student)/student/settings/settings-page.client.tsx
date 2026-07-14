'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.5} }
  .settings-section { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:18px; overflow:hidden; }
  .settings-row { display:flex; align-items:center; justify-content:space-between; padding:1rem 1.35rem; border-bottom:1px solid rgba(255,255,255,.05); gap:1rem; transition:background .15s; }
  .settings-row:last-child { border-bottom:none; }
  .settings-row:hover { background:rgba(255,255,255,.03); }
  .settings-label { font-size:.85rem; font-weight:700; color:#fff; }
  .settings-sub   { font-size:.72rem; color:rgba(255,255,255,.4); margin-top:.15rem; }
  .toggle { width:46px; height:26px; border-radius:13px; position:relative; cursor:pointer; transition:background .2s; flex-shrink:0; border:none; }
  .toggle-knob { position:absolute; top:3px; width:20px; height:20px; border-radius:50%; background:#fff; transition:left .2s; }
  .input-field { background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12); border-radius:10px; padding:.6rem .9rem; color:#fff; font-size:.88rem; outline:none; font-family:inherit; transition:border-color .2s; width:100%; }
  .input-field:focus { border-color:rgba(124,58,237,.5); }
  .btn-save { background:linear-gradient(135deg,#7C3AED,#4F46E5); color:#fff; border:none; border-radius:11px; font-family:inherit; font-weight:800; cursor:pointer; padding:.65rem 1.5rem; font-size:.88rem; transition:all .18s; }
  .btn-save:hover { filter:brightness(1.1); transform:translateY(-1px); }
  .btn-danger { background:rgba(239,68,68,.12); color:#F87171; border:1px solid rgba(239,68,68,.3); border-radius:11px; font-family:inherit; font-weight:700; cursor:pointer; padding:.6rem 1.25rem; font-size:.82rem; transition:all .18s; }
  .btn-danger:hover { background:rgba(239,68,68,.22); color:#fff; }
  .btn-sec { background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12); color:rgba(255,255,255,.65); border-radius:11px; font-family:inherit; font-weight:700; cursor:pointer; padding:.6rem 1.25rem; font-size:.82rem; transition:all .18s; }
  .btn-sec:hover { background:rgba(255,255,255,.12); color:#fff; }
  .plan-badge { padding:.28rem .75rem; border-radius:100px; font-size:.65rem; font-weight:800; text-transform:uppercase; letter-spacing:.06em; }
  ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.12); border-radius:3px; }
`

/* Toggle component */
const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
  <button className="toggle" style={{ background: on ? '#7C3AED' : 'rgba(255,255,255,.12)' }} onClick={onChange}>
    <div className="toggle-knob" style={{ left: on ? 23 : 3 }} />
  </button>
)

export default function SettingsPageClient() {
  const router = useRouter()

  /* Profile */
  const [name,    setName]    = useState('Riya Sharma')
  const [email,   setEmail]   = useState('riya@gmail.com')
  const [phone,   setPhone]   = useState('+91 98765 43210')
  const [exam,    setExam]    = useState('UPSC')
  const [category,setCategory]= useState('General')
  const [year,    setYear]    = useState('2026')
  const [saved,   setSaved]   = useState(false)

  /* Notifications */
  const [notifExam,  setNotifExam]  = useState(true)
  const [notifStreak,setNotifStreak]= useState(true)
  const [notifPlan,  setNotifPlan]  = useState(true)
  const [notifEmail, setNotifEmail] = useState(false)
  const [notifSMS,   setNotifSMS]   = useState(false)

  /* Privacy */
  const [pubLeader,  setPubLeader]  = useState(true)
  const [shareData,  setShareData]  = useState(false)
  const [analytics,  setAnalytics]  = useState(true)

  /* Danger zone */
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [loggingOut,    setLoggingOut]    = useState(false)

  const saveProfile = async () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    await new Promise(r => setTimeout(r, 800))
    router.push('/login')
  }

  const planColor = '#7C3AED'

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:'#0A0F1E', minHeight:'100vh', color:'#fff' }}>
      <style>{STYLE}</style>

      {/* Sticky header */}
      <div style={{ background:'rgba(10,15,30,.97)', borderBottom:'1px solid rgba(255,255,255,.07)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth:900, margin:'0 auto', padding:'0 1.5rem', height:60, display:'flex', alignItems:'center', gap:'1rem' }}>
          <Link href="/student/dashboard" style={{ color:'rgba(255,255,255,.4)', textDecoration:'none', fontSize:'.88rem', display:'flex', alignItems:'center', gap:'.4rem' }}
            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='#fff'}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,.4)'}>
            ← Dashboard
          </Link>
          <div style={{ width:1, height:18, background:'rgba(255,255,255,.12)' }} />
          <span style={{ fontWeight:900, fontSize:'.95rem' }}>⚙️ Settings & Profile</span>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'2rem 1.5rem 4rem' }}>

        {/* Profile card */}
        <div style={{ display:'flex', alignItems:'center', gap:'1.25rem', background:'linear-gradient(135deg,rgba(124,58,237,.14),rgba(6,182,212,.08))', border:'1px solid rgba(124,58,237,.25)', borderRadius:20, padding:'1.5rem', marginBottom:'2rem', animation:'fadeUp .4s ease' }}>
          <div style={{ width:68, height:68, borderRadius:'50%', background:'linear-gradient(135deg,#7C3AED,#06B6D4)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'1.8rem', flexShrink:0, boxShadow:'0 0 24px rgba(124,58,237,.4)' }}>
            {name[0]}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:900, fontSize:'1.05rem' }}>{name}</div>
            <div style={{ fontSize:'.78rem', color:'rgba(255,255,255,.45)', marginTop:'.2rem' }}>{email} · {exam} Aspirant</div>
            <div style={{ display:'flex', gap:'.5rem', marginTop:'.5rem', flexWrap:'wrap' }}>
              <span className="plan-badge" style={{ background:'rgba(124,58,237,.2)', color:'#A78BFA', border:'1px solid rgba(124,58,237,.3)' }}>⚡ Free Plan</span>
              <span className="plan-badge" style={{ background:'rgba(34,197,94,.12)', color:'#4ADE80', border:'1px solid rgba(34,197,94,.25)' }}>🔥 12-Day Streak</span>
              <span className="plan-badge" style={{ background:'rgba(245,158,11,.1)', color:'#FCD34D', border:'1px solid rgba(245,158,11,.25)' }}>🏆 Level 4</span>
            </div>
          </div>
          <Link href="/student/subscription" style={{ textDecoration:'none', flexShrink:0 }}>
            <button className="btn-save" style={{ fontSize:'.82rem', padding:'.55rem 1.1rem' }}>⚡ Upgrade Plan</button>
          </Link>
        </div>

        {/* ── Profile Info ── */}
        <h2 style={{ fontSize:'.72rem', fontWeight:800, color:'rgba(255,255,255,.3)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:'.75rem' }}>Profile Information</h2>
        <div className="settings-section" style={{ marginBottom:'1.5rem', animation:'fadeUp .4s .05s ease both' }}>
          <div style={{ padding:'1.25rem 1.35rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            {[
              { l:'Full Name',    v:name,    set:setName,    type:'text',  ph:'Your full name'     },
              { l:'Email Address',v:email,   set:setEmail,   type:'email', ph:'your@email.com'     },
              { l:'Phone Number', v:phone,   set:setPhone,   type:'tel',   ph:'+91 XXXXX XXXXX'    },
              { l:'Target Year',  v:year,    set:setYear,    type:'number',ph:'e.g. 2026'           },
            ].map(f => (
              <div key={f.l}>
                <label style={{ fontSize:'.72rem', fontWeight:700, color:'rgba(255,255,255,.4)', display:'block', marginBottom:'.4rem', textTransform:'uppercase', letterSpacing:'.06em' }}>{f.l}</label>
                <input className="input-field" type={f.type} value={f.v} onChange={e => f.set(e.target.value)} placeholder={f.ph} />
              </div>
            ))}
          </div>
          <div style={{ padding:'0 1.35rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', paddingBottom:'1.25rem' }}>
            <div>
              <label style={{ fontSize:'.72rem', fontWeight:700, color:'rgba(255,255,255,.4)', display:'block', marginBottom:'.4rem', textTransform:'uppercase', letterSpacing:'.06em' }}>Target Exam</label>
              <select className="input-field" value={exam} onChange={e => setExam(e.target.value)} style={{ cursor:'pointer' }}>
                {['UPSC','SSC','BANKING','RAILWAY','NDA','STATE_PSC','GATE','POLICE'].map(ex => (
                  <option key={ex} value={ex} style={{ background:'#111827' }}>{ex}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize:'.72rem', fontWeight:700, color:'rgba(255,255,255,.4)', display:'block', marginBottom:'.4rem', textTransform:'uppercase', letterSpacing:'.06em' }}>Category</label>
              <select className="input-field" value={category} onChange={e => setCategory(e.target.value)} style={{ cursor:'pointer' }}>
                {['General','OBC','SC','ST','EWS','PwD'].map(c => (
                  <option key={c} value={c} style={{ background:'#111827' }}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ padding:'1rem 1.35rem', borderTop:'1px solid rgba(255,255,255,.06)', display:'flex', justifyContent:'flex-end', gap:'.65rem' }}>
            <Link href="/onboarding" style={{ textDecoration:'none' }}>
              <button className="btn-sec" style={{ fontSize:'.8rem' }}>🎯 Re-run Onboarding</button>
            </Link>
            <button className="btn-save" onClick={saveProfile}>
              {saved ? '✅ Saved!' : '💾 Save Changes'}
            </button>
          </div>
        </div>

        {/* ── Notification Preferences ── */}
        <h2 style={{ fontSize:'.72rem', fontWeight:800, color:'rgba(255,255,255,.3)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:'.75rem' }}>Notifications</h2>
        <div className="settings-section" style={{ marginBottom:'1.5rem', animation:'fadeUp .4s .1s ease both' }}>
          {[
            { icon:'📋', label:'Exam Notifications',  sub:'UPSC, SSC & other exam date alerts',         on:notifExam,   set:setNotifExam   },
            { icon:'🔥', label:'Streak Reminders',     sub:'Daily reminders to maintain your streak',    on:notifStreak, set:setNotifStreak },
            { icon:'📅', label:'Study Plan Nudges',    sub:'Gentle reminders for today\'s study tasks',  on:notifPlan,   set:setNotifPlan   },
            { icon:'📧', label:'Email Digest',         sub:'Weekly performance digest to your email',    on:notifEmail,  set:setNotifEmail  },
            { icon:'📱', label:'SMS Alerts',           sub:'Critical exam date alerts via SMS',          on:notifSMS,    set:setNotifSMS    },
          ].map(r => (
            <div key={r.label} className="settings-row">
              <div style={{ display:'flex', gap:'.85rem', alignItems:'center' }}>
                <span style={{ fontSize:'1.25rem', flexShrink:0 }}>{r.icon}</span>
                <div>
                  <div className="settings-label">{r.label}</div>
                  <div className="settings-sub">{r.sub}</div>
                </div>
              </div>
              <Toggle on={r.on} onChange={() => r.set(v => !v)} />
            </div>
          ))}
        </div>

        {/* ── Privacy & Data ── */}
        <h2 style={{ fontSize:'.72rem', fontWeight:800, color:'rgba(255,255,255,.3)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:'.75rem' }}>Privacy & Data</h2>
        <div className="settings-section" style={{ marginBottom:'1.5rem', animation:'fadeUp .4s .15s ease both' }}>
          {[
            { icon:'🏆', label:'Show on National Leaderboard', sub:'Your name & rank visible to other aspirants', on:pubLeader, set:setPubLeader },
            { icon:'📊', label:'Share Anonymous Analytics',     sub:'Help improve ExamOS with usage data (no PII)', on:shareData, set:setShareData },
            { icon:'📈', label:'Personalisation Analytics',     sub:'AI uses your data to personalise content',     on:analytics, set:setAnalytics },
          ].map(r => (
            <div key={r.label} className="settings-row">
              <div style={{ display:'flex', gap:'.85rem', alignItems:'center' }}>
                <span style={{ fontSize:'1.25rem', flexShrink:0 }}>{r.icon}</span>
                <div>
                  <div className="settings-label">{r.label}</div>
                  <div className="settings-sub">{r.sub}</div>
                </div>
              </div>
              <Toggle on={r.on} onChange={() => r.set(v => !v)} />
            </div>
          ))}
          <div className="settings-row" style={{ flexDirection:'column', alignItems:'flex-start', gap:'.65rem' }}>
            <div>
              <div className="settings-label">📥 Download My Data</div>
              <div className="settings-sub">DPDP Act 2023 — export all your data in JSON format</div>
            </div>
            <button className="btn-sec" style={{ fontSize:'.78rem' }}>⬇️ Request Data Export</button>
          </div>
        </div>

        {/* ── App Preferences ── */}
        <h2 style={{ fontSize:'.72rem', fontWeight:800, color:'rgba(255,255,255,.3)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:'.75rem' }}>App Preferences</h2>
        <div className="settings-section" style={{ marginBottom:'1.5rem', animation:'fadeUp .4s .18s ease both' }}>
          <div className="settings-row">
            <div>
              <div className="settings-label">🌐 Language</div>
              <div className="settings-sub">UI language and AI response language</div>
            </div>
            <select className="input-field" style={{ width:'auto', minWidth:120 }} defaultValue="en">
              <option value="en" style={{ background:'#111827' }}>English</option>
              <option value="hi" style={{ background:'#111827' }}>हिंदी</option>
              <option value="hinglish" style={{ background:'#111827' }}>Hinglish</option>
            </select>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-label">🍅 Pomodoro Duration</div>
              <div className="settings-sub">Default study session length in the timer</div>
            </div>
            <select className="input-field" style={{ width:'auto', minWidth:120 }} defaultValue="25">
              <option value="25" style={{ background:'#111827' }}>25 min</option>
              <option value="35" style={{ background:'#111827' }}>35 min</option>
              <option value="45" style={{ background:'#111827' }}>45 min</option>
              <option value="50" style={{ background:'#111827' }}>50 min</option>
            </select>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-label">🎵 Study Ambience</div>
              <div className="settings-sub">Background sound while studying</div>
            </div>
            <select className="input-field" style={{ width:'auto', minWidth:140 }} defaultValue="none">
              {['None','Rain ☔','Café ☕','Focus 🎧','Nature 🌿','Lofi 🎶'].map(s => (
                <option key={s} value={s.toLowerCase()} style={{ background:'#111827' }}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Account & Security ── */}
        <h2 style={{ fontSize:'.72rem', fontWeight:800, color:'rgba(255,255,255,.3)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:'.75rem' }}>Account & Security</h2>
        <div className="settings-section" style={{ marginBottom:'1.5rem', animation:'fadeUp .4s .2s ease both' }}>
          <div className="settings-row">
            <div>
              <div className="settings-label">🔐 Change Password</div>
              <div className="settings-sub">Update your account password</div>
            </div>
            <button className="btn-sec" style={{ fontSize:'.8rem' }}>Change →</button>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-label">📱 Two-Factor Authentication</div>
              <div className="settings-sub">Add an extra layer of security via OTP</div>
            </div>
            <button className="btn-sec" style={{ fontSize:'.8rem' }}>Enable →</button>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-label">🔓 Active Sessions</div>
              <div className="settings-sub">View and revoke sessions on other devices</div>
            </div>
            <button className="btn-sec" style={{ fontSize:'.8rem' }}>Manage →</button>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-label">🚪 Sign Out</div>
              <div className="settings-sub">Log out from your current session</div>
            </div>
            <button className="btn-sec" style={{ fontSize:'.8rem' }} onClick={handleLogout} disabled={loggingOut}>
              {loggingOut ? '⏳ Signing out…' : 'Sign Out'}
            </button>
          </div>
        </div>

        {/* ── Danger Zone ── */}
        <h2 style={{ fontSize:'.72rem', fontWeight:800, color:'rgba(239,68,68,.5)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:'.75rem' }}>Danger Zone</h2>
        <div style={{ background:'rgba(239,68,68,.05)', border:'1px solid rgba(239,68,68,.18)', borderRadius:18, padding:'1.25rem 1.35rem', animation:'fadeUp .4s .25s ease both' }}>
          {!deleteConfirm ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
              <div>
                <div className="settings-label" style={{ color:'#F87171' }}>🗑️ Delete Account</div>
                <div className="settings-sub">Permanently delete all your data. This action cannot be undone. (DPDP Act 2023 compliant)</div>
              </div>
              <button className="btn-danger" onClick={() => setDeleteConfirm(true)}>Delete Account</button>
            </div>
          ) : (
            <div style={{ animation:'fadeUp .25s ease' }}>
              <div style={{ fontWeight:800, color:'#F87171', fontSize:'.95rem', marginBottom:'.5rem' }}>⚠️ Are you absolutely sure?</div>
              <div style={{ fontSize:'.83rem', color:'rgba(255,255,255,.5)', lineHeight:1.65, marginBottom:'1rem' }}>
                This will permanently delete your account, all test results, study plans, and progress data. 
                You have <strong style={{ color:'#F87171' }}>30 days</strong> to recover before hard deletion (DPDP Act compliance).
              </div>
              <div style={{ display:'flex', gap:'.65rem' }}>
                <button className="btn-sec" onClick={() => setDeleteConfirm(false)}>Cancel</button>
                <button className="btn-danger">Yes, Delete My Account</button>
              </div>
            </div>
          )}
        </div>

        {/* App version */}
        <div style={{ textAlign:'center', marginTop:'2.5rem', fontSize:'.68rem', color:'rgba(255,255,255,.18)' }}>
          ExamOS v2.0.0 · Built with ❤️ for India's 2 Lakh+ Aspirants
        </div>

      </div>
    </div>
  )
}
