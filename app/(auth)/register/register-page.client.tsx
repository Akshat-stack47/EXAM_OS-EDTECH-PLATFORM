'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { setAuthCookie } from '../login/actions'

const ROLES = [
  { value: 'STUDENT',     label: 'Student',     emoji: '🎓', desc: 'Prepare for UPSC, SSC, NEET & more with AI tools', grad: 'linear-gradient(135deg,#7C3AED,#4F46E5)' },
  { value: 'PARENT',      label: 'Parent',       emoji: '👨‍👩‍👧', desc: 'Monitor your child\'s progress & wellbeing', grad: 'linear-gradient(135deg,#E88D2A,#F5A623)' },
  { value: 'TEACHER',     label: 'Teacher',      emoji: '👨‍🏫', desc: 'Mentor students & grow your teaching career', grad: 'linear-gradient(135deg,#0EA5E9,#0284C7)' },
  { value: 'COORDINATOR', label: 'Coordinator',  emoji: '⚡', desc: 'Platform-wide oversight, analytics & admin control', grad: 'linear-gradient(135deg,#00D2FF,#3A7BD5)' },
] as const

const EXAMS = ['UPSC', 'SSC', 'BANKING', 'RAILWAY', 'STATE_PSC', 'JEE', 'NEET', 'DEFENCE'] as const

const EXAM_YEARS = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i)

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'obc', label: 'OBC' },
  { value: 'sc', label: 'SC' },
  { value: 'st', label: 'ST' },
  { value: 'ews', label: 'EWS' },
]

