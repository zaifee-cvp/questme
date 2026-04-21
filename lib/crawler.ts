export async function crawlUrl(url: string): Promise<{ title: string; content: string }> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Questme-Bot/1.0; +https://questme.ai)' },
    signal: AbortSignal.timeout(12000),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch ${url}`)
  // Limit raw HTML to 500KB to prevent OOM on large pages
  const html = (await response.text()).slice(0, 500_000)

  // Extract title before stripping tags
  const titleMatch = html.match(/<title[^>]*>([\/\S\s]*?)<\/title>/i)
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  const rawTitle = titleMatch?.[1] ?? h1Match?.[1] ?? new URL(url).hostname
  const title = rawTitle.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 200)

  // Strip noisy sections (script, style, nav, footer, etc.), then strip all remaining tags
  const content = html
    .replace(/<(script|style|nav|footer|header|aside|noscript)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#?\w+;/g, ' ')
    .replace(/\t/g, ' ').replace(/\n{3,}/g, '\n\n').replace(/ {2,}/g, ' ')
    .trim()
    .slice(0, 100_000)

  if (!content || content.length < 100) throw new Error('Could not extract meaningful content from this URL.')
  return { title, content }
}
