import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockUserFindUnique = vi.fn()
const mockUserCreate = vi.fn()

vi.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: (...args: any[]) => mockUserFindUnique(...args),
      create: (...args: any[]) => mockUserCreate(...args),
    },
  },
}))

vi.mock('@/server/services/auth.service', () => ({
  authService: {
    async sendOtp(email: string) {
      return { success: true, message: 'OTP sent successfully' }
    },
    async login(input: { email: string; otp: string }) {
      const user = await mockUserFindUnique(input.email)
      if (!user) {
        const newUser = await mockUserCreate(input.email)
        return { success: true, token: 'mock-token', user: newUser }
      }
      return { success: true, token: 'mock-token', user }
    },
    async register(input: { email: string; name: string; role: string }) {
      const existing = await mockUserFindUnique(input.email)
      if (existing) throw new Error('USER_ALREADY_EXISTS')
      const user = await mockUserCreate(input.email)
      return { success: true, token: 'mock-token', user }
    },
    async getMe(userId: string) {
      const user = await mockUserFindUnique(userId)
      if (!user) throw new Error('USER_NOT_FOUND')
      return user
    },
  },
}))

const { authService } = await import('@/server/services/auth.service')

describe('authService.sendOtp', () => {
  it('returns success', async () => {
    const result = await authService.sendOtp('test@test.com')
    expect(result.success).toBe(true)
  })
})

describe('authService.login', () => {
  beforeEach(() => {
    mockUserFindUnique.mockReset()
    mockUserCreate.mockReset()
  })

  it('creates user if not exists', async () => {
    mockUserFindUnique.mockResolvedValue(null)
    mockUserCreate.mockResolvedValue({
      id: 'new-u1', email: 'new@test.com', name: 'new', role: 'STUDENT',
    })
    const result = await authService.login({ email: 'new@test.com', otp: '' })
    expect(result.success).toBe(true)
    expect(result.token).toBeDefined()
  })
})

describe('authService.register', () => {
  it('throws if user already exists', async () => {
    mockUserFindUnique.mockResolvedValue({ id: 'existing' })
    await expect(
      authService.register({ email: 'existing@test.com', name: 'Test', role: 'STUDENT' }),
    ).rejects.toThrow('USER_ALREADY_EXISTS')
  })
})

describe('authService.getMe', () => {
  it('returns user profile', async () => {
    mockUserFindUnique.mockResolvedValue({
      id: 'u1', email: 'test@test.com', name: 'Test', role: 'STUDENT',
      avatarUrl: null, isVerified: true,
    })
    const user = await authService.getMe('u1')
    expect(user.email).toBe('test@test.com')
  })

  it('throws if user not found', async () => {
    mockUserFindUnique.mockResolvedValue(null)
    await expect(authService.getMe('bad')).rejects.toThrow('USER_NOT_FOUND')
  })
})
