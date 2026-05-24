import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('login page renders', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'invalid@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Invalid')).toBeVisible({ timeout: 10000 })
  })

  test('redirects authenticated user to dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@examos.app')
    await page.fill('input[type="password"]', 'test-password-123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 })
  })
})
