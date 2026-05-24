import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve('C:\\Users\\ashua\\OneDrive\\ドキュメント\\Desktop\\Exam_Os\\.env') })

import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const url = new URL(process.env.DATABASE_URL!)
const pool = new Pool({
  host: url.hostname,
  port: parseInt(url.port),
  database: url.pathname.slice(1),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  ssl: { rejectUnauthorized: false },
})
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

const EXAMS = [
  { examName: 'UPSC Civil Services', examYear: 2024, stage: 'Prelims', general: 98.5, obc: 95.2, sc: 87.8, st: 82.4, ews: 91.3, pwd: 72.1, totalMarks: 200 },
  { examName: 'UPSC Civil Services', examYear: 2024, stage: 'Mains', general: 752, obc: 720, sc: 698, st: 675, ews: 710, pwd: 645, totalMarks: 1750 },
  { examName: 'UPSC Civil Services', examYear: 2023, stage: 'Prelims', general: 95.2, obc: 91.8, sc: 84.5, st: 79.2, ews: 88.4, pwd: 68.9, totalMarks: 200 },
  { examName: 'SSC CGL', examYear: 2024, stage: 'Tier 1', general: 148.5, obc: 141.2, sc: 132.8, st: 126.4, ews: 137.6, pwd: 112.3, totalMarks: 200 },
  { examName: 'SSC CGL', examYear: 2023, stage: 'Tier 1', general: 145.2, obc: 138.6, sc: 130.1, st: 124.8, ews: 134.9, pwd: 108.7, totalMarks: 200 },
  { examName: 'IBPS PO', examYear: 2024, stage: 'Prelims', general: 58.5, obc: 55.2, sc: 48.8, st: 44.6, ews: 52.4, pwd: 38.1, totalMarks: 100 },
  { examName: 'IBPS PO', examYear: 2023, stage: 'Prelims', general: 56.8, obc: 53.4, sc: 46.2, st: 42.1, ews: 50.7, pwd: 35.9, totalMarks: 100 },
  { examName: 'IBPS Clerk', examYear: 2024, stage: 'Prelims', general: 72.5, obc: 68.3, sc: 61.8, st: 57.2, ews: 65.4, pwd: 48.6, totalMarks: 100 },
  { examName: 'RRB NTPC', examYear: 2024, stage: 'CBT 1', general: 65.3, obc: 61.8, sc: 55.4, st: 51.2, ews: 59.6, pwd: 42.8, totalMarks: 100 },
  { examName: 'UPSC CAPF', examYear: 2024, stage: 'Written', general: 285, obc: 272, sc: 258, st: 245, ews: 264, pwd: 228, totalMarks: 500 },
  { examName: 'JEE Advanced', examYear: 2024, stage: 'Final', general: 98, obc: 79, sc: 58, st: 44, ews: 85, pwd: 38, totalMarks: 360 },
  { examName: 'NEET UG', examYear: 2024, stage: 'Final', general: 720, obc: 680, sc: 640, st: 615, ews: 695, pwd: 580, totalMarks: 720 },
  { examName: 'NEET UG', examYear: 2023, stage: 'Final', general: 715, obc: 672, sc: 635, st: 608, ews: 688, pwd: 572, totalMarks: 720 },
  { examName: 'UPSC EPFO', examYear: 2024, stage: 'Prelims', general: 82.5, obc: 78.4, sc: 72.1, st: 68.5, ews: 75.8, pwd: 58.2, totalMarks: 150 },
]

async function main() {
  console.log('Seeding exam cutoff data...')

  for (const exam of EXAMS) {
    await db.examCutoff.upsert({
      where: { examName_examYear_stage: { examName: exam.examName, examYear: exam.examYear, stage: exam.stage } },
      update: exam,
      create: exam,
    })
  }

  console.log(`Seeded ${EXAMS.length} exam cutoff records`)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
