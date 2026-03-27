// app/(public)/signup/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Check, AlertCircle, Loader2 } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${appUrl}/onboarding`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/onboarding')
  }

  return (
    <div className="flex min-h-screen">
      {/* LEFT — gradient panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-[#0b7b6b] to-[#0ea895] p-12 lg:flex">
        <Link
          href="/"
          className="text-[15px] font-medium tracking-[-0.3px] text-white"
        >
          dentalys.ai
        </Link>
        <div>
          <h2 className="mb-6 text-[28px] font-medium leading-tight tracking-[-0.5px] text-white">
            Automate your
            <br />
            clinic&rsquo;s front desk
          </h2>
          <ul className="space-y-3">
            {[
              'AI answers patient questions 24/7',
              'Automatic booking & reminders',
              'Telegram bot — instant setup',
              'Works for clinics in any country',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/25">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-[14px] text-white/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[12px] text-white/50">
          &copy; 2025 dentalys.ai
        </p>
      </div>

      {/* RIGHT — form */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link
              href="/"
              className="text-[15px] font-medium tracking-[-0.3px] text-stone-800"
            >
              dentalys.ai
            </Link>
          </div>
          <h1 className="mb-2 text-[28px] font-medium tracking-[-0.5px] text-stone-900">
            Create your account
          </h1>
          <p className="mb-8 text-[14px] text-stone-500">
            14-day free trial · No credit card required
          </p>

          {error && (
            <div
              className="mb-6 flex items-center gap-2.5 rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-700"
              style={{ border: '0.5px solid #fecaca' }}
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="mb-1.5 block text-[13px] font-medium text-stone-700"
              >
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Jane Smith"
                className="w-full"
                autoComplete="name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[13px] font-medium text-stone-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@clinic.com"
                className="w-full"
                autoComplete="email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[13px] font-medium text-stone-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full"
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 text-[14px] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-stone-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-teal-600 hover:text-teal-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
