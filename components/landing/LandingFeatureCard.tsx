'use client'

export function LandingFeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: '1.5rem', transition: 'all 0.25s ease', cursor: 'default',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-4px)'
        el.style.background = 'rgba(124,58,237,0.08)'
        el.style.borderColor = 'rgba(124,58,237,0.25)'
        el.style.boxShadow = '0 16px 40px rgba(124,58,237,0.15)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(0)'
        el.style.background = 'rgba(255,255,255,0.03)'
        el.style.borderColor = 'rgba(255,255,255,0.07)'
        el.style.boxShadow = 'none'
      }}
    >
      <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{icon}</div>
      <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: '#fff' }}>{title}</h3>
      <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
    </div>
  )
}
