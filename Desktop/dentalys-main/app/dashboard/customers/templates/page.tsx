// app/dashboard/customers/templates/page.tsx
import Link from 'next/link'
import { FileDown, ArrowLeft } from 'lucide-react'

export default function ImportTemplatesPage() {
  const formats = [
    {
      name: 'CSV',
      description: 'Comma-separated values. Works with Excel, Google Sheets.',
      ext: 'csv',
    },
    {
      name: 'XLSX',
      description: 'Excel spreadsheet format.',
      ext: 'xlsx',
    },
    {
      name: 'VCF',
      description: 'vCard format. Export from phone contacts.',
      ext: 'vcf',
    },
    {
      name: 'JSON',
      description: 'JSON array of customer objects.',
      ext: 'json',
    },
  ]

  const fields = [
    { name: 'name', description: 'Customer full name', required: false },
    { name: 'phone', description: 'Phone number with country code', required: false },
    { name: 'email', description: 'Email address', required: false },
    { name: 'notes', description: 'Additional notes', required: false },
    { name: 'tags', description: 'Comma-separated tags', required: false },
    { name: 'is_first_time', description: 'true or false', required: false },
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/dashboard/customers/import"
        className="inline-flex items-center gap-1.5 text-[13px] text-stone-500 hover:text-stone-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to import
      </Link>

      {/* Download templates */}
      <div
        className="rounded-2xl bg-white p-6"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <h2 className="mb-4 text-[15px] font-medium text-stone-800">
          Download Templates
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {formats.map((fmt) => (
            <a
              key={fmt.ext}
              href={`/api/import/templates/${fmt.ext}`}
              className="flex items-start gap-3 rounded-xl bg-stone-50 p-4 hover:bg-amber-50 transition-colors"
              style={{ border: '0.5px solid #e7e5e4' }}
            >
              <FileDown className="mt-0.5 h-5 w-5 text-amber-600" />
              <div>
                <p className="text-[13px] font-medium text-stone-800">
                  {fmt.name} Template
                </p>
                <p className="mt-0.5 text-[12px] text-stone-400">
                  {fmt.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Field Reference */}
      <div
        className="rounded-2xl bg-white p-6"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <h2 className="mb-4 text-[15px] font-medium text-stone-800">
          Field Reference
        </h2>
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="text-[11px] uppercase text-stone-400">
              <th className="pb-3 font-medium">Field</th>
              <th className="pb-3 font-medium">Description</th>
              <th className="pb-3 font-medium">Required</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((f) => (
              <tr
                key={f.name}
                className="text-stone-600"
                style={{ borderTop: '0.5px solid #e7e5e4' }}
              >
                <td className="py-2.5">
                  <code className="rounded bg-stone-100 px-1.5 py-0.5 text-[12px]">
                    {f.name}
                  </code>
                </td>
                <td className="py-2.5">{f.description}</td>
                <td className="py-2.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      f.required
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {f.required ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
