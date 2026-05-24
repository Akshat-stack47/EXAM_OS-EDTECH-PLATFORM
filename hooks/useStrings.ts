'use client'

import { useUIStore } from '@/stores/useUIStore'
import { STRINGS } from '@/lib/strings'
import type { StringKey } from '@/lib/strings'

export function useStrings() {
  const language = useUIStore((s) => s.language)

  return function t(key: StringKey): string {
    return STRINGS[key]?.[language] ?? STRINGS[key]?.en ?? key
  }
}
