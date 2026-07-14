'use client'

import { useSearchParams } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { Card, CardContent } from '@/components/ui/card'
import { CoordinatorDashboardView } from '@/components/coordinator/CoordinatorDashboardView'

const COORDINATOR_DEMO_DATA = {
  name: 'Admin',
  totalUsers: 1247,
  totalStudents: 892,
  totalTeachers: 48,
  totalParents: 307,
  recentUsers: [],
}

export default function CoordinatorDashboardPageClient() {
  const searchParams = useSearchParams()
  const isPreview = searchParams.has('preview')
  const { data, isLoading } = trpc.coordinator.getDashboard.useQuery()

  if (isPreview) return <CoordinatorDashboardView data={COORDINATOR_DEMO_DATA} />

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-[#58A6FF] text-lg font-semibold animate-pulse">Loading dashboard...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <Card className="w-full max-w-md bg-[#161B22] border-[#30363D]">
          <CardContent className="py-8 text-center text-[#C9D1D9]">
            Dashboard data unavailable.
          </CardContent>
        </Card>
      </div>
    )
  }

  return <CoordinatorDashboardView data={data} />
}
