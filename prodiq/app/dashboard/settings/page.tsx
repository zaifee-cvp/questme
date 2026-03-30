'use client'
import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const router = useRouter()

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.updateUser({ password })
    setMsg(error ? error.message : 'Password updated successfully!')
    setSaving(false); setPassword('')
  }

  async function signOut() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div style={{ maxWidth: '480px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>Settings</h1>
      </div>
      <div className="card" style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>Change password</h3>
        <form onSubmit={updatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input className="input" type="password" placeholder="New password (8+ characters)" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
          {msg && <div style={{ fontSize: '13px', color: msg.includes('success') ? '#4ade80' : '#f87171' }}>{msg}</div>}
          <button className="btn-accent" type="submit" disabled={saving} style={{ width: 'fit-content' }}>{saving ? 'Saving...' : 'Update password'}</button>
        </form>
      </div>
      <div className="card">
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>Sign out</h3>
        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '14px' }}>You will be redirected to the homepage.</p>
        <button className="btn-ghost" onClick={signOut}>Sign out</button>
      </div>
    </div>
  )
}
