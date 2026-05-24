'use client'

import { useSearchParams } from 'next/navigation'
import { useStudentProfile } from '@/hooks/useStudentProfile'
import { StudentDashboardView } from '@/components/student/StudentDashboardView'
import { Card, CardContent } from '@/components/ui/card'

const DEMO_DATA = {
  profile: { name: 'Riya Sharma', streak: 12, nationalRank: 1847, totalStudyMins: 3600, todayMinutes: 45 },
  scores: [
    { subject: 'History', score: 78 },
    { subject: 'Polity', score: 82 },
    { subject: 'Geography', score: 65 },
    { subject: 'Economy', score: 71 },
    { subject: 'Science', score: 88 },
  ],
  recentSessions: [
    { duration: 45, createdAt: new Date().toISOString() },
    { duration: 30, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { duration: 60, createdAt: new Date(Date.now() - 172800000).toISOString() },
  ],
}

export default function StudentDashboardPageClient() {
  const searchParams = useSearchParams()
  const isPreview = searchParams.has('preview')
  const { data, isLoading, error } = useStudentProfile()

  if (isPreview) {
    return <StudentDashboardView data={DEMO_DATA} />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900 text-lg font-semibold animate-pulse">Loading dashboard...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-8 text-center text-gray-500">
            {error?.message || 'Unable to load dashboard data.'}
          </CardContent>
        </Card>
      </div>
    )
  }

  return <StudentDashboardView data={data} />
}
