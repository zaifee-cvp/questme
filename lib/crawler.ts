import * as cheerio from 'cheerio'

export async function crawlUrl(url: string): Promise<{ title: string; content: string }> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Questme-Bot/1.0; +https://questme.ai)' },
    signal: AbortSignal.timeout(12000),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch ${url}`)
  const html = await response.text()
  const $ = cheerio.load(html)
  $('script, style, nav, footer, header, aside, [role="navigation"], .nav, .navbar, .footer, .header, .sidebar, .menu, noscript').remove()
  const title = $('title').text().trim() || $('h1').first().text().trim() || new URL(url).hostname
  const mainContent = $('main, article, [role="main"], .content, .main-content, #content, #main').first()
  const rawText = (mainContent.length > 0 ? mainContent : $('body')).text()
  const content = rawText.replace(/\t/g, ' ').replace(/\n{3,}/g, '\n\n').replace(/[ ]{2,}/g, ' ').trim()
  if (!content || content.length < 100) throw new Error('Could not extract meaningful content from this URL.')
  return { title: title.slice(0, 200), content }
}
