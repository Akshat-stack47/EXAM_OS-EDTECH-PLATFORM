'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { trpc } from '@/lib/trpc'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { setAuthCookie } from './actions'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits').optional(),
})

export default function LoginPageClient() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')

  const sendOtp = trpc.auth.sendOtp.useMutation()
  const login = trpc.auth.login.useMutation()

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    if (step === 'email') {
      await sendOtp.mutateAsync({ email: data.email })
      setEmail(data.email)
      setStep('otp')
    } else {
      if (!data.otp) return
      const result = await login.mutateAsync({ email, otp: data.otp })
      if (result.success) {
        await setAuthCookie(result.token)
        router.push(`/${result.user.role.toLowerCase()}/dashboard`)
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input {...register('email')} placeholder="Email" type="email" disabled={step === 'otp'} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            
            {step === 'otp' && (
              <>
                <Input {...register('otp')} placeholder="OTP" type="text" maxLength={6} />
                {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}
              </>
            )}

            <Button type="submit" className="w-full" disabled={sendOtp.isPending || login.isPending}>
              {step === 'email' 
                ? (sendOtp.isPending ? 'Sending...' : 'Send OTP') 
                : (login.isPending ? 'Verifying...' : 'Verify & Login')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
