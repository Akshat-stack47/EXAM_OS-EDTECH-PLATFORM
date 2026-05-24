export type Role = 'STUDENT' | 'TEACHER' | 'PARENT' | 'COORDINATOR' | 'ADMIN'

export type ExamCategory = 'UPSC' | 'SSC' | 'BANKING' | 'RAILWAY' | 'STATE_PSC' | 'JEE' | 'NEET' | 'DEFENCE'

export type HealthRisk = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type SessionStatus = 'ACTIVE' | 'ENDED' | 'ARCHIVED'

export interface UserProfile {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl?: string | null
  isVerified: boolean
}

export interface StudentDashboardData {
  profile: {
    name: string
    nationalRank?: number | null
    streak: number
    totalStudyMins: number
    todayMinutes: number
  }
  scores: { subject: string; score: number }[]
  recentSessions: { duration: number; createdAt: string }[]
}

export interface ParentDashboardData {
  profile: {
    name: string
    children: {
      id: string
      name: string
      targetExam: string
      targetYear: number
      currentStreak: number
      totalStudyMins: number
      nationalRank?: number | null
      burnoutRisk: string
      subjectScores: { subject: string; score: number }[]
      isVerified: boolean
    }[]
  }
  alerts: { id: string; title: string; body: string }[]
}

export interface PaginatedResult<T> {
  items: T[]
  nextCursor?: string | null
  total?: number
}
