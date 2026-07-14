'use client'

import { useState, Suspense, lazy } from 'react'
import { trpc } from '@/lib/trpc'
import Link from 'next/link'

const WhiteboardCanvas = lazy(() =>
  import('@/components/whiteboard/WhiteboardCanvas').then((m) => ({ default: m.WhiteboardCanvas }))
)

const s = {
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.25rem' } as React.CSSProperties,
  label: { fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' },
  input: { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.7rem 0.9rem', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' as const },
  btnPrimary: { background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.6rem 1.25rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' } as React.CSSProperties,
  btnGhost: { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.6rem 1.25rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' } as React.CSSProperties,
}

export default function WhiteboardPageClient() {
  const { data: sessions, refetch } = trpc.whiteboard.list.useQuery()
  const createSession = trpc.whiteboard.create.useMutation()
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>()

  const handleCreate = async () => {
    if (!title.trim()) return
    const session = await createSession.mutateAsync({ title, topic: topic || undefined })
    setTitle('')
    setTopic('')
    setShowCreate(false)
    setActiveSessionId(session.id)
    refetch()
  }

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#0D0D1A', minHeight: '100vh', color: '#fff', padding: '1.5rem', maxWidth: 1200, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link href="/student/dashboard" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem' }}>
            ← Dashboard
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em', margin: '0.5rem 0 0.25rem', background: 'linear-gradient(90deg,#A78BFA,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🖊️ Collaborative Whiteboard
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem', margin: 0 }}>
            Draw, plan and study together — sessions are saved to the cloud
          </p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} style={showCreate ? s.btnGhost : s.btnPrimary}>
          {showCreate ? 'Cancel' : '+ New Session'}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div style={{ ...s.card, marginBottom: '1.5rem', border: '1px solid rgba(124,58,237,0.3)' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, color: '#A78BFA' }}>Create Session</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={s.label}>Session Title *</label>
              <input
                value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. UPSC GS-1 Revision"
                style={s.input}
                onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
            <div>
              <label style={s.label}>Topic (optional)</label>
              <input
                value={topic} onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Indian History, Polity"
                style={s.input}
                onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
          </div>
          <button onClick={handleCreate} disabled={createSession.isPending || !title.trim()} style={{ ...s.btnPrimary, opacity: !title.trim() ? 0.5 : 1 }}>
            {createSession.isPending ? '⏳ Creating...' : '🚀 Create & Open Session'}
          </button>
        </div>
      )}

      {/* Canvas */}
      <div style={{ marginBottom: '1.5rem' }}>
        {activeSessionId ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#22C55E', fontWeight: 700 }}>🟢 Session Active</span>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>{activeSessionId.slice(0, 8)}</span>
              <button onClick={() => setActiveSessionId(undefined)} style={{ marginLeft: 'auto', ...s.btnGhost, padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
                Close Session
              </button>
            </div>
            <Suspense fallback={<div style={{ height: 400, background: 'rgba(255,255,255,0.03)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>Loading whiteboard...</div>}>
              <WhiteboardCanvas sessionId={activeSessionId} />
            </Suspense>
          </div>
        ) : (
          <Suspense fallback={<div style={{ height: 480, background: 'rgba(255,255,255,0.03)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>Loading whiteboard...</div>}>
            <WhiteboardCanvas />
          </Suspense>
        )}
      </div>

      {/* Session list */}
      <div style={s.card}>
        <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
          Your Sessions
        </h2>
        {!sessions || sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>
            No sessions yet. Create one above to get started! 🎨
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {sessions.map((sess: any) => (
              <div
                key={sess.id}
                onClick={() => setActiveSessionId(activeSessionId === sess.id ? undefined : sess.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.85rem 1rem', borderRadius: 12, cursor: 'pointer',
                  background: activeSessionId === sess.id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${activeSessionId === sess.id ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.07)'}`,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (activeSessionId !== sess.id) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { if (activeSessionId !== sess.id) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' }}
              >
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', margin: '0 0 0.2rem' }}>{sess.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                    {sess.topic || 'No topic'} · {sess._count?.members ?? 0} member{sess._count?.members !== 1 ? 's' : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.55rem', borderRadius: 100, background: sess.status === 'ACTIVE' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)', color: sess.status === 'ACTIVE' ? '#22C55E' : 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {sess.status}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>
                    {new Date(sess.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </span>
                  <span style={{ color: activeSessionId === sess.id ? '#A78BFA' : 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
                    {activeSessionId === sess.id ? '✓' : '→'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
