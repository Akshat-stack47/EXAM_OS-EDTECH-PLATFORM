'use client'

import Link from 'next/link'
import { NotificationBell } from '@/components/shared/NotificationBell'
import { useTranslation } from '@/hooks/useTranslation'

export function StudentLayoutShell({ children }: { children: React.ReactNode }) {
  const { t, lang, changeLanguage } = useTranslation()

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D1A', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <header style={{ background: 'rgba(13,13,26,0.97)', borderBottom: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(24px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.25rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>

          {/* ── Logo + Tagline (clickable → dashboard) ── */}
          <Link href="/student/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0, cursor: 'pointer' }}>
            <span style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'linear-gradient(135deg,#7C3AED,#06B6D4)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 900,
              boxShadow: '0 0 14px rgba(124,58,237,0.45)',
              flexShrink: 0,
            }}>⚡</span>
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#fff' }}>
                Exam<span style={{ color: '#A78BFA' }}>OS</span>
              </div>
              <div style={{
                fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.06em',
                background: 'linear-gradient(90deg,#A78BFA,#38BDF8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginTop: '0.1rem', whiteSpace: 'nowrap',
              }}>
                INDIA'S UNIFIED EXAM INTELLIGENCE
              </div>
            </div>
          </Link>

          {/* ── Nav ── */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.875rem' }}>
            <Link href="/student/dashboard" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: 600, transition: 'color .15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'}>
              {t('nav.dashboard')}
            </Link>
            <Link href="/student/exam-hub" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: 600, transition: 'color .15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'}>
              {t('nav.exams')}
            </Link>
            <Link href="/student/health" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: 600, transition: 'color .15s', display: 'none' }} className="sm:inline"
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'}>
              {t('nav.health')}
            </Link>
            <NotificationBell />
            <button
              onClick={() => changeLanguage(lang === 'en' ? 'hi' : 'en')}
              style={{ fontSize: '0.75rem', padding: '0.28rem 0.65rem', borderRadius: 7, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}
            >
              {lang === 'en' ? 'हिं' : 'EN'}
            </button>
            <Link href="/login" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, transition: 'color .15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#F87171'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'}>
              {t('nav.logout')}
            </Link>
          </nav>

        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
