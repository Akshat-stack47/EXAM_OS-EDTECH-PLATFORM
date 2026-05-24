'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState, useMemo } from 'react'

const RISK_COLORS: Record<string, string> = {
  LOW: '#22C55E',
  MEDIUM: '#F59E0B',
  HIGH: '#EF4444',
  CRITICAL: '#DC2626',
}

const DaysToExam = React.memo(({ targetYear, targetExam }: { targetYear: number; targetExam: string }) => {
  const [days, setDays] = useState(0)
  useEffect(() => {
    const diff = new Date(targetYear, 0, 1).getTime() - Date.now()
    setDays(Math.max(0, Math.ceil(diff / 86400000)))
  }, [targetYear])
  return <span>{days || '—'}</span>
})

export const ParentDashboardView = React.memo(({ profile, alerts }: { profile: any; alerts: any[] }) => {
  return (
    <div className="min-h-screen bg-[#FFF8F2]">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Namaste, <span className="text-[#E88D2A]">{profile.name}</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {profile.children.length > 0
                ? `Watching over ${profile.children.map((c: any) => c.name).join(', ')}`
                : 'No children linked yet'}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-[#E88D2A] font-semibold text-sm hover:bg-gray-50 transition-colors">
              {alerts.length > 0 ? `${alerts.length} Alerts` : 'No Alerts'}
            </button>
            <button className="px-4 py-2 bg-[#E88D2A] text-white rounded-lg font-semibold text-sm hover:bg-[#D67A1E] transition-colors">
              Call Mentor
            </button>
          </div>
        </header>

        {profile.children.length === 0 && (
          <Card className="border-dashed border-2 border-[#E88D2A]/30 bg-white/50">
            <CardContent className="py-12 text-center">
              <div className="text-5xl mb-4">👋</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Link Your Child</h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Enter the invite code from your child&apos;s profile to start tracking their progress.
              </p>
              <div className="flex gap-3 justify-center">
                <input
                  type="text"
                  placeholder="Enter invite code"
                  className="px-4 py-2 border border-gray-300 rounded-lg w-48 text-sm focus:outline-none focus:ring-2 focus:ring-[#E88D2A]/50"
                />
                <button className="px-6 py-2 bg-[#E88D2A] text-white rounded-lg font-semibold text-sm hover:bg-[#D67A1E] transition-colors">
                  Link
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {profile.children.map((child: any) => (
          <div key={child.id} className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              {child.name}
              {!child.isVerified && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Unverified</span>
              )}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <Card className="border-l-4" style={{ borderLeftColor: '#E88D2A' }}>
                <CardContent className="py-4">
                  <div className="text-2xl font-bold text-gray-900"><DaysToExam targetYear={child.targetYear} targetExam={child.targetExam} /></div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Days to {child.targetExam}</div>
                </CardContent>
              </Card>
              <Card className="border-l-4" style={{ borderLeftColor: '#22C55E' }}>
                <CardContent className="py-4">
                  <div className="text-2xl font-bold text-gray-900">{Math.floor(child.totalStudyMins / 60)}h {child.totalStudyMins % 60}m</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Total Study</div>
                </CardContent>
              </Card>
              <Card className="border-l-4" style={{ borderLeftColor: '#3B82F6' }}>
                <CardContent className="py-4">
                  <div className="text-2xl font-bold text-gray-900">{child.currentStreak} days</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Study Streak</div>
                </CardContent>
              </Card>
              <Card className="border-l-4" style={{ borderLeftColor: '#8B5CF6' }}>
                <CardContent className="py-4">
                  <div className="text-2xl font-bold text-gray-900">#{child.nationalRank || '—'}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">National Rank</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-gray-700 uppercase tracking-wide">Subject Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  {child.subjectScores.length === 0 ? (
                    <p className="text-gray-400 text-sm py-4 text-center">No subject scores yet</p>
                  ) : (
                    <div className="space-y-3">
                      {child.subjectScores.map((s: any) => (
                        <div key={s.subject} className="flex items-center gap-4">
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
                          <span className="w-12 text-right text-sm font-bold text-gray-800">{s.score}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-bold text-gray-700 uppercase tracking-wide">Health Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!child.latestHealth ? (
                      <p className="text-gray-400 text-sm py-4 text-center">No health data</p>
                    ) : (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Wellness</span>
                          <span className="font-bold" style={{ color: RISK_COLORS[child.latestHealth.riskLevel] || '#6B7280' }}>
                            {child.latestHealth.overallScore?.toFixed(1) || '—'}/10
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Risk</span>
                          <span
                            className="px-1.5 py-0.5 rounded text-xs font-bold text-white"
                            style={{ backgroundColor: RISK_COLORS[child.latestHealth.riskLevel] || '#6B7280' }}
                          >
                            {child.latestHealth.riskLevel || '—'}
                          </span>
                        </div>
                        {child.latestHealth.wantsCounselor && (
                          <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 mt-1">
                            Requested counselor
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-bold text-gray-700 uppercase tracking-wide">Recent Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {alerts.length === 0 ? (
                      <p className="text-gray-400 text-sm py-4 text-center">All clear — no alerts</p>
                    ) : (
                      <div className="space-y-2">
                        {alerts.slice(0, 5).map((alert: any) => (
                          <div key={alert.id} className="p-3 bg-orange-50 border-l-4 border-[#F59E0B] text-sm text-[#92400E] rounded">
                            <strong>{alert.title}</strong>
                            <p className="text-xs mt-1">{alert.body}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
