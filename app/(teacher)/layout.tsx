import Link from 'next/link'
import { LanguageToggle } from '@/components/shared/LanguageToggle'

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F0F5FA]">
      <header className="bg-[#1B3A5C] text-white">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/teacher/dashboard" className="font-bold text-lg tracking-tight">
            Exam<span className="text-amber-400">OS</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm text-gray-300">
            <Link href="/teacher/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <LanguageToggle />
            <Link href="/login" className="hover:text-white transition-colors">Logout</Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
