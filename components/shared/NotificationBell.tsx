'use client'

import { useState, useRef, useEffect } from 'react'
import { trpc } from '@/lib/trpc'
import { Button } from '@/components/ui/button'

export const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { data: notifications, refetch } = trpc.notification.list.useQuery()
  const markRead = trpc.notification.markRead.useMutation()

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

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 text-gray-300 hover:text-white transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-100">
            <p className="font-bold text-sm text-gray-900">Notifications</p>
          </div>
          {!notifications || notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">No notifications yet</div>
          ) : (
            notifications.slice(0, 10).map((n: any) => (
              <div key={n.id} className={`p-3 border-b border-gray-50 text-sm ${!n.read ? 'bg-blue-50/50' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{n.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{n.body}</p>
                  </div>
                  {!n.read && (
                    <button onClick={() => handleMarkRead(n.id)} className="text-[10px] text-blue-600 hover:underline whitespace-nowrap ml-2">
                      Mark read
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
