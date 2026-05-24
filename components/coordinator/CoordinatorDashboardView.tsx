'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const CoordinatorDashboardView = ({ data }: { data: any }) => {
  return (
    <div className="min-h-screen bg-[#0D1117]">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Control Center</h1>
          <p className="text-[#8B949E] text-sm mt-1">Welcome, {data.name} · System Overview</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#161B22] border-[#30363D]">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-[#58A6FF]">{data.totalUsers}</div>
              <div className="text-xs text-[#8B949E] uppercase tracking-wide mt-1">Total Users</div>
            </CardContent>
          </Card>
          <Card className="bg-[#161B22] border-[#30363D]">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-[#22C55E]">{data.totalStudents}</div>
              <div className="text-xs text-[#8B949E] uppercase tracking-wide mt-1">Students</div>
            </CardContent>
          </Card>
          <Card className="bg-[#161B22] border-[#30363D]">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-[#F59E0B]">{data.totalTeachers}</div>
              <div className="text-xs text-[#8B949E] uppercase tracking-wide mt-1">Teachers</div>
            </CardContent>
          </Card>
          <Card className="bg-[#161B22] border-[#30363D]">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-[#A371F7]">{data.totalParents}</div>
              <div className="text-xs text-[#8B949E] uppercase tracking-wide mt-1">Parents</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#161B22] border-[#30363D]">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-[#C9D1D9] uppercase tracking-wide">Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentUsers.length === 0 ? (
              <p className="text-[#8B949E] text-sm py-4 text-center">No recent users</p>
            ) : (
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
                    {data.recentUsers.map((u: any) => (
                      <tr key={u.id} className="border-b border-[#30363D]/50 text-[#C9D1D9]">
                        <td className="py-3 pr-4">{u.name}</td>
                        <td className="py-3 pr-4 text-[#8B949E]">{u.email}</td>
                        <td className="py-3 pr-4">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#21262D] text-[#58A6FF]">{u.role}</span>
                        </td>
                        <td className="py-3 text-[#8B949E]">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
