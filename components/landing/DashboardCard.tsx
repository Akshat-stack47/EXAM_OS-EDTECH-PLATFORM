'use client'

interface DashboardCard {
  name: string
  emoji: string
  desc: string
  href: string
  gradient: string
  accent: string
  badge: string
  dark?: boolean
}

export function DashboardCard({ d }: { d: DashboardCard }) {
  return (
    <a href={d.href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div
        style={{
          background: d.gradient,
          borderRadius: 20,
          padding: '2rem',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          border: `1px solid ${d.accent}22`,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translateY(-4px)'
          el.style.boxShadow = `0 20px 40px ${d.accent}33`
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = 'none'
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{d.emoji}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontWeight: 800, fontSize: '1.15rem', color: d.dark === false ? '#1A1A2E' : '#fff', margin: 0 }}>
            {d.name} Dashboard
          </h3>
          <span style={{
            fontSize: '0.65rem', padding: '0.25rem 0.6rem', borderRadius: 100,
            background: `${d.accent}33`, color: d.accent, fontWeight: 700,
            letterSpacing: '0.05em', textTransform: 'uppercase' as const, border: `1px solid ${d.accent}44`,
          }}>
            {d.badge}
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: d.dark === false ? 'rgba(26,26,46,0.7)' : 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>
          {d.desc}
        </p>
        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: d.accent, fontSize: '0.875rem', fontWeight: 700 }}>
          Preview Dashboard <span>→</span>
        </div>
      </div>
    </a>
  )
}
