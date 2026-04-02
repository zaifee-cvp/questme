import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Customer Support Chatbot for Businesses | Questme.ai',
  description: 'Questme.ai lets you deploy an AI chatbot that answers customer support questions 24/7 — trained on your own product and service knowledge.',
  alternates: { canonical: 'https://www.questme.ai/ai-customer-support-chatbot' },
}

export default function AICustomerSupportChatbot() {
  return (
    <div style={{ minHeight: '100vh', background: '#080A0E', color: '#F0F0F0' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1E2028', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1100px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ width: '32px', height: '32px', background: '#AAFF00', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '16px', color: '#080A0E', fontFamily: 'Outfit, sans-serif' }}>Q</div>
          <span style={{ fontWeight: 700, fontSize: '18px', fontFamily: 'Outfit, sans-serif' }}>Questme<span style={{ color: '#AAFF00' }}>.ai</span></span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/blog" style={{ fontSize: '14px', color: '#9CA3AF', textDecoration: 'none' }}>Blog</Link>
          <Link href="/sign-in" style={{ fontSize: '14px', color: '#9CA3AF', textDecoration: 'none' }}>Sign in</Link>
          <Link href="/sign-up" className="btn-accent" style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '8px' }}>Start free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '72px 24px 48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '20px', padding: '6px 16px', fontSize: '12px', color: '#9CA3AF', marginBottom: '28px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#AAFF00', display: 'inline-block' }}></span>
          Customer Support Automation
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1.5px', fontFamily: 'Outfit, sans-serif' }}>
          AI Customer Support Chatbot<br />
          <span style={{ color: '#AAFF00' }}>for Businesses</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '36px', maxWidth: '620px' }}>
          Your customers have questions at all hours. With Questme.ai, you can deploy an AI chatbot that answers them instantly — trained entirely on your own product and service knowledge, not generic scripts.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/sign-up" className="btn-accent" style={{ fontSize: '16px', padding: '14px 32px' }}>Start for free →</Link>
          <Link href="/" className="btn-ghost" style={{ fontSize: '16px', padding: '14px 32px' }}>See how it works</Link>
        </div>
      </section>

      {/* Content */}
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 80px' }}>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Why Businesses Struggle to Answer Customer Questions Fast Enough
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            When a customer sends an enquiry, they expect a quick answer. If they don't get one, they move on — often to a competitor. Most small and mid-sized businesses rely on a single inbox, a single support email, or a WhatsApp number that only one person monitors. That works fine when volume is low.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            But the moment enquiries increase — during a product launch, a sale, or a busy season — the cracks appear. Customers wait hours. Staff get overwhelmed. Leads that could have converted go cold. The problem isn't that your team doesn't care. It's that human support doesn't scale automatically.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            What an AI Customer Support Chatbot Actually Does
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            An AI customer support chatbot is a piece of software that sits on your website or messaging channels and responds to inbound customer questions automatically. Unlike a static FAQ page, it has a conversational interface — customers type a question in natural language and get a relevant, accurate answer within seconds.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Questme.ai goes further than most chatbots. Instead of relying on pre-written scripts or one-size-fits-all AI responses, it learns from the actual content you provide — your product pages, your FAQs, your service descriptions, your policies. The result is a chatbot that sounds like your business, because it genuinely knows your business.
          </p>
          <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: '#F0F0F0', marginBottom: '10px', marginTop: '24px' }}>
            What kinds of questions can it handle?
          </h3>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            Product details, pricing, availability, return policies, service terms, delivery timelines, how-to questions — anything your business regularly gets asked. If the answer is in the content you've provided, the bot will find it and deliver it accurately.
          </p>
        </section>

        <section style={{ marginBottom: '56px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '16px', padding: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Trained on Your Own Business Knowledge — Not Generic Answers
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            The biggest frustration with generic chatbots is that they give generic answers. "Please contact our support team." "We'll get back to you within 2 business days." These responses don't help anyone.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Questme.ai works differently. You upload the knowledge — product documentation, FAQs, website pages, PDFs, or plain text — and the AI indexes it. When a customer asks a question, the bot searches your content for the most relevant answer and responds from that context. It won't make things up. If the answer isn't in your knowledge base, the bot says so and can route the customer to your team.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            This means your customers always get accurate, on-brand answers — not hallucinated or generic responses that erode trust.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Available 24/7 Without Hiring Extra Staff
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Hiring support staff is expensive. Even a part-time agent adds salary, training, and management overhead. And they still have hours — they sleep, they get sick, they go on leave.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            An AI chatbot doesn't. It handles enquiries at 2am, on weekends, and during public holidays, with the same quality of response every time. For businesses that serve customers across time zones, or simply want to stop missing after-hours enquiries, this is a significant operational upgrade — at a fraction of the cost of a human agent.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Works on Your Website and WhatsApp
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Your customers reach you through different channels. Some browse your website and want answers there. Others prefer to message via WhatsApp, especially in markets across Southeast Asia.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            Questme.ai deploys on both. Embed the chatbot on your website with a single script tag — no development work required. The same knowledge base powers your WhatsApp channel, so you deliver a consistent experience wherever customers find you.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Easy to Set Up. No Technical Skills Needed.
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            You don't need a developer to get started. Sign up, paste in your product URLs or upload your documents, and Questme.ai crawls and indexes the content automatically. Within minutes, your bot is trained and ready to deploy.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            Adding the bot to your website is a single copy-paste of one script tag. No plugins, no developer handoffs, no long setup processes. If you can send an email, you can set up Questme.ai.
          </p>
          <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {['Paste your product URLs', 'AI indexes your content', 'Copy one embed script', 'Chatbot goes live'].map((step, i) => (
              <div key={step} className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: '#AAFF00', fontWeight: 900, fontFamily: 'Outfit, sans-serif', fontSize: '18px', flexShrink: 0 }}>0{i + 1}</span>
                <span style={{ fontSize: '14px', color: '#D1D5DB', lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '20px', padding: '48px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Start Answering Customer Questions<br /><span style={{ color: '#AAFF00' }}>Instantly</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
            Join businesses using Questme.ai to handle customer support automatically — without adding headcount.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/sign-up" className="btn-accent" style={{ fontSize: '16px', padding: '14px 36px' }}>Start for free — no credit card</Link>
            <Link href="/" className="btn-ghost" style={{ fontSize: '16px', padding: '14px 28px' }}>Learn more →</Link>
          </div>
          <p style={{ fontSize: '12px', color: '#4B5563', marginTop: '16px' }}>Free plan available · No credit card required</p>
        </section>

      </article>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1E2028', padding: '32px 24px', maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ width: '24px', height: '24px', background: '#AAFF00', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '12px', color: '#080A0E', fontFamily: 'Outfit, sans-serif' }}>Q</div>
          <span style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'Outfit, sans-serif' }}>Questme<span style={{ color: '#AAFF00' }}>.ai</span></span>
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/blog" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>Blog</Link>
          <Link href="/ai-product-knowledge-chatbot" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>Product Knowledge Bot</Link>
          <Link href="/whatsapp-ai-chatbot-for-business" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>WhatsApp Bot</Link>
        </div>
      </footer>

    </div>
  )
}
