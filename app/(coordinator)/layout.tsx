import Link from 'next/link'
import { LanguageToggle } from '@/components/shared/LanguageToggle'

export default function CoordinatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0D1117]">
      <header className="bg-[#161B22] border-b border-[#30363D]">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/coordinator/dashboard" className="font-bold text-lg text-white tracking-tight">
            Exam<span className="text-[#58A6FF]">OS</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm text-[#8B949E]">
            <Link href="/coordinator/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <LanguageToggle />
            <Link href="/login" className="hover:text-white transition-colors">Logout</Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
