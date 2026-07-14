import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SignJWT } from 'jose'

// SECURITY: Only enabled in development mode
// Hit this endpoint to seed test data: GET /api/seed
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed endpoint disabled in production' }, { status: 403 })
  }

  const JWT_SECRET = new TextEncoder().encode(
    process.env.SUPABASE_JWT_SECRET || 'examos-local-dev-jwt-secret-change-in-production'
  )

  async function createToken(userId: string, role: string) {
    return new SignJWT({ role, sub: userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)
  }

  try {
    const results: Record<string, { token: string; email: string }> = {}

    // ── Helper: upsert a user (skip if already exists) ──────────────
    async function upsertUser(data: {
      email: string; name: string; role: any; supabaseId: string
    }) {
      const existing = await db.user.findUnique({ where: { email: data.email } })
      if (existing) return existing
      return db.user.create({ data: { ...data, isVerified: true } })
    }

    // ── 1. Student ─────────────────────────────────────────────────
    const student = await upsertUser({
      email: 'student@examos.in', name: 'Riya Sharma', role: 'STUDENT',
      supabaseId: `sb-student-${Date.now()}`,
    })

    let studentProfile = await db.studentProfile.findUnique({ where: { userId: student.id } })
    if (!studentProfile) {
      studentProfile = await db.studentProfile.create({
        data: {
          userId: student.id, targetExam: 'UPSC', targetYear: 2026,
          category: 'general', currentStreak: 14, longestStreak: 21,
          xpPoints: 4250, nationalRank: 1847, burnoutRisk: 'LOW', totalStudyMins: 4320,
        },
      })

      // Subject scores
      const subjects = [
        { subject: 'History', score: 78 }, { subject: 'Polity', score: 82 },
        { subject: 'Geography', score: 65 }, { subject: 'Economy', score: 71 },
        { subject: 'Science & Tech', score: 88 }, { subject: 'Ethics', score: 69 },
      ]
      for (const s of subjects) {
        await db.subjectScore.create({ data: { studentId: studentProfile.id, ...s } })
      }

      // Study sessions
      for (let i = 0; i < 10; i++) {
        const d = new Date(); d.setDate(d.getDate() - i)
        await db.studySession.create({ data: { studentId: studentProfile.id, duration: 45 + i * 5, createdAt: d, subject: 'Polity', examTag: 'UPSC' } })
      }

      // Mock results
      for (let i = 0; i < 5; i++) {
        const d = new Date(); d.setDate(d.getDate() - i * 3)
        await db.mockResult.create({
          data: {
            studentId: studentProfile.id, testId: `mock-${i + 1}`,
            score: 120 + i * 10, totalMarks: 200, timeTakenSecs: 5400 + i * 300,
            percentile: 72 + i * 4, rank: 2000 - i * 100,
            subjectBreakup: { history: 24, polity: 28, geography: 22, economy: 24 },
            attemptedAt: d,
          },
        })
      }
    }

    results.student = { email: student.email, token: await createToken(student.id, 'STUDENT') }

    // ── 2. Teacher ─────────────────────────────────────────────────
    const teacher = await upsertUser({
      email: 'teacher@examos.in', name: 'Dr. Amit Verma', role: 'TEACHER',
      supabaseId: `sb-teacher-${Date.now()}`,
    })

    if (!await db.teacherProfile.findUnique({ where: { userId: teacher.id } })) {
      await db.teacherProfile.create({
        data: { userId: teacher.id, bio: 'Ex-IAS officer. 10+ years UPSC mentoring.', specialization: 'History & Polity', rating: 4.8, earnings: 48000 },
      })
    }
    results.teacher = { email: teacher.email, token: await createToken(teacher.id, 'TEACHER') }

    // ── 3. Parent ──────────────────────────────────────────────────
    const parent = await upsertUser({
      email: 'parent@examos.in', name: 'Anita Sharma', role: 'PARENT',
      supabaseId: `sb-parent-${Date.now()}`,
    })

    let parentProfile = await db.parentProfile.findUnique({ where: { userId: parent.id } })
    if (!parentProfile) {
      parentProfile = await db.parentProfile.create({
        data: { userId: parent.id, alertPrefs: { email: true }, city: 'Delhi' },
      })

      await db.parentChildLink.create({
        data: { parentId: parentProfile.id, studentId: studentProfile!.id, isVerified: true },
      })

      await db.notification.createMany({
        data: [
          { userId: parent.id, title: '🔥 14-day streak!', body: 'Riya has studied every day for 14 days in a row.' },
          { userId: parent.id, title: '📊 Mock test result', body: 'Riya scored 78% in UPSC Prelims mock (Rank: #1847).' },
          { userId: parent.id, title: '❤️ Health check-in', body: 'Riya submitted her weekly health survey. Risk: LOW.' },
        ],
      })
    }
    results.parent = { email: parent.email, token: await createToken(parent.id, 'PARENT') }

    // ── 4. Coordinator ─────────────────────────────────────────────
    const coord = await upsertUser({
      email: 'coordinator@examos.in', name: 'ExamOS Admin', role: 'COORDINATOR',
      supabaseId: `sb-coord-${Date.now()}`,
    })
    results.coordinator = { email: coord.email, token: await createToken(coord.id, 'COORDINATOR') }

    return NextResponse.json({
      success: true,
      message: '✅ Database seeded successfully! Use these tokens as the sb-access-token cookie.',
      accounts: results,
    })
  } catch (error: any) {
    console.error('Seed API error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
