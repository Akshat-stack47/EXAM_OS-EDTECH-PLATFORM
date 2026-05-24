import Link from 'next/link'
import { LanguageToggle } from '@/components/shared/LanguageToggle'

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFF8F2]">
      <header className="bg-white border-b border-[#F0E4D7]">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/parent/dashboard" className="font-bold text-lg tracking-tight text-gray-900">
            Exam<span className="text-[#E88D2A]">OS</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm text-gray-500">
            <Link href="/parent/dashboard" className="hover:text-[#E88D2A] transition-colors">Dashboard</Link>
            <LanguageToggle />
            <Link href="/login" className="hover:text-[#E88D2A] transition-colors">Logout</Link>
          </nav>
        </div>
      </header>
      <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">{children}</main>
    </div>
  )
}
