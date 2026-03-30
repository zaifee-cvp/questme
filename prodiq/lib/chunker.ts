const CHUNK_SIZE = 1500
const CHUNK_OVERLAP = 200

export function chunkText(text: string): string[] {
  const cleaned = text.replace(/\s+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
  if (cleaned.length <= CHUNK_SIZE) return cleaned.length > 50 ? [cleaned] : []
  const chunks: string[] = []
  let start = 0
  while (start < cleaned.length) {
    let end = Math.min(start + CHUNK_SIZE, cleaned.length)
    if (end < cleaned.length) {
      const lastPeriod = cleaned.lastIndexOf('.', end)
      const lastNewline = cleaned.lastIndexOf('\n', end)
      const breakPoint = Math.max(lastPeriod, lastNewline)
      if (breakPoint > start + CHUNK_SIZE * 0.5) end = breakPoint + 1
    }
    const chunk = cleaned.slice(start, end).trim()
    if (chunk.length > 80) chunks.push(chunk)
    start = end - CHUNK_OVERLAP
  }
  return chunks
}
