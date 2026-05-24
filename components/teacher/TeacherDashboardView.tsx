'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const TeacherDashboardView = ({ data }: { data: any }) => (
  <div className="min-h-screen bg-[#F0F5FA]">
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1B3A5C]">Welcome, {data.name}</h1>
        <p className="text-gray-500 text-sm mt-1">{data.specialization || 'Educator'} · {data.email}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="py-6">
            <div className="text-3xl font-bold text-[#1B3A5C]">{data.studentCount}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Active Students</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="text-3xl font-bold text-[#1B3A5C]">₹{data.earnings.toLocaleString()}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Total Earnings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="text-3xl font-bold text-[#1B3A5C]">{data.rating.toFixed(1)}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Rating</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#1B3A5C]">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.bio && (
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Bio</span>
              <p className="text-gray-700 mt-1">{data.bio}</p>
            </div>
          )}
          {data.specialization && (
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Specialization</span>
              <p className="text-gray-700 mt-1">{data.specialization}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
)
