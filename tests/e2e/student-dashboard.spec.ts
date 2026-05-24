import { test, expect } from '@playwright/test'

test.describe('Student Dashboard', () => {
  test.use({ storageState: '.auth/student.json' })

  test('displays student overview', async ({ page }) => {
    await page.goto('/dashboard/student')
    await expect(page.locator('[data-testid="student-overview"]')).toBeVisible()
    await expect(page.locator('[data-testid="upcoming-exams"]')).toBeVisible()
    await expect(page.locator('[data-testid="recent-scores"]')).toBeVisible()
  })

  test('can navigate to exam attempt', async ({ page }) => {
    await page.goto('/dashboard/student')
    await page.locator('[data-testid="start-exam"]').first().click()
    await expect(page).toHaveURL(/\/exam\//)
  })

  test('shows performance analytics', async ({ page }) => {
    await page.goto('/dashboard/student')
    await page.locator('[data-testid="analytics-tab"]').click()
    await expect(page.locator('[data-testid="performance-chart"]')).toBeVisible()
  })
})
