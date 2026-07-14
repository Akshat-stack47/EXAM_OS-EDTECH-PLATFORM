import Link from 'next/link'
import { DashboardCard } from '@/components/landing/DashboardCard'
import { LandingFeatureCard } from '@/components/landing/LandingFeatureCard'
import { LandingStatCard } from '@/components/landing/LandingStatCard'

export const revalidate = 3600

const STATS = [
  { value: '200M+', label: 'Aspirants Targeted' },
  { value: '12', label: 'Exam Categories' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '4', label: 'Role Dashboards' },
]

const FEATURES = [
  { icon: '🧠', title: 'AI-Powered Study Plans', desc: 'Personalized 7-day schedules generated from your mock test performance and weak topic map.' },
  { icon: '📊', title: 'Live Analytics', desc: 'Post-test heatmaps, time-per-question analysis, and subject-wise accuracy — instantly.' },
  { icon: '🔥', title: 'Streak & XP System', desc: 'Gamified learning that keeps you consistent. Daily streaks, XP points, and national rank tracking.' },
  { icon: '🤝', title: 'Collaborative Whiteboard', desc: 'Study with peers in real-time on AI-assisted collaborative whiteboards.' },
  { icon: '💚', title: 'Health Engine', desc: 'Weekly burnout detection surveys with AI response and counselor escalation for high-risk students.' },
  { icon: '🎯', title: 'PYQ Intelligence', desc: 'Previous year questions indexed by topic, difficulty, and year — searchable in milliseconds.' },
]

const DASHBOARDS = [
  { name: 'Student', emoji: '🎓', desc: 'Track streaks, take mocks, chat with AI mentor, and monitor health — all in one dark premium interface.', href: '/student/dashboard?preview=1', gradient: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)', accent: '#7C3AED', badge: 'Dark Premium' },
  { name: 'Parent', emoji: '👨‍👩‍👧', desc: "Monitor your child's study hours, exam scores, and emotional health with warm, easy-to-read insights.", href: '/parent/dashboard?preview=1', gradient: 'linear-gradient(135deg, #1A0E00 0%, #2D1A00 50%, #3D2200 100%)', accent: '#E88D2A', badge: 'Amber Warm' },
  { name: 'Teacher', emoji: '📚', desc: 'Manage classes, track student performance, review weak topic clusters, and schedule mentorship sessions.', href: '/teacher/dashboard?preview=1', gradient: 'linear-gradient(135deg, #1B3A5C 0%, #2C5F8A 100%)', accent: '#0EA5E9', badge: 'Navy Professional' },
  { name: 'Control Center', emoji: '⚡', desc: 'Platform-wide oversight — user analytics, system health, exam data, and feature flag management.', href: '/coordinator/dashboard?preview=1', gradient: 'linear-gradient(135deg, #0D1117 0%, #161B22 100%)', accent: '#00D2FF', badge: 'Terminal Dark' },
]

