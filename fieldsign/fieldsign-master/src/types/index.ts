// ============================================================
// FIELDSERVICE SAAS - GLOBAL TYPE DEFINITIONS
// ============================================================

export type UserRole = 'admin' | 'technician'
export type SwoStatus = 'New' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled'
export type WorkOrderStatus = 'Draft' | 'Completed'
export type TechnicianStatus = 'active' | 'inactive'
export type QrCodeStatus = 'active' | 'disabled'
export type EmailStatus = 'pending' | 'sent' | 'failed'
export type EmailRecipientType = 'client' | 'company'
export type SourceType = 'admin' | 'technician'
export type FieldType = 'text' | 'textarea' | 'number' | 'dropdown' | 'checkbox' | 'date'
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'unpaid'
export type SubscriptionPlan = 'starter' | 'growth' | 'business'

export interface Company {
  id: string
  company_name: string
  company_slug: string
  company_email: string
  company_phone: string | null
  company_address: string | null
  logo_url: string | null
  timezone: string
  pdf_footer: string | null
  email_template_subject: string | null
  email_template_body: string | null
  swo_prefix: string
  report_prefix: string
  timer_enabled: boolean
  timer_minutes: number
  extension_minutes: number
  require_extension_reason: boolean
  // Stripe billing
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: SubscriptionStatus | null
  subscription_plan: SubscriptionPlan | null
  trial_ends_at: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  company_id: string
  role: UserRole
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface Technician {
  id: string
  company_id: string
  user_id: string | null
  name: string
  email: string | null
  phone: string | null
  employee_id: string | null
  status: TechnicianStatus
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  company_id: string
  client_name: string
  contact_person: string | null
  contact_number: string | null
  email: string | null
  address: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  company_id: string
  service_name: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ServiceField {
  id: string
  company_id: string
  service_id: string
  field_label: string
  field_key: string
  field_type: FieldType
  field_options: string[] | null
  is_required: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Swo {
  id: string
  company_id: string
  swo_no: string
  client_id: string | null
  service_id: string | null
  technician_id: string | null
  created_by_user_id: string | null
  source_type: SourceType
  service_address: string | null
  job_instructions: string | null
  scheduled_date: string | null
  status: SwoStatus
  created_at: string
  updated_at: string
  // Joined fields
  client?: Client
  service?: Service
  technician?: Technician
}

export interface WorkOrder {
  id: string
  company_id: string
  swo_id: string | null
  service_report_no: string
  client_id: string | null
  technician_id: string | null
  service_id: string | null
  client_name: string
  contact_number: string | null
  client_email: string | null
  service_address: string | null
  technician_name: string
  service_date: string
  start_time: string | null
  end_time: string | null
  duration_minutes: number | null
  work_summary: string | null
  signature_url: string | null
  pdf_url: string | null
  report_started_at: string | null
  report_submitted_at: string | null
  extension_requested: boolean
  extension_reason: string | null
  extension_minutes: number | null
  status: WorkOrderStatus
  created_at: string
  updated_at: string
  // Joined fields
  swo?: Swo
  client?: Client
  service?: Service
  technician?: Technician
  field_values?: WorkOrderFieldValue[]
}

export interface WorkOrderFieldValue {
  id: string
  work_order_id: string
  service_field_id: string | null
  field_label: string
  field_key: string
  value_text: string | null
  value_json: unknown | null
  created_at: string
  updated_at: string
}

export interface QrCode {
  id: string
  company_id: string
  technician_id: string
  qr_token: string
  status: QrCodeStatus
  last_used_at: string | null
  created_at: string
  updated_at: string
  // Joined
  technician?: Technician
}

export interface EmailLog {
  id: string
  company_id: string
  work_order_id: string | null
  recipient_email: string
  recipient_type: EmailRecipientType
  subject: string
  status: EmailStatus
  provider_message_id: string | null
  error_message: string | null
  sent_at: string | null
  created_at: string
}

// ---- UI / Form Types ----

export interface QrValidationResult {
  technician_id: string
  technician_name: string
  company_id: string
  company_name: string
  qr_id: string
}

export interface ReportSubmissionPayload {
  // SWO
  swo_id?: string
  company_id: string
  technician_id: string
  technician_name: string
  // Client
  client_id?: string
  client_name: string
  contact_number: string
  client_email: string
  service_address: string
  // Service
  service_id: string
  // Report
  service_date: string
  start_time: string
  end_time: string
  work_summary: string
  // Dynamic fields
  field_values: Record<string, string>
  // Timer
  report_started_at: string
  extension_requested: boolean
  extension_reason?: string
  extension_minutes?: number
  // Signature (base64 PNG)
  signature_data: string
}

export interface ReportDashboardRow {
  id: string
  service_report_no: string
  swo_no: string | null
  client_name: string
  contact_number: string | null
  client_email: string | null
  service_name: string | null
  technician_name: string
  service_date: string
  start_time: string | null
  end_time: string | null
  duration_minutes: number | null
  extension_requested: boolean
  status: WorkOrderStatus
  pdf_url: string | null
}

export type ApiResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string }
