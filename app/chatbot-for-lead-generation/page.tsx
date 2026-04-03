import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Chatbot for Lead Generation | Questme.ai',
  description: 'Use Questme.ai as a chatbot for lead generation. Engage website visitors, answer their questions, and capture leads automatically — powered by your business knowledge.',
  alternates: { canonical: 'https://www.questme.ai/chatbot-for-lead-generation' },
}

export default function ChatbotForLeadGeneration() {
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
          Lead Generation Automation
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1.5px', fontFamily: 'Outfit, sans-serif' }}>
          Chatbot for<br />
          <span style={{ color: '#AAFF00' }}>Lead Generation</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '36px', maxWidth: '620px' }}>
          Questme.ai turns your website chatbot into a lead generation engine — engaging visitors, answering their questions, and capturing contact details automatically, around the clock.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/sign-up" className="btn-accent" style={{ fontSize: '16px', padding: '14px 32px' }}>Start for free →</Link>
          <Link href="/" className="btn-ghost" style={{ fontSize: '16px', padding: '14px 32px' }}>See how it works</Link>
        </div>
      </section>

      {/* Content */}
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 80px' }}>

        <section style={{ marginBottom: '52px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Why Most Website Visitors Leave Without Converting
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            The majority of people who visit a business website leave without taking any action — no signup, no purchase, no enquiry sent. Many of them were genuinely interested. They just ran into friction before they could convert: a question they could not easily answer, a pricing detail they could not find, or simply a moment where waiting for a reply felt like too much effort.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            A chatbot for lead generation addresses this directly. Instead of letting visitors browse passively until they give up, a chatbot engages them, answers what they need to know, and creates a natural moment to capture their contact details — while they are still interested, still on the page, still ready to hear from you.
          </p>
        </section>

        <section style={{ marginBottom: '52px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            How a Chatbot Captures Leads Automatically
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Lead capture through a chatbot works differently from a contact form. A form asks for commitment upfront — the visitor must provide their details before they receive anything in return. A chatbot gives value first: it answers the visitor&apos;s questions, provides useful information about your products or services, and then — at a moment when the visitor has already received something helpful — asks for an email address to continue the conversation or send follow-up information.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            This sequencing produces better results. Visitors are more willing to share their contact details after experiencing a genuinely useful interaction than before it. The leads you capture this way have already demonstrated specific interest by asking real questions about your business.
          </p>
        </section>

        <section style={{ marginBottom: '52px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '16px', padding: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            AI Chat Support That Engages Visitors in Real Time
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            The chatbot acts as AI chat support for every visitor, at the moment they need it. A visitor reading your pricing page who wonders whether a specific feature is included can ask immediately and get an answer in seconds — rather than leaving the page to hunt for the information or submitting a form and waiting until the next business day.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            Real-time engagement is what separates a chatbot for lead generation from passive lead capture methods like forms or gated downloads. The chatbot meets the visitor in the middle of their decision-making process and supports it, rather than interrupting it with a request.
          </p>
        </section>

        <section style={{ marginBottom: '52px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Trained on Your Products, Pricing, and Services
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            The quality of a lead generation chatbot depends entirely on the quality of the answers it can give. Generic AI gives generic answers, which fail to convert visitors who have specific, real questions about your specific business.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Questme.ai trains the chatbot on your own content — product pages, pricing details, service descriptions, FAQs, policies. When a visitor asks about your pricing or whether your product works for their use case, the bot answers from your actual documentation. The accuracy of the response is what builds the trust that leads to sharing a contact detail.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            You update your content any time — add products, revise pricing, adjust service scope — and the chatbot reflects those changes immediately.
          </p>
        </section>

        <section style={{ marginBottom: '52px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Works as an AI Enquiry Response System at Scale
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            As your website traffic grows, the chatbot scales without any additional cost or complexity. A human live chat setup would require more agents as traffic increases. An AI enquiry response system handles one conversation or one thousand conversations with the same response quality and the same speed.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            All leads captured — email addresses, conversation context, the questions each visitor asked — are stored in your Questme.ai dashboard. Your sales or marketing team has a clean record of every conversation, making follow-up focused and informed rather than cold. See our full guide on{' '}
            <Link href="/website-ai-chatbot-for-lead-generation" style={{ color: '#AAFF00', textDecoration: 'none' }}>website AI chatbot for lead generation</Link>.
          </p>
        </section>

        <section style={{ marginBottom: '52px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            WhatsApp AI Chatbot for Lead Capture Too
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Lead generation does not only happen on your website. In markets across Southeast Asia, a significant volume of inbound enquiries arrives via WhatsApp. A WhatsApp AI chatbot powered by Questme.ai handles these automatically — answering questions, capturing contact information, and qualifying leads that arrive through WhatsApp as well as through your website.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            The same knowledge base powers both channels. A prospect who messages on WhatsApp at 10pm gets the same quality of information as one who uses the website chat widget during business hours. Learn more about{' '}
            <Link href="/whatsapp-ai-chatbot-for-business" style={{ color: '#AAFF00', textDecoration: 'none' }}>WhatsApp AI chatbot for business</Link>.
          </p>
        </section>

        <section style={{ marginBottom: '52px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Works for Small Business as Well as Enterprise
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Large businesses benefit from the scale a chatbot for lead generation provides — thousands of conversations handled automatically without proportional staffing costs. But a chatbot for small business is equally valuable. A small team cannot engage every website visitor in real time. An AI chatbot can, and it does so at a cost that makes sense for businesses at every stage.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            For small businesses in particular, the leads captured overnight — visitors who came during off-hours and would otherwise have left without a trace — often represent the clearest return on investment. Read more on our page about{' '}
            <Link href="/ai-chatbot-for-business" style={{ color: '#AAFF00', textDecoration: 'none' }}>AI chatbot for business</Link>.
          </p>
        </section>

        {/* Related pages */}
        <section style={{ marginBottom: '52px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '12px', padding: '24px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#AAFF00', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Related guides</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              ['Website AI Chatbot', '/website-ai-chatbot'],
              ['Website AI Chatbot for Lead Generation', '/website-ai-chatbot-for-lead-generation'],
              ['AI Chatbot for Business', '/ai-chatbot-for-business'],
              ['WhatsApp AI Chatbot for Business', '/whatsapp-ai-chatbot-for-business'],
            ].map(([label, href]) => (
              <Link key={href} href={href} style={{ fontSize: '14px', color: '#9CA3AF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#AAFF00', fontSize: '12px' }}>→</span>{label}
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: '52px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '32px' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: '10px', color: '#F0F0F0' }}>
                How does a chatbot for lead generation work?
              </h3>
              <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: 1.8 }}>
                A chatbot for lead generation engages website visitors in conversation, answers their questions using your business knowledge, and collects contact information — typically an email address — at a natural point in the interaction. The lead details are stored for your team to follow up. Unlike a contact form, the chatbot provides value before asking for anything, which makes visitors more willing to share their details.
              </p>
            </div>

            <div style={{ borderTop: '1px solid #1E2028', paddingTop: '28px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: '10px', color: '#F0F0F0' }}>
                What is the difference between AI chat support and a lead capture form?
              </h3>
              <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: 1.8 }}>
                A lead capture form is passive — it sits on a page waiting for the visitor to decide to fill it in. AI chat support is active — it engages visitors, responds to their specific questions, and creates a two-way interaction. Forms ask for commitment before delivering value. AI chat support delivers value first, which produces warmer, better-qualified leads. The conversion rate from chatbot-captured leads is typically higher because those visitors have already demonstrated specific interest.
              </p>
            </div>

            <div style={{ borderTop: '1px solid #1E2028', paddingTop: '28px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: '10px', color: '#F0F0F0' }}>
                Can a chatbot for small business handle lead generation effectively?
              </h3>
              <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: 1.8 }}>
                Yes. Small businesses often benefit most from chatbot lead generation because they lack the staff to engage every visitor in real time. An AI chatbot does not require a person to be available — it handles conversations automatically, at any hour. For a small business, this means leads that arrive outside working hours are captured rather than lost. Questme.ai is priced to be accessible for small businesses, with a free plan and affordable paid tiers.
              </p>
            </div>

            <div style={{ borderTop: '1px solid #1E2028', paddingTop: '28px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: '10px', color: '#F0F0F0' }}>
                How does an AI enquiry response system qualify leads?
              </h3>
              <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: 1.8 }}>
                An AI enquiry response system qualifies leads through the questions they ask. A visitor who asks about pricing, specific product features, or service availability has demonstrated intent — they are evaluating whether your offering fits their needs. The chatbot records what each visitor asked, giving your sales team context when they follow up. This means follow-up conversations start informed rather than cold.
              </p>
            </div>

          </div>
        </section>

        {/* CTA */}
        <section style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '20px', padding: '48px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Start Capturing Leads with<br /><span style={{ color: '#AAFF00' }}>Your AI Chatbot</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', marginBottom: '32px', maxWidth: '440px', margin: '0 auto 32px' }}>
            Train the AI on your business, deploy on your website and WhatsApp, and start capturing qualified leads from day one.
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
          <Link href="/website-ai-chatbot-for-lead-generation" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>Lead Gen Bot</Link>
          <Link href="/ai-chatbot-for-business" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>AI Chatbot for Business</Link>
        </div>
      </footer>

    </div>
  )
}
