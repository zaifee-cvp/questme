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

/**
 * A sanity floor, NOT an answer gate.
 *
 * It used to be an answer gate at 0.30, and that made the dentalys bot deny
 * having pricing it demonstrably has. Measured in production: questions the
 * knowledge base genuinely answers score 0.24-0.69; questions it genuinely
 * does not score 0.02-0.15. 0.18 sits in the empty band between those two
 * populations with roughly 0.09 of margin on each side.
 *
 * Anything above this floor is handed to the model, which decides whether it
 * actually answers the question. That decision belongs to the model: it can
 * read the chunk, and a cosine score cannot.
 */
export const RETRIEVAL_FLOOR = 0.18

export type KnowledgeHit = { id: string; content: string; similarity: number }

export async function searchKnowledge(
  botId: string,
  query: string,
  floor = RETRIEVAL_FLOOR,
  limit = 8,
): Promise<{ chunks: KnowledgeHit[]; topSimilarity: number | null }> {
  const supabase = createSupabaseServiceClient()
  const embedding = await embedText(query)
  const { data, error } = await supabase.rpc('match_knowledge_chunks', {
    query_embedding: embedding,
    match_bot_id: botId,
    // Fetched unfiltered and filtered below, so a near miss is still visible.
    // Without this, "nothing matched" and "matched at 0.17" look identical
    // in the logs, and that ambiguity is what hid this bug for months.
    match_threshold: 0,
    match_count: limit,
  })
  if (error) {
    console.error('RAG search error:', error)
    return { chunks: [], topSimilarity: null }
  }
  const all = (data || []) as KnowledgeHit[]
  return {
    chunks: all.filter((c) => c.similarity > floor),
    topSimilarity: all.length > 0 ? all[0].similarity : null,
  }
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
The CONTEXT is retrieved by similarity and may include passages that are only loosely related to the question. Read it and judge for yourself: if it contains the answer, give it, even when the wording differs from the question. If it does not contain the answer, respond with exactly: "${fallbackMessage}"
Never invent, estimate, or extrapolate a fact that is not written in the CONTEXT. Never mention "the context" or "the document" — just answer naturally.
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
