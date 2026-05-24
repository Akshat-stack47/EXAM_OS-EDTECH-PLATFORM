import http from 'k6/http'
import { check, sleep, group } from 'k6'
import { Rate, Trend } from 'k6/metrics'

const errorRate = new Rate('errors')
const healthLatency = new Trend('health_latency')
const loginLatency = new Trend('login_latency')

export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    errors: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'],
    health_latency: ['p(95)<500'],
  },
}

const BASE_URL = __ENV.BASE_URL || 'https://staging.examos.app'

export default function () {
  group('health endpoint', () => {
    const res = http.get(`${BASE_URL}/health`)
    healthLatency.add(res.timings.duration)
    const ok = check(res, {
      'health status is 200': (r) => r.status === 200,
      'health response has healthy status': (r) => r.json('status') === 'healthy',
    })
    errorRate.add(!ok)
  })

  group('login page', () => {
    const res = http.get(`${BASE_URL}/login`)
    loginLatency.add(res.timings.duration)
    const ok = check(res, {
      'login page loads': (r) => r.status === 200,
    })
    errorRate.add(!ok)
  })

  sleep(1)
}
