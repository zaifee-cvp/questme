export async function crawlUrl(url: string): Promise<{ title: string; content: string }> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 25000)

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: controller.signal,
      redirect: 'follow',
    })
    if (!response.ok) throw new Error('HTTP ' + response.status + ': Failed to fetch ' + url)
    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.includes('text/html') && !contentType.includes('text/plain') && !contentType.includes('application/xhtml')) {
      throw new Error('URL does not point to a readable page (content-type: ' + contentType + ')')
    }

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

    if (!content || content.length < 100) throw new Error('Could not extract meaningful content from this URL. The page may require JavaScript to render.')
    return { title, content }
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('Timed out fetching the URL. The site may be too slow or blocking requests.')
    throw err
  } finally {
    clearTimeout(timeout)
  }
}
