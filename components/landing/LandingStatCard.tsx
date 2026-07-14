'use client'

export function LandingStatCard({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: '2rem', textAlign: 'center', transition: 'all 0.25s ease', cursor: 'default',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-3px) scale(1.02)'
        el.style.background = 'rgba(6,182,212,0.07)'
        el.style.borderColor = 'rgba(6,182,212,0.25)'
        el.style.boxShadow = '0 12px 32px rgba(6,182,212,0.12)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(0) scale(1)'
        el.style.background = 'rgba(255,255,255,0.03)'
        el.style.borderColor = 'rgba(255,255,255,0.07)'
        el.style.boxShadow = 'none'
      }}
    >
      <div style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(135deg,#A78BFA,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.4rem' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
        {label}
      </div>
    </div>
  )
}
