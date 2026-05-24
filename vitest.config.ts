import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
      include: ['lib/**', 'server/**', 'components/**'],
      exclude: ['node_modules', '.next', 'dist', 'coverage'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
})
