'use client'

import { useState, useCallback, useMemo } from 'react'
import { StudyTimer } from './StudyTimer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc'

import React from 'react'
import { SearchBox } from '@/components/shared/SearchBox'

const RISK_COLORS: Record<string, string> = {
  LOW: '#22C55E',
  MEDIUM: '#F59E0B',
  HIGH: '#EF4444',
  CRITICAL: '#DC2626',
}

export const StudentDashboardView = React.memo(({ data }: { data: any }) => {
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiReply, setAiReply] = useState<string | null>(null)

  const aiChat = trpc.ai.chat.useMutation()
  const logSession = trpc.student.logSession.useMutation()

  const handleAskAI = useCallback(async () => {
    if (!aiQuestion.trim()) return
    const result = await aiChat.mutateAsync({
      message: aiQuestion,
      examType: 'UPSC',
    })
    setAiReply(result.reply)
  }, [aiQuestion, aiChat])

  const handleLogSession = useCallback(async () => {
    await logSession.mutateAsync({ durationMinutes: 25 })
  }, [logSession])

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {data.profile.name}!</h1>
        <div className="flex items-center gap-3">
          <div className="w-64 hidden md:block">
            <SearchBox entity="exams" className="w-full" />
          </div>
          <Button onClick={handleLogSession} variant="outline" size="sm" disabled={logSession.isPending}>
            {logSession.isPending ? 'Logging...' : 'Log 25min Study'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-gray-900 text-white border-none">
          <CardContent className="py-4">
            <div className="text-2xl font-bold">{data.profile.streak}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">Day Streak</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 text-white border-none">
          <CardContent className="py-4">
            <div className="text-2xl font-bold">#{data.profile.nationalRank || '—'}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">Nat&apos;l Rank</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 text-white border-none">
          <CardContent className="py-4">
            <div className="text-2xl font-bold">{Math.floor((data.profile.totalStudyMins || 0) / 60)}h</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">Total Study</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 text-white border-none">
          <CardContent className="py-4">
            <div className="text-2xl font-bold">{data.profile.todayMinutes || 0}m</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">Today</div>
          </CardContent>
        </Card>
      </div>

      <StudyTimer />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="py-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Subject Performance</h2>
            {data.scores.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No subject scores yet</p>
            ) : (
              data.scores.map((s: { subject: string; score: number }) => (
                <div key={s.subject} className="flex items-center gap-4 mb-3 last:mb-0">
                  <span className="w-24 text-sm text-gray-600 font-medium">{s.subject}</span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(s.score, 100)}%`,
                        backgroundColor: s.score >= 70 ? '#22C55E' : s.score >= 40 ? '#F59E0B' : '#EF4444',
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-800 w-12 text-right">{s.score}%</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900">AI Study Assistant</h2>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                  placeholder="Ask anything about your exam..."
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                />
                <Button onClick={handleAskAI} disabled={aiChat.isPending || !aiQuestion.trim()} size="sm">
                  {aiChat.isPending ? '...' : 'Ask'}
                </Button>
              </div>
              {aiReply && (
                <div className="p-3 bg-gray-50 border rounded-lg text-sm text-gray-700">
                  {aiReply}
                </div>
              )}
              {data.recentSessions && data.recentSessions.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Recent Sessions</p>
                  {data.recentSessions.slice(0, 3).map((s: any, i: number) => (
                    <div key={i} className="text-xs text-gray-500 flex justify-between py-1">
                      <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                      <span className="font-medium">{s.duration} min</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="py-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Health Status</h2>
            {!data.latestHealth ? (
              <p className="text-gray-400 text-sm text-center py-4">No health survey submitted yet</p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overall Score</span>
                  <span className="text-lg font-bold" style={{ color: RISK_COLORS[data.latestHealth.riskLevel] || '#6B7280' }}>
                    {data.latestHealth.overallScore?.toFixed(1) || '—'}/10
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Risk Level</span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: RISK_COLORS[data.latestHealth.riskLevel] || '#6B7280' }}
                  >
                    {data.latestHealth.riskLevel || 'UNKNOWN'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mood</span>
                  <span className="text-sm font-medium">{data.latestHealth.moodScore}/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sleep</span>
                  <span className="text-sm font-medium">{data.latestHealth.sleepScore}/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Anxiety</span>
                  <span className="text-sm font-medium">{data.latestHealth.anxietyScore}/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Motivation</span>
                  <span className="text-sm font-medium">{data.latestHealth.motivationScore}/10</span>
                </div>
                {data.latestHealth.wantsCounselor && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 mt-2">
                    You requested counselor support. A coordinator will reach out.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Active Whiteboards</h2>
            {data.whiteboards.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No whiteboard sessions</p>
            ) : (
              <div className="space-y-2">
                {data.whiteboards.slice(0, 5).map((w: any) => (
                  <div key={w.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border text-sm">
                    <div>
                      <div className="font-medium text-gray-900">{w.title}</div>
                      {w.topic && <div className="text-xs text-gray-500">{w.topic}</div>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{w.memberCount} member{w.memberCount !== 1 ? 's' : ''}</span>
                      <span className={`px-1.5 py-0.5 rounded font-medium ${
                        w.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        w.status === 'ENDED' ? 'bg-gray-200 text-gray-500' :
                        'bg-blue-100 text-blue-700'
                      }`}>{w.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
})
