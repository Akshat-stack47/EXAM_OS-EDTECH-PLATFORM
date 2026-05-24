'use client'

import { useSearchParams } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CoordinatorDashboardView } from '@/components/coordinator/CoordinatorDashboardView'

function CoordinatorPreview() {
  return (
    <div className="min-h-screen bg-[#0D1117]">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Control Center</h1>
          <p className="text-[#8B949E] text-sm mt-1">Admin · System Overview</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#161B22] border-[#30363D]">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-[#58A6FF]">1,247</div>
              <div className="text-xs text-[#8B949E] uppercase tracking-wide mt-1">Total Users</div>
            </CardContent>
          </Card>
          <Card className="bg-[#161B22] border-[#30363D]">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-[#22C55E]">892</div>
              <div className="text-xs text-[#8B949E] uppercase tracking-wide mt-1">Students</div>
            </CardContent>
          </Card>
          <Card className="bg-[#161B22] border-[#30363D]">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-[#F59E0B]">48</div>
              <div className="text-xs text-[#8B949E] uppercase tracking-wide mt-1">Teachers</div>
            </CardContent>
          </Card>
          <Card className="bg-[#161B22] border-[#30363D]">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-[#A371F7]">307</div>
              <div className="text-xs text-[#8B949E] uppercase tracking-wide mt-1">Parents</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#161B22] border-[#30363D]">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-[#C9D1D9] uppercase tracking-wide">
              Recent Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#8B949E] border-b border-[#30363D]">
                    <th className="text-left py-3 pr-4 font-medium">Name</th>
                    <th className="text-left py-3 pr-4 font-medium">Email</th>
                    <th className="text-left py-3 pr-4 font-medium">Role</th>
                    <th className="text-left py-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: '1', name: 'Riya Sharma', email: 'riya.s@example.com', role: 'STUDENT', createdAt: new Date().toISOString() },
                    { id: '2', name: 'Anita Sharma', email: 'anita.s@example.com', role: 'PARENT', createdAt: new Date(Date.now() - 86400000).toISOString() },
                    { id: '3', name: 'Dr. Amit Verma', email: 'amit.v@example.com', role: 'TEACHER', createdAt: new Date(Date.now() - 172800000).toISOString() },
                    { id: '4', name: 'Priya Patel', email: 'priya.p@example.com', role: 'STUDENT', createdAt: new Date(Date.now() - 259200000).toISOString() },
                  ].map((u) => (
                    <tr key={u.id} className="border-b border-[#30363D]/50 text-[#C9D1D9]">
                      <td className="py-3 pr-4">{u.name}</td>
                      <td className="py-3 pr-4 text-[#8B949E]">{u.email}</td>
                      <td className="py-3 pr-4">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#21262D] text-[#58A6FF]">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-[#8B949E]">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CoordinatorDashboardPageClient() {
  const searchParams = useSearchParams()
  const isPreview = searchParams.has('preview')
  const { data, isLoading } = trpc.coordinator.getDashboard.useQuery()

  if (isPreview) return <CoordinatorPreview />

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
