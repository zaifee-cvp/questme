// app/(public)/page.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  MessageSquare,
  Calendar,
  Gift,
  Clock,
  RefreshCw,
  Send,
  ArrowRight,
  Check,
  Star,
  Zap,
  Globe,
} from 'lucide-react'

const translations = {
  en: {
    badge: 'AI Receptionist for Dental Clinics',
    headline1: "Your clinic's front desk,",
    headline2: 'automated.',
    sub: 'Dentalys.ai answers patient enquiries, books dental appointments, and sends recall reminders — 24/7 on Telegram.',
    cta: 'Start 14-day free trial',
    ctaSub: 'No credit card · Setup in 10 minutes · Works worldwide',
  },
  ru: {
    badge: 'ИИ-администратор для стоматологических клиник',
    headline1: 'Стойка регистрации вашей стоматологии,',
    headline2: 'полностью автоматизирована.',
    sub: 'Отвечает на вопросы пациентов, записывает на приём и отправляет напоминания — 24/7 в Telegram.',
    cta: 'Начать 14-дневный бесплатный период',
    ctaSub: 'Без карты · Настройка за 10 минут',
  },
} as const

type Lang = keyof typeof translations

const LANG_OPTIONS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
]

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('en')
  const t = translations[lang]
  return (
    <div className="min-h-screen bg-[#f0fdf9]">
      {/* ============================================================ */}
      {/* STICKY NAV */}
      {/* ============================================================ */}
      <nav
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md"
        style={{ borderBottom: '0.5px solid #e7e5e4' }}
      >
        <div className="mx-auto flex h-[52px] max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-[15px] font-medium tracking-[-0.3px] text-stone-800"
          >
            dentalys.ai
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-[13px] text-stone-600 hover:text-stone-800 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-[13px] text-stone-600 hover:text-stone-800 transition-colors"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="text-[13px] text-stone-600 hover:text-stone-800 transition-colors"
            >
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="border-0 bg-transparent text-[13px] text-stone-500 focus:ring-0 cursor-pointer"
            >
              {LANG_OPTIONS.map((o) => (
                <option key={o.code} value={o.code}>{o.label}</option>
              ))}
            </select>
            <Link href="/login" className="btn-ghost text-[13px]">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary text-[13px]">
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* ============================================================ */}
      {/* HERO */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden px-6 pb-24 pt-20 text-center">
        <div
          className="pointer-events-none absolute inset-0 -top-40"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(14,168,149,0.10) 0%, transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-3xl">
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] text-stone-600"
            style={{ border: '0.5px solid #d6d3d1' }}
          >
            <Globe className="h-3.5 w-3.5 text-teal-600" />
            {t.badge}
          </div>
          <h1 className="text-[52px] font-medium leading-[1.08] tracking-[-1.5px] text-stone-900">
            {t.headline1}
            <br />
            <span className="text-brand-gradient">{t.headline2}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-stone-500">
            {t.sub}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup" className="btn-primary px-8 py-3 text-[15px]">
              {t.cta}
            </Link>
            <a
              href="#pricing"
              className="btn-outline px-8 py-3 text-[15px]"
            >
              See pricing <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
          <p className="mt-5 text-[13px] text-stone-400">
            {t.ctaSub}
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* GLOBAL REACH */}
      {/* ============================================================ */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-6 text-[13px] font-medium uppercase tracking-wider text-stone-400">
            Trusted by dental clinics worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              '🇸🇬 Singapore',
              '🇲🇾 Malaysia',
              '🇦🇪 UAE',
              '🇬🇧 UK',
              '🇦🇺 Australia',
              '🇹🇭 Thailand',
              '🇵🇭 Philippines',
              '🇮🇩 Indonesia',
              '🇺🇸 USA',
              '🇸🇦 Saudi Arabia',
              '🇭🇰 Hong Kong',
              '🇮🇳 India',
              '🇷🇺 Russia',
            ].map((country) => (
              <span
                key={country}
                className="inline-flex items-center rounded-full bg-white px-4 py-2 text-[13px] text-stone-600"
                style={{ border: '0.5px solid #e7e5e4' }}
              >
                {country}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PAIN POINTS */}
      {/* ============================================================ */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {[
            {
              title: 'After-hours enquiries go unanswered',
              desc: 'Patients message at 11pm. Nobody replies. They book elsewhere.',
              icon: Clock,
            },
            {
              title: 'Staff spend hours on repetitive questions',
              desc: 'Same questions about prices, availability, procedures — every single day.',
              icon: MessageSquare,
            },
            {
              title: 'Double bookings damage your reputation',
              desc: 'Manual scheduling causes conflicts and patient complaints.',
              icon: Calendar,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl bg-white p-6"
              style={{ border: '0.5px solid #e7e5e4' }}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
                <item.icon className="h-5 w-5 text-stone-500" />
              </div>
              <h3 className="mb-2 text-[15px] font-medium text-stone-800">
                {item.title}
              </h3>
              <p className="text-[14px] leading-relaxed text-stone-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* FEATURES */}
      {/* ============================================================ */}
      <section id="features" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[13px] font-medium uppercase tracking-wider text-teal-600">
              Features
            </p>
            <h2 className="text-[36px] font-medium tracking-[-1px] text-stone-900">
              Everything your front desk needs
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* AI Receptionist — wide card */}
            <div
              className="rounded-xl bg-stone-50 p-8 md:col-span-2"
              style={{ border: '0.5px solid #e7e5e4' }}
            >
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100">
                    <Zap className="h-5 w-5 text-teal-600" />
                  </div>
                  <h3 className="mb-2 text-[20px] font-medium text-stone-800">
                    AI Receptionist
                  </h3>
                  <p className="text-[15px] leading-relaxed text-stone-500">
                    Uses only your real data&nbsp;&mdash; never invents
                    information. Answers from your services, prices, and FAQs.
                  </p>
                </div>
                <div className="rounded-xl bg-white p-5" style={{ border: '0.5px solid #e7e5e4' }}>
                  <div className="space-y-3">
                    <div className="flex justify-end">
                      <div className="rounded-2xl rounded-br-md bg-stone-100 px-4 py-2.5 text-[14px] text-stone-700">
                        How much is a dental cleaning?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-bl-md bg-teal-50 px-4 py-2.5 text-[14px] text-stone-700">
                        Our routine cleaning starts at $120 for a 45-min session. New patients get 15% off with WELCOME15! 🦷
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature cards */}
            {[
              {
                icon: Calendar,
                title: 'Real-time Booking',
                desc: 'Patients pick a date, AI checks live availability and books instantly.',
              },
              {
                icon: Gift,
                title: 'First-timer Promotions',
                desc: 'Automatically applies welcome discounts for new patients.',
              },
              {
                icon: RefreshCw,
                title: 'Google Calendar Sync',
                desc: 'Two-way sync so your schedule is always up to date.',
              },
              {
                icon: Clock,
                title: '24/7 Availability',
                desc: 'Never miss a booking — your AI works around the clock.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl bg-stone-50 p-6"
                style={{ border: '0.5px solid #e7e5e4' }}
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
                  <feature.icon className="h-5 w-5 text-stone-500" />
                </div>
                <h3 className="mb-1 text-[15px] font-medium text-stone-800">
                  {feature.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-stone-500">
                  {feature.desc}
                </p>
              </div>
            ))}

            {/* Telegram card */}
            <div
              className="flex items-center gap-6 rounded-xl bg-stone-50 p-6 md:col-span-2"
              style={{ border: '0.5px solid #e7e5e4' }}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#229ED9]/10">
                <Send className="h-6 w-6 text-[#229ED9]" />
              </div>
              <div>
                <h3 className="mb-1 text-[15px] font-medium text-stone-800">
                  Telegram
                </h3>
                <p className="text-[14px] leading-relaxed text-stone-500">
                  Meet patients where they already are. Direct bot integration, instant setup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW IT WORKS */}
      {/* ============================================================ */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-[13px] font-medium uppercase tracking-wider text-teal-600">
              How it works
            </p>
            <h2 className="text-[36px] font-medium tracking-[-1px] text-stone-900">
              Go live in 10 minutes
            </h2>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Sign up and connect your bots',
                desc: 'Create your account and connect your Telegram bot in minutes.',
              },
              {
                step: '2',
                title: 'AI pre-loaded with your data',
                desc: 'Services, FAQ, and offers are auto-loaded. Just update pricing.',
              },
              {
                step: '3',
                title: 'Patients chat, book, get reminders',
                desc: 'Your AI handles everything — booking, follow-ups, and reminders.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-[18px] font-medium text-teal-700">
                  {item.step}
                </div>
                <h3 className="mb-2 text-[15px] font-medium text-stone-800">
                  {item.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-stone-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CHANNELS */}
      {/* ============================================================ */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <div
            className="rounded-xl bg-white p-8"
            style={{ border: '0.5px solid #e7e5e4' }}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#229ED9]/10">
              <Send className="h-6 w-6 text-[#229ED9]" />
            </div>
            <h3 className="mb-1 text-[18px] font-medium text-stone-800">
              ✈️ Telegram
            </h3>
            <p className="mb-3 text-[14px] leading-relaxed text-stone-500">
              Patients book appointments directly through your clinic&apos;s Telegram bot — available 24/7, in any language.
            </p>
            <p className="text-[13px] text-stone-400">
              Direct bot integration, instant setup
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PRICING TEASER */}
      {/* ============================================================ */}
      <section id="pricing" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[13px] font-medium uppercase tracking-wider text-teal-600">
              Pricing
            </p>
            <h2 className="text-[36px] font-medium tracking-[-1px] text-stone-900">
              Simple pricing for clinics worldwide
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Free Trial */}
            <div
              className="rounded-xl bg-stone-50 p-8"
              style={{ border: '0.5px solid #e7e5e4' }}
            >
              <p className="mb-1 text-[13px] font-medium text-stone-400">
                Free Trial
              </p>
              <p className="mb-4 text-[36px] font-medium tracking-tight text-stone-900">
                $0
                <span className="text-[15px] font-normal text-stone-400">
                  {' '}
                  / 14 days
                </span>
              </p>
              <p className="mb-6 text-[14px] text-stone-500">
                Full features included
              </p>
              <Link
                href="/signup"
                className="btn-outline w-full justify-center text-[14px]"
              >
                Start free trial
              </Link>
            </div>
            {/* Starter */}
            <div
              className="rounded-xl bg-stone-50 p-8"
              style={{ border: '0.5px solid #e7e5e4' }}
            >
              <p className="mb-1 text-[13px] font-medium text-stone-400">
                Starter
              </p>
              <p className="mb-4 text-[36px] font-medium tracking-tight text-stone-900">
                $88
                <span className="text-[15px] font-normal text-stone-400">
                  {' '}
                  USD/mo
                </span>
              </p>
              <p className="mb-6 text-[14px] text-stone-500">
                For growing clinics
              </p>
              <Link
                href="/signup?plan=starter"
                className="btn-outline w-full justify-center text-[14px]"
              >
                Get Starter
              </Link>
            </div>
            {/* Pro */}
            <div className="relative rounded-xl bg-[#1a1a1a] p-8 text-white">
              <span className="absolute -top-3 right-6 inline-flex rounded-full bg-teal-500 px-3 py-1 text-[11px] font-medium text-white">
                Most Popular
              </span>
              <p className="mb-1 text-[13px] font-medium text-stone-400">
                Pro
              </p>
              <p className="mb-4 text-[36px] font-medium tracking-tight text-white">
                $168
                <span className="text-[15px] font-normal text-stone-400">
                  {' '}
                  USD/mo
                </span>
              </p>
              <p className="mb-6 text-[14px] text-stone-400">
                For serious clinics
              </p>
              <Link
                href="/signup?plan=pro"
                className="inline-flex w-full items-center justify-center rounded-[20px] bg-white px-6 py-2.5 text-[14px] font-medium text-stone-800 hover:bg-stone-100 transition-colors"
              >
                Get Pro
              </Link>
            </div>
          </div>
          <p className="mt-6 text-center text-[13px] text-stone-400">
            Prices in USD · Accept payments in your local currency
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TESTIMONIALS */}
      {/* ============================================================ */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[13px] font-medium uppercase tracking-wider text-teal-600">
              Testimonials
            </p>
            <h2 className="text-[36px] font-medium tracking-[-1px] text-stone-900">
              Loved by clinics
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote: 'We never miss after-hours booking requests now.',
                name: 'Dr. Sarah Chen',
                clinic: 'Lumière Dental, Singapore',
              },
              {
                quote: 'Setup took 8 minutes. The AI handles Arabic patients perfectly.',
                name: 'Dr. Ahmed Al-Rashid',
                clinic: 'Bright Smile Dental, Dubai UAE',
              },
              {
                quote: 'It paid for itself in the first week of new patient bookings.',
                name: 'Dr. Emma Thompson',
                clinic: 'ClearDent Clinic, London UK',
              },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-xl bg-white p-6"
                style={{ border: '0.5px solid #e7e5e4' }}
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-teal-500 text-teal-500"
                    />
                  ))}
                </div>
                <p className="mb-4 text-[15px] leading-relaxed text-stone-700">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-[14px] font-medium text-stone-800">
                  {t.name}
                </p>
                <p className="text-[13px] text-stone-400">{t.clinic}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FINAL CTA */}
      {/* ============================================================ */}
      <section className="px-6 pb-24 pt-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-6 text-[36px] font-medium tracking-[-1px] text-stone-900">
            Stop missing bookings.
            <br />
            Start today.
          </h2>
          <Link href="/signup" className="btn-primary px-10 py-3.5 text-[15px]">
            Start free — 14 days on us
          </Link>
          <p className="mt-4 text-[13px] text-stone-400">
            No credit card required
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
      <footer
        className="bg-white px-6 py-12"
        style={{ borderTop: '0.5px solid #e7e5e4' }}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <p className="text-[15px] font-medium tracking-[-0.3px] text-stone-800">
              dentalys.ai
            </p>
            <p className="mt-1 text-[13px] text-stone-400">
              Made for clinics worldwide
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#pricing"
              className="text-[13px] text-stone-500 hover:text-stone-700 transition-colors"
            >
              Pricing
            </a>
            <Link
              href="/login"
              className="text-[13px] text-stone-500 hover:text-stone-700 transition-colors"
            >
              Login
            </Link>
            <span className="text-[13px] text-stone-500">Privacy</span>
            <span className="text-[13px] text-stone-500">Terms</span>
          </div>
          <p className="text-[12px] text-stone-400">
            &copy; 2025 dentalys.ai
          </p>
        </div>
      </footer>
    </div>
  )
}
