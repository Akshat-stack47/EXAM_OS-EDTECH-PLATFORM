import { test, expect } from '@playwright/test'

test.describe('API Health', () => {
  test('health endpoint returns 200', async ({ request }) => {
    const response = await request.get('/health')
    expect(response.ok()).toBeTruthy()
    const body = await response.json()
    expect(body).toHaveProperty('status', 'healthy')
    expect(body).toHaveProperty('checks')
    expect(body.checks).toHaveProperty('database')
    expect(body.checks.database).toHaveProperty('status', 'healthy')
  })

  test('health endpoint has required fields', async ({ request }) => {
    const response = await request.get('/health')
    const body = await response.json()
    expect(body).toHaveProperty('timestamp')
    expect(body).toHaveProperty('latency')
    expect(typeof body.latency).toBe('number')
  })
})
