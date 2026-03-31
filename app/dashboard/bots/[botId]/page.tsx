'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Plus, Trash2, RefreshCw, ExternalLink, Copy, Check, ChevronRight } from 'lucide-react'

interface Source { id: string; type: string; title: string; status: string; chunk_count: number; error_message?: string }
interface Chunk { id: string; content: string }
interface Bot { id: string; name: string; welcome_message: string; fallback_message: string; lead_capture_enabled: boolean; lead_capture_prompt: string; handoff_enabled: boolean; handoff_email: string; restrict_to_knowledge: boolean; color: string; contact_phone?: string; contact_whatsapp?: string; contact_email?: string; contact_address?: string; contact_website?: string; contact_instagram?: string; contact_facebook?: string }
type Tab = 'knowledge' | 'settings' | 'embed'

export default function BotPage() {
  const { botId } = useParams<{ botId: string }>()
  const [bot, setBot] = useState<Bot | null>(null)
  const [sources, setSources] = useState<Source[]>([])
  const [tab, setTab] = useState<Tab>('knowledge')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [addingUrl, setAddingUrl] = useState(false)
  const [textTitle, setTextTitle] = useState('')
  const [textContent, setTextContent] = useState('')
  const [addingText, setAddingText] = useState(false)
  const [faqPairs, setFaqPairs] = useState([{ question: '', answer: '' }])
  const [addingFaq, setAddingFaq] = useState(false)
  const [saving, setSaving] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [addingPdf, setAddingPdf] = useState(false)
  const [pdfMsg, setPdfMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [imgFile, setImgFile] = useState<File | null>(null)
  const [imgBlob, setImgBlob] = useState<Blob | null>(null)
  const [imgPreview, setImgPreview] = useState<string | null>(null)
  const [imgDesc, setImgDesc] = useState('')
  const [addingImg, setAddingImg] = useState(false)
  const [imgMsg, setImgMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [imgCompressInfo, setImgCompressInfo] = useState<string | null>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const imgInputRef = useRef<HTMLInputElement>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState<Record<string, { chunks: Chunk[]; loading: boolean }>>({})

  async function toggleExpand(id: string) {
    if (expandedId === id) { setExpandedId(null); return }
    setExpandedId(id)
    if (previewData[id]) return
    setPreviewData(prev => ({ ...prev, [id]: { chunks: [], loading: true } }))
    try {
      const res = await fetch(`/api/knowledge/${id}`)
      if (res.ok) {
        const data = await res.json()
        setPreviewData(prev => ({ ...prev, [id]: { chunks: data.chunks, loading: false } }))
      } else {
        setPreviewData(prev => ({ ...prev, [id]: { chunks: [], loading: false } }))
      }
    } catch {
      setPreviewData(prev => ({ ...prev, [id]: { chunks: [], loading: false } }))
    }
  }

  const fetchData = useCallback(async () => {
    const [botRes, sourcesRes] = await Promise.all([fetch(`/api/bots/${botId}`), fetch(`/api/knowledge?botId=${botId}`)])
    if (botRes.ok) setBot(await botRes.json())
    if (sourcesRes.ok) setSources(await sourcesRes.json())
    setLoading(false)
  }, [botId])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    const hasIndexing = sources.some(s => s.status === 'indexing' || s.status === 'pending')
    if (!hasIndexing) return
    const interval = setInterval(async () => {
      const res = await fetch(`/api/knowledge?botId=${botId}`)
      if (res.ok) setSources(await res.json())
    }, 3000)
    return () => clearInterval(interval)
  }, [sources, botId])

  async function addUrl(e: React.FormEvent) {
    e.preventDefault(); setAddingUrl(true)
    await fetch('/api/ingest/url', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ botId, url: urlInput }) })
    setUrlInput(''); await fetchData(); setAddingUrl(false)
  }

  async function addText(e: React.FormEvent) {
    e.preventDefault(); setAddingText(true)
    await fetch('/api/ingest/text', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ botId, title: textTitle, content: textContent }) })
    setTextTitle(''); setTextContent(''); await fetchData(); setAddingText(false)
  }

  async function addFaq(e: React.FormEvent) {
    e.preventDefault()
    const valid = faqPairs.filter(f => f.question.trim() && f.answer.trim())
    if (!valid.length) return
    setAddingFaq(true)
    await fetch('/api/ingest/faq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ botId, faqs: valid }) })
    setFaqPairs([{ question: '', answer: '' }]); await fetchData(); setAddingFaq(false)
  }

  async function uploadPdf(file: File) {
    setAddingPdf(true); setPdfMsg(null)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('botId', botId)
    const res = await fetch('/api/ingest/file', { method: 'POST', body: fd })
    if (res.ok) {
      setPdfMsg({ type: 'success', text: '✓ PDF added — indexing in progress' })
      setPdfFile(null)
      await fetchData()
    } else {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }))
      setPdfMsg({ type: 'error', text: err.error || 'Upload failed' })
    }
    setAddingPdf(false)
    if (pdfInputRef.current) pdfInputRef.current.value = ''
  }

  function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
    return new Promise((resolve) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)
        URL.revokeObjectURL(url)
        canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', quality)
      }
      img.src = url
    })
  }

  async function handleImageSelect(file: File) {
    setImgMsg(null); setImgCompressInfo(null)
    if (imgPreview) URL.revokeObjectURL(imgPreview)
    setImgPreview(URL.createObjectURL(file))
    setImgFile(file)
    setImgBlob(null)

    let compressed = await compressImage(file, 1200, 0.8)
    if (compressed.size > 2 * 1024 * 1024) {
      compressed = await compressImage(file, 1200, 0.6)
    }

    const fmt = (b: number) => b >= 1024 * 1024 ? `${(b / (1024 * 1024)).toFixed(1)}MB` : `${Math.round(b / 1024)}KB`
    setImgCompressInfo(`Image compressed: ${fmt(file.size)} → ${fmt(compressed.size)}`)
    setImgBlob(compressed)
  }

  async function addImage(e: React.FormEvent) {
    e.preventDefault()
    if (!imgFile) return
    setAddingImg(true); setImgMsg(null)
    const uploadBlob = imgBlob ?? imgFile
    const uploadFile = new File(
      [uploadBlob],
      imgFile.name.replace(/\.[^.]+$/, '.jpg'),
      { type: 'image/jpeg' }
    )
    const fd = new FormData()
    fd.append('file', uploadFile)
    fd.append('botId', botId)
    fd.append('description', imgDesc.trim())
    const res = await fetch('/api/ingest/image', { method: 'POST', body: fd })
    if (res.ok) {
      setImgMsg({ type: 'success', text: '✓ Image added' })
      setImgFile(null); setImgBlob(null); setImgPreview(null); setImgDesc(''); setImgCompressInfo(null)
      await fetchData()
    } else {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }))
      setImgMsg({ type: 'error', text: err.error || 'Upload failed' })
    }
    setAddingImg(false)
    if (imgInputRef.current) imgInputRef.current.value = ''
  }

  async function deleteSource(id: string) {
    await fetch(`/api/knowledge/${id}`, { method: 'DELETE' })
    setSources(prev => prev.filter(s => s.id !== id))
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault(); if (!bot) return; setSaving(true)
    await fetch(`/api/bots/${botId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bot) })
    setSaving(false)
  }

  function copyEmbed() {
    navigator.clipboard.writeText(`<script src="${window.location.origin}/widget.js" data-bot-id="${botId}"></script>`)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div style={{ color: '#6B7280', textAlign: 'center', padding: '60px' }}>Loading...</div>
  if (!bot) return <div style={{ color: '#f87171', textAlign: 'center', padding: '60px' }}>Bot not found</div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        <div style={{ width: '44px', height: '44px', background: bot.color || '#AAFF00', borderRadius: '12px', fontWeight: 900, fontSize: '20px', color: '#080A0E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>{bot.name[0].toUpperCase()}</div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>{bot.name}</h1>
          <a href={`/chat/${botId}`} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#AAFF00', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ExternalLink size={12} />Preview chat
          </a>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #1E2028', marginBottom: '24px' }}>
        {(['knowledge', 'settings', 'embed'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 18px', fontSize: '14px', color: tab === t ? '#AAFF00' : '#6B7280', borderBottom: tab === t ? '2px solid #AAFF00' : '2px solid transparent', fontFamily: 'DM Sans, sans-serif' }}>
            {t === 'embed' ? 'Embed & Share' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'knowledge' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div className="card">
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>🌐 Add URL</h3>
              <form onSubmit={addUrl} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input className="input" type="url" placeholder="https://yoursite.com/faq" value={urlInput} onChange={e => setUrlInput(e.target.value)} required />
                <button className="btn-accent" type="submit" disabled={addingUrl} style={{ justifyContent: 'center', padding: '9px', fontSize: '13px' }}>{addingUrl ? 'Crawling...' : '+ Add URL'}</button>
              </form>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>📝 Add text</h3>
              <form onSubmit={addText} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input className="input" placeholder="Title" value={textTitle} onChange={e => setTextTitle(e.target.value)} required />
                <textarea className="input" placeholder="Paste product info, policies, descriptions..." value={textContent} onChange={e => setTextContent(e.target.value)} required style={{ minHeight: '80px' }} />
                <button className="btn-accent" type="submit" disabled={addingText} style={{ justifyContent: 'center', padding: '9px', fontSize: '13px' }}>{addingText ? 'Adding...' : '+ Add text'}</button>
              </form>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>💬 Add FAQ</h3>
              <form onSubmit={addFaq} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {faqPairs.map((pair, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <input className="input" placeholder={`Question ${i + 1}`} value={pair.question} onChange={e => { const p = [...faqPairs]; p[i].question = e.target.value; setFaqPairs(p) }} />
                    <textarea className="input" placeholder="Answer" value={pair.answer} onChange={e => { const p = [...faqPairs]; p[i].answer = e.target.value; setFaqPairs(p) }} style={{ minHeight: '60px' }} />
                  </div>
                ))}
                <button type="button" className="btn-ghost" style={{ fontSize: '12px', padding: '7px', justifyContent: 'center' }} onClick={() => setFaqPairs(prev => [...prev, { question: '', answer: '' }])}>
                  <Plus size={13} />Add another Q&A
                </button>
                <button className="btn-accent" type="submit" disabled={addingFaq} style={{ justifyContent: 'center', padding: '9px', fontSize: '13px' }}>{addingFaq ? 'Adding...' : '+ Save FAQs'}</button>
              </form>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>📄 Upload PDF</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input ref={pdfInputRef} type="file" accept=".pdf,application/pdf" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) { setPdfFile(f); uploadPdf(f) } }} />
                <div
                  onClick={() => { if (!addingPdf) { setPdfMsg(null); pdfInputRef.current?.click() } }}
                  style={{ border: '1px dashed #374151', borderRadius: '8px', padding: '20px', cursor: addingPdf ? 'default' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: addingPdf ? 0.6 : 1, transition: 'border-color 0.15s' }}
                  onMouseEnter={e => { if (!addingPdf) (e.currentTarget as HTMLDivElement).style.borderColor = '#AAFF00' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#374151' }}
                >
                  <span style={{ fontSize: '22px' }}>📄</span>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>
                    {addingPdf ? 'Uploading…' : pdfFile ? `📎 ${pdfFile.name}` : 'Click to choose PDF'}
                  </span>
                </div>
                {pdfMsg && <div style={{ fontSize: '12px', color: pdfMsg.type === 'success' ? '#4ade80' : '#f87171' }}>{pdfMsg.text}</div>}
              </div>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>🖼️ Upload Image</h3>
              <form onSubmit={addImage} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input ref={imgInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleImageSelect(f) }} />
                {imgPreview ? (
                  <div style={{ position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgPreview} alt="preview" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #1E2028', display: 'block' }} />
                    <button type="button" onClick={() => { setImgFile(null); setImgBlob(null); setImgCompressInfo(null); if (imgPreview) URL.revokeObjectURL(imgPreview); setImgPreview(null); if (imgInputRef.current) imgInputRef.current.value = '' }}
                      style={{ position: 'absolute', top: '6px', right: '6px', background: '#080A0ECC', border: '1px solid #1E2028', borderRadius: '50%', width: '22px', height: '22px', color: '#9CA3AF', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>✕</button>
                    {imgFile && <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{imgFile.name}</div>}
                  </div>
                ) : (
                  <div
                    onClick={() => { setImgMsg(null); imgInputRef.current?.click() }}
                    style={{ border: '1px dashed #374151', borderRadius: '8px', padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'border-color 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#AAFF00' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#374151' }}
                  >
                    <span style={{ fontSize: '22px' }}>🖼️</span>
                    <span style={{ fontSize: '13px', color: '#6B7280' }}>Click to choose image</span>
                  </div>
                )}
                {imgCompressInfo && <div style={{ fontSize: '11px', color: '#6B7280' }}>{imgCompressInfo}</div>}
                <input className="input" placeholder="Describe this image for AI (optional)…" value={imgDesc} onChange={e => setImgDesc(e.target.value)} style={{ fontSize: '13px' }} />
                {imgMsg && <div style={{ fontSize: '12px', color: imgMsg.type === 'success' ? '#4ade80' : '#f87171' }}>{imgMsg.text}</div>}
                <button className="btn-accent" type="submit" disabled={addingImg || !imgFile}
                  style={{ justifyContent: 'center', padding: '9px', fontSize: '13px' }}>
                  {addingImg ? 'Uploading…' : '+ Upload Image'}
                </button>
              </form>
            </div>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', fontFamily: 'Outfit, sans-serif' }}>Sources ({sources.length})</h3>
          {sources.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed #1E2028', borderRadius: '12px', color: '#6B7280', fontSize: '14px' }}>No knowledge sources yet. Add URLs, text, or FAQs above.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sources.map(s => {
                const isOpen = expandedId === s.id
                const preview = previewData[s.id]
                return (
                  <div key={s.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {/* Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', cursor: 'pointer' }}
                      onClick={() => toggleExpand(s.id)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                        <ChevronRight size={14} style={{ color: '#4B5563', flexShrink: 0, transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                        <span style={{ fontSize: '18px' }}>{s.type === 'url' ? '🌐' : s.type === 'faq' ? '💬' : s.type === 'file' ? '📄' : s.type === 'image' ? '🖼️' : '📝'}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                            <span className="source-type">{s.type}</span>
                            {s.chunk_count > 0 && <span style={{ fontSize: '11px', color: '#6B7280' }}>{s.chunk_count} chunks</span>}
                            {s.error_message && <span style={{ fontSize: '11px', color: '#f87171' }}>{s.error_message}</span>}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                        {(s.status === 'indexing' || s.status === 'pending') && <span className="status-indexing" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><RefreshCw size={11} style={{ animation: 'spin 1s linear infinite' }} />Indexing</span>}
                        {s.status === 'ready' && <span className="status-ready">Ready</span>}
                        {s.status === 'failed' && <span className="status-failed">Failed</span>}
                        <button onClick={() => deleteSource(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '4px', display: 'flex' }}><Trash2 size={14} /></button>
                      </div>
                    </div>

                    {/* Expanded preview */}
                    {isOpen && (
                      <div style={{ borderTop: '1px solid #1E2028', background: '#1A1D2E', padding: '16px', fontSize: '14px', color: '#8B95A8' }}>
                        {preview?.loading ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4B5563' }}>
                            <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />Loading…
                          </div>
                        ) : !preview?.chunks.length ? (
                          <div style={{ color: '#4B5563', fontStyle: 'italic' }}>No content indexed yet.</div>
                        ) : s.type === 'image' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {preview.chunks.map(c => {
                              const urlMatch = c.content.match(/Image URL:\s*(\S+)/)
                              const descMatch = c.content.match(/Description:\s*([\s\S]+)/)
                              return (
                                <div key={c.id}>
                                  {urlMatch && (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={urlMatch[1]} alt={s.title} style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '6px', marginBottom: '8px', display: 'block' }} />
                                  )}
                                  {descMatch && <div style={{ lineHeight: 1.6 }}>{descMatch[1].trim()}</div>}
                                  {!descMatch && <div style={{ color: '#4B5563', fontStyle: 'italic' }}>No description.</div>}
                                </div>
                              )
                            })}
                          </div>
                        ) : s.type === 'url' ? (
                          <div>
                            <a href={s.title} target="_blank" rel="noreferrer" style={{ color: '#AAFF00', fontSize: '12px', wordBreak: 'break-all', display: 'block', marginBottom: '10px' }}>{s.title}</a>
                            {preview.chunks.map(c => (
                              <div key={c.id} style={{ lineHeight: 1.7, marginBottom: '8px', whiteSpace: 'pre-wrap' }}>{c.content.slice(0, 500)}{c.content.length > 500 ? '…' : ''}</div>
                            ))}
                          </div>
                        ) : s.type === 'faq' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {preview.chunks.map(c => {
                              const qMatch = c.content.match(/Q:\s*([\s\S]+?)(?:\nA:|$)/)
                              const aMatch = c.content.match(/A:\s*([\s\S]+)/)
                              return (
                                <div key={c.id} style={{ borderLeft: '2px solid #2D3148', paddingLeft: '12px' }}>
                                  {qMatch && <div style={{ fontWeight: 600, color: '#D1D5DB', marginBottom: '4px' }}>Q: {qMatch[1].trim()}</div>}
                                  {aMatch && <div>A: {aMatch[1].trim()}</div>}
                                  {!qMatch && <div style={{ whiteSpace: 'pre-wrap' }}>{c.content}</div>}
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          // text / file
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {preview.chunks.map(c => (
                              <div key={c.id} style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{c.content.slice(0, 500)}{c.content.length > 500 ? '…' : ''}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'settings' && (
        <form onSubmit={saveSettings} style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div><label style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Bot name</label><input className="input" value={bot.name} onChange={e => setBot({ ...bot, name: e.target.value })} /></div>
          <div><label style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Welcome message</label><input className="input" value={bot.welcome_message} onChange={e => setBot({ ...bot, welcome_message: e.target.value })} /></div>
          <div><label style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Fallback message (when bot cannot answer)</label><textarea className="input" value={bot.fallback_message} onChange={e => setBot({ ...bot, fallback_message: e.target.value })} /></div>
          <div><label style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Lead capture prompt</label><input className="input" value={bot.lead_capture_prompt || ''} onChange={e => setBot({ ...bot, lead_capture_prompt: e.target.value })} placeholder="Enter your email to start chatting" /></div>
          <div><label style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Accent color</label><input className="input" type="color" value={bot.color} onChange={e => setBot({ ...bot, color: e.target.value })} style={{ height: '44px', cursor: 'pointer', padding: '4px' }} /></div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>Contact Details</h3>
            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '-8px' }}>Your bot will automatically answer contact questions using these details.</p>
            {[
              { key: 'contact_phone', label: 'Phone number', placeholder: '+65 9123 4567', type: 'tel' },
              { key: 'contact_whatsapp', label: 'WhatsApp number', placeholder: '+65 9123 4567', type: 'tel' },
              { key: 'contact_email', label: 'Email address', placeholder: 'hello@yourbusiness.com', type: 'email' },
              { key: 'contact_website', label: 'Website', placeholder: 'https://yourbusiness.com', type: 'text' },
              { key: 'contact_address', label: 'Address', placeholder: '123 Orchard Road, Singapore 238858', type: 'text' },
              { key: 'contact_instagram', label: 'Instagram', placeholder: '@yourbusiness', type: 'text' },
              { key: 'contact_facebook', label: 'Facebook page', placeholder: 'https://facebook.com/yourbusiness', type: 'text' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>{label}</label>
                <input className="input" type={type} placeholder={placeholder} value={(bot as any)[key] || ''} onChange={e => setBot({ ...bot, [key]: e.target.value })} onBlur={key === 'contact_website' ? e => { const val = e.target.value.trim(); if (val && !val.startsWith('http://') && !val.startsWith('https://')) setBot(b => ({ ...b!, [key]: 'https://' + val })) } : undefined} />
              </div>
            ))}
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>Features</h3>
            {[
              { key: 'restrict_to_knowledge', label: 'Restrict answers to knowledge base', desc: 'Bot only answers from your uploaded content' },
              { key: 'lead_capture_enabled', label: 'Enable lead capture', desc: 'Ask visitors for email before chatting' },
              { key: 'handoff_enabled', label: 'Enable human handoff', desc: 'Email your team when a visitor asks for a human' },
            ].map(({ key, label, desc }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={!!(bot as any)[key]} onChange={e => setBot({ ...bot, [key]: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: '#AAFF00', flexShrink: 0 }} />
                <div><div style={{ fontSize: '14px', fontWeight: 500 }}>{label}</div><div style={{ fontSize: '12px', color: '#6B7280' }}>{desc}</div></div>
              </label>
            ))}
          </div>
          {bot.handoff_enabled && (
            <div><label style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Handoff email</label><input className="input" type="email" placeholder="your@email.com" value={bot.handoff_email || ''} onChange={e => setBot({ ...bot, handoff_email: e.target.value })} /></div>
          )}
          <button className="btn-accent" type="submit" disabled={saving} style={{ width: 'fit-content' }}>{saving ? 'Saving...' : 'Save settings'}</button>
        </form>
      )}

      {tab === 'embed' && (
        <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px', fontFamily: 'Outfit, sans-serif' }}>Embed on your website</h3>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '14px' }}>Paste this before your closing body tag</p>
            <div style={{ background: '#161820', border: '1px solid #1E2028', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '13px', color: '#AAFF00', lineHeight: 1.8, marginBottom: '12px', wordBreak: 'break-all' }}>
              {`<script src="${typeof window !== 'undefined' ? window.location.origin : 'https://questme.ai'}/widget.js" data-bot-id="${botId}"></script>`}
            </div>
            <button className="btn-accent" onClick={copyEmbed} style={{ fontSize: '13px', padding: '9px 18px' }}>
              {copied ? <><Check size={14} />Copied!</> : <><Copy size={14} />Copy embed code</>}
            </button>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px', fontFamily: 'Outfit, sans-serif' }}>Shareable link</h3>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '14px' }}>Share a direct link — no website needed</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#161820', border: '1px solid #1E2028', borderRadius: '8px', padding: '10px 14px' }}>
              <span style={{ flex: 1, fontSize: '13px', color: '#D1D5DB', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {typeof window !== 'undefined' ? window.location.origin : 'https://questme.ai'}/chat/{botId}
              </span>
              <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/chat/${botId}`); setCopied(true); setTimeout(() => setCopied(false), 2000) }} style={{ background: 'none', border: 'none', color: '#AAFF00', cursor: 'pointer', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
