import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const revalidate = 3600

const DASHBOARDS = [
  { name: 'Student Dashboard', desc: 'Track your preparation with AI-powered study tools, mock tests, and progress analytics.', href: '/student/dashboard?preview=1', color: 'bg-gray-900 hover:bg-gray-800', textColor: 'text-white' },
  { name: 'Parent Dashboard', desc: 'Monitor your child\'s academic journey — study streaks, subject progress, and mentor access.', href: '/parent/dashboard?preview=1', color: 'bg-[#E88D2A] hover:bg-[#D67A1E]', textColor: 'text-white' },
  { name: 'Teacher Dashboard', desc: 'Manage classes, track student performance, and offer personalized mentorship.', href: '/teacher/dashboard?preview=1', color: 'bg-[#1B3A5C] hover:bg-[#2C5F8A]', textColor: 'text-white' },
  { name: 'Control Center', desc: 'Platform-wide oversight — user management, exam data, and system analytics.', href: '/coordinator/dashboard?preview=1', color: 'bg-[#0D1117] hover:bg-[#161B22] border border-gray-700', textColor: 'text-[#C9D1D9]' },
]

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="flex flex-col items-center justify-center py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl text-center">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-mono tracking-widest text-cyan-400 border border-cyan-400 rounded">
            EXAMOS · v2.0
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            <span className="text-purple-500">India&apos;s Unified</span><br />
            Exam Intelligence<br />
            <span className="text-amber-500">Platform</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            One ecosystem for every exam — UPSC, SSC, Banking, NEET, JEE. Built for 200M+ aspirants.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-base px-8">Get Started Free</Button>
            </Link>
            <Link href="/exams">
              <Button size="lg" variant="outline" className="text-base px-8 border-gray-600 text-gray-300 hover:text-white">Explore Exams</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">4 Role-Based Dashboards</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {DASHBOARDS.map((d) => (
              <Link key={d.name} href={d.href}>
                <div className={`p-6 rounded-2xl ${d.color} ${d.textColor} shadow-sm transition-all h-full`}>
                  <h3 className="text-xl font-bold mb-2">{d.name}</h3>
                  <p className="text-sm opacity-80">{d.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 bg-gray-900 text-gray-500 text-sm text-center">
        ExamOS — Open Source Exam Intelligence Platform. Built for India.
      </footer>
    </div>
  )
}
