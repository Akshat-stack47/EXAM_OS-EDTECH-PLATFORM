/**
 * ExamOS — Database Seed Script
 * Creates test accounts for all 4 roles so you can test the full app
 *
 * Usage: npx tsx --env-file=.env prisma/seed.ts
 *        (or: npm run seed)
 */

import { db } from '../lib/db'
import { SignJWT } from 'jose'

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

async function main() {
  console.log('🌱 Seeding ExamOS database...\n')

  // ── Clean up existing seed accounts ──────────────────────────────
  const seedEmails = ['student@examos.in', 'parent@examos.in', 'teacher@examos.in', 'coordinator@examos.in']
  for (const email of seedEmails) {
    const user = await db.user.findUnique({ where: { email } })
    if (user) {
      // Delete dependent records first
      await db.studySession.deleteMany({ where: { student: { userId: user.id } } })
      await db.subjectScore.deleteMany({ where: { student: { userId: user.id } } })
      await db.mockResult.deleteMany({ where: { student: { userId: user.id } } })
      await db.notification.deleteMany({ where: { userId: user.id } })
      await db.auditLog.deleteMany({ where: { userId: user.id } })
      await db.studentProfile.deleteMany({ where: { userId: user.id } })
      await db.teacherProfile.deleteMany({ where: { userId: user.id } })
      await db.parentProfile.deleteMany({ where: { userId: user.id } })
      await db.user.delete({ where: { id: user.id } })
    }
  }

  // ── 1. Student ────────────────────────────────────────────────────
  const student = await db.user.create({
    data: {
      email: 'student@examos.in',
      name: 'Riya Sharma',
      role: 'STUDENT',
      supabaseId: `sb-student-seed-${Date.now()}`,
      isVerified: true,
    },
  })
  const studentProfile = await db.studentProfile.create({
    data: {
      userId: student.id,
      targetExam: 'UPSC',
      targetYear: 2026,
      category: 'general',
      currentStreak: 14,
      longestStreak: 21,
      xpPoints: 4250,
      nationalRank: 1847,
      burnoutRisk: 'LOW',
      totalStudyMins: 4320,
      studyHoursGoal: 8,
    },
  })

  // Subject scores
  const subjects = [
    { subject: 'History', score: 78 },
    { subject: 'Polity', score: 82 },
    { subject: 'Geography', score: 65 },
    { subject: 'Economy', score: 71 },
    { subject: 'Science & Tech', score: 88 },
    { subject: 'Current Affairs', score: 74 },
    { subject: 'Ethics', score: 69 },
    { subject: 'Environment', score: 76 },
  ]
  for (const s of subjects) {
    await db.subjectScore.create({ data: { studentId: studentProfile.id, ...s } })
  }

  // Study sessions (last 10 days)
  for (let i = 0; i < 10; i++) {
    const d = new Date(); d.setDate(d.getDate() - i)
    await db.studySession.create({
      data: { studentId: studentProfile.id, duration: 45 + Math.floor(Math.random() * 90), createdAt: d, subject: 'Polity', examTag: 'UPSC' },
    })
  }

  // Mock results
  for (let i = 0; i < 5; i++) {
    const d = new Date(); d.setDate(d.getDate() - i * 3)
    await db.mockResult.create({
      data: {
        studentId: studentProfile.id,
        testId: `mock-${i + 1}`,
        score: 120 + Math.floor(Math.random() * 60),
        totalMarks: 200,
        timeTakenSecs: 5400 + Math.floor(Math.random() * 1800),
        percentile: 70 + Math.random() * 25,
        rank: 1800 + Math.floor(Math.random() * 500),
        subjectBreakup: { history: 24, polity: 28, geography: 22, economy: 24, science: 22 },
        attemptedAt: d,
      },
    })
  }

  // Health survey
  await db.healthSurvey.create({
    data: {
      userId: student.id,
      weekStart: new Date(Date.now() - 7 * 24 * 3600 * 1000),
      moodScore: 8,
      sleepScore: 7,
      anxietyScore: 4,
      motivationScore: 9,
      overallScore: 7.5,
      riskLevel: 'LOW',
      wantsCounselor: false,
    },
  })

  const studentToken = await createToken(student.id, 'STUDENT')
  console.log(`✅ Student: student@examos.in`)
  console.log(`   Token: ${studentToken.slice(0, 40)}...\n`)

  // ── 2. Teacher ────────────────────────────────────────────────────
  const teacher = await db.user.create({
    data: {
      email: 'teacher@examos.in',
      name: 'Dr. Amit Verma',
      role: 'TEACHER',
      supabaseId: `sb-teacher-seed-${Date.now()}`,
      isVerified: true,
    },
  })
  await db.teacherProfile.create({
    data: {
      userId: teacher.id,
      bio: 'Experienced UPSC mentor with 10+ years of guiding aspirants to top ranks. Ex-IAS officer.',
      specialization: 'History & Polity',
      rating: 4.8,
      earnings: 48000,
    },
  })

  // Add some at-risk students for the teacher dashboard
  const atRiskEmails = ['risk1@examos.in', 'risk2@examos.in']
  for (let i = 0; i < atRiskEmails.length; i++) {
    const u = await db.user.create({
      data: { email: atRiskEmails[i], name: `At-Risk Student ${i + 1}`, role: 'STUDENT', supabaseId: `sb-risk-${i}-${Date.now()}`, isVerified: true },
    })
    const sp = await db.studentProfile.create({
      data: { userId: u.id, targetExam: 'UPSC', targetYear: 2026, category: 'general', burnoutRisk: i === 0 ? 'HIGH' : 'MEDIUM', nationalRank: 9000 + i * 500, currentStreak: 1 },
    })
    await db.subjectScore.create({ data: { studentId: sp.id, subject: 'History', score: 45 + i * 5 } })
  }

  const teacherToken = await createToken(teacher.id, 'TEACHER')
  console.log(`✅ Teacher: teacher@examos.in`)
  console.log(`   Token: ${teacherToken.slice(0, 40)}...\n`)

  // ── 3. Parent ─────────────────────────────────────────────────────
  const parent = await db.user.create({
    data: {
      email: 'parent@examos.in',
      name: 'Anita Sharma',
      role: 'PARENT',
      supabaseId: `sb-parent-seed-${Date.now()}`,
      isVerified: true,
    },
  })
  const parentProfile = await db.parentProfile.create({
    data: { userId: parent.id, alertPrefs: { email: true, sms: false }, city: 'Delhi', occupation: 'Teacher' },
  })

  // Link student to parent
  await db.parentChildLink.create({
    data: { parentId: parentProfile.id, studentId: studentProfile.id, isVerified: true },
  })

  // Add some alerts
  await db.notification.createMany({
    data: [
      { userId: parent.id, title: 'Study streak achieved!', body: 'Riya has completed 14 consecutive study days. Keep it up!', read: false },
      { userId: parent.id, title: 'Mock test result available', body: 'Riya scored 78% in the latest UPSC Prelims mock.', read: false },
      { userId: parent.id, title: 'Health check-in submitted', body: 'Riya submitted her weekly health survey. Risk: LOW.', read: true },
    ],
  })

  const parentToken = await createToken(parent.id, 'PARENT')
  console.log(`✅ Parent: parent@examos.in`)
  console.log(`   Token: ${parentToken.slice(0, 40)}...\n`)

  // ── 4. Coordinator ───────────────────────────────────────────────
  const coordinator = await db.user.create({
    data: {
      email: 'coordinator@examos.in',
      name: 'ExamOS Admin',
      role: 'COORDINATOR',
      supabaseId: `sb-coord-seed-${Date.now()}`,
      isVerified: true,
    },
  })

  const coordToken = await createToken(coordinator.id, 'COORDINATOR')
  console.log(`✅ Coordinator: coordinator@examos.in`)
  console.log(`   Token: ${coordToken.slice(0, 40)}...\n`)

  console.log('─'.repeat(60))
  console.log(`\n🎉 Seed complete! Login with any of these emails via OTP.`)
  console.log(`   The OTP will be printed in the server console when you request it.\n`)
  console.log(`📋 Quick Copy Tokens (paste as sb-access-token cookie for testing):`)
  console.log(`   Student:     ${studentToken}`)
  console.log(`   Teacher:     ${teacherToken}`)
  console.log(`   Parent:      ${parentToken}`)
  console.log(`   Coordinator: ${coordToken}`)
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1) })
