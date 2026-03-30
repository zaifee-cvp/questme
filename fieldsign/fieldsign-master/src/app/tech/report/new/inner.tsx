'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reportSubmissionSchema, type ReportSubmissionInput } from '@/schemas'
import { useTechSession } from '@/contexts/TechContext'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Textarea, FormField, Spinner, Modal } from '@/components/ui'
import { SignaturePad } from '@/components/tech/signature-pad'
import { TimerDisplay } from '@/components/tech/timer-display'
import { ArrowLeft, Check, ChevronRight, Search } from 'lucide-react'
import { getCurrentDate, getCurrentTime, calculateDurationMinutes } from '@/lib/utils/formatters'
import type { Service, ServiceField, Client } from '@/types'

type Step = 'client' | 'service' | 'form' | 'signature' | 'submitting' | 'success'

export default function NewReportInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { session } = useTechSession()
  const supabase = createClient()

  const swoId = searchParams.get('swo_id')

  // State
  const [step, setStep] = useState<Step>('client')
  const [company, setCompany] = useState<any>(null)
  const [prefilledSwo, setPrefilledSwo] = useState<any>(null)
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [serviceFields, setServiceFields] = useState<ServiceField[]>([])
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const [clientSearchQuery, setClientSearchQuery] = useState('')
  const [clientResults, setClientResults] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isNewClient, setIsNewClient] = useState(false)
  const [reportStartedAt] = useState(new Date().toISOString())
  const [extensionData, setExtensionData] = useState<{
    requested: boolean; reason: string; note: string; minutes: number
  }>({ requested: false, reason: '', note: '', minutes: 0 })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<{ report_no: string } | null>(null)

  // Client form fields
  const [clientName, setClientName] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [serviceAddress, setServiceAddress] = useState('')

  // Report form fields
  const [serviceDate, setServiceDate] = useState(getCurrentDate())
  const [startTime, setStartTime] = useState(getCurrentTime())
  const [endTime, setEndTime] = useState(getCurrentTime())
  const [workSummary, setWorkSummary] = useState('')
  const [timerExpired, setTimerExpired] = useState(false)

  // Validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!session) return
    loadInitialData()
  }, [session])

  const loadInitialData = async () => {
    if (!session) return

    // Load company settings
    const { data: co } = await supabase
      .from('companies')
      .select('*')
      .eq('id', session.company_id)
      .single()
    setCompany(co)

    // Load services
    const { data: svcs } = await supabase
      .from('services')
      .select('*')
      .eq('company_id', session.company_id)
      .eq('is_active', true)
      .order('sort_order')
    setServices(svcs ?? [])

    // If SWO provided, prefill
    if (swoId) {
      const { data: swo } = await supabase
        .from('swos')
        .select('*, client:clients(*), service:services(*)')
        .eq('id', swoId)
        .single()
      if (swo) {
        setPrefilledSwo(swo)
        if (swo.client) {
          setSelectedClient(swo.client)
          setClientName(swo.client.client_name)
          setContactNumber(swo.client.contact_number ?? '')
          setClientEmail(swo.client.email ?? '')
          setServiceAddress(swo.service_address ?? swo.client.address ?? '')
        }
        if (swo.service) {
          setSelectedService(swo.service)
          loadServiceFields(swo.service.id)
        }
      }
    }
  }

  const loadServiceFields = async (serviceId: string) => {
    const { data } = await supabase
      .from('service_fields')
      .select('*')
      .eq('service_id', serviceId)
      .order('sort_order')
    setServiceFields(data ?? [])
  }

  const searchClients = async (query: string) => {
    if (!query.trim() || !session) { setClientResults([]); return }
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('company_id', session.company_id)
      .ilike('client_name', `%${query}%`)
      .limit(8)
    setClientResults(data ?? [])
  }

  const selectExistingClient = (client: Client) => {
    setSelectedClient(client)
    setClientName(client.client_name)
    setContactNumber(client.contact_number ?? '')
    setClientEmail(client.email ?? '')
    setServiceAddress(client.address ?? '')
    setIsNewClient(false)
    setClientResults([])
    setClientSearchQuery('')
  }

  const handleServiceSelect = (svc: Service) => {
    setSelectedService(svc)
    loadServiceFields(svc.id)
  }

  const validateClientStep = () => {
    const errs: Record<string, string> = {}
    if (!clientName.trim()) errs.clientName = 'Client name is required'
    if (!contactNumber.trim()) errs.contactNumber = 'Contact number is required'
    if (!clientEmail.trim()) errs.clientEmail = 'Email is required'
    if (clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) errs.clientEmail = 'Invalid email'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateFormStep = () => {
    const errs: Record<string, string> = {}
    if (!serviceDate) errs.serviceDate = 'Service date is required'
    if (!startTime) errs.startTime = 'Start time is required'
    if (!endTime) errs.endTime = 'End time is required'
    if (!workSummary.trim()) errs.workSummary = 'Work summary is required'
    serviceFields.filter(f => f.is_required).forEach(f => {
      if (!fieldValues[f.field_key]?.trim()) errs[f.field_key] = `${f.field_label} is required`
    })
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!signatureData) {
      setFormErrors({ signature: 'Signature is required' })
      return
    }
    if (!session || !selectedService) return

    setStep('submitting')
    setSubmitError(null)

    try {
      const payload = {
        swo_id: swoId || undefined,
        company_id: session.company_id,
        technician_id: session.technician_id,
        technician_name: session.technician_name,
        client_id: selectedClient?.id,
        client_name: clientName,
        contact_number: contactNumber,
        client_email: clientEmail,
        service_address: serviceAddress,
        service_id: selectedService.id,
        service_date: serviceDate,
        start_time: startTime,
        end_time: endTime,
        work_summary: workSummary,
        field_values: fieldValues,
        report_started_at: reportStartedAt,
        extension_requested: extensionData.requested,
        extension_reason: extensionData.requested
          ? (extensionData.reason === 'Other' ? extensionData.note : extensionData.reason)
          : undefined,
        extension_minutes: extensionData.requested ? extensionData.minutes : undefined,
        signature_data: signatureData,
        is_new_client: isNewClient || !selectedClient,
      }

      const response = await fetch('/api/reports/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!result.success) throw new Error(result.error)

      setSuccessData({ report_no: result.data.service_report_no })
      setStep('success')
    } catch (err: any) {
      setSubmitError(err.message ?? 'Submission failed')
      setStep('signature')
    }
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen px-6 text-center">
        <div>
          <p className="text-gray-600 mb-4">Please scan your QR code to access the technician app.</p>
          <Button variant="outline" onClick={() => router.push('/tech')}>Go to App</Button>
        </div>
      </div>
    )
  }

  // SUCCESS
  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <Check className="h-10 w-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted!</h2>
        <p className="text-gray-500 text-sm mb-1">Service report number:</p>
        <p className="font-mono font-bold text-[#1e3a5f] text-xl mb-6">{successData?.report_no}</p>
        <p className="text-sm text-gray-400 mb-8">The report PDF has been emailed to the client and your company.</p>
        <Button size="xl" onClick={() => router.push('/tech')}>Back to Home</Button>
      </div>
    )
  }

  // SUBMITTING
  if (step === 'submitting') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Spinner size="lg" />
        <div className="text-center">
          <p className="font-semibold text-gray-900">Submitting Report...</p>
          <p className="text-sm text-gray-500 mt-1">Generating PDF and sending emails</p>
        </div>
      </div>
    )
  }

  const stepLabels: Record<Step, string> = {
    client: 'Client Details',
    service: 'Select Service',
    form: 'Report Details',
    signature: 'Signature',
    submitting: '',
    success: '',
  }

  const stepNumbers: Record<string, number> = { client: 1, service: 2, form: 3, signature: 4 }
  const currentStepNum = stepNumbers[step] ?? 1

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-[#1e3a5f] px-4 pt-10 pb-5">
        <button onClick={() => router.push('/tech')} className="flex items-center gap-2 text-[#9cb3cc] mb-3 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-white text-lg font-bold">
          {prefilledSwo ? `Report for ${prefilledSwo.swo_no}` : 'New Service Report'}
        </h1>
        {/* Step indicator */}
        <div className="flex items-center gap-1.5 mt-3">
          {[1, 2, 3, 4].map(n => (
            <div
              key={n}
              className={`h-1.5 rounded-full flex-1 transition-colors ${
                n < currentStepNum ? 'bg-green-400'
                : n === currentStepNum ? 'bg-white'
                : 'bg-[#ffffff30]'
              }`}
            />
          ))}
        </div>
        <p className="text-[#9cb3cc] text-xs mt-1.5">Step {currentStepNum} of 4: {stepLabels[step]}</p>
      </div>

      <div className="px-4 py-5">
        {/* Timer */}
        {company?.timer_enabled && step !== 'client' && step !== 'service' && (
          <TimerDisplay
            durationMinutes={company.timer_minutes}
            extensionMinutes={company.extension_minutes}
            requireReason={company.require_extension_reason}
            onExpire={() => setTimerExpired(true)}
            onExtension={(reason, note, mins) =>
              setExtensionData({ requested: true, reason, note, minutes: mins })
            }
          />
        )}

        {/* STEP 1: CLIENT */}
        {step === 'client' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-gray-900">Client Information</h2>

            {/* Search existing clients */}
            {!selectedClient && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Search Existing Client</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={clientSearchQuery}
                    onChange={e => { setClientSearchQuery(e.target.value); searchClients(e.target.value) }}
                    placeholder="Search by name..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                  />
                </div>
                {clientResults.length > 0 && (
                  <div className="mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {clientResults.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => selectExistingClient(c)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                      >
                        <p className="text-sm font-medium text-gray-900">{c.client_name}</p>
                        <p className="text-xs text-gray-400">{c.contact_number} · {c.email}</p>
                      </button>
                    ))}
                  </div>
                )}
                <div className="relative flex items-center my-4">
                  <div className="flex-1 border-t border-gray-200" />
                  <span className="px-3 text-xs text-gray-400 bg-gray-50">or enter new client</span>
                  <div className="flex-1 border-t border-gray-200" />
                </div>
              </div>
            )}

            {selectedClient && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-800">{selectedClient.client_name}</p>
                  <p className="text-xs text-green-600">Existing client selected</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedClient(null); setIsNewClient(false); setClientName(''); setContactNumber(''); setClientEmail(''); setServiceAddress('') }}
                  className="text-xs text-green-600 hover:text-green-800 underline"
                >
                  Change
                </button>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={clientName}
                onChange={e => { setClientName(e.target.value); setIsNewClient(!selectedClient) }}
                placeholder="Full client name"
                className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${formErrors.clientName ? 'border-red-500' : 'border-gray-200 focus:ring-[#1e3a5f]/20'}`}
              />
              {formErrors.clientName && <p className="text-xs text-red-500 mt-1">{formErrors.clientName}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={e => setContactNumber(e.target.value)}
                placeholder="+65 9123 4567"
                className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${formErrors.contactNumber ? 'border-red-500' : 'border-gray-200 focus:ring-[#1e3a5f]/20'}`}
              />
              {formErrors.contactNumber && <p className="text-xs text-red-500 mt-1">{formErrors.contactNumber}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={e => setClientEmail(e.target.value)}
                placeholder="client@email.com"
                className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${formErrors.clientEmail ? 'border-red-500' : 'border-gray-200 focus:ring-[#1e3a5f]/20'}`}
              />
              {formErrors.clientEmail && <p className="text-xs text-red-500 mt-1">{formErrors.clientEmail}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Service Address</label>
              <textarea
                value={serviceAddress}
                onChange={e => setServiceAddress(e.target.value)}
                placeholder="Site address for this job"
                rows={2}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 resize-none"
              />
            </div>

            <Button
              size="xl"
              className="w-full"
              onClick={() => {
                if (validateClientStep()) setStep('service')
              }}
            >
              Continue <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {/* STEP 2: SERVICE SELECTION */}
        {step === 'service' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-gray-900">Select Service Type</h2>
            {services.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">No services configured. Please contact your admin.</p>
            ) : (
              <div className="space-y-2">
                {services.map(svc => (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => handleServiceSelect(svc)}
                    className={`w-full text-left px-4 py-4 rounded-xl border transition-colors ${
                      selectedService?.id === svc.id
                        ? 'border-[#1e3a5f] bg-[#f0f4f9]'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className={`font-medium text-sm ${selectedService?.id === svc.id ? 'text-[#1e3a5f]' : 'text-gray-900'}`}>
                        {svc.service_name}
                      </p>
                      {selectedService?.id === svc.id && (
                        <Check className="h-4 w-4 text-[#1e3a5f]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" size="xl" onClick={() => setStep('client')} className="flex-1">Back</Button>
              <Button
                size="xl"
                className="flex-1"
                disabled={!selectedService}
                onClick={() => setStep('form')}
              >
                Continue <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: REPORT FORM */}
        {step === 'form' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-gray-900">Report Details</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-xs text-blue-700">
                <span className="font-semibold">Service:</span> {selectedService?.service_name}
                {' · '}
                <span className="font-semibold">Technician:</span> {session.technician_name}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Service Date <span className="text-red-500">*</span></label>
              <input type="date" value={serviceDate} onChange={e => setServiceDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Start Time <span className="text-red-500">*</span></label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
                {formErrors.startTime && <p className="text-xs text-red-500 mt-1">{formErrors.startTime}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">End Time <span className="text-red-500">*</span></label>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
                {formErrors.endTime && <p className="text-xs text-red-500 mt-1">{formErrors.endTime}</p>}
              </div>
            </div>

            {/* Dynamic service fields */}
            {serviceFields.map(field => (
              <div key={field.id}>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  {field.field_label}
                  {field.is_required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.field_type === 'text' && (
                  <input type="text" value={fieldValues[field.field_key] ?? ''} onChange={e => setFieldValues(p => ({ ...p, [field.field_key]: e.target.value }))}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${formErrors[field.field_key] ? 'border-red-500' : 'border-gray-200 focus:ring-[#1e3a5f]/20'}`} />
                )}
                {field.field_type === 'textarea' && (
                  <textarea value={fieldValues[field.field_key] ?? ''} onChange={e => setFieldValues(p => ({ ...p, [field.field_key]: e.target.value }))} rows={3}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 resize-none ${formErrors[field.field_key] ? 'border-red-500' : 'border-gray-200 focus:ring-[#1e3a5f]/20'}`} />
                )}
                {field.field_type === 'number' && (
                  <input type="number" value={fieldValues[field.field_key] ?? ''} onChange={e => setFieldValues(p => ({ ...p, [field.field_key]: e.target.value }))}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${formErrors[field.field_key] ? 'border-red-500' : 'border-gray-200 focus:ring-[#1e3a5f]/20'}`} />
                )}
                {field.field_type === 'date' && (
                  <input type="date" value={fieldValues[field.field_key] ?? ''} onChange={e => setFieldValues(p => ({ ...p, [field.field_key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20" />
                )}
                {field.field_type === 'dropdown' && (
                  <select value={fieldValues[field.field_key] ?? ''} onChange={e => setFieldValues(p => ({ ...p, [field.field_key]: e.target.value }))}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${formErrors[field.field_key] ? 'border-red-500' : 'border-gray-200 focus:ring-[#1e3a5f]/20'}`}>
                    <option value="">-- Select --</option>
                    {(Array.isArray(field.field_options) ? field.field_options : []).map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
                {field.field_type === 'checkbox' && (
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={fieldValues[field.field_key] === 'true'} onChange={e => setFieldValues(p => ({ ...p, [field.field_key]: e.target.checked ? 'true' : 'false' }))}
                      className="h-4 w-4 rounded border-gray-300" />
                    <span className="text-sm text-gray-700">Yes</span>
                  </div>
                )}
                {formErrors[field.field_key] && <p className="text-xs text-red-500 mt-1">{formErrors[field.field_key]}</p>}
              </div>
            ))}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Work Summary <span className="text-red-500">*</span></label>
              <textarea value={workSummary} onChange={e => setWorkSummary(e.target.value)} rows={4}
                placeholder="Describe the work carried out..."
                className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 resize-y ${formErrors.workSummary ? 'border-red-500' : 'border-gray-200 focus:ring-[#1e3a5f]/20'}`} />
              {formErrors.workSummary && <p className="text-xs text-red-500 mt-1">{formErrors.workSummary}</p>}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="xl" onClick={() => setStep('service')} className="flex-1">Back</Button>
              <Button size="xl" className="flex-1" onClick={() => { if (validateFormStep()) setStep('signature') }}>
                Continue <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: SIGNATURE */}
        {step === 'signature' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-gray-900">Customer Signature</h2>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Client</span><span className="font-medium">{clientName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Service</span><span className="font-medium">{selectedService?.service_name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{serviceDate}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-medium">{calculateDurationMinutes(startTime, endTime)} min</span></div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Customer Signature <span className="text-red-500">*</span>
              </label>
              <SignaturePad onSignature={setSignatureData} />
              {formErrors.signature && <p className="text-xs text-red-500 mt-1">{formErrors.signature}</p>}
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" size="xl" onClick={() => setStep('form')} className="flex-1">Back</Button>
              <Button
                size="xl"
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={!signatureData}
                onClick={handleSubmit}
              >
                Submit Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
