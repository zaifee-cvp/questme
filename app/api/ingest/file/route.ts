import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import { chunkText } from '@/lib/chunker'
import { embedText } from '@/lib/rag'

export const maxDuration = 300

function extractTextFromPDFBuffer(buffer: Buffer): string {
  const zlib = require('zlib')
  const text: string[] = []
  const pdfStr = buffer.toString('binary')

  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g
  let match
  while ((match = streamRegex.exec(pdfStr)) !== null) {
    try {
      const streamData = Buffer.from(match[1], 'binary')
      let decoded: string
      try {
        decoded = zlib.inflateSync(streamData).toString('utf-8')
      } catch {
        decoded = streamData.toString('utf-8')
      }

      // Extract text between BT...ET blocks
      const btBlocks = decoded.match(/BT[\s\S]*?ET/g)
      if (btBlocks) {
        for (const block of btBlocks) {
          // Handle parenthesized strings: (text) Tj
          const parenMatches = block.match(/\(([^)]*)\)\s*Tj/g)
          if (parenMatches) {
            for (const pm of parenMatches) {
              const inner = pm.match(/\(([^)]*)\)/)
              if (inner) {
                const clean = inner[1]
                  .replace(/\\n/g, '\n').replace(/\\r/g, '')
                  .replace(/\\\\/g, '\\').replace(/\\([()])/g, '$1')
                if (clean.trim()) text.push(clean)
              }
            }
          }

          // Handle hex strings: <hex> Tj
          const hexTj = block.match(/<([0-9a-fA-F]+)>\s*Tj/g)
          if (hexTj) {
            for (const h of hexTj) {
              const hexMatch = h.match(/<([0-9a-fA-F]+)>/)
              if (hexMatch) {
                const hex = hexMatch[1]
                let str = ''
                for (let i = 0; i < hex.length; i += 4) {
                  const code = parseInt(hex.substring(i, i + 4), 16)
                  if (code > 0 && code < 65535) str += String.fromCharCode(code)
                }
                if (!str.trim()) {
                  str = ''
                  for (let i = 0; i < hex.length; i += 2) {
                    const code = parseInt(hex.substring(i, i + 2), 16)
                    if (code > 31 && code < 127) str += String.fromCharCode(code)
                  }
                }
                if (str.trim()) text.push(str)
              }
            }
          }

          // Handle TJ arrays: [(text) num (text)] TJ
          const tjArrays = block.match(/\[(.*?)\]\s*TJ/g)
          if (tjArrays) {
            for (const tj of tjArrays) {
              const parts: string[] = []
              // Paren strings in TJ
              const parenParts = tj.match(/\(([^)]*)\)/g)
              if (parenParts) {
                for (const p of parenParts) {
                  const inner = p.slice(1, -1)
                    .replace(/\\n/g, '\n').replace(/\\r/g, '')
                    .replace(/\\\\/g, '\\').replace(/\\([()])/g, '$1')
                  parts.push(inner)
                }
              }
              // Hex strings in TJ
              const hexParts = tj.match(/<([0-9a-fA-F]+)>/g)
              if (hexParts) {
                for (const hp of hexParts) {
                  const hex = hp.slice(1, -1)
                  let str = ''
                  for (let i = 0; i < hex.length; i += 2) {
                    const code = parseInt(hex.substring(i, i + 2), 16)
                    if (code > 31 && code < 127) str += String.fromCharCode(code)
                  }
                  if (str.trim()) parts.push(str)
                }
              }
              const line = parts.join('')
              if (line.trim()) text.push(line)
            }
          }
        }
      }
    } catch {}
  }

  return text.join(' ').replace(/\s+/g, ' ').trim()
}

export async function POST(req: NextRequest) {
  try {
    const authClient = createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const supabase = createSupabaseServiceClient()
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const botId = formData.get('botId') as string | null
    if (!file || !botId) return NextResponse.json({ error: 'Missing file or botId' }, { status: 400 })
    if (!file.name.endsWith('.pdf') && file.type !== 'application/pdf') return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 })
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    const { data: bot } = await supabase.from('bots').select('id').eq('id', botId).eq('user_id', user.id).single()
    if (!bot) return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    const { data: source } = await supabase.from('knowledge_sources').insert({ bot_id: botId, user_id: user.id, type: 'file', title: file.name, status: 'indexing' }).select().single()
    if (!source) return NextResponse.json({ error: 'Failed' }, { status: 500 })

    try {
      const buffer = Buffer.from(await file.arrayBuffer())
      const extractedText = extractTextFromPDFBuffer(buffer)
      if (!extractedText || extractedText.trim().length < 50) throw new Error('Could not extract text from PDF (the PDF may be a scanned image without selectable text)')
      const chunks = chunkText(extractedText)
      if (chunks.length === 0) throw new Error('No meaningful content extracted')
      for (const chunk of chunks) {
        const embedding = await embedText(chunk)
        await supabase.from('knowledge_chunks').insert({ source_id: source.id, bot_id: botId, content: chunk, embedding })
      }
      await supabase.from('knowledge_sources').update({ title: file.name, status: 'ready', chunk_count: chunks.length, updated_at: new Date().toISOString() }).eq('id', source.id)
      return NextResponse.json({ sourceId: source.id, status: 'ready' })
    } catch (err: any) {
      await supabase.from('knowledge_sources').update({ status: 'failed', error_message: err.message }).eq('id', source.id)
      return NextResponse.json({ sourceId: source.id, status: 'failed', error: err.message }, { status: 422 })
    }
  } catch (err: any) {
    console.error('[POST /api/ingest/file] unhandled error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
