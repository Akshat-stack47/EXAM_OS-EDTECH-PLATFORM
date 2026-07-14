'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { setAuthCookie } from './actions'

export default function LoginPageClient() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [devOtp, setDevOtp] = useState<string | null>(null)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const sendOtp = trpc.auth.sendOtp.useMutation({
    onSuccess: (data: any) => {
      setStep('otp')
      if (data?.devOtp) setDevOtp(data.devOtp)
    },
    onError: (e: any) => setError(e.message || 'Failed to send OTP'),
  })
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async (result: any) => {
      if (result.success) {
        await setAuthCookie(result.token)
        router.push(`/${result.user.role.toLowerCase()}/dashboard`)
      }
    },
    onError: (e: any) => {
      const msg = e.message || ''
      if (msg === 'INVALID_OTP') setError('Incorrect code. Please check and try again.')
      else if (msg === 'OTP_EXPIRED') setError('Code expired. Please go back and request a new one.')
      else if (msg === 'OTP_NOT_FOUND') setError('No code found. Please go back and request a new one.')
      else setError(msg || 'Login failed. Please try again.')
    },
  })

  const handleOtpChange = (i: number, val: string) => {
    const v = val.replace(/\D/g, '').slice(0, 1)
    const next = [...otpDigits]; next[i] = v
    setOtpDigits(next)
    if (v && i < 5) otpRefs.current[i + 1]?.focus()
  }
  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[i] && i > 0) otpRefs.current[i - 1]?.focus()
  }
  const otp = otpDigits.join('')

  const handleEmailSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    setError('')
    if (!email.includes('@')) { setError('Enter a valid email address'); return }
    sendOtp.mutate({ email })
  }

  const handleOtpSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    setError('')
    if (otp.length < 6) { setError('Enter the full 6-digit OTP'); return }
    loginMutation.mutate({ email, otp })
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg,#0D0D1A 0%,#1B1040 50%,#0D0D1A 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Ambient glow */}
      <div style={{ position: 'fixed', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: '40%', right: '8%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, boxShadow: '0 0 24px rgba(124,58,237,0.4)' }}>⚡</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>Exam<span style={{ color: '#A78BFA' }}>OS</span></span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>India's AI-powered exam preparation platform</p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '2.5rem', backdropFilter: 'blur(20px)', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
          {step === 'email' ? (
            <>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>Welcome back 👋</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', margin: '0 0 2rem' }}>Enter your email to receive a one-time password</p>

              <form onSubmit={handleEmailSubmit}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Email Address</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" autoFocus required
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '0.85rem 1rem', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                  />
                </div>
                {error && <p style={{ color: '#F87171', fontSize: '0.82rem', marginBottom: '1rem', padding: '0.6rem 0.85rem', background: 'rgba(239,68,68,0.1)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>{error}</p>}
                <button type="submit" disabled={sendOtp.isPending}
                  style={{ width: '100%', background: sendOtp.isPending ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg,#7C3AED,#06B6D4)', color: '#fff', border: 'none', borderRadius: 12, padding: '0.9rem', fontWeight: 800, fontSize: '1rem', cursor: sendOtp.isPending ? 'wait' : 'pointer', letterSpacing: '-0.01em', transition: 'opacity 0.2s' }}>
                  {sendOtp.isPending ? '⏳ Sending OTP...' : '✉️ Send OTP →'}
                </button>
              </form>
            </>
          ) : (
            <>
              <button onClick={() => { setStep('email'); setError(''); setOtpDigits(['', '', '', '', '', '']) }}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.8rem', marginBottom: '1.25rem', padding: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                ← Back
              </button>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>Check your email 📬</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', margin: '0 0 2rem' }}>
                We sent a 6-digit code to <span style={{ color: '#A78BFA', fontWeight: 700 }}>{email}</span>
              </p>

              {/* Dev OTP display — prominent, auto-fills the input */}
              {devOtp && (
                <div
                  onClick={() => {
                    // Auto-fill all 6 digits
                    const digits = devOtp.split('')
                    setOtpDigits(digits)
                    setTimeout(() => otpRefs.current[5]?.focus(), 50)
                  }}
                  style={{
                    background: 'linear-gradient(135deg,rgba(34,197,94,0.15),rgba(16,185,129,0.1))',
                    border: '2px solid rgba(34,197,94,0.5)',
                    borderRadius: 14,
                    padding: '1rem 1.25rem',
                    marginBottom: '1.25rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: 'rgba(74,222,128,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
                    🧪 Dev Mode — Your OTP Code
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '0.3em', color: '#4ADE80', fontFamily: 'monospace' }}>
                    {devOtp}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(74,222,128,0.6)', marginTop: '0.4rem' }}>
                    Click to auto-fill ↑ (email not configured)
                  </div>
                </div>
              )}

              <form onSubmit={handleOtpSubmit}>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  {otpDigits.map((d, i) => (
                    <input key={i}
                      ref={el => { otpRefs.current[i] = el }}
                      type="text" inputMode="numeric" maxLength={1} value={d}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKey(i, e)}
                      style={{ width: 52, height: 60, textAlign: 'center', fontSize: '1.5rem', fontWeight: 900, background: 'rgba(255,255,255,0.06)', border: `2px solid ${d ? 'rgba(124,58,237,0.6)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 12, color: '#fff', outline: 'none', transition: 'border-color 0.15s', caretColor: '#A78BFA' }}
                    />
                  ))}
                </div>
                {error && <p style={{ color: '#F87171', fontSize: '0.82rem', marginBottom: '1rem', padding: '0.6rem 0.85rem', background: 'rgba(239,68,68,0.1)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center' }}>{error}</p>}
                <button type="submit" disabled={loginMutation.isPending || otp.length < 6}
                  style={{ width: '100%', background: otp.length === 6 ? 'linear-gradient(135deg,#7C3AED,#06B6D4)' : 'rgba(255,255,255,0.06)', color: otp.length === 6 ? '#fff' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: 12, padding: '0.9rem', fontWeight: 800, fontSize: '1rem', cursor: otp.length === 6 ? 'pointer' : 'default', letterSpacing: '-0.01em', transition: 'all 0.2s' }}>
                  {loginMutation.isPending ? '⏳ Verifying...' : '🔓 Verify & Login →'}
                </button>
              </form>

              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginTop: '1.25rem' }}>
                Didn't receive it?{' '}
                <button onClick={() => sendOtp.mutate({ email })} style={{ background: 'transparent', border: 'none', color: '#A78BFA', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
                  Resend OTP
                </button>
              </p>
            </>
          )}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '2rem', paddingTop: '1.25rem', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>
              New to ExamOS?{' '}
              <Link href="/register" style={{ color: '#A78BFA', fontWeight: 700, textDecoration: 'none' }}>Create account →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
