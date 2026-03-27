// app/dashboard/templates/page.tsx
'use client'

import { useState } from 'react'
import {
  Layers,
  Stethoscope,
  HelpCircle,
  Tag,
  CheckCircle2,
  Loader2,
} from 'lucide-react'

interface Template {
  id: string
  category: 'service' | 'faq' | 'promotion'
  title: string
  description: string
  icon: React.ElementType
}

const TEMPLATES: Template[] = [
  {
    id: 'botox',
    category: 'service',
    title: 'Botox Treatment',
    description: 'Botox injection service with standard pricing and duration.',
    icon: Stethoscope,
  },
  {
    id: 'facial',
    category: 'service',
    title: 'Facial Treatment',
    description: 'Standard facial treatment with cleansing and moisturizing.',
    icon: Stethoscope,
  },
  {
    id: 'laser',
    category: 'service',
    title: 'Laser Hair Removal',
    description: 'Single-area laser hair removal session.',
    icon: Stethoscope,
  },
  {
    id: 'filler',
    category: 'service',
    title: 'Dermal Fillers',
    description: 'Hyaluronic acid dermal filler injection.',
    icon: Stethoscope,
  },
  {
    id: 'faq-hours',
    category: 'faq',
    title: 'Operating Hours',
    description: 'Answer about your business operating hours.',
    icon: HelpCircle,
  },
  {
    id: 'faq-parking',
    category: 'faq',
    title: 'Parking Information',
    description: 'Parking availability and directions.',
    icon: HelpCircle,
  },
  {
    id: 'faq-cancel',
    category: 'faq',
    title: 'Cancellation Policy',
    description: 'Your booking cancellation and rescheduling policy.',
    icon: HelpCircle,
  },
  {
    id: 'promo-first',
    category: 'promotion',
    title: 'First-Timer Discount',
    description: '15% off for first-time customers.',
    icon: Tag,
  },
  {
    id: 'promo-refer',
    category: 'promotion',
    title: 'Referral Discount',
    description: '10% off when referred by an existing customer.',
    icon: Tag,
  },
]

export default function TemplatesPage() {
  const [applying, setApplying] = useState<string | null>(null)
  const [applied, setApplied] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<'all' | 'service' | 'faq' | 'promotion'>(
    'all'
  )

  const filtered =
    filter === 'all'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === filter)

  const handleApply = async (templateId: string) => {
    setApplying(templateId)
    try {
      const res = await fetch('/api/templates/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      })
      if (res.ok) {
        setApplied((prev) => new Set(prev).add(templateId))
      }
    } finally {
      setApplying(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {(['all', 'service', 'faq', 'promotion'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full px-3 py-1.5 text-[12px] font-medium capitalize transition-colors ${
              filter === cat
                ? 'bg-amber-50 text-amber-700'
                : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl bg-white py-16"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <Layers className="mb-3 h-10 w-10 text-stone-300" />
          <p className="text-[14px] font-medium text-stone-600">
            No templates in this category
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tpl) => (
            <div
              key={tpl.id}
              className="rounded-2xl bg-white p-5"
              style={{ border: '0.5px solid #e7e5e4' }}
            >
              <div className="mb-3 flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                  <tpl.icon className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[14px] font-medium text-stone-800">
                    {tpl.title}
                  </h3>
                  <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium capitalize text-stone-500">
                    {tpl.category}
                  </span>
                </div>
              </div>
              <p className="mb-4 text-[12px] text-stone-400">
                {tpl.description}
              </p>
              {applied.has(tpl.id) ? (
                <span className="flex items-center gap-1.5 text-[12px] text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" /> Applied
                </span>
              ) : (
                <button
                  onClick={() => handleApply(tpl.id)}
                  disabled={applying === tpl.id}
                  className="btn-outline text-[12px]"
                >
                  {applying === tpl.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    'Apply Template'
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
