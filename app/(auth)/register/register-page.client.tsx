'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { setAuthCookie } from '../login/actions'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
})

const ROLES = [
  { value: 'STUDENT', label: 'Student', desc: 'Prepare for exams with AI-powered tools', color: 'bg-gray-900 hover:bg-gray-800' },
  { value: 'PARENT', label: 'Parent', desc: 'Track your child\'s progress and performance', color: 'bg-[#E88D2A] hover:bg-[#D67A1E]' },
  { value: 'TEACHER', label: 'Teacher', desc: 'Manage classes and mentor students', color: 'bg-[#1B3A5C] hover:bg-[#2C5F8A]' },
] as const

export default function RegisterPageClient() {
  const router = useRouter()
  const [step, setStep] = useState<'role' | 'details'>('role')
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [error, setError] = useState('')

  const register = trpc.auth.register.useMutation()

  const { register: reg, handleSubmit, formState: { errors } } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    if (!selectedRole) return
    setError('')
    try {
      const result = await register.mutateAsync({
        name: data.name,
        email: data.email,
        role: selectedRole as 'STUDENT' | 'PARENT' | 'TEACHER',
      })
      await setAuthCookie(result.token)
      router.push(`/${result.user.role.toLowerCase()}/dashboard`)
    } catch (e: any) {
      setError(e.message === 'USER_ALREADY_EXISTS' ? 'An account with this email already exists' : 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {step === 'role' ? 'Choose Your Role' : 'Create Your Account'}
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            {step === 'role' ? 'Select how you\'ll use ExamOS' : 'Fill in your details to get started'}
          </p>
        </CardHeader>
        <CardContent>
          {step === 'role' ? (
            <div className="space-y-3">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => { setSelectedRole(r.value); setStep('details') }}
                  className={`w-full p-4 rounded-xl text-white text-left transition-all ${r.color} ${selectedRole === r.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                >
                  <div className="font-bold">{r.label}</div>
                  <div className="text-xs opacity-80 mt-0.5">{r.desc}</div>
                </button>
              ))}
              <p className="text-xs text-gray-400 text-center pt-2">
                Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input {...reg('name')} placeholder="Full Name" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Input {...reg('email')} placeholder="Email Address" type="email" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
              <Button type="submit" className="w-full" disabled={register.isPending}>
                {register.isPending ? 'Creating account...' : `Create ${selectedRole?.toLowerCase()} account`}
              </Button>
              <button type="button" onClick={() => setStep('role')} className="w-full text-sm text-gray-500 hover:text-gray-700">
                Back to role selection
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
