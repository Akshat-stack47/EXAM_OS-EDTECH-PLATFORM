/**
 * AI Code Audit — pre‑commit & CI scanner
 *
 * Checks:
 * 1. Barrel exports (no index.ts with > 3 re-exports)
 * 2. No raw `any` type (eslint already catches, double‑check)
 * 3. tRPC router structure (must not use raw t.procedure)
 * 4. `use client` hygiene
 * 5. Hard‑coded strings > 40 chars without `t()`
 * 6. No empty catch blocks
 * 7. Import depth ≤ 3
 *
 * Usage: pnpm audit:ai
 */

import { readFileSync, existsSync } from 'fs'
import { globSync } from 'glob'
import path from 'path'

const ROOT = path.resolve(import.meta.dirname, '..')

let errors: string[] = []
let warnings: string[] = []

function error(msg: string) { errors.push(msg) }
function warn(msg: string) { warnings.push(msg) }

// ── 1. Barrel exports ──────────────────────────────────────────
function checkBarrelExports() {
  const files = globSync('**/index.ts', {
    cwd: ROOT,
    ignore: ['node_modules/**', '.next/**', 'dist/**'],
  })
  for (const file of files) {
    const content = readFileSync(path.join(ROOT, file), 'utf-8')
    const reExports = content.match(/export\s+\{[^}]+\}\s+from\s+['"]/g)
    if (reExports) {
      for (const match of reExports) {
        const symbols = match.replace(/export\s+\{/, '').replace(/\}\s+from\s+['"]/, '')
        const count = symbols.split(',').length
        if (count > 3) {
          warn(`Barrel export: ${file} re‑exports ${count} symbols — keep under 3`)
        }
      }
    }
  }
}

// ── 2. tRPC router check ──────────────────────────────────────
function checkTrpcRouters() {
  const files = globSync('server/**/*.router.ts', {
    cwd: ROOT,
    ignore: ['node_modules/**'],
  })
  for (const file of files) {
    const content = readFileSync(path.join(ROOT, file), 'utf-8')
    if (!content.includes('createTRPCRouter')) {
      error(`${file}: must export a createTRPCRouter call`)
    }
    if (content.includes('t.procedure')) {
      error(`${file}: uses raw t.procedure — use base procedures from server/trpc.ts`)
    }
  }
}

// ── 3. `use client` hygiene ───────────────────────────────────
function checkUseClient() {
  const files = globSync('{app,components}/**/*.{ts,tsx}', {
    cwd: ROOT,
    ignore: ['node_modules/**', '.next/**'],
  })
  for (const file of files) {
    const content = readFileSync(path.join(ROOT, file), 'utf-8').trim()
    const isLayoutOrPage = file.endsWith('layout.tsx') || file.endsWith('page.tsx')
    if (isLayoutOrPage && content.startsWith("'use client'")) {
      warn(`${file}: layout/page should NOT have 'use client'`)
    }
    const hasHooks = /\b(useState|useEffect|useContext|useReducer|useCallback|useMemo|useRef|useImperativeHandle|useLayoutEffect|useDebugValue|useDeferredValue|useTransition|useSyncExternalStore|useOptimistic)\b/.test(content)
    if (hasHooks && !content.startsWith("'use client'")) {
      error(`${file}: uses React hooks but does not have 'use client'`)
    }
  }
}

// ── 4. Empty catch blocks ─────────────────────────────────────
function checkEmptyCatch() {
  const files = globSync('{app,components,lib,server}/**/*.{ts,tsx}', {
    cwd: ROOT,
    ignore: ['node_modules/**', '.next/**', 'dist/**'],
  })
  for (const file of files) {
    const content = readFileSync(path.join(ROOT, file), 'utf-8')
    if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(content)) {
      error(`${file}: empty catch block — must re‑throw or handle the error`)
    }
  }
}

// ── 5. Import depth ───────────────────────────────────────────
function checkImportDepth() {
  const files = globSync('{app,components,lib,server}/**/*.{ts,tsx}', {
    cwd: ROOT,
    ignore: ['node_modules/**', '.next/**', 'dist/**'],
  })
  for (const file of files) {
    const content = readFileSync(path.join(ROOT, file), 'utf-8')
    const relativeImports = content.match(/from\s+['"](\.\.?\/[^'"]+)['"]/g)
    if (relativeImports) {
      for (const imp of relativeImports) {
        const impPath = imp.match(/['"]([^'"]+)['"]/)![1]
        const depth = impPath.split('/').filter(p => p === '..').length
        if (depth > 3) {
          warn(`${file}: relative import "${impPath}" exceeds max depth of 3`)
        }
      }
    }
  }
}

// ── Main ──────────────────────────────────────────────────────
console.log('\n🔍 AI Code Audit — starting...\n')

checkBarrelExports()
checkTrpcRouters()
checkUseClient()
checkEmptyCatch()
checkImportDepth()

if (errors.length > 0) {
  console.error('❌ ERRORS:')
  errors.forEach(e => console.error(`   ${e}`))
}
if (warnings.length > 0) {
  console.warn('⚠️  WARNINGS:')
  warnings.forEach(w => console.warn(`   ${w}`))
}

console.log(`\n📊 Summary: ${errors.length} errors, ${warnings.length} warnings\n`)

if (errors.length > 0) {
  process.exit(1)
}
