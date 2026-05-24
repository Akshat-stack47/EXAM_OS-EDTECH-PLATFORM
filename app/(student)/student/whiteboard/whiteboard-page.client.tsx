'use client'

import { useState, lazy } from 'react'
import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const WhiteboardCanvas = lazy(() => import('@/components/whiteboard/WhiteboardCanvas').then(m => ({ default: m.WhiteboardCanvas })))

export default function WhiteboardPageClient() {
  const { data: sessions, refetch } = trpc.whiteboard.list.useQuery()
  const createSession = trpc.whiteboard.create.useMutation()
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) return
    await createSession.mutateAsync({ title, topic: topic || undefined })
    setTitle('')
    setTopic('')
    setShowCreate(false)
    refetch()
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/student/dashboard" className="text-sm text-blue-600 hover:underline">&larr; Dashboard</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Collaborative Whiteboard</h1>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? 'Cancel' : 'New Session'}
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardContent className="py-4 space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Session title"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            />
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topic (optional)"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            />
            <Button onClick={handleCreate} disabled={createSession.isPending || !title.trim()}>
              {createSession.isPending ? 'Creating...' : 'Create Session'}
            </Button>
          </CardContent>
        </Card>
      )}

      <WhiteboardCanvas />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {!sessions || sessions.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No sessions yet. Create one to get started.</p>
          ) : (
            <div className="space-y-2">
              {sessions.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-sm text-gray-800">{s.title}</p>
                    <p className="text-xs text-gray-400">{s.topic || 'No topic'} · {s._count?.members ?? 0} members</p>
                  </div>
                  <span className="text-[10px] text-gray-400">{new Date(s.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
