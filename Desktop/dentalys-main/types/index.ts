// types/index.ts

export type { Database } from './database'
export type {
  Business, BusinessInsert, BusinessUpdate,
  Profile, ProfileInsert, ProfileUpdate,
  Subscription, SubscriptionInsert, SubscriptionUpdate,
  Service, ServiceInsert, ServiceUpdate,
  Promotion, PromotionInsert, PromotionUpdate,
  BusinessHour, BusinessHourInsert, BusinessHourUpdate,
  Customer, CustomerInsert, CustomerUpdate,
  Booking, BookingInsert, BookingUpdate,
  FaqItem, FaqItemInsert, FaqItemUpdate,
  ConversationThread, ConversationThreadInsert, ConversationThreadUpdate,
  ConversationLog, ConversationLogInsert, ConversationLogUpdate,
  HandoffRequest, HandoffRequestInsert, HandoffRequestUpdate,
  CalendarConnection, CalendarConnectionInsert, CalendarConnectionUpdate,
  CustomerImport, CustomerImportInsert, CustomerImportUpdate,
  WhatsappTemplate, WhatsappTemplateInsert, WhatsappTemplateUpdate,
} from './database'

// ============================================================
// Core types
// ============================================================

export interface TimeSlot {
  start: string
  end: string
}

export interface ToolContext {
  businessId: string
  chatId: string
  timezone: string
  channel: 'telegram'
}

// ============================================================
// Tool result interfaces
// ============================================================

export interface GetServicesResult {
  services: Array<{
    id: string
    name: string
    description: string | null
    duration_minutes: number
    price: number | null
    currency: string
  }>
}

export interface GetFaqAnswerResult {
  answer: string | null
  question: string | null
  confidence: 'high' | 'medium' | 'low' | 'none'
}

export interface GetActivePromotionsResult {
  promotions: Array<{
    id: string
    title: string
    description: string | null
    discount_type: 'percentage' | 'fixed'
    discount_value: number
    promo_code: string | null
    first_time_only: boolean
  }>
}

export interface CheckFirstTimeCustomerResult {
  is_first_time: boolean
  customer_name: string | null
}

export interface GetAvailableSlotsResult {
  date: string
  slots: TimeSlot[]
  timezone: string
}

export interface CreateBookingResult {
  booking_id: string
  service_name: string
  start_time: string
  end_time: string
  status: string
  google_event_id?: string
}

export interface CreateHandoffResult {
  handoff_id: string
  status: string
  message: string
}

// ============================================================
// Telegram types
// ============================================================

export interface TelegramUser {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

export interface TelegramChat {
  id: number
  type: 'private' | 'group' | 'supergroup' | 'channel'
  first_name?: string
  last_name?: string
  username?: string
}

export interface TelegramVoice {
  file_id: string
  file_unique_id: string
  duration: number
  mime_type?: string
  file_size?: number
}

export interface TelegramMessage {
  message_id: number
  from?: TelegramUser
  chat: TelegramChat
  date: number
  text?: string
  voice?: TelegramVoice
}

export interface TelegramCallbackQuery {
  id: string
  from: TelegramUser
  message?: TelegramMessage
  data?: string
}

export interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
  callback_query?: TelegramCallbackQuery
}

// ============================================================
// Google Calendar types
// ============================================================

export interface GoogleBusyTime {
  start: string
  end: string
}

export interface GoogleCalendarEvent {
  summary: string
  description?: string
  start: { dateTime: string; timeZone: string }
  end: { dateTime: string; timeZone: string }
  attendees?: Array<{ email: string }>
}

// ============================================================
// Setup & onboarding
// ============================================================

export interface SetupProgress {
  profile?: boolean
  services?: boolean
  promotion?: boolean
  telegram?: boolean
  calendar?: boolean
}

// ============================================================
// Customer import types
// ============================================================

export interface ParsedCustomer {
  name?: string
  phone?: string
  email?: string
  notes?: string
  tags?: string[]
  is_first_time?: boolean
  _row_number: number
  _raw: Record<string, string>
}

export interface ParseResult {
  records: ParsedCustomer[]
  errors: Array<{ row: number; message: string }>
  total: number
}

export type FieldMapping = Record<
  string,
  'name' | 'phone' | 'email' | 'notes' | 'tags' | 'is_first_time' | 'skip'
>

// ============================================================
// Dashboard
// ============================================================

export interface DashboardStats {
  totalBookings: number
  bookingsThisMonth: number
  totalCustomers: number
  newCustomersThisMonth: number
  pendingHandoffs: number
  bookingsByChannel: { telegram: number }
}

// ============================================================
// Stripe plans
// ============================================================

export const STRIPE_PLANS = {
  starter: {
    name: 'Starter',
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID!,
    price: 88,
    currency: 'USD',
    features: [
      'Telegram only',
      'Up to 100 bookings/month',
      'Up to 5 services',
      'Up to 200 customers',
      'Google Calendar',
      'Email support',
    ],
  },
  pro: {
    name: 'Pro',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
    price: 168,
    currency: 'USD',
    features: [
      'Telegram',
      'Unlimited bookings',
      'Unlimited services',
      'Unlimited customers',
      'Google and Outlook calendar',
      'Channel analytics',
      'Auto handoffs',
      'White-label',
      'Priority chat support',
    ],
  },
} as const

export type PlanKey = 'starter' | 'pro'

// ============================================================
// Supported currencies
// ============================================================

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
] as const

// ============================================================
// Supported timezones
// ============================================================

export const SUPPORTED_TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
  { value: 'America/Anchorage', label: 'Alaska Time' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time' },
  { value: 'America/Toronto', label: 'Eastern Time (Canada)' },
  { value: 'America/Vancouver', label: 'Pacific Time (Canada)' },
  { value: 'America/Sao_Paulo', label: 'Brasilia Time' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Argentina Time' },
  { value: 'America/Mexico_City', label: 'Central Time (Mexico)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)' },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)' },
  { value: 'Europe/Zurich', label: 'Zurich (CET/CEST)' },
  { value: 'Europe/Moscow', label: 'Moscow, St. Petersburg (UTC+3)' },
  { value: 'Asia/Yekaterinburg', label: 'Yekaterinburg (UTC+5)' },
  { value: 'Asia/Novosibirsk', label: 'Novosibirsk (UTC+7)' },
  { value: 'Asia/Vladivostok', label: 'Vladivostok (UTC+10)' },
  { value: 'Europe/Istanbul', label: 'Istanbul (TRT)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Riyadh', label: 'Riyadh (AST)' },
  { value: 'Africa/Cairo', label: 'Cairo (EET)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (ICT)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Kuala_Lumpur', label: 'Kuala Lumpur (MYT)' },
  { value: 'Asia/Jakarta', label: 'Jakarta (WIB)' },
  { value: 'Asia/Manila', label: 'Manila (PHT)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Seoul', label: 'Seoul (KST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST/AEDT)' },
  { value: 'Australia/Perth', label: 'Perth (AWST)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (SAST)' },
  { value: 'Africa/Lagos', label: 'Lagos (WAT)' },
] as const

// ============================================================
// Supported languages
// ============================================================

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ms', name: 'Malay' },
  { code: 'th', name: 'Thai' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'zh', name: 'Chinese' },
  { code: 'tl', name: 'Filipino' },
  { code: 'hi', name: 'Hindi' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'ru', name: 'Russian' },
] as const
