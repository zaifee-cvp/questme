// app/dashboard/customers/import/page.tsx
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Upload,
  FileText,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react'

type Step = 'upload' | 'mapping' | 'preview' | 'complete'

interface ColumnMapping {
  column: string
  field: string
}

export default function ImportCustomersPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [columns, setColumns] = useState<string[]>([])
  const [mappings, setMappings] = useState<ColumnMapping[]>([])
  const [preview, setPreview] = useState<Record<string, string>[]>([])
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{
    imported: number
    skipped: number
    errors: number
  } | null>(null)
  const [error, setError] = useState('')

  const FIELD_OPTIONS = [
    { value: 'skip', label: 'Skip' },
    { value: 'name', label: 'Name' },
    { value: 'phone', label: 'Phone' },
    { value: 'email', label: 'Email' },
    { value: 'notes', label: 'Notes' },
    { value: 'tags', label: 'Tags' },
    { value: 'is_first_time', label: 'First Time' },
  ]

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setError('')

    const formData = new FormData()
    formData.append('file', selected)

    try {
      const res = await fetch('/api/import/parse', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        setColumns(data.columns || [])
        setPreview(data.preview || [])
        setMappings(
          (data.columns || []).map((col: string) => ({
            column: col,
            field: guessField(col),
          }))
        )
        setStep('mapping')
      } else {
        setError(data.error || 'Failed to parse file')
      }
    } catch {
      setError('Failed to upload file')
    }
  }

  const guessField = (col: string): string => {
    const lower = col.toLowerCase()
    if (lower.includes('name')) return 'name'
    if (lower.includes('phone') || lower.includes('mobile')) return 'phone'
    if (lower.includes('email')) return 'email'
    if (lower.includes('note')) return 'notes'
    if (lower.includes('tag')) return 'tags'
    return 'skip'
  }

  const updateMapping = (index: number, field: string) => {
    setMappings((prev) =>
      prev.map((m, i) => (i === index ? { ...m, field } : m))
    )
  }

  const handleImport = async () => {
    setImporting(true)
    setError('')

    try {
      const fieldMapping: Record<string, string> = {}
      mappings.forEach((m) => {
        if (m.field !== 'skip') {
          fieldMapping[m.column] = m.field
        }
      })

      const formData = new FormData()
      if (file) formData.append('file', file)
      formData.append('mapping', JSON.stringify(fieldMapping))

      const res = await fetch('/api/import/execute', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        setResult({
          imported: data.imported || 0,
          skipped: data.skipped || 0,
          errors: data.errors || 0,
        })
        setStep('complete')
      } else {
        setError(data.error || 'Import failed')
      }
    } catch {
      setError('Import failed')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-[12px]">
        {(['upload', 'mapping', 'preview', 'complete'] as Step[]).map(
          (s, i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <div className="h-px w-8 bg-stone-200" />}
              <span
                className={`rounded-full px-2.5 py-0.5 font-medium capitalize ${
                  step === s
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-stone-400'
                }`}
              >
                {s}
              </span>
            </div>
          )
        )}
      </div>

      {error && (
        <div
          className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-700"
          style={{ border: '0.5px solid' }}
        >
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Upload step */}
      {step === 'upload' && (
        <div
          className="rounded-2xl bg-white p-8 text-center"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <Upload className="mx-auto mb-4 h-12 w-12 text-stone-300" />
          <h2 className="text-[15px] font-medium text-stone-800">
            Upload Customer File
          </h2>
          <p className="mt-1 text-[13px] text-stone-400">
            Supported formats: CSV, XLSX, VCF, JSON
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls,.vcf,.json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary mx-auto mt-5 flex items-center gap-2"
          >
            <FileText className="h-4 w-4" /> Choose File
          </button>
          {file && (
            <p className="mt-3 text-[12px] text-stone-500">
              Selected: {file.name}
            </p>
          )}
        </div>
      )}

      {/* Mapping step */}
      {step === 'mapping' && (
        <div
          className="rounded-2xl bg-white p-6"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <h2 className="mb-4 text-[15px] font-medium text-stone-800">
            Map Columns
          </h2>
          <div className="space-y-3">
            {mappings.map((m, i) => (
              <div key={m.column} className="flex items-center gap-4">
                <span className="w-40 truncate text-[13px] font-medium text-stone-600">
                  {m.column}
                </span>
                <ArrowRight className="h-4 w-4 text-stone-300" />
                <select
                  value={m.field}
                  onChange={(e) => updateMapping(i, e.target.value)}
                  className="flex-1 rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                  style={{ border: '0.5px solid #e7e5e4' }}
                >
                  {FIELD_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => setStep('upload')}
              className="btn-ghost flex items-center gap-1.5 text-[13px]"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={() => setStep('preview')}
              className="btn-primary flex items-center gap-2 text-[13px]"
            >
              Preview <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Preview step */}
      {step === 'preview' && (
        <div
          className="rounded-2xl bg-white p-6"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <h2 className="mb-4 text-[15px] font-medium text-stone-800">
            Preview ({preview.length} rows)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="text-[11px] uppercase text-stone-400">
                  {columns.map((col) => (
                    <th key={col} className="px-3 py-2 font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 5).map((row, i) => (
                  <tr
                    key={i}
                    className="text-stone-600"
                    style={{ borderTop: '0.5px solid #e7e5e4' }}
                  >
                    {columns.map((col) => (
                      <td key={col} className="px-3 py-2">
                        {row[col] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => setStep('mapping')}
              className="btn-ghost flex items-center gap-1.5 text-[13px]"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={handleImport}
              disabled={importing}
              className="btn-primary flex items-center gap-2 text-[13px]"
            >
              {importing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Import <CheckCircle2 className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Complete step */}
      {step === 'complete' && result && (
        <div
          className="rounded-2xl bg-white p-8 text-center"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-500" />
          <h2 className="text-[15px] font-medium text-stone-800">
            Import Complete
          </h2>
          <div className="mt-4 flex justify-center gap-6 text-[13px]">
            <div>
              <p className="text-2xl font-medium text-emerald-600">
                {result.imported}
              </p>
              <p className="text-stone-400">Imported</p>
            </div>
            <div>
              <p className="text-2xl font-medium text-amber-600">
                {result.skipped}
              </p>
              <p className="text-stone-400">Skipped</p>
            </div>
            <div>
              <p className="text-2xl font-medium text-red-600">
                {result.errors}
              </p>
              <p className="text-stone-400">Errors</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard/customers')}
            className="btn-primary mx-auto mt-6"
          >
            View Customers
          </button>
        </div>
      )}
    </div>
  )
}
