'use client'

import { useState, useCallback } from 'react'
import i18n from '@/lib/i18n'

export function useTranslation() {
  const [lang, setLang] = useState(i18n.language)

  const t = useCallback((key: string) => i18n.t(key), [])

  const changeLanguage = useCallback((lng: string) => {
    i18n.changeLanguage(lng)
    setLang(lng)
  }, [])

  return { t, lang, changeLanguage }
}
