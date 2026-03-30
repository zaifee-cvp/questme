'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signupSchema, type SignupInput } from '@/schemas'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, FormField } from '@/components/ui'

export default function SignupInner() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupInput) => {
    setServerError(null)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (!result.success) { setServerError(result.error); return }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (signInError) { router.push('/auth/login?message=account_created'); return }
      router.push('/dashboard')
      router.refresh()
    } catch {
      setServerError('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-[#1e3a5f] mb-4">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
          <p className="text-gray-500 mt-1 text-sm">Get started with FieldService Platform</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField label="Company Name" required error={errors.company_name?.message}>
              <Input type="text" placeholder="Acme Services Pte Ltd" {...register('company_name')} error={errors.company_name?.message} />
            </FormField>
            <FormField label="Your Name" required error={errors.name?.message}>
              <Input type="text" placeholder="John Smith" {...register('name')} error={errors.name?.message} />
            </FormField>
            <FormField label="Email Address" required error={errors.email?.message}>
              <Input type="email" placeholder="john@acmeservices.com" autoComplete="email" {...register('email')} error={errors.email?.message} />
            </FormField>
            <FormField label="Password" required error={errors.password?.message} hint="Minimum 8 characters">
              <Input type="password" placeholder="Create a strong password" autoComplete="new-password" {...register('password')} error={errors.password?.message} />
            </FormField>
            {serverError && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-700">{serverError}</p>
              </div>
            )}
            <Button type="submit" className="w-full" loading={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#1e3a5f] font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
