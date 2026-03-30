'use client'
import { useState } from 'react'

const sections = [
  {
    id: 'getting-started',
    title: '🚀 Getting Started',
    items: [
      {
        q: 'What is Questme.ai?',
        a: 'Questme.ai is an AI knowledge bot platform. You upload your product information once, and your customers can ask questions and get instant accurate answers — 24/7. No hallucinations. The bot only answers from what you provide.'
      },
      {
        q: 'How do I create my first bot?',
        a: 'Go to My Bots → click "+ New bot" → type a name for your bot (e.g. "Naylaa Store Support") → click Create bot. Your bot is instantly ready to receive knowledge.'
      },
      {
        q: 'How do I share my bot with customers?',
        a: 'Go to your bot → click the "Embed & Share" tab → copy the Shareable Link. Share this link on Instagram bio, WhatsApp, TikTok, email — anywhere. Customers click the link and chat instantly. No app download needed.'
      },
    ]
  },
  {
    id: 'knowledge',
    title: '📚 Adding Knowledge',
    items: [
      {
        q: 'How does the bot learn about my business?',
        a: 'You add knowledge through 4 methods: (1) URL crawl — paste your website link and we index it automatically, (2) Text paste — type or paste product info, prices, policies directly, (3) FAQ pairs — write question and answer pairs, (4) PDF upload — upload a catalog or manual. The bot uses ONLY what you provide — it never searches the internet.'
      },
      {
        q: 'Can I add information not on my website?',
        a: "Yes — this is the most important feature. Use the \"Add text\" box to paste anything: price lists, delivery zones, opening hours, team info, custom policies. Anything you type here becomes part of the bot's knowledge instantly."
      },
      {
        q: 'How long does indexing take?',
        a: 'URL crawling takes 10–30 seconds. Text and FAQ sources are instant. PDF uploads take 15–60 seconds depending on file size. You will see the status change from "Indexing" to "Ready" when done.'
      },
      {
        q: 'Can I update or remove knowledge sources?',
        a: 'Yes. In the Knowledge Base tab, each source shows a delete button. Remove old sources and add updated ones whenever your products or prices change. The bot learns the new info immediately.'
      },
      {
        q: 'How many pages can I index?',
        a: 'Free plan: 20 pages. Starter: 50 pages. Pro: 300 pages. Scale: Unlimited. One "page" = one URL crawled or one text/FAQ entry submitted.'
      },
    ]
  },
  {
    id: 'chat',
    title: '💬 How Customers Chat',
    items: [
      {
        q: 'How does a customer use the bot?',
        a: 'They click your shareable link → optionally enter their email (if lead capture is on) → type their question → get an instant answer. No app download. Works on any phone or desktop browser.'
      },
      {
        q: 'What if the bot cannot answer a question?',
        a: "The bot will say \"I don't have that information — please contact us directly\" and show your contact buttons (WhatsApp, phone, email). It never guesses or makes up answers."
      },
      {
        q: 'Can the bot answer in different languages?',
        a: 'Yes. If a customer asks in Malay, the bot responds in Malay. If they ask in Chinese, it responds in Chinese — as long as the knowledge you uploaded contains relevant information.'
      },
    ]
  },
  {
    id: 'leads',
    title: '📥 Leads & Analytics',
    items: [
      {
        q: 'What is Lead Capture?',
        a: 'When enabled, customers must enter their email before chatting. Every chat session becomes a lead in your Leads dashboard. Go to Settings tab in your bot → turn on Lead Capture. You can also customize the prompt text.'
      },
      {
        q: 'Where do I see my leads?',
        a: 'Dashboard → Leads. You will see all emails collected, the date, and you can export to CSV to use in email campaigns.'
      },
      {
        q: 'What are Knowledge Gaps?',
        a: 'Dashboard → Analytics → Knowledge Gaps shows you questions customers asked that the bot could not answer. This tells you exactly what information to add next to make your bot smarter.'
      },
    ]
  },
  {
    id: 'embed',
    title: '🔌 Embed on Website',
    items: [
      {
        q: 'How do I add the chat widget to my website?',
        a: 'Go to your bot → Embed & Share tab → copy the Script tag. Paste it anywhere in your website HTML before the closing </body> tag. A chat bubble will appear on your site. Works on Shopify, Webflow, WordPress, Wix — any platform.'
      },
      {
        q: 'What is the difference between shareable link and embed?',
        a: 'Shareable link opens a full chat page — share it on social media, WhatsApp, email. Embed script adds a floating chat bubble to your existing website. Use both for maximum reach.'
      },
    ]
  },
  {
    id: 'settings',
    title: '⚙️ Bot Settings',
    items: [
      {
        q: 'Can I customize how the bot looks?',
        a: 'Yes. In the Settings tab: change the bot name, welcome message, fallback message (what it says when it cannot answer), and accent color. The color changes the chat bubble and user message bubbles to match your brand.'
      },
      {
        q: 'What is Human Handoff?',
        a: 'When a customer types words like "speak to someone", "human", or "agent", the bot sends an email alert to you. Go to Settings → enable Human Handoff → enter your notification email. This ensures urgent customers always reach a real person.'
      },
      {
        q: 'What are Contact Details for?',
        a: 'Fill in your phone, WhatsApp, email, address, website, Instagram, Facebook in Settings → Contact Details. The bot will use these to answer "how do I contact you?" questions. Clickable buttons also appear at the bottom of the chat page.'
      },
      {
        q: 'What is White Label?',
        a: 'On the Scale plan, you can remove the "Powered by Questme.ai" branding from the chat page. Your bot appears as your own custom product. Perfect for agencies building bots for clients.'
      },
    ]
  },
  {
    id: 'billing',
    title: '💳 Billing & Plans',
    items: [
      {
        q: 'What plans are available?',
        a: 'Free (100 chats/mo), Starter $68/mo (500 chats, 1 bot), Pro $128/mo (3,000 chats, 5 bots, PDF upload, analytics), Scale $248/mo (10,000 chats, unlimited bots, white label, API access).'
      },
      {
        q: 'Is there a free trial?',
        a: 'Yes — all paid plans include a 14-day free trial. No credit card required to start. You are automatically on the Free plan until you upgrade.'
      },
      {
        q: 'How do I upgrade my plan?',
        a: 'Dashboard → Billing → click Upgrade on any plan. You will be taken to a secure Stripe checkout. Your new limits activate immediately after payment.'
      },
      {
        q: 'Can I cancel anytime?',
        a: 'Yes. Dashboard → Billing → Manage → Cancel subscription. Your plan stays active until the end of the billing period. No penalties.'
      },
    ]
  },
]

