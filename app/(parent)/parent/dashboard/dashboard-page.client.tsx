'use client'

import { useSearchParams } from 'next/navigation'
import { useParentDashboard } from '@/hooks/useParentDashboard'
import { ParentDashboardView } from '@/components/parent/ParentDashboardView'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function ParentPreview() {
  return (
    <div className="min-h-screen bg-[#FFF8F2]">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Namaste, <span className="text-[#E88D2A]">Anita Sharma</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Watching over Riya Sharma, Arjun Sharma</p>
          </div>
        </header>

        {['Riya Sharma', 'Arjun Sharma'].map((name) => (
          <div key={name} className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{name}</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <Card className="border-l-4" style={{ borderLeftColor: '#E88D2A' }}>
                <CardContent className="py-4">
                  <div className="text-2xl font-bold text-gray-900">214</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Days to UPSC</div>
                </CardContent>
              </Card>
              <Card className="border-l-4" style={{ borderLeftColor: '#22C55E' }}>
                <CardContent className="py-4">
                  <div className="text-2xl font-bold text-gray-900">72h 30m</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Total Study</div>
                </CardContent>
              </Card>
              <Card className="border-l-4" style={{ borderLeftColor: '#3B82F6' }}>
                <CardContent className="py-4">
                  <div className="text-2xl font-bold text-gray-900">12 days</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Study Streak</div>
                </CardContent>
              </Card>
              <Card className="border-l-4" style={{ borderLeftColor: '#8B5CF6' }}>
                <CardContent className="py-4">
                  <div className="text-2xl font-bold text-gray-900">#1847</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">National Rank</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Subject Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { subject: 'History', score: 78 },
                      { subject: 'Polity', score: 82 },
                      { subject: 'Geography', score: 65 },
                      { subject: 'Economy', score: 71 },
                      { subject: 'Science', score: 88 },
                    ].map((s) => (
                      <div key={s.subject} className="flex items-center gap-4">
                        <span className="w-24 text-sm text-gray-600 font-medium">{s.subject}</span>
                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${s.score}%`,
                              backgroundColor: s.score >= 70 ? '#22C55E' : s.score >= 40 ? '#F59E0B' : '#EF4444',
                            }}
                          />
                        </div>
                        <span className="w-12 text-right text-sm font-bold text-gray-800">{s.score}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm py-4 text-center">All clear — no alerts</p>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ParentDashboardPageClient() {
  const searchParams = useSearchParams()
  const isPreview = searchParams.has('preview')
  const { data, isLoading } = useParentDashboard()

  if (isPreview) {
    return <ParentPreview />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center">
        <div className="text-[#E88D2A] text-lg font-semibold animate-pulse">Loading dashboard...</div>
      </div>
    )
  }

  if (!data?.profile) {
    return (
      <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-8 text-center">
            <p className="text-gray-600">No data available. Link a student to get started.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <ParentDashboardView profile={data.profile} alerts={data.alerts} />
}
