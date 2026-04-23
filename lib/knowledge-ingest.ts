export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const { extractText } = await import('unpdf')
  const { text } = await extractText(new Uint8Array(buffer), { mergePages: true })
  return Array.isArray(text) ? text.join(' ') : text
}

export async function extractTextFromURL(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
    signal: AbortSignal.timeout(25000),
    redirect: 'follow',
  })
  if (!response.ok) throw new Error(`Failed to fetch URL: HTTP ${response.status}`)
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('text/html') && !contentType.includes('text/plain') && !contentType.includes('application/xhtml')) {
    throw new Error('URL does not point to a readable page (content-type: ' + contentType + ')')
  }
  const html = await response.text()
  const { load } = await import('cheerio')
  const $ = load(html)
  $('script, style, nav, footer, header, aside, iframe, noscript').remove()
  const raw = $('body').text()
  const text = raw
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  if (text.length < 100) throw new Error('Could not extract meaningful content from this URL. The page may require JavaScript to render.')
  return text
}

export function chunkText(text: string, maxSize = 1000): string[] {
  const paragraphs = text
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40)

  const chunks: string[] = []
  let current = ''

  for (const para of paragraphs) {
    if (current.length + para.length < maxSize) {
      current += (current ? '\n\n' : '') + para
    } else {
      if (current) chunks.push(current.trim())
      if (para.length > maxSize) {
        const sentences = para.match(/[^.!?]+[.!?]+/g) || [para]
        let buf = ''
        for (const s of sentences) {
          if (buf.length + s.length < maxSize) {
            buf += s
          } else {
            if (buf) chunks.push(buf.trim())
            buf = s
          }
        }
        current = buf
      } else {
        current = para
      }
    }
  }
  if (current) chunks.push(current.trim())
  return chunks.filter((c) => c.length > 80).slice(0, 200)
}