export default function HelpPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const [activeSection, setActiveSection] = useState('getting-started')

  function toggle(key: string) {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div style={{ maxWidth: '860px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#F0F0F0' }}>Help & User Guide</h1>
        <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>Everything you need to know to get the most out of Questme.ai</p>
      </div>

      {/* Quick nav */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => {
              setActiveSection(s.id)
              document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: activeSection === s.id ? '1px solid #AAFF00' : '1px solid #1E2028',
              background: activeSection === s.id ? '#AAFF0015' : 'transparent',
              color: activeSection === s.id ? '#AAFF00' : '#6B7280',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.15s',
            }}
          >{s.title}</button>
        ))}
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {sections.map(section => (
          <div key={section.id} id={section.id} className="card" style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: '#F0F0F0', marginBottom: '16px' }}>{section.title}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {section.items.map((item, i) => {
                const key = `${section.id}-${i}`
                const isOpen = openItems[key]
                return (
                  <div key={key} style={{ borderRadius: '8px', overflow: 'hidden' }}>
                    <button
                      onClick={() => { toggle(key); setActiveSection(section.id) }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '12px 14px',
                        background: isOpen ? '#AAFF0008' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        borderRadius: '8px',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF08' }}
                      onMouseLeave={e => { if (!isOpen) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                    >
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#E5E7EB', flex: 1 }}>{item.q}</span>
                      <span style={{ color: isOpen ? '#AAFF00' : '#4B5563', fontSize: '18px', flexShrink: 0, transition: 'transform 0.2s', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', display: 'inline-block' }}>+</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '4px 14px 14px', fontSize: '14px', color: '#9CA3AF', lineHeight: 1.7 }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Contact support */}
      <div style={{ marginTop: '24px', padding: '20px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#F0F0F0', fontFamily: 'Outfit, sans-serif' }}>Still need help?</div>
          <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>Our support team replies within 24 hours</div>
        </div>
        <a
          href="mailto:support@questme.ai"
          style={{ padding: '8px 20px', background: '#AAFF00', color: '#080A0E', borderRadius: '8px', fontWeight: 700, fontSize: '13px', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}
        >
          Email support →
        </a>
      </div>
    </div>
  )
}
