export async function crawlUrl(url: string): Promise<{ title: string; content: string }> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12000)

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Questme-Bot/1.0; +https://questme.ai)' },
      signal: controller.signal,
    })
    if (!response.ok) throw new Error('HTTP ' + response.status + ': Failed to fetch ' + url)

    const html = await response.text()

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
    const rawTitle = titleMatch?.[1] ?? h1Match?.[1] ?? new URL(url).hostname
    const title = rawTitle.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 200)

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
  } finally {
    clearTimeout(timeout)
  }
}
