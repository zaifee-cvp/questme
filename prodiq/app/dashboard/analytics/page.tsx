'use client'
import { useState, useEffect } from 'react'

export default function AnalyticsPage() {
  const [bots, setBots] = useState<any[]>([])
  const [selectedBot, setSelectedBot] = useState('')
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/bots').then(r => r.json()).then(d => {
      if (Array.isArray(d)) { setBots(d); if (d.length > 0) setSelectedBot(d[0].id) }
    })
  }, [])

  useEffect(() => {
    if (!selectedBot) return
    setLoading(true)
    fetch(`/api/analytics/${selectedBot}`).then(r => r.json()).then(d => { setStats(d); setLoading(false) })
  }, [selectedBot])

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>Analytics</h1>
        <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>Performance and insights for your bots</p>
      </div>
      {bots.length > 0 && (
        <select className="input" style={{ maxWidth: '280px', marginBottom: '24px' }} value={selectedBot} onChange={e => setSelectedBot(e.target.value)}>
          {bots.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      )}
      {loading ? (
        <div style={{ color: '#6B7280', textAlign: 'center', padding: '40px' }}>Loading...</div>
      ) : stats ? (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Total chats', value: stats.totalChats, color: '#F0F0F0' },
              { label: 'Answer rate', value: `${stats.answerRate}%`, color: '#AAFF00' },
              { label: 'Total leads', value: stats.totalLeads, color: '#F0F0F0' },
              { label: 'Unanswered', value: stats.unansweredCount, color: '#f87171' },
            ].map(s => (
              <div key={s.label} className="card">
                <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{s.label}</div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: s.color, fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
              </div>
            ))}
          </div>
          {stats.unansweredQuestions?.length > 0 && (
            <div className="card" style={{ borderColor: '#AAFF0030' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px', color: '#AAFF00', fontFamily: 'Outfit, sans-serif' }}>Knowledge gaps</h3>
              <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '14px' }}>Questions your bot could not answer — add them to your knowledge base</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {stats.unansweredQuestions.map((q: string, i: number) => (
                  <div key={i} style={{ background: '#161820', border: '1px solid #1E2028', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#D1D5DB', display: 'flex', gap: '10px' }}>
                    <span style={{ color: '#6B7280', fontSize: '11px', flexShrink: 0 }}>#{i + 1}</span>{q}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px', border: '1px dashed #1E2028', borderRadius: '12px', color: '#6B7280', fontSize: '14px' }}>
          No data yet. Share your bot and start getting chats!
        </div>
      )}
    </div>
  )
}
