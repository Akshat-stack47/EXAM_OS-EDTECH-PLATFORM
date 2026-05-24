'use client'

import { useTranslation } from '@/hooks/useTranslation'

export function LanguageToggle() {
  const { lang, changeLanguage } = useTranslation()
  return (
    <button
      onClick={() => changeLanguage(lang === 'en' ? 'hi' : 'en')}
      className="text-xs px-2 py-1 rounded border border-gray-600 hover:border-white transition-colors"
      aria-label="Toggle language"
    >
      {lang === 'en' ? 'हिं' : 'EN'}
    </button>
  )
}