const EXAMS = ['UPSC CSE', 'SSC CGL', 'IBPS PO', 'Railways RRB', 'NEET UG', 'JEE Main', 'State PSC', 'Defence NDA']

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh', background: '#0D0D1A', color: '#F8F8FF' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, backdropFilter: 'blur(20px)', background: 'rgba(13,13,26,0.8)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</span>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>Exam<span style={{ color: '#7C3AED' }}>OS</span></span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/login" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Login</Link>
          <Link href="/register" style={{ background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', color: '#fff', padding: '0.5rem 1.2rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '5rem 2rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse,rgba(124,58,237,0.25) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', padding: '0.3rem 1rem', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', color: '#A78BFA', marginBottom: '1.5rem' }}>
            ✦ EXAMOS v2.0 — NOW IN EARLY ACCESS
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            <span style={{ background: 'linear-gradient(90deg,#A78BFA,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>India&apos;s Unified</span>
            <br />Exam Intelligence
            <br /><span style={{ background: 'linear-gradient(90deg,#F59E0B,#F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Platform</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.55)', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            One ecosystem for every exam — UPSC, SSC, Banking, NEET, JEE. AI-powered study plans, live mock analytics, and collaborative tools for 200M+ aspirants.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" style={{ background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', color: '#fff', padding: '0.85rem 2rem', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: '1rem', boxShadow: '0 8px 32px rgba(124,58,237,0.4)' }}>
              Start Free Today →
            </Link>
            <Link href="/exams" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)', padding: '0.85rem 2rem', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}>
              Explore Exams
            </Link>
          </div>
        </div>
      </section>

      {/* Exam Ticker — animated scroll */}
      <section style={{ padding: '1.25rem 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', overflow: 'hidden', position: 'relative' }}>
        <style>{`
          @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
          .exam-ticker { display: flex; gap: 3rem; width: max-content; animation: ticker 22s linear infinite; }
          .exam-ticker:hover { animation-play-state: paused; }
          .exam-badge { font-size: 0.78rem; font-weight: 700; color: rgba(255,255,255,0.45); letter-spacing: 0.06em; text-transform: uppercase; white-space: nowrap; padding: 0.35rem 0.85rem; border: 1px solid rgba(255,255,255,0.08); border-radius: 100px; transition: color 0.2s, border-color 0.2s; }
          .exam-badge:hover { color: #A78BFA; border-color: rgba(167,139,250,0.35); }
        `}</style>
        <div className="exam-ticker">
          {[...EXAMS, ...EXAMS].map((exam, i) => (
            <span key={i} className="exam-badge">⚡ {exam}</span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {STATS.map((s) => (
            <LandingStatCard key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </section>

      {/* Role Dashboards — uses client component for hover interactivity */}
      <section style={{ padding: '3rem 2rem 5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>4 Role-Based Dashboards</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem' }}>Each role gets a completely different premium interface tailored to their needs.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {DASHBOARDS.map((d) => (
              <DashboardCard key={d.name} d={d} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '4rem 2rem 5rem', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Everything You Need to Clear Your Exam</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem' }}>Built for aspirants who are serious about their preparation.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {FEATURES.map((f) => (
              <LandingFeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse,rgba(124,58,237,0.2) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Start Your Preparation Today.<br /><span style={{ background: 'linear-gradient(90deg,#7C3AED,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>For Free.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '1rem' }}>No credit card. No download. Instant access to your AI study dashboard.</p>
          <Link href="/register" style={{ background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', color: '#fff', padding: '1rem 2.5rem', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: '1.05rem', boxShadow: '0 8px 32px rgba(124,58,237,0.4)', display: 'inline-block' }}>
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '3rem 2rem 2rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            {/* Brand */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'.4rem', marginBottom:'.75rem' }}>
                <span style={{ width:28, height:28, borderRadius:7, background:'linear-gradient(135deg,#7C3AED,#06B6D4)', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>⚡</span>
                <span style={{ fontWeight:900, fontSize:'1rem', color:'#fff' }}>Exam<span style={{ color:'#A78BFA' }}>OS</span></span>
              </div>
              <p style={{ fontSize:'.78rem', lineHeight:1.7, color:'rgba(255,255,255,.35)' }}>India's Unified Exam Intelligence Platform. Built for 200M+ aspirants.</p>
            </div>
            {/* Product */}
            <div>
              <div style={{ fontWeight:800, color:'rgba(255,255,255,.65)', fontSize:'.8rem', marginBottom:'.85rem', textTransform:'uppercase', letterSpacing:'.06em' }}>Platform</div>
              {[['Student Dashboard','/student/dashboard'],['Mock Tests','/student/mock-tests'],['Flashcards','/student/flashcards'],['Exam Calendar','/student/calendar'],['PYQ Browser','/student/pyq'],['Subscription','/student/subscription']].map(([l,h]) => (
                <div key={l} style={{ marginBottom:'.45rem' }}><Link href={h} style={{ color:'rgba(255,255,255,.35)', textDecoration:'none', fontSize:'.8rem', transition:'color .15s' }}>{l}</Link></div>
              ))}
            </div>
            {/* Company */}
            <div>
              <div style={{ fontWeight:800, color:'rgba(255,255,255,.65)', fontSize:'.8rem', marginBottom:'.85rem', textTransform:'uppercase', letterSpacing:'.06em' }}>Company</div>
              {[['About Us','/about'],['Contact Us','/contact'],['Teacher Dashboard','/teacher/dashboard'],['Coordinator Panel','/coordinator/dashboard'],['For Parents','/parent/dashboard']].map(([l,h]) => (
                <div key={l} style={{ marginBottom:'.45rem' }}><Link href={h} style={{ color:'rgba(255,255,255,.35)', textDecoration:'none', fontSize:'.8rem' }}>{l}</Link></div>
              ))}
            </div>
            {/* Legal */}
            <div>
              <div style={{ fontWeight:800, color:'rgba(255,255,255,.65)', fontSize:'.8rem', marginBottom:'.85rem', textTransform:'uppercase', letterSpacing:'.06em' }}>Legal</div>
              {[['Privacy Policy','/privacy-policy'],['Terms of Service','/terms-of-service'],['Contact / Support','/contact'],['DPDP Act Compliance','/privacy-policy']].map(([l,h]) => (
                <div key={l} style={{ marginBottom:'.45rem' }}><Link href={h} style={{ color:'rgba(255,255,255,.35)', textDecoration:'none', fontSize:'.8rem' }}>{l}</Link></div>
              ))}
            </div>
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,.06)', paddingTop:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
            <span style={{ fontSize:'.75rem', color:'rgba(255,255,255,.2)' }}>© 2026 ExamOS Technologies Pvt. Ltd. · New Delhi, India · Made with ❤️ for every aspirant</span>
            <div style={{ display:'flex', gap:'1rem' }}>
              <Link href="/login" style={{ color:'rgba(255,255,255,.3)', textDecoration:'none', fontSize:'.75rem' }}>Sign In</Link>
              <Link href="/register" style={{ color:'#A78BFA', textDecoration:'none', fontSize:'.75rem', fontWeight:700 }}>Get Started →</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
