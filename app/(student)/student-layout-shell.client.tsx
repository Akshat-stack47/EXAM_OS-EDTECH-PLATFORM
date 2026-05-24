'use client'

import Link from 'next/link'
import { NotificationBell } from '@/components/shared/NotificationBell'
import { SearchBox } from '@/components/shared/SearchBox'
import { useTranslation } from '@/hooks/useTranslation'

export function StudentLayoutShell({ children }: { children: React.ReactNode }) {
  const { t, lang, changeLanguage } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/student/dashboard" className="font-bold text-lg tracking-tight shrink-0">
            Exam<span className="text-amber-500">OS</span>
          </Link>
          <div className="flex-1 max-w-md hidden md:block">
            <SearchBox
              placeholder={t('search.placeholder')}
              entity="exams"
              className="w-full"
              onSelect={(item) => {
                const doc = item.document || item
                if (doc.examName) window.location.href = `/exams?name=${encodeURIComponent(doc.examName)}`
              }}
            />
          </div>
          <nav className="flex items-center gap-4 text-sm text-gray-300 shrink-0">
            <Link href="/student/dashboard" className="hover:text-white transition-colors hidden sm:inline">{t('nav.dashboard')}</Link>
            <Link href="/exams" className="hover:text-white transition-colors">{t('nav.exams')}</Link>
            <Link href="/student/health" className="hover:text-white transition-colors hidden sm:inline">{t('nav.health')}</Link>
            <Link href="/student/whiteboard" className="hover:text-white transition-colors hidden sm:inline">{t('nav.whiteboard')}</Link>
            <Link href="/search" className="hover:text-white transition-colors md:hidden" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </Link>
            <NotificationBell />
            <button
              onClick={() => changeLanguage(lang === 'en' ? 'hi' : 'en')}
              className="text-xs px-2 py-1 rounded border border-gray-600 hover:border-white transition-colors"
            >
              {lang === 'en' ? 'हिं' : 'EN'}
            </button>
            <Link href="/login" className="hover:text-white transition-colors">{t('nav.logout')}</Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
