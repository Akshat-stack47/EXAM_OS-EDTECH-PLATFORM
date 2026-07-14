'use client'

import { useState, useRef, useEffect } from 'react'
import { trpc } from '@/lib/trpc'

export const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { data: notifications, refetch } = trpc.notification.list.useQuery(undefined, {
    refetchInterval: 60000, // refresh every 60s
  })
  const markRead = trpc.notification.markRead.useMutation()
  const markAll = trpc.notification.markAllRead.useMutation()

  const unreadCount = notifications?.filter((n: any) => !n.read).length ?? 0

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleMarkRead = async (id: string) => {
    await markRead.mutateAsync({ id })
    refetch()
  }

  const handleMarkAll = async () => {
    await markAll.mutateAsync()
    refetch()
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ position: 'relative', padding: '0.4rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, transition: 'color 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
        title="Notifications"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 16, background: '#EF4444', borderRadius: '50%', fontSize: '0.6rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0D0D1A' }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 10px)', width: 320, background: '#1A1A2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.6)', zIndex: 1000, overflow: 'hidden' }}>
          <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff', margin: 0 }}>Notifications {unreadCount > 0 && <span style={{ background: '#EF4444', borderRadius: 100, padding: '0.05rem 0.45rem', fontSize: '0.65rem', marginLeft: '0.4rem' }}>{unreadCount}</span>}</p>
            {unreadCount > 0 && (
              <button onClick={handleMarkAll} style={{ background: 'transparent', border: 'none', fontSize: '0.72rem', color: '#A78BFA', cursor: 'pointer', fontWeight: 700 }}>Mark all read</button>
            )}
          </div>
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {!notifications || notifications.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>
                🔔 No notifications yet
              </div>
            ) : (
              notifications.slice(0, 15).map((n: any) => (
                <div key={n.id} style={{ padding: '0.85rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: n.read ? 'transparent' : 'rgba(124,58,237,0.07)', transition: 'background 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#fff', margin: '0 0 0.2rem' }}>{n.title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.4 }}>{n.body}</p>
                    </div>
                    {!n.read && (
                      <button onClick={() => handleMarkRead(n.id)} style={{ background: 'transparent', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 6, padding: '0.1rem 0.4rem', fontSize: '0.65rem', color: '#A78BFA', cursor: 'pointer', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                        ✓ Read
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.35rem' }}>
                    {new Date(n.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            )}
          </div>
          <div style={{ padding: '0.6rem 1rem', borderTop: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
            <a href="/student/notifications" onClick={() => setOpen(false)}
              style={{ fontSize: '0.78rem', color: '#A78BFA', fontWeight: 700, textDecoration: 'none' }}>
              View all notifications →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
