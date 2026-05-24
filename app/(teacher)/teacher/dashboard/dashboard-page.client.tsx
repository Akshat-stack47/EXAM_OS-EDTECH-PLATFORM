'use client'

import { useSearchParams } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TeacherDashboardView } from '@/components/teacher/TeacherDashboardView'

function TeacherPreview() {
  return (
    <div className="min-h-screen bg-[#F0F5FA]">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1B3A5C]">
            Welcome, Dr. Amit Verma
          </h1>
          <p className="text-gray-500 text-sm mt-1">History · amit.verma@example.com</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-[#1B3A5C]">24</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Active Students</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-[#1B3A5C]">₹48,000</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Total Earnings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-[#1B3A5C]">4.8</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Rating</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#1B3A5C]">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Bio</span>
              <p className="text-gray-700 mt-1">Experienced UPSC mentor with 10+ years of guiding aspirants to top ranks.</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Specialization</span>
              <p className="text-gray-700 mt-1">History & Polity</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function TeacherDashboardPageClient() {
  const searchParams = useSearchParams()
  const isPreview = searchParams.has('preview')
  const { data, isLoading } = trpc.teacher.getDashboard.useQuery()

  if (isPreview) return <TeacherPreview />

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0F5FA] flex items-center justify-center">
        <div className="text-[#1B3A5C] text-lg font-semibold animate-pulse">Loading dashboard...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F0F5FA] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-8 text-center text-gray-500">
            Teacher profile not found.
          </CardContent>
        </Card>
      </div>
    )
  }

  return <TeacherDashboardView data={data} />
}
