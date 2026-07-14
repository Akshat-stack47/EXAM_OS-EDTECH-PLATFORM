'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'

/* ─── types ──────────────────────────────────────────────────────── */
type UserRole = 'STUDENT' | 'TEACHER' | 'PARENT' | 'COORDINATOR' | 'ADMIN'

/* ─── constants ──────────────────────────────────────────────────── */
const SYSTEM_METRICS = [
  { label: 'DB Latency',   value: '12ms',   status: 'ok'   },
  { label: 'API Response', value: '48ms',   status: 'ok'   },
  { label: 'Error Rate',   value: '0.02%',  status: 'ok'   },
  { label: 'Memory',       value: '64%',    status: 'warn' },
  { label: 'CPU',          value: '38%',    status: 'ok'   },
  { label: 'Queue Depth',  value: '12 jobs', status: 'ok'  },
]

const ROLE_COLORS: Record<UserRole, string> = {
  STUDENT: '#22C55E', TEACHER: '#F59E0B', PARENT: '#A371F7',
  COORDINATOR: '#58A6FF', ADMIN: '#EF4444',
}

const MODERATION_QUEUE = [
  { id: 'm1', type: 'Fake Notes',       content: 'Misleading UPSC notes with wrong dates', reporter: 'Rahul K.', severity: 'HIGH',   ai: 94 },
  { id: 'm2', type: 'Copyright',        content: 'Drishti IAS PDF uploaded without license', reporter: 'Auto-AI',  severity: 'MEDIUM', ai: 81 },
  { id: 'm3', type: 'Scam Link',        content: 'Telegram link promising "100% selection"',  reporter: 'Priya S.', severity: 'HIGH',   ai: 97 },
  { id: 'm4', type: 'Inappropriate',    content: 'Community post with misleading exam tips',   reporter: 'System',   severity: 'LOW',    ai: 62 },
]

const FRAUD_ALERTS = [
  { id: 'f1', type: 'Fake Teacher',      user: 'Mukesh T.',   score: 89, desc: 'Claimed IAS rank 1, unverifiable credentials',  time: '2h ago'  },
  { id: 'f2', type: 'Bulk Registration', user: '23 accounts', score: 96, desc: 'Same IP, created within 4 minutes',              time: '5h ago'  },
  { id: 'f3', type: 'Payment Fraud',     user: 'Raj M.',      score: 78, desc: 'Chargebacks on 3 consecutive subscriptions',     time: '1d ago'  },
]

const SUB_TIERS = [
  { name: 'Free',      users: 640,  color: '#8B949E', pct: 51 },
  { name: 'Aspirant',  users: 310,  color: '#58A6FF', pct: 25 },
  { name: 'Pro',       users: 210,  color: '#7C3AED', pct: 17 },
  { name: 'Elite',     users: 87,   color: '#F59E0B', pct: 7  },
]

const RECENT_USERS_DEMO = [
  { id: 'u1', name: 'Anjali Gupta',  email: 'anjali@gmail.com',   role: 'STUDENT' as UserRole,     createdAt: new Date(Date.now() - 2 * 3600000) },
  { id: 'u2', name: 'Dr. Sharma',    email: 'sharma@examos.in',   role: 'TEACHER' as UserRole,     createdAt: new Date(Date.now() - 5 * 3600000) },
  { id: 'u3', name: 'Priya Nair',    email: 'priya.n@yahoo.com',  role: 'STUDENT' as UserRole,     createdAt: new Date(Date.now() - 8 * 3600000) },
  { id: 'u4', name: 'Meena Devi',    email: 'meena@hotmail.com',  role: 'PARENT' as UserRole,      createdAt: new Date(Date.now() - 24 * 3600000) },
  { id: 'u5', name: 'Vikram Ops',    email: 'vikram@examos.in',   role: 'COORDINATOR' as UserRole, createdAt: new Date(Date.now() - 48 * 3600000) },
]

const MONTHS_SPARKLINE = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const MRR_DATA = [2.8, 3.1, 3.5, 3.9, 4.0, 4.2]

