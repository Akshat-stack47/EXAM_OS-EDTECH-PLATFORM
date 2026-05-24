import { env } from '@/lib/env'

type FlagName = 'aiGrading' | 'liveClasses' | 'parentDashboard'

const flags: Record<FlagName, boolean> = {
  aiGrading: env.NEXT_PUBLIC_FEATURE_AI_GRADING ?? false,
  liveClasses: env.NEXT_PUBLIC_FEATURE_LIVE_CLASSES ?? false,
  parentDashboard: env.NEXT_PUBLIC_FEATURE_PARENT_DASHBOARD ?? false,
}

export function isEnabled(flag: FlagName): boolean {
  return flags[flag]
}

export function isDisabled(flag: FlagName): boolean {
  return !flags[flag]
}

export const featureFlags = {
  isEnabled,
  isDisabled,
}
