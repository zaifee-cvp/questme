'use client'
import { useState, useEffect } from 'react'
import { Plus, Settings, Trash2, ExternalLink, Bot } from 'lucide-react'
import Link from 'next/link'

interface BotData { id: string; name: string; is_active: boolean; chat_count: number; color: string }

export default function DashboardPage() {
  const [bots, setBots] = useState<BotData[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newBotName, setNewBotName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { fetchBots() }, [])

  async function fetchBots() {
    const res = await fetch('/api/bots')
    const data = await res.json()
    if (Array.isArray(data)) setBots(data)
    setLoading(false)
  }

  async function createBot(e: React.FormEvent) {
    e.preventDefault()
    if (!newBotName.trim()) return
    setCreating(true); setError('')
    const res = await fetch('/api/bots', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newBotName.trim() }) })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Failed'); setCreating(false); return }
    setBots(prev => [data, ...prev])
    setNewBotName(''); setShowCreate(false); setCreating(false)
  }

  async function deleteBot(id: string) {
    if (!confirm('Delete this bot? This removes all its knowledge and chat history.')) return
    await fetch(`/api/bots/${id}`, { method: 'DELETE' })
    setBots(prev => prev.filter(b => b.id !== id))
  }

  if (loading) return <div style={{ color: '#6B7280', textAlign: 'center', padding: '60px' }}>Loading...</div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>My Bots</h1>
          <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>{bots.length} bot{bots.length !== 1 ? 's' : ''} active</p>
        </div>
        <button className="btn-accent" onClick={() => setShowCreate(true)}><Plus size={16} />New bot</button>
      </div>

      {showCreate && (
        <div className="card" style={{ marginBottom: '20px', borderColor: '#AAFF0040' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '14px', fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>Create new bot</h3>
          <form onSubmit={createBot} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <input className="input" style={{ maxWidth: '320px' }} placeholder="Bot name (e.g. Store Support Bot)" value={newBotName} onChange={e => setNewBotName(e.target.value)} required />
            {error && <div style={{ width: '100%', fontSize: '13px', color: '#f87171' }}>{error}</div>}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-accent" type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create bot'}</button>
              <button className="btn-ghost" type="button" onClick={() => { setShowCreate(false); setError('') }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {bots.map(bot => (
          <div key={bot.id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', background: bot.color || '#AAFF00', borderRadius: '12px', fontWeight: 900, fontSize: '18px', color: '#080A0E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', flexShrink: 0 }}>
                {bot.name[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bot.name}</div>
                <div style={{ fontSize: '12px', color: '#AAFF00', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#AAFF00', display: 'inline-block' }}></span>
                  Active · {bot.chat_count} chats
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href={`/dashboard/bots/${bot.id}`} className="btn-accent" style={{ flex: 1, justifyContent: 'center', padding: '9px', fontSize: '13px', background: bot.color || '#AAFF00', borderColor: bot.color || '#AAFF00' }}>
                <Settings size={14} />Manage
              </Link>
              <a href={`/chat/${bot.id}`} target="_blank" rel="noreferrer" className="btn-ghost" style={{ padding: '9px 12px', fontSize: '13px' }}><ExternalLink size={14} /></a>
              <button onClick={() => deleteBot(bot.id)} className="btn-ghost" style={{ padding: '9px 12px', fontSize: '13px', color: '#f87171', borderColor: '#3d1515' }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {bots.length === 0 && !showCreate && (
        <div style={{ textAlign: 'center', padding: '80px 24px', border: '1px dashed #1E2028', borderRadius: '12px' }}>
          <Bot size={44} style={{ color: '#2a2d38', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>No bots yet</h3>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>Create your first AI knowledge bot to get started.</p>
          <button className="btn-accent" onClick={() => setShowCreate(true)}><Plus size={16} />Create your first bot</button>
        </div>
      )}
    </div>
  )
}
