'use client'
import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createSupabaseBrowserClient()
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (err) { setError(err.message); setLoading(false); return }
    setDone(true)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080A0E', padding: '24px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>📧</div>
            <h2 style={{ fontSize: '20px', marginBottom: '10px', fontFamily: 'Outfit, sans-serif', color: '#F0F0F0' }}>Check your email</h2>
            <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
              We sent a password reset link to <strong style={{ color: '#F0F0F0' }}>{email}</strong>. Click the link in the email to reset your password.
            </p>
            <Link href="/sign-in" style={{ color: '#AAFF00', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Back to sign in</Link>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px', textDecoration: 'none' }}>
                <div style={{ width: '32px', height: '32px', background: '#AAFF00', borderRadius: '8px', fontWeight: 900, fontSize: '16px', color: '#080A0E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>Q</div>
                <span style={{ fontWeight: 700, fontSize: '18px', fontFamily: 'Outfit, sans-serif', color: '#F0F0F0' }}>Questme<span style={{ color: '#AAFF00' }}>.ai</span></span>
              </Link>
              <h1 style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: '#F0F0F0' }}>Forgot password?</h1>
              <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '6px' }}>Enter your email and we will send you a reset link</p>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input className="input" type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} required />
              {error && <div style={{ fontSize: '13px', color: '#f87171', background: '#1f0a0a', border: '1px solid #3d1515', borderRadius: '8px', padding: '10px 14px' }}>{error}</div>}
              <button className="btn-accent" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Sending...' : 'Send reset link →'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#6B7280' }}>
              Remember your password? <Link href="/sign-in" style={{ color: '#AAFF00', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
