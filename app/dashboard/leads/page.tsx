'use client'
import { useState, useEffect } from 'react'

export default function LeadsPage() {
  const [bots, setBots] = useState<any[]>([])
  const [selectedBot, setSelectedBot] = useState('')
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/bots').then(r => r.json()).then(d => {
      if (Array.isArray(d)) { setBots(d); if (d.length > 0) setSelectedBot(d[0].id) }
    })
  }, [])

  useEffect(() => {
    if (!selectedBot) return
    setLoading(true)
    fetch(`/api/leads/${selectedBot}`).then(r => r.json()).then(d => { setLeads(Array.isArray(d) ? d : []); setLoading(false) })
  }, [selectedBot])

  function exportCsv() {
    const rows = [['Name', 'Email', 'Phone', 'Question Asked', 'Date'], ...leads.map(l => [l.name || '', l.email || '', l.phone || '', l.trigger_message || '', new Date(l.created_at).toLocaleDateString()])]
    const csv = rows.map(r => r.map((v: string) => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'questme-leads.csv'; a.click()
  }

  async function deleteLead(leadId: string) {
    if (!selectedBot) return
    if (!window.confirm('Delete this lead?')) return
    const response = await fetch(`/api/leads/${selectedBot}/${leadId}`, { method: 'DELETE' })
    const data = await response.json()
    if (!response.ok || !data?.success) {
      alert(data?.error || 'Failed to delete lead')
      return
    }
    setLeads(prev => prev.filter(l => l.id !== leadId))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>Leads</h1>
          <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>Contacts captured from your bots</p>
        </div>
        {leads.length > 0 && <button className="btn-ghost" onClick={exportCsv}>Export CSV</button>}
      </div>
      {bots.length > 1 && (
        <select className="input" style={{ maxWidth: '280px', marginBottom: '16px' }} value={selectedBot} onChange={e => setSelectedBot(e.target.value)}>
          {bots.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      )}
      {loading ? (
        <div style={{ color: '#6B7280', textAlign: 'center', padding: '40px' }}>Loading...</div>
      ) : leads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', border: '1px dashed #1E2028', borderRadius: '12px', color: '#6B7280', fontSize: '14px' }}>
          No leads yet — leads appear here when visitors ask questions your bot can't answer.
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1E2028' }}>
                {['Name', 'Email', 'Phone', 'Question Asked', 'Date captured'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
                <th style={{ padding: '12px 16px' }}></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l, i) => (
                <tr key={l.id} style={{ borderBottom: i < leads.length - 1 ? '1px solid #1E2028' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontSize: '14px' }}>{l.name || <span style={{ color: '#6B7280' }}>—</span>}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#AAFF00' }}>{l.email || <span style={{ color: '#6B7280' }}>—</span>}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#AAFF00' }}>{l.phone || <span style={{ color: '#6B7280' }}>—</span>}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#9CA3AF', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.trigger_message || <span style={{ color: '#6B7280' }}>—</span>}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6B7280' }}>{new Date(l.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => deleteLead(l.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#F87171',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
