import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/migrate — idempotent schema sync
// Safe to run multiple times: IF NOT EXISTS on every column
export async function GET() {
  const results: string[] = []
  const errors: string[] = []

  async function run(label: string, sql: string) {
    try {
      await db.$executeRawUnsafe(sql)
      results.push(`✅ ${label}`)
    } catch (e: any) {
      if (
        e.message?.includes('already exists') ||
        e.message?.includes('duplicate column') ||
        e.message?.includes('42701') // PostgreSQL duplicate column error code
      ) {
        results.push(`⏭️  ${label} (already exists)`)
      } else {
        errors.push(`❌ ${label}: ${e.message?.split('\n')[0]}`)
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // USERS
  // ═══════════════════════════════════════════════════════════════════════
  await run('users.deletedAt',    `ALTER TABLE users ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP WITH TIME ZONE`)
  await run('users.updatedAt',    `ALTER TABLE users ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('users.avatarUrl',    `ALTER TABLE users ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT`)
  await run('users.isVerified',   `ALTER TABLE users ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN NOT NULL DEFAULT false`)
  await run('users.supabaseId',   `ALTER TABLE users ADD COLUMN IF NOT EXISTS "supabaseId" TEXT`)
  await run('users.phone',        `ALTER TABLE users ADD COLUMN IF NOT EXISTS "phone" TEXT`)

  // ═══════════════════════════════════════════════════════════════════════
  // STUDENT PROFILES — exact field names from schema.prisma
  // ═══════════════════════════════════════════════════════════════════════
  await run('student_profiles.studyHoursGoal', `ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS "studyHoursGoal" INTEGER NOT NULL DEFAULT 8`)
  await run('student_profiles.currentStreak',  `ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS "currentStreak" INTEGER NOT NULL DEFAULT 0`)
  await run('student_profiles.longestStreak',  `ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS "longestStreak" INTEGER NOT NULL DEFAULT 0`)
  await run('student_profiles.xpPoints',       `ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS "xpPoints" INTEGER NOT NULL DEFAULT 0`)
  await run('student_profiles.nationalRank',   `ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS "nationalRank" INTEGER`)
  await run('student_profiles.burnoutRisk',    `ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS "burnoutRisk" TEXT NOT NULL DEFAULT 'LOW'`)
  await run('student_profiles.lastActiveAt',   `ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS "lastActiveAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('student_profiles.totalStudyMins', `ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS "totalStudyMins" INTEGER NOT NULL DEFAULT 0`)
  await run('student_profiles.parentLinked',   `ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS "parentLinked" BOOLEAN NOT NULL DEFAULT false`)
  await run('student_profiles.createdAt',      `ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('student_profiles.updatedAt',      `ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('student_profiles.deletedAt',      `ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP WITH TIME ZONE`)
  // Rename wrong column names from first migration attempt
  await run('student_profiles drop streak (dup)', `
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_profiles' AND column_name='streak') THEN
        ALTER TABLE student_profiles DROP COLUMN "streak";
      END IF;
    END $$
  `)

  // ═══════════════════════════════════════════════════════════════════════
  // TEACHER PROFILES
  // ═══════════════════════════════════════════════════════════════════════
  await run('teacher_profiles.bio',            `ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS "bio" TEXT`)
  await run('teacher_profiles.specialization', `ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS "specialization" TEXT`)
  await run('teacher_profiles.rating',         `ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0`)
  await run('teacher_profiles.earnings',       `ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS "earnings" NUMERIC(12,2) NOT NULL DEFAULT 0.0`)
  await run('teacher_profiles.createdAt',      `ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('teacher_profiles.updatedAt',      `ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('teacher_profiles.deletedAt',      `ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP WITH TIME ZONE`)

  // ═══════════════════════════════════════════════════════════════════════
  // PARENT PROFILES
  // ═══════════════════════════════════════════════════════════════════════
  await run('parent_profiles.occupation', `ALTER TABLE parent_profiles ADD COLUMN IF NOT EXISTS "occupation" TEXT`)
  await run('parent_profiles.city',       `ALTER TABLE parent_profiles ADD COLUMN IF NOT EXISTS "city" TEXT`)
  await run('parent_profiles.createdAt',  `ALTER TABLE parent_profiles ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('parent_profiles.updatedAt',  `ALTER TABLE parent_profiles ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('parent_profiles.deletedAt',  `ALTER TABLE parent_profiles ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP WITH TIME ZONE`)

  // ═══════════════════════════════════════════════════════════════════════
  // PARENT CHILD LINKS
  // ═══════════════════════════════════════════════════════════════════════
  await run('parent_child_links.isVerified', `ALTER TABLE parent_child_links ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN NOT NULL DEFAULT false`)
  await run('parent_child_links.linkedAt',   `ALTER TABLE parent_child_links ADD COLUMN IF NOT EXISTS "linkedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('parent_child_links.createdAt',  `ALTER TABLE parent_child_links ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('parent_child_links.updatedAt',  `ALTER TABLE parent_child_links ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('parent_child_links.deletedAt',  `ALTER TABLE parent_child_links ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP WITH TIME ZONE`)

  // ═══════════════════════════════════════════════════════════════════════
  // HEALTH SURVEYS
  // ═══════════════════════════════════════════════════════════════════════
  await run('health_surveys.weekStart',       `ALTER TABLE health_surveys ADD COLUMN IF NOT EXISTS "weekStart" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()`)
  await run('health_surveys.moodScore',       `ALTER TABLE health_surveys ADD COLUMN IF NOT EXISTS "moodScore" INTEGER NOT NULL DEFAULT 5`)
  await run('health_surveys.sleepScore',      `ALTER TABLE health_surveys ADD COLUMN IF NOT EXISTS "sleepScore" INTEGER NOT NULL DEFAULT 5`)
  await run('health_surveys.anxietyScore',    `ALTER TABLE health_surveys ADD COLUMN IF NOT EXISTS "anxietyScore" INTEGER NOT NULL DEFAULT 5`)
  await run('health_surveys.motivationScore', `ALTER TABLE health_surveys ADD COLUMN IF NOT EXISTS "motivationScore" INTEGER NOT NULL DEFAULT 5`)
  await run('health_surveys.overallScore',    `ALTER TABLE health_surveys ADD COLUMN IF NOT EXISTS "overallScore" DOUBLE PRECISION NOT NULL DEFAULT 5.0`)
  await run('health_surveys.riskLevel',       `ALTER TABLE health_surveys ADD COLUMN IF NOT EXISTS "riskLevel" TEXT NOT NULL DEFAULT 'LOW'`)
  await run('health_surveys.wantsCounselor',  `ALTER TABLE health_surveys ADD COLUMN IF NOT EXISTS "wantsCounselor" BOOLEAN NOT NULL DEFAULT false`)
  await run('health_surveys.notes',           `ALTER TABLE health_surveys ADD COLUMN IF NOT EXISTS "notes" TEXT`)
  await run('health_surveys.aiResponse',      `ALTER TABLE health_surveys ADD COLUMN IF NOT EXISTS "aiResponse" TEXT`)
  await run('health_surveys.submittedAt',     `ALTER TABLE health_surveys ADD COLUMN IF NOT EXISTS "submittedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('health_surveys.createdAt',       `ALTER TABLE health_surveys ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('health_surveys.updatedAt',       `ALTER TABLE health_surveys ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('health_surveys.deletedAt',       `ALTER TABLE health_surveys ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP WITH TIME ZONE`)

  // ═══════════════════════════════════════════════════════════════════════
  // STUDY SESSIONS
  // ═══════════════════════════════════════════════════════════════════════
  await run('study_sessions.duration',  `ALTER TABLE study_sessions ADD COLUMN IF NOT EXISTS "duration" INTEGER NOT NULL DEFAULT 0`)
  await run('study_sessions.subject',   `ALTER TABLE study_sessions ADD COLUMN IF NOT EXISTS "subject" TEXT`)
  await run('study_sessions.notes',     `ALTER TABLE study_sessions ADD COLUMN IF NOT EXISTS "notes" TEXT`)
  await run('study_sessions.createdAt', `ALTER TABLE study_sessions ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('study_sessions.updatedAt', `ALTER TABLE study_sessions ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('study_sessions.deletedAt', `ALTER TABLE study_sessions ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP WITH TIME ZONE`)

  // ═══════════════════════════════════════════════════════════════════════
  // WHITEBOARD SESSIONS
  // ═══════════════════════════════════════════════════════════════════════
  await run('whiteboard_sessions.topic',        `ALTER TABLE whiteboard_sessions ADD COLUMN IF NOT EXISTS "topic" TEXT`)
  await run('whiteboard_sessions.canvasData',   `ALTER TABLE whiteboard_sessions ADD COLUMN IF NOT EXISTS "canvasData" JSONB DEFAULT '{}'`)
  await run('whiteboard_sessions.maxMembers',   `ALTER TABLE whiteboard_sessions ADD COLUMN IF NOT EXISTS "maxMembers" INTEGER NOT NULL DEFAULT 6`)
  await run('whiteboard_sessions.isPublic',     `ALTER TABLE whiteboard_sessions ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN NOT NULL DEFAULT false`)
  await run('whiteboard_sessions.inviteCode',   `ALTER TABLE whiteboard_sessions ADD COLUMN IF NOT EXISTS "inviteCode" TEXT`)
  await run('whiteboard_sessions.botEnabled',   `ALTER TABLE whiteboard_sessions ADD COLUMN IF NOT EXISTS "botEnabled" BOOLEAN NOT NULL DEFAULT true`)
  await run('whiteboard_sessions.aiCorrections',`ALTER TABLE whiteboard_sessions ADD COLUMN IF NOT EXISTS "aiCorrections" INTEGER NOT NULL DEFAULT 0`)
  await run('whiteboard_sessions.startedAt',    `ALTER TABLE whiteboard_sessions ADD COLUMN IF NOT EXISTS "startedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('whiteboard_sessions.endedAt',      `ALTER TABLE whiteboard_sessions ADD COLUMN IF NOT EXISTS "endedAt" TIMESTAMP WITH TIME ZONE`)
  await run('whiteboard_sessions.createdAt',    `ALTER TABLE whiteboard_sessions ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('whiteboard_sessions.updatedAt',    `ALTER TABLE whiteboard_sessions ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('whiteboard_sessions.deletedAt',    `ALTER TABLE whiteboard_sessions ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP WITH TIME ZONE`)

  // ═══════════════════════════════════════════════════════════════════════
  // SUBJECT SCORES
  // ═══════════════════════════════════════════════════════════════════════
  await run('subject_scores.createdAt', `ALTER TABLE subject_scores ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('subject_scores.updatedAt', `ALTER TABLE subject_scores ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('subject_scores.deletedAt', `ALTER TABLE subject_scores ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP WITH TIME ZONE`)

  // ═══════════════════════════════════════════════════════════════════════
  // MOCK RESULTS
  // ═══════════════════════════════════════════════════════════════════════
  await run('mock_results.createdAt', `ALTER TABLE mock_results ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('mock_results.updatedAt', `ALTER TABLE mock_results ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('mock_results.deletedAt', `ALTER TABLE mock_results ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP WITH TIME ZONE`)

  // ═══════════════════════════════════════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════════════
  await run('notifications.type',      `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS "type" TEXT NOT NULL DEFAULT 'INFO'`)
  await run('notifications.read',      `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS "read" BOOLEAN NOT NULL DEFAULT false`)
  await run('notifications.link',      `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS "link" TEXT`)
  await run('notifications.createdAt', `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('notifications.updatedAt', `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('notifications.deletedAt', `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP WITH TIME ZONE`)

  // ═══════════════════════════════════════════════════════════════════════
  // AUDIT LOGS
  // ═══════════════════════════════════════════════════════════════════════
  await run('audit_logs.updatedAt',   `ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`)
  await run('audit_logs.entityId',    `ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS "entityId" TEXT`)
  await run('audit_logs.entityType',  `ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS "entityType" TEXT`)
  await run('audit_logs.ipAddress',   `ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS "ipAddress" TEXT`)
  await run('audit_logs.userAgent',   `ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS "userAgent" TEXT`)

  return NextResponse.json({
    success: errors.length === 0,
    applied: results.length,
    skipped: results.filter(r => r.includes('⏭️')).length,
    added: results.filter(r => r.includes('✅')).length,
    errors: errors.length > 0 ? errors : undefined,
    details: results,
    summary: `${results.length} checked, ${results.filter(r => r.includes('✅')).length} added, ${errors.length} errors`,
  })
}
