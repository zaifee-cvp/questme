'use client'
import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import Link from 'next/link'
export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createSupabaseBrowserClient()
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    if (data.session) {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080A0E', padding: '24px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', background: '#AAFF00', borderRadius: '8px', fontWeight: 900, fontSize: '16px', color: '#080A0E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>Q</div>
            <span style={{ fontWeight: 700, fontSize: '18px', fontFamily: 'Outfit, sans-serif', color: '#F0F0F0' }}>Questme<span style={{ color: '#AAFF00' }}>.ai</span></span>
          </Link>
          <h1 style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>Sign in</h1>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input className="input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <div style={{ textAlign: 'right', marginTop: '-8px' }}>
              <Link href="/forgot-password" style={{ fontSize: '13px', color: '#AAFF00', textDecoration: 'none' }}>Forgot password?</Link>
            </div>
          {error && <div style={{ fontSize: '13px', color: '#f87171', background: '#1f0a0a', border: '1px solid #3d1515', borderRadius: '8px', padding: '10px 14px' }}>{error}</div>}
          <button className="btn-accent" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#6B7280' }}>
          No account? <Link href="/sign-up" style={{ color: '#AAFF00', textDecoration: 'none', fontWeight: 600 }}>Sign up free</Link>
        </p>
      </div>
    </div>
  )
}