/* ─── DonutChart SVG ─────────────────────────────────────────────── */
const DonutChart = ({ segments }: { segments: { pct: number; color: string; name: string }[] }) => {
  const cx = 80, cy = 80, r = 65, sw = 20
  let offset = 0
  const arcs = segments.map(s => {
    const circ = 2 * Math.PI * r
    const len = (s.pct / 100) * circ
    const arc = { dash: len, gap: circ - len, offset, color: s.color, name: s.name, pct: s.pct }
    offset += len
    return arc
  })
  return (
    <svg viewBox="0 0 160 160" style={{ width: '100%', maxWidth: 160 }}>
      {arcs.map((a, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={a.color} strokeWidth={sw}
          strokeDasharray={`${a.dash} ${a.gap}`} strokeDashoffset={-a.offset}
          transform={`rotate(-90 ${cx} ${cy})`} />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="900" fill="#fff">1,247</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.4)">Total Users</text>
    </svg>
  )
}

/* ─── Sparkline SVG ──────────────────────────────────────────────── */
const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const w = 120, h = 36
  const min = Math.min(...data), max = Math.max(...data)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * (h - 6) - 3
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: w, height: h }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * w} cy={h - ((data[data.length - 1] - min) / (max - min || 1)) * (h - 6) - 3} r="3.5" fill={color} />
    </svg>
  )
}

