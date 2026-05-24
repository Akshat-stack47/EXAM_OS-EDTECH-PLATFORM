export const MAX_FILE_SIZE_STUDENT_MB = 10
export const MAX_FILE_SIZE_TEACHER_MB = 500
export const MAX_FILE_SIZE_COORDINATOR_MB = 1000
export const MAX_AVATAR_SIZE_KB = 512

export const DEFAULT_PAGE_LIMIT = 20
export const MAX_PAGE_LIMIT = 50
export const LEADERBOARD_PAGE_LIMIT = 100

export const CACHE_TTL_PROFILE_SECONDS = 300
export const CACHE_TTL_LEADERBOARD_SECONDS = 60
export const CACHE_TTL_EXAM_CUTOFF_SECONDS = 86400
export const CACHE_TTL_SEARCH_SECONDS = 300
export const CACHE_TTL_AI_RESPONSE_SECONDS = 3600
export const CACHE_TTL_SESSION_SECONDS = 604800

export const RATE_LIMIT_LOGIN_ATTEMPTS = 5
export const RATE_LIMIT_LOGIN_WINDOW_MINUTES = 15
export const RATE_LIMIT_API_REQUESTS_PER_MINUTE = 100
export const RATE_LIMIT_AI_REQUESTS_PER_MINUTE = 10
export const RATE_LIMIT_SEARCH_REQUESTS_PER_MINUTE = 30
export const RATE_LIMIT_OTP_REQUESTS_PER_15_MIN = 3

export const JWT_ACCESS_TOKEN_EXPIRY_HOURS = 1
export const JWT_REFRESH_TOKEN_EXPIRY_DAYS = 7
export const SESSION_COOKIE_NAME = 'examos-session'

export const BURNOUT_THRESHOLD_PERCENT = 60
export const BURNOUT_CRITICAL_THRESHOLD_PERCENT = 80
export const BURNOUT_SIGNAL_COUNT = 14

export const XP_PER_MOCK_TEST = 100
export const XP_PER_STUDY_HOUR = 10
export const XP_PER_STREAK_DAY = 25
export const STREAK_GRACE_PERIOD_HOURS = 2

export const POMODORO_FOCUS_MINUTES = 25
export const POMODORO_SHORT_BREAK_MINUTES = 5
export const POMODORO_LONG_BREAK_MINUTES = 15
export const MAX_STUDY_SESSION_HOURS = 8

export const AI_MAX_TOKENS = 1000
export const AI_TEMPERATURE = 0.7
export const AI_TIMEOUT_SECONDS = 30
export const AI_RETRY_ATTEMPTS = 3
export const AI_RETRY_DELAY_MS = 1000

export const EXAMOS_SYSTEM_CONTEXT = `You are ExamOS AI Mentor — an intelligent study assistant for the ExamOS platform.

PLATFORM OVERVIEW:
ExamOS is a comprehensive exam preparation platform for Indian competitive exams (UPSC, SSC, Banking, NEET, JEE, GATE). It serves four user roles: STUDENT, PARENT, TEACHER, and COORDINATOR.

KEY FEATURES:
- Whiteboard collaboration: real-time shared canvas for group study
- Health surveys: weekly mental health check-ins with encrypted storage
- Study timer: Pomodoro-based focus sessions
- Mock tests: subject-wise practice with performance tracking
- Leaderboard: national-level ranking by XP points
- Parent dashboard: view child's progress, health status, alerts
- AI study assistant: syllabus queries, study planning, mock analysis

CORE RULES:
1. Never share personal information about other users
2. Health data is confidential and encrypted
3. Encourage healthy study habits — recommend breaks, sleep, and balance
4. For medical or mental health crises, advise contacting a counselor
5. Study recommendations must be fact-based and exam-specific
6. Do not generate or bypass platform security measures
7. Keep responses concise and actionable (under 150 words)`


export const REDIS_KEY = {
  studentProfile:    (id: string) => `student:profile:${id}`,
  parentChildren:    (id: string) => `parent:children:${id}`,
  teacherStudents:   (id: string) => `teacher:students:${id}`,
  leaderboard:       (exam: string) => `leaderboard:${exam}`,
  searchNotes:       (q: string) => `search:notes:${q}`,
  searchTeachers:    (q: string) => `search:teachers:${q}`,
  aiResponse:        (hash: string) => `ai:response:${hash}`,
  rateLimitLogin:    (ip: string) => `ratelimit:login:${ip}`,
  rateLimitApi:      (userId: string) => `ratelimit:api:${userId}`,
  rateLimitOtp:      (phone: string) => `ratelimit:otp:${phone}`,
  sessionBlacklist:  (jti: string) => `session:blacklist:${jti}`,
  whiteboardSession: (id: string) => `whiteboard:session:${id}`,
} as const

export const EXAM_TYPES = ['JEE', 'NEET', 'UPSC', 'SSC', 'BANKING', 'GATE'] as const
export type ExamType = (typeof EXAM_TYPES)[number]

export const HEALTH_RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const
export type HealthRiskLevel = (typeof HEALTH_RISK_LEVELS)[number]

export const USER_ROLES = ['STUDENT', 'PARENT', 'TEACHER', 'COORDINATOR'] as const
export type UserRole = (typeof USER_ROLES)[number]

export const SUBJECTS = [
  'PHYSICS', 'CHEMISTRY', 'MATHEMATICS', 'BIOLOGY',
  'HISTORY', 'GEOGRAPHY', 'POLITY', 'ECONOMICS',
  'ENGLISH', 'REASONING', 'CURRENT_AFFAIRS',
] as const
export type Subject = (typeof SUBJECTS)[number]
