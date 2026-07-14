'use client'

import { useSearchParams } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { TeacherDashboardView } from '@/components/teacher/TeacherDashboardView'

const TEACHER_DEMO_DATA = {
  name: 'Dr. Amit Verma',
  email: 'educator@examos.in',
  specialization: 'History & Polity',
  bio: 'Experienced UPSC mentor with 10+ years of guiding aspirants to top ranks.',
  studentCount: 8,
  earnings: 55000,
  rating: 4.8,
}

export default function TeacherDashboardPageClient() {
  const searchParams = useSearchParams()
  const isPreview = searchParams.has('preview')
  const { data, isLoading } = trpc.teacher.getDashboard.useQuery()

  if (isPreview) return <TeacherDashboardView data={TEACHER_DEMO_DATA} />

  if (isLoading) {
    return (
      <div style={{ minHeight:'100vh', background:'#0A0F1E', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Inter',system-ui,sans-serif" }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#0EA5E9,#6366F1)', margin:'0 auto 1rem', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', animation:'pulse 1.5s ease-in-out infinite' }}>🎓</div>
          <p style={{ color:'rgba(255,255,255,0.4)', fontWeight:600, fontSize:'0.9rem' }}>Loading dashboard…</p>
        </div>
      </div>
    )
  }

  if (!data) return <TeacherDashboardView data={TEACHER_DEMO_DATA} />

  return <TeacherDashboardView data={data} />
}
