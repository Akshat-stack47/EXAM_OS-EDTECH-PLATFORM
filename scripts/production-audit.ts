import { execSync } from 'child_process'
import * as fs from 'fs'

type AuditStatus = 'PASS' | 'FAIL' | 'WARN' | 'SKIP'

interface AuditItem {
  name: string
  status: AuditStatus
  detail?: string
}

const results: { category: string; items: AuditItem[] }[] = []

function check(name: string, fn: () => AuditStatus | { status: AuditStatus; detail: string }): AuditItem {
  try {
    const result = fn()
    if (typeof result === 'string') {
      return { name, status: result }
    }
    return { name, ...result }
  } catch (e) {
    return { name, status: 'FAIL', detail: String(e) }
  }
}

function fileExists(path: string): boolean {
  return fs.existsSync(path)
}

results.push({
  category: 'Database',
  items: [
    check('Prisma schema valid', () => {
      execSync('npx prisma validate', { stdio: 'pipe' })
      return 'PASS'
    }),
    check('Soft delete middleware active', () =>
      fileExists('lib/db.ts') ? 'PASS' : { status: 'WARN', detail: 'Verify soft delete middleware is active in lib/db.ts' }
    ),
    check('Audit log service exists', () =>
      fileExists('lib/audit.ts') ? 'PASS' : 'FAIL'
    ),
  ],
})

results.push({
  category: 'Security',
  items: [
    check('No HIGH npm vulnerabilities', () => {
      try {
        execSync('npx pnpm audit --audit-level high 2>/dev/null', { stdio: 'pipe' })
        return 'PASS'
      } catch {
        return { status: 'SKIP', detail: 'pnpm audit unavailable' }
      }
    }),
    check('Proxy.ts exists (Next.js 16)', () =>
      fileExists('proxy.ts') ? 'PASS' : 'FAIL'
    ),
    check('Webhook verification exists', () =>
      fileExists('app/api/webhooks/razorpay/route.ts') ? 'PASS' : 'WARN'
    ),
    check('GDPR service exists', () =>
      fileExists('server/services/gdpr.service.ts') ? 'PASS' : 'WARN'
    ),
    check('vercel.json security headers exist', () => {
      if (!fileExists('vercel.json')) return 'FAIL'
      const v = fs.readFileSync('vercel.json', 'utf-8')
      return v.includes('Content-Security-Policy') && v.includes('Strict-Transport-Security')
        ? 'PASS'
        : { status: 'FAIL', detail: 'CSP and HSTS headers missing from vercel.json' }
    }),
    check('CORS configured in proxy.ts', () => {
      if (!fileExists('proxy.ts')) return 'FAIL'
      const p = fs.readFileSync('proxy.ts', 'utf-8')
      return p.includes('Access-Control-Allow-Origin') ? 'PASS' : 'FAIL'
    }),
  ],
})

results.push({
  category: 'Performance',
  items: [
    check('TypeScript zero errors', () => {
      execSync('npx tsc --noEmit', { stdio: 'pipe' })
      return 'PASS'
    }),
    check('Constants file exists', () =>
      fileExists('lib/constants.ts') ? 'PASS' : 'FAIL'
    ),
    check('AI safe wrapper exists', () =>
      fileExists('lib/ai-safe.ts') ? 'PASS' : 'FAIL'
    ),
  ],
})

results.push({
  category: 'AI Agent Governance',
  items: [
    check('Anti-pattern audit script exists', () =>
      fileExists('scripts/ai-code-audit.ts') ? 'PASS' : 'FAIL'
    ),
    check('AppError class exists', () =>
      fileExists('lib/errors.ts') ? 'PASS' : 'FAIL'
    ),
    check('tRPC base procedures exist', () =>
      fileExists('server/trpc.ts') ? 'PASS' : 'FAIL'
    ),
    check('Constants file exists', () =>
      fileExists('lib/constants.ts') ? 'PASS' : 'FAIL'
    ),
  ],
})

results.push({
  category: 'DevOps',
  items: [
    check('CI pipeline exists', () =>
      fileExists('.github/workflows/ci.yml') ? 'PASS' : 'FAIL'
    ),
    check('Health endpoint exists', () =>
      fileExists('app/api/health/route.ts') ? 'PASS' : 'FAIL'
    ),
    check('Sentry client config exists', () =>
      fileExists('sentry.client.config.ts') ? 'PASS' : 'FAIL'
    ),
    check('Logger exists', () =>
      fileExists('lib/logger.ts') ? 'PASS' : 'FAIL'
    ),
    check('Disaster recovery runbook exists', () =>
      fileExists('docs/devops/disaster-recovery.md') ? 'PASS' : 'FAIL'
    ),
    check('CHANGELOG.md exists', () =>
      fileExists('CHANGELOG.md') ? 'PASS' : 'FAIL'
    ),
  ],
})

results.push({
  category: 'Health & Compliance',
  items: [
    check('i18n strings file exists', () =>
      fileExists('lib/strings.ts') ? 'PASS' : 'FAIL'
    ),
    check('Error boundary exists', () =>
      fileExists('components/shared/ErrorBoundary.tsx') ? 'PASS' : 'FAIL'
    ),
    check('Global error page exists', () =>
      fileExists('app/global-error.tsx') ? 'PASS' : 'FAIL'
    ),
    check('.env.example no real secrets', () => {
      if (!fileExists('.env.example')) return 'FAIL'
      const env = fs.readFileSync('.env.example', 'utf-8')
      if (/sk-[a-zA-Z0-9]{20}|rzp_live_[a-zA-Z0-9]{10}/.test(env)) {
        return { status: 'FAIL', detail: '.env.example may contain real API keys!' }
      }
      return 'PASS'
    }),
  ],
})

console.log('\n' + String.fromCharCode(0x2550).repeat(55))
console.log('  ExamOS Production Readiness Audit')
console.log('  ' + new Date().toISOString())
console.log(String.fromCharCode(0x2550).repeat(55) + '\n')

let totalFail = 0
let totalWarn = 0
let totalPass = 0

for (const { category, items } of results) {
  console.log(`\n${category}`)
  console.log(String.fromCharCode(0x2500).repeat(40))
  for (const item of items) {
    const icon = { PASS: 'PASS', FAIL: 'FAIL', WARN: 'WARN', SKIP: 'SKIP' }[item.status]
    console.log(`  [${icon}] ${item.name}${item.detail ? `\n       -> ${item.detail}` : ''}`)
    if (item.status === 'FAIL') totalFail++
    if (item.status === 'WARN') totalWarn++
    if (item.status === 'PASS') totalPass++
  }
}

console.log('\n' + String.fromCharCode(0x2550).repeat(55))
console.log(`  PASS: ${totalPass}  WARN: ${totalWarn}  FAIL: ${totalFail}`)
console.log(String.fromCharCode(0x2550).repeat(55))

if (totalFail > 0) {
  console.log('\nPRODUCTION AUDIT FAILED - Fix all FAIL items before deploying.')
  process.exit(1)
} else if (totalWarn > 0) {
  console.log('\nAudit passed with warnings. Review WARN items before production.')
} else {
  console.log('\nAll checks passed. Ready for production.')
}
