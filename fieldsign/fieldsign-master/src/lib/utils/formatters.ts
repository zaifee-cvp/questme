import { format, parseISO, differenceInMinutes } from 'date-fns'

// ============================================================
// DATE FORMATTERS
// ============================================================
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'dd MMM yyyy')
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'dd MMM yyyy HH:mm')
}

export function formatTime(time: string): string {
  // time format: HH:mm or HH:mm:ss
  if (!time) return ''
  const [h, m] = time.split(':')
  const hours = parseInt(h)
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${m} ${ampm}`
}

export function getCurrentDate(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getCurrentTime(): string {
  return format(new Date(), 'HH:mm')
}

// ============================================================
// DURATION CALCULATOR
// ============================================================
export function calculateDurationMinutes(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  const startMins = sh * 60 + sm
  const endMins = eh * 60 + em
  return Math.max(0, endMins - startMins)
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

// ============================================================
// STATUS BADGE COLORS
// ============================================================
export function getSwoStatusColor(status: string): string {
  const map: Record<string, string> = {
    'New': 'bg-blue-100 text-blue-800',
    'Assigned': 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-orange-100 text-orange-800',
    'Completed': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-gray-100 text-gray-600',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

export function getWorkOrderStatusColor(status: string): string {
  const map: Record<string, string> = {
    'Draft': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-green-100 text-green-800',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

// ============================================================
// SLUG GENERATOR
// ============================================================
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 50)
}

// ============================================================
// TRUNCATE TEXT
// ============================================================
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str
  return str.substring(0, maxLen) + '...'
}

// ============================================================
// SAFE JSON PARSE
// ============================================================
export function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

// ============================================================
// EMAIL TEMPLATE INTERPOLATION
// ============================================================
export function interpolateEmailTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '')
}

// ============================================================
// STORAGE PATH BUILDERS
// ============================================================
export function buildSignaturePath(companyId: string, workOrderId: string): string {
  return `companies/${companyId}/signatures/${workOrderId}.png`
}

export function buildPdfPath(companyId: string, workOrderId: string, year: number, month: number): string {
  const monthStr = String(month).padStart(2, '0')
  return `companies/${companyId}/reports/${year}/${monthStr}/${workOrderId}.pdf`
}

export function buildLogoPath(companyId: string, filename: string): string {
  return `companies/${companyId}/logos/${filename}`
}

export function buildQrPath(companyId: string, qrId: string): string {
  return `companies/${companyId}/qrcodes/${qrId}.png`
}

// ============================================================
// CLASS NAME HELPER
// ============================================================
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
