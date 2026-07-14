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

// ─── In-memory OTP store (works in dev; in prod use Redis) ───────────────────
const otpStore = new Map<string, { otp: string; expiresAt: Date }>()

// ─── Send OTP email via Resend ────────────────────────────────────────────────
async function sendOtpEmail(email: string, otp: string): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey || resendApiKey === 'REPLACE_WITH_RESEND_API_KEY') {
    // No email service configured — log to console for dev
    return false
  }

  try {
    const from = process.env.EMAIL_FROM || 'ExamOS <noreply@examos.in>'
    const appName = 'ExamOS'

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your OTP Code</title>
</head>
<body style="margin:0;padding:0;background:#0D0D1A;font-family:'Segoe UI',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0D1A;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#161628;border-radius:16px;border:1px solid rgba(124,58,237,0.25);overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#7C3AED,#06B6D4);padding:2px 0;"></td>
        </tr>
        <tr>
          <td style="padding:36px 40px 0;text-align:center;">
            <div style="font-size:32px;margin-bottom:8px;">🎓</div>
            <h1 style="color:#fff;font-size:22px;font-weight:900;margin:0;letter-spacing:-0.02em;">${appName}</h1>
            <p style="color:rgba(255,255,255,0.45);font-size:13px;margin:6px 0 0;">India's Unified Exam Intelligence Platform</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;">
            <p style="color:rgba(255,255,255,0.75);font-size:15px;line-height:1.6;margin:0 0 24px;">
              Your one-time verification code is:
            </p>
            <!-- OTP Box -->
            <div style="background:rgba(124,58,237,0.12);border:2px solid rgba(124,58,237,0.4);border-radius:12px;padding:28px;text-align:center;margin:0 0 24px;">
              <div style="font-size:48px;font-weight:900;letter-spacing:16px;color:#A78BFA;font-family:monospace;">${otp}</div>
              <p style="color:rgba(255,255,255,0.35);font-size:12px;margin:12px 0 0;letter-spacing:0.05em;">VALID FOR 10 MINUTES · DO NOT SHARE</p>
            </div>
            <p style="color:rgba(255,255,255,0.45);font-size:13px;line-height:1.6;margin:0;">
              Enter this 6-digit code on the login page to access your ${appName} account.
              If you did not request this, you can safely ignore this email.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px 32px;border-top:1px solid rgba(255,255,255,0.06);">
            <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0;text-align:center;">
              © ${new Date().getFullYear()} ${appName} · Secure Authentication
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: `${otp} — Your ${appName} verification code`,
        html,
        text: `Your ${appName} verification code is: ${otp}\n\nThis code is valid for 10 minutes. Do not share it with anyone.`,
      }),
    })

    if (res.ok) {
      console.log(`✉️  OTP email sent to ${email} via Resend`)
      return true
    }
    const body = await res.text()
    console.warn(`⚠️  Resend email failed (${res.status}): ${body}`)
    return false
  } catch (err: any) {
    console.warn(`⚠️  Resend exception: ${err?.message}`)
    return false
  }
}

export const authService = {
  async sendOtp(email: string) {
    // ── Always generate a local 6-digit OTP ────────────────────────────────────
    // We intentionally do NOT use supabase.auth.signInWithOtp because it sends
    // a magic link email ("Your sign-in link") instead of a 6-digit code.
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 min

    otpStore.set(email, { otp, expiresAt })

    // ── Try to send via Resend ─────────────────────────────────────────────────
    const emailSent = await sendOtpEmail(email, otp)

    if (!emailSent) {
      // Dev fallback: log to console
      console.log(`\n🔐 ================================`)
      console.log(`   OTP for ${email}: ${otp}`)
      console.log(`   Expires: ${expiresAt.toLocaleTimeString()}`)
      console.log(`   (Set RESEND_API_KEY in .env to send real emails)`)
      console.log(`🔐 ================================\n`)
    }

    return {
      success: true,
      message: `Verification code sent to ${email}`,
      // In dev without email configured, expose OTP so user can test locally
      devOtp: (!emailSent && process.env.NODE_ENV !== 'production') ? otp : undefined,
    }
  },

  async login(input: LoginInput) {
    const { email, otp } = input

    // ── Verify local OTP ────────────────────────────────────────────────────────
    const storedOtp = otpStore.get(email)
    if (!storedOtp) {
      await auditLog({ userId: email, action: 'USER_LOGIN_FAILED', metadata: { email, reason: 'OTP_NOT_FOUND' } })
      throw new Error('OTP_EXPIRED')
    }
    if (storedOtp.otp !== otp) {
      await auditLog({ userId: email, action: 'USER_LOGIN_FAILED', metadata: { email, reason: 'INVALID_OTP' } })
      throw new Error('INVALID_OTP')
    }
    if (storedOtp.expiresAt < new Date()) {
      otpStore.delete(email)
      await auditLog({ userId: email, action: 'USER_LOGIN_FAILED', metadata: { email, reason: 'OTP_EXPIRED' } })
      throw new Error('OTP_EXPIRED')
    }

    otpStore.delete(email)
    return await authService._getOrCreateUser(email, null)
  },

  /** Internal: find or auto-create a DB user, then issue our JWT */
  async _getOrCreateUser(email: string, supabaseId: string | null) {
    let user = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true },
    })

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name: email.split('@')[0],
          role: 'STUDENT',
          supabaseId: supabaseId ?? `local-${Date.now()}`,
          isVerified: true,
        },
        select: { id: true, email: true, name: true, role: true },
      })
      await auditLog({
        userId: user.id,
        action: 'ACCOUNT_CREATED',
        entityType: 'User',
        entityId: user.id,
        metadata: { email: user.email, role: user.role, method: 'LOGIN_AUTO_CREATE' },
      })
    } else {
      await auditLog({
        userId: user.id,
        action: 'USER_LOGIN',
        entityType: 'User',
        entityId: user.id,
        metadata: { method: 'OTP' },
      })
    }

    const token = await new SignJWT({ role: user.role, sub: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    return { success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } }
  },

  async register(input: {
    email: string; name: string; role: 'STUDENT' | 'PARENT' | 'TEACHER' | 'COORDINATOR'
    targetExam?: string; targetYear?: number; category?: string
  }) {
    const { email, name, role, targetExam, targetYear, category } = input

    const existing = await db.user.findUnique({ where: { email }, select: { id: true } })
    if (existing) throw new Error('USER_ALREADY_EXISTS')

    const user = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { email, name, role, supabaseId: `local-${Date.now()}`, isVerified: true },
        select: { id: true, email: true, name: true, role: true },
      })

      if (role === 'STUDENT') {
        await tx.studentProfile.create({
          data: {
            userId: newUser.id,
            targetExam: (targetExam as any) ?? 'UPSC',
            targetYear: targetYear ?? (new Date().getFullYear() + 1),
            category: category ?? 'general',
          },
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
      // COORDINATOR: role field on User is the authority

      await auditLog({
        userId: newUser.id,
        action: 'ACCOUNT_CREATED',
        entityType: 'User',
        entityId: newUser.id,
        metadata: { email: newUser.email, role: newUser.role, method: 'REGISTER' },
      })

      return newUser
    })

    const token = await new SignJWT({ role: user.role, sub: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    return { success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } }
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
