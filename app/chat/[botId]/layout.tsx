import type { Metadata } from 'next'

const SITE_URL = 'https://www.questme.ai'
const OG_IMAGE = `${SITE_URL}/og-image.png`

export async function generateMetadata(
  { params }: { params: { botId: string } }
): Promise<Metadata> {
  let botName = 'Chat'
  try {
    const res = await fetch(`${SITE_URL}/api/bots/public/${params.botId}`, {
      next: { revalidate: 300 },
    })
    if (res.ok) {
      const bot = await res.json()
      if (bot?.name) botName = bot.name
    }
  } catch {}

  const title = `${botName} | Powered by Questme.ai`
  const description = 'Ask me anything about our products.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: 'Questme.ai',
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: 'Questme.ai — AI Product Knowledge Bot',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  }
}

export default function ChatBotLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
