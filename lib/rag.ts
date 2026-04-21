import { createSupabaseServiceClient } from './supabase/server'

export async function embedText(text: string): Promise<number[]> {
  const input = text.replace(/\n/g, ' ').trim().slice(0, 8191)
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: 'text-embedding-3-small', input }),
  })
  if (!res.ok) throw new Error(`OpenAI embedding error: ${res.status}`)
  const data = await res.json()
  return data.data[0].embedding
}

export async function searchKnowledge(botId: string, query: string, threshold = 0.65, limit = 5): Promise<{ id: string; content: string; similarity: number }[]> {
  const supabase = createSupabaseServiceClient()
  const embedding = await embedText(query)
  const { data, error } = await supabase.rpc('match_knowledge_chunks', {
    query_embedding: embedding,
    match_bot_id: botId,
    match_threshold: threshold,
    match_count: limit,
  })
  if (error) { console.error('RAG search error:', error); return [] }
  return data || []
}

export async function generateAnswer(opts: {
  botName: string
  fallbackMessage: string
  restrictToKnowledge: boolean
  context: string
  messages: { role: 'user' | 'assistant'; content: string }[]
}): Promise<string> {
  const { botName, fallbackMessage, restrictToKnowledge, context, messages } = opts
  const systemPrompt = restrictToKnowledge
    ? `You are the AI assistant for ${botName}.
STRICT RULE: Answer ONLY using the CONTEXT provided below. Do not use any outside knowledge whatsoever.
If the context does not contain the answer, respond with exactly: "${fallbackMessage}"
Never mention "the context" or "the document" — just answer naturally.
Keep answers concise (under 150 words). Be helpful, warm, and professional.

CONTEXT:
${context || '(No relevant information found)'}`
    : `You are the AI assistant for ${botName}. Use the provided context as your primary source, supplement with general knowledge only when needed.
CONTEXT:
${context || '(No context provided)'}`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, ...messages.slice(-10)],
      temperature: 0.2,
      max_tokens: 600,
    }),
  })
  if (!res.ok) throw new Error(`OpenAI chat error: ${res.status}`)
  const data = await res.json()
  return data.choices[0].message.content || fallbackMessage
}

export async function indexChunks(sourceId: string, botId: string, chunks: string[]): Promise<void> {
  if (chunks.length === 0) return
  const supabase = createSupabaseServiceClient()
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await embedText(chunks[i])
    await supabase.from('knowledge_chunks').insert({
      source_id: sourceId,
      bot_id: botId,
      content: chunks[i],
      embedding,
    })
  }
}
