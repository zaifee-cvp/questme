'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { companySettingsSchema, type CompanySettingsInput } from '@/schemas'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Textarea, FormField, Spinner, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Upload, Check, AlertCircle } from 'lucide-react'

const TIMEZONES = [
  'UTC', 'Asia/Singapore', 'Asia/Kuala_Lumpur', 'Asia/Jakarta',
  'Asia/Bangkok', 'Asia/Hong_Kong', 'Asia/Tokyo', 'Asia/Seoul',
  'Australia/Sydney', 'Europe/London', 'America/New_York', 'America/Los_Angeles',
]

export default function SettingsPage() {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [company, setCompany] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [saveError, setSaveError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CompanySettingsInput>({
    resolver: zodResolver(companySettingsSchema),
  })

  useEffect(() => {
    const fetchCompany = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles').select('company_id').eq('id', user.id).single()
      if (!profile) return
      const { data: co } = await supabase
        .from('companies').select('*').eq('id', profile.company_id).single()
      if (co) {
        setCompany(co)
        setLogoUrl(co.logo_url)
        reset({
          company_name: co.company_name,
          company_email: co.company_email,
          company_phone: co.company_phone ?? '',
          company_address: co.company_address ?? '',
          timezone: co.timezone,
          pdf_footer: co.pdf_footer ?? '',
          email_template_subject: co.email_template_subject ?? '',
          email_template_body: co.email_template_body ?? '',
          swo_prefix: co.swo_prefix,
          report_prefix: co.report_prefix,
          timer_enabled: co.timer_enabled,
          timer_minutes: co.timer_minutes,
          extension_minutes: co.extension_minutes,
          require_extension_reason: co.require_extension_reason,
        })
      }
      setLoading(false)
    }
    fetchCompany()
  }, [])

  const onSubmit = async (data: CompanySettingsInput) => {
    if (!company) return
    setSaveLoading(true)
    setSaveStatus('idle')
    setSaveError(null)
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          company_name: data.company_name,
          company_email: data.company_email,
          company_phone: data.company_phone || null,
          company_address: data.company_address || null,
          timezone: data.timezone,
          pdf_footer: data.pdf_footer || null,
          email_template_subject: data.email_template_subject || null,
          email_template_body: data.email_template_body || null,
          swo_prefix: data.swo_prefix,
          report_prefix: data.report_prefix,
          timer_enabled: data.timer_enabled,
          timer_minutes: data.timer_minutes,
          extension_minutes: data.extension_minutes,
          require_extension_reason: data.require_extension_reason,
        })
        .eq('id', company.id)
      if (error) throw error
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (err: any) {
      setSaveStatus('error')
      setSaveError(err.message)
    } finally {
      setSaveLoading(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !company) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Please upload a JPG, PNG or WebP image')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be under 2MB')
      return
    }

    setLogoUploading(true)
    const ext = file.name.split('.').pop()
    const path = `companies/${company.id}/logos/logo.${ext}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('fieldsign-assets')
        .upload(path, file, { upsert: true, contentType: file.type })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('fieldsign-assets')
        .getPublicUrl(path)

      await supabase.from('companies').update({ logo_url: publicUrl }).eq('id', company.id)
      setLogoUrl(publicUrl + '?t=' + Date.now())
    } catch (err: any) {
      alert('Upload failed: ' + err.message)
    } finally {
      setLogoUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your company profile, branding, and platform configuration</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Logo */}
        <Card>
          <CardHeader><CardTitle>Company Logo</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-full w-full object-contain p-1" />
                ) : (
                  <Upload className="h-6 w-6 text-gray-300" />
                )}
              </div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  loading={logoUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-3.5 w-3.5 mr-1" />
                  {logoUploading ? 'Uploading...' : 'Upload Logo'}
                </Button>
                <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or WebP. Max 2MB. Recommended: 200×60px</p>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Profile */}
        <Card>
          <CardHeader><CardTitle>Company Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Company Name" required error={errors.company_name?.message}>
                <Input {...register('company_name')} error={errors.company_name?.message} />
              </FormField>
              <FormField label="Company Email" required error={errors.company_email?.message}>
                <Input type="email" {...register('company_email')} error={errors.company_email?.message} />
              </FormField>
              <FormField label="Phone Number" error={errors.company_phone?.message}>
                <Input {...register('company_phone')} placeholder="+65 6123 4567" />
              </FormField>
              <FormField label="Timezone" required error={errors.timezone?.message}>
                <select {...register('timezone')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                </select>
              </FormField>
            </div>
            <FormField label="Company Address" error={errors.company_address?.message}>
              <Textarea {...register('company_address')} placeholder="123 Business Road, Singapore 123456" rows={2} />
            </FormField>
          </CardContent>
        </Card>

        {/* Identifier Prefixes */}
        <Card>
          <CardHeader>
            <CardTitle>Identifier Prefixes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">Configure prefixes for auto-generated SWO and Report numbers. Changes affect future records only.</p>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="SWO Prefix" required error={errors.swo_prefix?.message} hint="e.g. SWO → SWO-000001">
                <Input {...register('swo_prefix')} placeholder="SWO" className="uppercase" error={errors.swo_prefix?.message} />
              </FormField>
              <FormField label="Report Prefix" required error={errors.report_prefix?.message} hint="e.g. SR → SR-000001">
                <Input {...register('report_prefix')} placeholder="SR" className="uppercase" error={errors.report_prefix?.message} />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Timer Settings */}
        <Card>
          <CardHeader><CardTitle>Report Timer</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              The report timer counts down during report completion. It helps ensure timely submissions and tracks if extensions were needed.
            </p>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="timer_enabled" {...register('timer_enabled')} className="h-4 w-4 rounded border-gray-300" />
              <label htmlFor="timer_enabled" className="text-sm text-gray-700 font-medium">Enable report timer</label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Timer Duration (minutes)" required error={errors.timer_minutes?.message}>
                <Input type="number" min={1} max={60} {...register('timer_minutes', { valueAsNumber: true })} error={errors.timer_minutes?.message} />
              </FormField>
              <FormField label="Extension Duration (minutes)" required error={errors.extension_minutes?.message}>
                <Input type="number" min={1} max={60} {...register('extension_minutes', { valueAsNumber: true })} error={errors.extension_minutes?.message} />
              </FormField>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="require_extension_reason" {...register('require_extension_reason')} className="h-4 w-4 rounded border-gray-300" />
              <label htmlFor="require_extension_reason" className="text-sm text-gray-700">Require technician to provide a reason for requesting an extension</label>
            </div>
          </CardContent>
        </Card>

        {/* PDF Settings */}
        <Card>
          <CardHeader><CardTitle>PDF Report Footer</CardTitle></CardHeader>
          <CardContent>
            <FormField label="Footer Text" error={errors.pdf_footer?.message} hint="This text appears at the bottom of every generated PDF report">
              <Textarea {...register('pdf_footer')} placeholder="Thank you for choosing our services." rows={2} />
            </FormField>
          </CardContent>
        </Card>

        {/* Email Template */}
        <Card>
          <CardHeader><CardTitle>Email Template</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Available variables: <code className="bg-gray-100 px-1 rounded text-xs">{'{{report_no}}'}</code>{' '}
              <code className="bg-gray-100 px-1 rounded text-xs">{'{{client_name}}'}</code>{' '}
              <code className="bg-gray-100 px-1 rounded text-xs">{'{{service_date}}'}</code>{' '}
              <code className="bg-gray-100 px-1 rounded text-xs">{'{{company_name}}'}</code>{' '}
              <code className="bg-gray-100 px-1 rounded text-xs">{'{{technician_name}}'}</code>
            </p>
            <FormField label="Email Subject" error={errors.email_template_subject?.message}>
              <Input {...register('email_template_subject')} placeholder="Service Completion Report - {{report_no}}" />
            </FormField>
            <FormField label="Email Body" error={errors.email_template_body?.message}>
              <Textarea {...register('email_template_body')} rows={6} placeholder="Dear {{client_name}},&#10;&#10;Please find attached your service report {{report_no}}..." />
            </FormField>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <Button type="submit" size="lg" loading={saveLoading}>
            {saveLoading ? 'Saving...' : 'Save Settings'}
          </Button>
          {saveStatus === 'success' && (
            <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
              <Check className="h-4 w-4" />Settings saved successfully
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center gap-1.5 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />{saveError}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
