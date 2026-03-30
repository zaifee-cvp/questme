import { z } from 'zod'

// ============================================================
// COMPANY SCHEMAS
// ============================================================
export const companySettingsSchema = z.object({
  company_name: z.string().min(1, 'Company name is required').max(100),
  company_email: z.string().email('Invalid email address'),
  company_phone: z.string().optional().or(z.literal('')),
  company_address: z.string().optional().or(z.literal('')),
  timezone: z.string().min(1, 'Timezone is required'),
  pdf_footer: z.string().max(500).optional().or(z.literal('')),
  email_template_subject: z.string().max(200).optional().or(z.literal('')),
  email_template_body: z.string().max(2000).optional().or(z.literal('')),
  swo_prefix: z.string().min(1).max(10).regex(/^[A-Z0-9]+$/, 'Prefix must be uppercase letters/numbers only'),
  report_prefix: z.string().min(1).max(10).regex(/^[A-Z0-9]+$/, 'Prefix must be uppercase letters/numbers only'),
  timer_enabled: z.boolean(),
  timer_minutes: z.number().int().min(1).max(60),
  extension_minutes: z.number().int().min(1).max(60),
  require_extension_reason: z.boolean(),
})

export type CompanySettingsInput = z.infer<typeof companySettingsSchema>

// ============================================================
// AUTH SCHEMAS
// ============================================================
export const signupSchema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters').max(100),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type SignupInput = z.infer<typeof signupSchema>

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>

// ============================================================
// CLIENT SCHEMAS
// ============================================================
export const clientSchema = z.object({
  client_name: z.string().min(1, 'Client name is required').max(200),
  contact_person: z.string().max(100).optional().or(z.literal('')),
  contact_number: z.string().max(50).optional().or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  notes: z.string().max(1000).optional().or(z.literal('')),
})

export type ClientInput = z.infer<typeof clientSchema>

// ============================================================
// SERVICE SCHEMAS
// ============================================================
export const serviceSchema = z.object({
  service_name: z.string().min(1, 'Service name is required').max(200),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
})

export type ServiceInput = z.infer<typeof serviceSchema>

export const serviceFieldSchema = z.object({
  field_label: z.string().min(1, 'Field label is required').max(200),
  field_key: z.string().min(1).max(100).regex(/^[a-z0-9_]+$/, 'Key must be lowercase letters, numbers, underscores'),
  field_type: z.enum(['text', 'textarea', 'number', 'dropdown', 'checkbox', 'date']),
  field_options: z.array(z.string()).optional(),
  is_required: z.boolean().default(false),
  sort_order: z.number().int().min(0).default(0),
})

export type ServiceFieldInput = z.infer<typeof serviceFieldSchema>

// ============================================================
// TECHNICIAN SCHEMAS
// ============================================================
export const technicianSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(50).optional().or(z.literal('')),
  employee_id: z.string().max(50).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']).default('active'),
})

export type TechnicianInput = z.infer<typeof technicianSchema>

// ============================================================
// SWO SCHEMAS
// ============================================================
export const swoSchema = z.object({
  client_id: z.string().uuid().optional().or(z.literal('')),
  service_id: z.string().uuid().optional().or(z.literal('')),
  technician_id: z.string().uuid().optional().or(z.literal('')),
  service_address: z.string().max(500).optional().or(z.literal('')),
  job_instructions: z.string().max(2000).optional().or(z.literal('')),
  scheduled_date: z.string().optional().or(z.literal('')),
  status: z.enum(['New', 'Assigned', 'In Progress', 'Completed', 'Cancelled']).default('New'),
})

export type SwoInput = z.infer<typeof swoSchema>

// ============================================================
// REPORT SUBMISSION SCHEMA
// ============================================================
export const reportSubmissionSchema = z.object({
  swo_id: z.string().uuid().optional(),
  company_id: z.string().uuid(),
  technician_id: z.string().uuid(),
  technician_name: z.string().min(1),
  // Client
  client_id: z.string().uuid().optional(),
  client_name: z.string().min(1, 'Client name is required').max(200),
  contact_number: z.string().min(1, 'Contact number is required').max(50),
  client_email: z.string().email('Valid email required'),
  service_address: z.string().min(1, 'Service address is required').max(500),
  // Service
  service_id: z.string().uuid('Service is required'),
  // Report
  service_date: z.string().min(1, 'Service date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  work_summary: z.string().min(1, 'Work summary is required').max(5000),
  // Dynamic fields
  field_values: z.record(z.string(), z.string()),
  // Timer
  report_started_at: z.string(),
  extension_requested: z.boolean(),
  extension_reason: z.string().optional(),
  extension_minutes: z.number().optional(),
  // Signature
  signature_data: z.string().min(1, 'Signature is required'),
})

export type ReportSubmissionInput = z.infer<typeof reportSubmissionSchema>

// ============================================================
// TECH SWO CREATION (by technician)
// ============================================================
export const techSwoSchema = z.object({
  client_name: z.string().min(1, 'Client name is required').max(200),
  contact_number: z.string().min(1, 'Contact number is required').max(50),
  client_email: z.string().email('Valid email required'),
  address: z.string().max(500).optional().or(z.literal('')),
  service_id: z.string().uuid('Please select a service'),
  service_address: z.string().max(500).optional().or(z.literal('')),
  job_instructions: z.string().max(2000).optional().or(z.literal('')),
})

export type TechSwoInput = z.infer<typeof techSwoSchema>
