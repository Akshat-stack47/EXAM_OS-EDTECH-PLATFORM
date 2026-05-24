import { db } from '@/lib/db'
import { z } from 'zod'
import { SignJWT } from 'jose'
import { auditLog } from '@/lib/audit'

export const loginSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
})

export type LoginInput = z.infer<typeof loginSchema>

const JWT_SECRET = new TextEncoder().encode(
  process.env.SUPABASE_JWT_SECRET || 'default-secret-change-in-production'
)

const otpStore = new Map<string, { otp: string; expiresAt: Date }>()

export const authService = {
  async sendOtp(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    otpStore.set(email, { otp, expiresAt })
    console.log(`OTP for ${email}: ${otp}`)

    return { success: true, message: 'OTP sent successfully' }
  },

  async login(input: LoginInput) {
    const { email, otp } = input

    const storedOtp = otpStore.get(email)
    if (!storedOtp || storedOtp.otp !== otp || storedOtp.expiresAt < new Date()) {
      await auditLog({ userId: email, action: 'USER_LOGIN_FAILED', metadata: { email, reason: 'INVALID_OTP' } })
      throw new Error('INVALID_OTP')
    }

    otpStore.delete(email)

    let user = await db.user.findUnique({ where: { email }, select: { id: true, email: true, name: true, role: true } })

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name: email.split('@')[0],
          role: 'STUDENT',
          supabaseId: `sb-${Date.now()}`,
        },
        select: { id: true, email: true, name: true, role: true },
      })
      await auditLog({ userId: user.id, action: 'ACCOUNT_CREATED', entityType: 'User', entityId: user.id, metadata: { email: user.email, role: user.role, method: 'LOGIN_AUTO_CREATE' } })
    }

    await auditLog({ userId: user.id, action: 'USER_LOGIN', entityType: 'User', entityId: user.id, metadata: { method: 'OTP' } })

    const token = await new SignJWT({ role: user.role, sub: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  },

  async register(input: { email: string; name: string; role: 'STUDENT' | 'PARENT' | 'TEACHER' }) {
    const { email, name, role } = input

    const existing = await db.user.findUnique({ where: { email }, select: { id: true } })
    if (existing) throw new Error('USER_ALREADY_EXISTS')

    const user = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { email, name, role, supabaseId: `sb-${Date.now()}`, isVerified: true },
        select: { id: true, email: true, name: true, role: true },
      })

      if (role === 'STUDENT') {
        await tx.studentProfile.create({
          data: { userId: newUser.id, targetExam: 'UPSC', targetYear: new Date().getFullYear() + 1, category: 'general' },
          select: { id: true },
        })
      } else if (role === 'PARENT') {
        await tx.parentProfile.create({
          data: { userId: newUser.id, alertPrefs: {} },
          select: { id: true },
        })
      } else if (role === 'TEACHER') {
        await tx.teacherProfile.create({
          data: { userId: newUser.id },
          select: { id: true },
        })
      }

      await auditLog({ userId: newUser.id, action: 'ACCOUNT_CREATED', entityType: 'User', entityId: newUser.id, metadata: { email: newUser.email, role: newUser.role, method: 'REGISTER' } })

      return newUser
    })

    const token = await new SignJWT({ role: user.role, sub: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    return {
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    }
  },

  async getMe(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, avatarUrl: true, isVerified: true },
    })

    if (!user) throw new Error('USER_NOT_FOUND')
    return user
  },
}