/* ─── Main Component ─────────────────────────────────────────────── */
export const CoordinatorDashboardView = ({ data }: { data: any }) => {
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const [userSearch, setUserSearch]   = useState('')
  const [roleFilter, setRoleFilter]   = useState<string>('ALL')
  const [dismissed,  setDismissed]    = useState<Set<string>>(new Set())
  const [modActions, setModActions]   = useState<Record<string, 'approved' | 'rejected'>>({})
  const [broadcastMsg, setBroadcastMsg] = useState('')
  const [broadcastTarget, setBroadcastTarget] = useState('ALL')
  const [broadcastSent, setBroadcastSent] = useState(false)

  const broadcastMutation = trpc.coordinator.broadcastMessage.useMutation({
    onSuccess: () => { setBroadcastSent(true); setBroadcastMsg('') },
  })
  const suspendMutation = trpc.coordinator.suspendUser.useMutation()

  const stats = [
    { value: String(data?.totalUsers    ?? 0), label: 'Total Users',  color: '#58A6FF' },
    { value: String(data?.totalStudents ?? 0),  label: 'Students',     color: '#22C55E' },
    { value: String(data?.totalTeachers ?? 0),  label: 'Teachers',     color: '#F59E0B' },
    { value: String(data?.totalParents  ?? 0),  label: 'Parents',      color: '#A371F7' },
  ]

  const allUsers = (data?.recentUsers ?? []) as any[]
  const filteredUsers = allUsers.filter((u: any) => {
    const q = userSearch.toLowerCase()
    const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    const matchR = roleFilter === 'ALL' || u.role === roleFilter
    return matchQ && matchR
  })

  const modPending = MODERATION_QUEUE.filter(m => !dismissed.has(m.id) && !modActions[m.id])
  const fraudPending = FRAUD_ALERTS.filter(f => !dismissed.has(f.id))

  const sevColor = (s: string) =>
    s === 'HIGH' ? { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', text: '#EF4444' } :
    s === 'MEDIUM' ? { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', text: '#F59E0B' } :
    { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', text: '#22C55E' }

  const NavBtn = ({ id, label }: { id: string; label: string }) => (
    <button onClick={() => setActivePanel(activePanel === id ? null : id)}
      style={{ padding: '0.4rem 0.9rem', borderRadius: 8, border: `1px solid ${activePanel === id ? '#00D2FF' : '#30363D'}`, background: activePanel === id ? 'rgba(0,210,255,0.1)' : '#161B22', color: activePanel === id ? '#00D2FF' : '#8B949E', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace', transition: 'all 0.2s' }}>
      {label}
    </button>
  )

  return (
    <div style={{ fontFamily: "'IBM Plex Mono','Courier New',monospace", background: '#0D1117', minHeight: '100vh', color: '#C9D1D9', padding: '1.5rem', maxWidth: 1400, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 10px #22C55E', display: 'inline-block' }} />
            <span style={{ fontSize: '0.7rem', color: '#22C55E', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>SYSTEM ONLINE</span>
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: '#fff', letterSpacing: '-0.01em' }}>⚡ Control Center</h1>
          <p style={{ color: '#8B949E', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
            {data?.name ?? 'Admin'} · System Administrator
          </p>
        </div>
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 10, padding: '0.75rem 1.25rem', fontSize: '0.8rem', color: '#8B949E' }}>
          <span style={{ color: '#22C55E' }}>●</span> All systems operational · Uptime 99.98%
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(155px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 12, padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: s.color }} />
            <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: '0.68rem', color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Nav Panels ── */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <NavBtn id="revenue"    label="// Revenue Analytics"    />
        <NavBtn id="moderation" label="// Content Moderation"   />
        <NavBtn id="fraud"      label="// Anti-Fraud Monitor"    />
        <NavBtn id="users"      label="// User Management"       />
        <NavBtn id="broadcast"  label="// Broadcast System"      />
        <NavBtn id="subs"       label="// Subscriptions"         />
      </div>

      {/* ── Revenue Analytics ── */}
      {activePanel === 'revenue' && (
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 14, padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>// Revenue Analytics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'MRR',           value: '₹4.2L',   delta: '+8.2%', color: '#22C55E', spark: MRR_DATA },
              { label: 'ARR',           value: '₹50.4L',  delta: '+8.2%', color: '#22C55E', spark: MRR_DATA.map(v => v * 12) },
              { label: 'Churn Rate',    value: '2.3%',    delta: '-0.4%', color: '#22C55E', spark: [3.1, 2.8, 2.6, 2.5, 2.4, 2.3] },
              { label: 'Avg LTV',       value: '₹8,400',  delta: '+₹320', color: '#58A6FF', spark: [7200, 7500, 7800, 7900, 8100, 8400] },
              { label: 'Conversion',    value: '12.4%',   delta: '+1.2%', color: '#F59E0B', spark: [9.8, 10.2, 10.8, 11.2, 12.0, 12.4] },
            ].map(m => (
              <div key={m.label} style={{ background: '#0D1117', border: '1px solid #21262D', borderRadius: 10, padding: '1rem' }}>
                <div style={{ fontSize: '0.68rem', color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem', fontWeight: 700 }}>{m.label}</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff', marginBottom: '0.15rem' }}>{m.value}</div>
                <div style={{ fontSize: '0.72rem', color: m.color, fontWeight: 700, marginBottom: '0.5rem' }}>{m.delta} vs last month</div>
                <Sparkline data={m.spark} color={m.color} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button style={{ padding: '0.5rem 1rem', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, color: '#22C55E', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>📊 Export MRR Report</button>
            <button style={{ padding: '0.5rem 1rem', background: 'rgba(88,166,255,0.1)', border: '1px solid rgba(88,166,255,0.25)', borderRadius: 8, color: '#58A6FF', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>📄 GST-Compliant CSV</button>
          </div>
        </div>
      )}

      {/* ── Content Moderation ── */}
      {activePanel === 'moderation' && (
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 14, padding: '1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>// Content Moderation Queue</h2>
            <span style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 700 }}>{modPending.length} items pending review</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {MODERATION_QUEUE.map(item => {
              if (dismissed.has(item.id)) return null
              const action = modActions[item.id]
              const sc = sevColor(item.severity)
              return (
                <div key={item.id} style={{ background: '#0D1117', border: `1px solid ${action ? (action === 'approved' ? '#21262D' : '#21262D') : sc.border}`, borderRadius: 10, padding: '1rem 1.25rem', opacity: action ? 0.55 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: 100, background: sc.bg, border: `1px solid ${sc.border}`, fontSize: '0.65rem', fontWeight: 800, color: sc.text, textTransform: 'uppercase' }}>{item.severity}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C9D1D9' }}>{item.type}</span>
                      <span style={{ fontSize: '0.72rem', color: '#8B949E' }}>by {item.reporter}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#8B949E' }}>AI confidence:</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: item.ai >= 90 ? '#EF4444' : '#F59E0B' }}>{item.ai}%</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#8B949E', marginBottom: '0.75rem', fontFamily: 'sans-serif' }}>{item.content}</div>
                  {!action ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => setModActions(a => ({ ...a, [item.id]: 'rejected' }))}
                        style={{ padding: '0.4rem 1rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#EF4444', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>✕ Remove Content</button>
                      <button onClick={() => setModActions(a => ({ ...a, [item.id]: 'approved' }))}
                        style={{ padding: '0.4rem 1rem', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, color: '#22C55E', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>✓ Approve</button>
                      <button onClick={() => setDismissed(p => new Set([...p, item.id]))}
                        style={{ padding: '0.4rem 0.75rem', background: 'transparent', border: '1px solid #30363D', borderRadius: 8, color: '#8B949E', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Dismiss</button>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: action === 'approved' ? '#22C55E' : '#EF4444' }}>
                      {action === 'approved' ? '✓ Approved — content cleared' : '✕ Content removed'}
                    </div>
                  )}
                </div>
              )
            })}
            {modPending.length === 0 && (
              <p style={{ color: '#8B949E', textAlign: 'center', padding: '2rem', fontFamily: 'sans-serif', fontSize: '0.875rem' }}>✅ All items reviewed</p>
            )}
          </div>
        </div>
      )}

      {/* ── Anti-Fraud Monitor ── */}
      {activePanel === 'fraud' && (
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 14, padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>// Anti-Fraud Monitor</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {fraudPending.map(f => (
              <div key={f.id} style={{ background: '#0D1117', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <div>
                    <span style={{ padding: '0.2rem 0.65rem', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 100, fontSize: '0.65rem', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginRight: '0.5rem' }}>{f.type}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#C9D1D9' }}>{f.user}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#8B949E' }}>{f.time}</span>
                    <div style={{ padding: '0.2rem 0.65rem', borderRadius: 100, background: f.score >= 90 ? 'rgba(220,38,38,0.2)' : 'rgba(245,158,11,0.15)', border: `1px solid ${f.score >= 90 ? 'rgba(220,38,38,0.4)' : 'rgba(245,158,11,0.3)'}`, fontSize: '0.72rem', fontWeight: 800, color: f.score >= 90 ? '#DC2626' : '#F59E0B' }}>
                      AI Fraud: {f.score}%
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#8B949E', marginBottom: '0.75rem', fontFamily: 'sans-serif' }}>{f.desc}</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button style={{ padding: '0.4rem 0.85rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#EF4444', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>🚫 Suspend Account</button>
                  <button style={{ padding: '0.4rem 0.85rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 8, color: '#F59E0B', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>⚠️ Flag for Review</button>
                  <button onClick={() => setDismissed(p => new Set([...p, f.id]))}
                    style={{ padding: '0.4rem 0.85rem', background: 'transparent', border: '1px solid #30363D', borderRadius: 8, color: '#8B949E', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>✓ False Positive</button>
                </div>
              </div>
            ))}
            {fraudPending.length === 0 && (
              <p style={{ color: '#8B949E', textAlign: 'center', padding: '2rem', fontFamily: 'sans-serif' }}>✅ No active fraud alerts</p>
            )}
          </div>
        </div>
      )}

      {/* ── User Management Console ── */}
      {activePanel === 'users' && (
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 14, padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>// User Management Console</h2>
          <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search name / email…"
              style={{ flex: 1, minWidth: 200, background: '#0D1117', border: '1px solid #30363D', borderRadius: 8, padding: '0.55rem 0.85rem', color: '#C9D1D9', fontSize: '0.85rem', outline: 'none', fontFamily: 'monospace' }} />
            {(['ALL', 'STUDENT', 'TEACHER', 'PARENT', 'COORDINATOR'] as const).map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                style={{ padding: '0.4rem 0.75rem', borderRadius: 8, border: `1px solid ${roleFilter === r ? (ROLE_COLORS[r as UserRole] ?? '#58A6FF') : '#30363D'}`, background: roleFilter === r ? `${(ROLE_COLORS[r as UserRole] ?? '#58A6FF')}18` : '#0D1117', color: roleFilter === r ? (ROLE_COLORS[r as UserRole] ?? '#58A6FF') : '#8B949E', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{r}</button>
            ))}
            <button style={{ padding: '0.4rem 0.85rem', background: 'rgba(88,166,255,0.1)', border: '1px solid rgba(88,166,255,0.25)', borderRadius: 8, color: '#58A6FF', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>📤 GDPR Export</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: '#8B949E', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.65rem 0.75rem 0.65rem 0', borderBottom: '1px solid #30363D', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u: any) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(48,54,61,0.5)' }}>
                    <td style={{ padding: '0.7rem 0.75rem 0.7rem 0', fontWeight: 600, color: '#C9D1D9' }}>{u.name}</td>
                    <td style={{ padding: '0.7rem 0.75rem 0.7rem 0', color: '#8B949E', fontFamily: 'monospace', fontSize: '0.78rem' }}>{u.email}</td>
                    <td style={{ padding: '0.7rem 0.75rem 0.7rem 0' }}>
                      <span style={{ padding: '0.2rem 0.55rem', borderRadius: 100, fontSize: '0.62rem', fontWeight: 800, background: `${ROLE_COLORS[u.role as UserRole] ?? '#8B949E'}18`, color: ROLE_COLORS[u.role as UserRole] ?? '#8B949E', border: `1px solid ${ROLE_COLORS[u.role as UserRole] ?? '#8B949E'}33`, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '0.7rem 0', color: '#8B949E', fontSize: '0.78rem', fontFamily: 'monospace' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '0.7rem 0' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button style={{ padding: '0.25rem 0.55rem', background: 'rgba(88,166,255,0.1)', border: '1px solid rgba(88,166,255,0.2)', borderRadius: 6, color: '#58A6FF', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }}>👤 Impersonate</button>
                        <button style={{ padding: '0.25rem 0.55rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, color: '#EF4444', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }}>🚫 Suspend</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <p style={{ color: '#8B949E', textAlign: 'center', padding: '2rem', fontFamily: 'sans-serif' }}>No users match the search/filter</p>
            )}
          </div>
        </div>
      )}

      {/* ── Broadcast System ── */}
      {activePanel === 'broadcast' && (
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 14, padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>// Broadcast & Announcement</h2>
          {broadcastSent ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✅</div>
              <div style={{ fontWeight: 700, color: '#22C55E', fontSize: '1rem', marginBottom: '0.35rem' }}>Broadcast Sent Successfully!</div>
              <div style={{ color: '#8B949E', fontSize: '0.82rem', fontFamily: 'sans-serif' }}>Reached all {broadcastTarget === 'ALL' ? '1,247' : broadcastTarget === 'STUDENT' ? '892' : broadcastTarget === 'TEACHER' ? '48' : '307'} {broadcastTarget.toLowerCase()}s</div>
              <button onClick={() => { setBroadcastSent(false); setBroadcastMsg('') }} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #30363D', borderRadius: 8, color: '#8B949E', cursor: 'pointer', fontSize: '0.8rem' }}>Send Another</button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: '#8B949E', alignSelf: 'center', fontWeight: 600 }}>Target:</span>
                {['ALL', 'STUDENT', 'TEACHER', 'PARENT'].map(t => (
                  <button key={t} onClick={() => setBroadcastTarget(t)}
                    style={{ padding: '0.35rem 0.75rem', borderRadius: 8, border: `1px solid ${broadcastTarget === t ? '#00D2FF' : '#30363D'}`, background: broadcastTarget === t ? 'rgba(0,210,255,0.1)' : '#0D1117', color: broadcastTarget === t ? '#00D2FF' : '#8B949E', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>{t}</button>
                ))}
              </div>
              <textarea value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)}
                placeholder="Type your announcement message here… (supports Markdown)"
                style={{ width: '100%', height: 120, background: '#0D1117', border: '1px solid #30363D', borderRadius: 10, padding: '0.85rem', color: '#C9D1D9', fontSize: '0.875rem', outline: 'none', resize: 'vertical', fontFamily: 'monospace', boxSizing: 'border-box', marginBottom: '1rem' }} />
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => broadcastMsg.trim() && broadcastMutation.mutate({
                    title: `Announcement`,
                    body: broadcastMsg.trim(),
                    targetRole: broadcastTarget as any,
                  })}
                  disabled={!broadcastMsg.trim() || broadcastMutation.isPending}
                  style={{ padding: '0.55rem 1.25rem', background: broadcastMsg.trim() ? 'linear-gradient(135deg,#00D2FF,#0891B2)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, color: broadcastMsg.trim() ? '#fff' : '#8B949E', fontWeight: 700, cursor: broadcastMsg.trim() ? 'pointer' : 'default', fontSize: '0.85rem' }}>
                  {broadcastMutation.isPending ? '⏳ Sending...' : '📢 Send Now'}
                </button>
                <button style={{ padding: '0.55rem 1.25rem', background: 'rgba(255,255,255,0.05)', border: '1px solid #30363D', borderRadius: 8, color: '#8B949E', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                  🕐 Schedule Send
                </button>
                <button style={{ padding: '0.55rem 1.25rem', background: 'rgba(255,255,255,0.05)', border: '1px solid #30363D', borderRadius: 8, color: '#8B949E', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                  👁 Preview
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Subscription Donut ── */}
      {activePanel === 'subs' && (
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 14, padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>// Subscription Breakdown</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: 160 }}>
              <DonutChart segments={SUB_TIERS} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {SUB_TIERS.map(t => (
                <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: t.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, height: 6, background: '#21262D', borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${t.pct}%`, background: t.color, borderRadius: 100 }} />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: t.color, fontWeight: 800, minWidth: 35 }}>{t.pct}%</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#C9D1D9', minWidth: 55 }}>{t.name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#8B949E' }}>{t.users.toLocaleString()} users</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Default: System Health + Feature Flags + Recent Registrations ── */}
      {!activePanel && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {/* System Health */}
            <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 14, padding: '1.5rem' }}>
              <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>// System Health</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {SYSTEM_METRICS.map(m => (
                  <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', background: '#0D1117', borderRadius: 8, border: '1px solid #21262D' }}>
                    <span style={{ fontSize: '0.85rem', color: '#C9D1D9' }}>{m.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{m.value}</span>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: m.status === 'ok' ? '#22C55E' : '#F59E0B', boxShadow: `0 0 6px ${m.status === 'ok' ? '#22C55E' : '#F59E0B'}` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1rem', padding: '0.6rem 0.75rem', background: '#0D1117', borderRadius: 8, border: '1px solid #21262D', fontSize: '0.75rem', color: '#8B949E' }}>
                <span style={{ color: '#22C55E' }}>→</span> Last deploy: 2h ago · Uptime: 99.98%
              </div>
            </div>

            {/* Feature Flags */}
            <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 14, padding: '1.5rem' }}>
              <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>// Feature Flags</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                  { name: 'AI Grading',        enabled: true  },
                  { name: 'Live Classes',       enabled: true  },
                  { name: 'Parent Dashboard',   enabled: true  },
                  { name: 'Whiteboard',         enabled: true  },
                  { name: 'Health Engine',      enabled: true  },
                  { name: 'Score Predictor',    enabled: true  },
                  { name: 'Auto Form Filler',   enabled: false },
                ].map(f => (
                  <div key={f.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', background: '#0D1117', borderRadius: 8, border: '1px solid #21262D' }}>
                    <span style={{ fontSize: '0.85rem', color: '#C9D1D9' }}>{f.name}</span>
                    <div style={{ padding: '0.2rem 0.65rem', borderRadius: 100, background: f.enabled ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${f.enabled ? 'rgba(34,197,94,0.3)' : '#30363D'}`, fontSize: '0.62rem', fontWeight: 800, color: f.enabled ? '#22C55E' : '#8B949E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {f.enabled ? 'ON' : 'OFF'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Registrations */}
          <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 14, padding: '1.5rem' }}>
            <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#8B949E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>// Recent Registrations</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: '#8B949E', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {['Name', 'Email', 'Role', 'Joined'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem 0.75rem 0', borderBottom: '1px solid #30363D', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data?.recentUsers ?? RECENT_USERS_DEMO).map((u: any) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(48,54,61,0.5)', color: '#C9D1D9' }}>
                      <td style={{ padding: '0.75rem 1rem 0.75rem 0', fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: '0.75rem 1rem 0.75rem 0', color: '#8B949E', fontFamily: 'monospace', fontSize: '0.8rem' }}>{u.email}</td>
                      <td style={{ padding: '0.75rem 1rem 0.75rem 0' }}>
                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: 100, fontSize: '0.62rem', fontWeight: 800, background: `${ROLE_COLORS[u.role as UserRole] ?? '#8B949E'}15`, color: ROLE_COLORS[u.role as UserRole] ?? '#8B949E', border: `1px solid ${ROLE_COLORS[u.role as UserRole] ?? '#8B949E'}33`, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '0.75rem 0', color: '#8B949E', fontSize: '0.8rem', fontFamily: 'monospace' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