export default function RegisterPageClient() {
  const router = useRouter()
  const [step, setStep] = useState<'role' | 'details' | 'exam'>('role')
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [targetExam, setTargetExam] = useState<string>('UPSC')
  const [targetYear, setTargetYear] = useState<number>(new Date().getFullYear() + 1)
  const [category, setCategory] = useState<string>('general')
  const [error, setError] = useState('')

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: async (result: any) => {
      await setAuthCookie(result.token)
      // Students go through onboarding wizard; other roles go straight to dashboard
      if (result.user.role === 'STUDENT') {
        router.push('/onboarding')
      } else {
        router.push(`/${result.user.role.toLowerCase()}/dashboard`)
      }
    },
    onError: (e: any) => {
      setError(e.message === 'USER_ALREADY_EXISTS' ? 'An account with this email already exists.' : 'Registration failed. Please try again.')
    },
  })

  const handleDetailsSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    setError('')
    if (!name.trim() || name.length < 2) { setError('Enter your full name (min 2 chars)'); return }
    if (!email.includes('@')) { setError('Enter a valid email address'); return }
    if (selectedRole === 'STUDENT') {
      setStep('exam')
    } else {
      registerMutation.mutate({ name: name.trim(), email, role: selectedRole as any })
    }
  }

  const handleExamSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    registerMutation.mutate({ name: name.trim(), email, role: 'STUDENT', targetExam: targetExam as any, targetYear, category })
  }

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 12, padding: '0.85rem 1rem', color: '#fff', fontSize: '1rem', outline: 'none',
    boxSizing: 'border-box' as const, transition: 'border-color 0.2s',
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg,#0D0D1A 0%,#1B1040 50%,#0D0D1A 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ position: 'fixed', top: '15%', right: '15%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, boxShadow: '0 0 24px rgba(124,58,237,0.4)' }}>⚡</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>Exam<span style={{ color: '#A78BFA' }}>OS</span></span>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '2.5rem', backdropFilter: 'blur(20px)', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>

          {/* Step indicator */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
            {(['role', 'details', ...(selectedRole === 'STUDENT' ? ['exam'] : [])]).map((s, i) => (
              <div key={s} style={{ flex: 1, height: 3, borderRadius: 100, background: ['role', 'details', 'exam'].indexOf(step) >= i ? 'linear-gradient(90deg,#7C3AED,#06B6D4)' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
            ))}
          </div>

          {/* ── Step 1: Role ── */}
          {step === 'role' && (
            <>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Choose your role</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', margin: '0 0 1.75rem' }}>How will you use ExamOS?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {ROLES.map(r => (
                  <button key={r.value}
                    onClick={() => { setSelectedRole(r.value); setStep('details') }}
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '1.1rem 1.25rem', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(167,139,250,0.4)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)' }}
                  >
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: r.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>{r.emoji}</div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>{r.label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.15rem' }}>{r.desc}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.2)', fontSize: '1.1rem' }}>→</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── Step 2: Details ── */}
          {step === 'details' && (
            <>
              <button onClick={() => setStep('role')} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.8rem', marginBottom: '1.25rem', padding: 0 }}>← Back</button>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Create your account</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', margin: '0 0 1.75rem' }}>
                Registering as a <span style={{ color: '#A78BFA', fontWeight: 700 }}>{selectedRole?.toLowerCase()}</span>
              </p>
              <form onSubmit={handleDetailsSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Full Name</label>
                  <input style={inputStyle} placeholder="Riya Sharma" value={name} onChange={e => setName(e.target.value)} required
                    onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')} />
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Email Address</label>
                  <input style={inputStyle} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required
                    onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')} />
                </div>
                {error && <p style={{ color: '#F87171', fontSize: '0.82rem', marginBottom: '1rem', padding: '0.6rem 0.85rem', background: 'rgba(239,68,68,0.1)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>{error}</p>}
                <button type="submit" disabled={registerMutation.isPending}
                  style={{ width: '100%', background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', color: '#fff', border: 'none', borderRadius: 12, padding: '0.9rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>
                  {selectedRole === 'STUDENT' ? 'Next: Choose Exam →' : (registerMutation.isPending ? '⏳ Creating...' : '🚀 Create Account →')}
                </button>
              </form>
            </>
          )}

          {/* ── Step 3: Exam Target (Students only) ── */}
          {step === 'exam' && (
            <>
              <button onClick={() => setStep('details')} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.8rem', marginBottom: '1.25rem', padding: 0 }}>← Back</button>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Your exam target 🎯</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', margin: '0 0 1.75rem' }}>We'll personalise your experience based on your goal</p>
              <form onSubmit={handleExamSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Target Exam</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {EXAMS.map(ex => (
                      <button key={ex} type="button" onClick={() => setTargetExam(ex)}
                        style={{ padding: '0.45rem 0.9rem', borderRadius: 8, border: `1px solid ${targetExam === ex ? 'rgba(124,58,237,0.6)' : 'rgba(255,255,255,0.12)'}`, background: targetExam === ex ? 'rgba(124,58,237,0.2)' : 'transparent', color: targetExam === ex ? '#A78BFA' : 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s' }}>
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Target Year</label>
                    <select value={targetYear} onChange={e => setTargetYear(Number(e.target.value))}
                      style={{ ...inputStyle, cursor: 'pointer' }}>
                      {EXAM_YEARS.map(y => <option key={y} value={y} style={{ background: '#1a1a2e' }}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)}
                      style={{ ...inputStyle, cursor: 'pointer' }}>
                      {CATEGORIES.map(c => <option key={c.value} value={c.value} style={{ background: '#1a1a2e' }}>{c.label}</option>)}
                    </select>
                  </div>
                </div>
                {error && <p style={{ color: '#F87171', fontSize: '0.82rem', marginBottom: '1rem', padding: '0.6rem 0.85rem', background: 'rgba(239,68,68,0.1)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>{error}</p>}
                <button type="submit" disabled={registerMutation.isPending}
                  style={{ width: '100%', background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', color: '#fff', border: 'none', borderRadius: 12, padding: '0.9rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>
                  {registerMutation.isPending ? '⏳ Creating account...' : '🚀 Create My Account →'}
                </button>
              </form>
            </>
          )}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '2rem', paddingTop: '1.25rem', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#A78BFA', fontWeight: 700, textDecoration: 'none' }}>Log in →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
