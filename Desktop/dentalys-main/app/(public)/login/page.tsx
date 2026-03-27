// app/(public)/login/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Check, AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen">
      {/* LEFT — dark panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-[#0b7b6b] to-[#0ea895] p-12 lg:flex">
        <Link
          href="/"
          className="text-[15px] font-medium tracking-[-0.3px] text-white"
        >
          dentalys.ai
        </Link>
        <div>
          <h2 className="mb-6 text-[28px] font-medium leading-tight tracking-[-0.5px] text-white">
            Your AI receptionist
            <br />
            is waiting.
          </h2>
          <ul className="space-y-3">
            {[
              '24/7 patient booking on Telegram',
              'Auto-reminders reduce no-shows by 60%',
              'Setup in under 10 minutes',
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
            Welcome back
          </h1>
          <p className="mb-8 text-[14px] text-stone-500">
            Sign in to your clinic dashboard
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
                placeholder="••••••••"
                className="w-full"
                autoComplete="current-password"
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
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-[13px]">
            <button
              type="button"
              className="text-stone-500 hover:text-stone-700 transition-colors"
            >
              Forgot password?
            </button>
            <Link
              href="/signup"
              className="font-medium text-teal-600 hover:text-teal-700 transition-colors"
            >
              Sign up free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
