// types/database.ts

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          tagline: string | null
          phone: string | null
          email: string | null
          address: string | null
          website: string | null
          logo_url: string | null
          timezone: string
          currency: string
          language: string
          country: string | null
          telegram_bot_token: string | null
          telegram_bot_username: string | null
          telegram_webhook_secret: string | null
          whatsapp_provider: 'wati' | 'twilio' | '360dialog' | null
          whatsapp_phone_number: string | null
          whatsapp_display_name: string | null
          whatsapp_api_url: string | null
          whatsapp_api_token: string | null
          whatsapp_webhook_secret: string | null
          whatsapp_enabled: boolean
          welcome_message: string
          handoff_message: string
          bot_persona_name: string | null
          buffer_minutes: number
          setup_progress: Record<string, boolean>
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          slug: string
          tagline?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          website?: string | null
          logo_url?: string | null
          timezone?: string
          currency?: string
          language?: string
          country?: string | null
          telegram_bot_token?: string | null
          telegram_bot_username?: string | null
          telegram_webhook_secret?: string | null
          whatsapp_provider?: 'wati' | 'twilio' | '360dialog' | null
          whatsapp_phone_number?: string | null
          whatsapp_display_name?: string | null
          whatsapp_api_url?: string | null
          whatsapp_api_token?: string | null
          whatsapp_webhook_secret?: string | null
          whatsapp_enabled?: boolean
          buffer_minutes?: number
          welcome_message?: string
          handoff_message?: string
          bot_persona_name?: string | null
          setup_progress?: Record<string, boolean>
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          slug?: string
          tagline?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          website?: string | null
          logo_url?: string | null
          timezone?: string
          currency?: string
          language?: string
          country?: string | null
          telegram_bot_token?: string | null
          telegram_bot_username?: string | null
          telegram_webhook_secret?: string | null
          whatsapp_provider?: 'wati' | 'twilio' | '360dialog' | null
          whatsapp_phone_number?: string | null
          whatsapp_display_name?: string | null
          whatsapp_api_url?: string | null
          whatsapp_api_token?: string | null
          whatsapp_webhook_secret?: string | null
          buffer_minutes?: number
          whatsapp_enabled?: boolean
          welcome_message?: string
          handoff_message?: string
          bot_persona_name?: string | null
          setup_progress?: Record<string, boolean>
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          business_id: string | null
          full_name: string | null
          avatar_url: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          business_id?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          business_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          stripe_price_id: string | null
          plan: 'free' | 'starter' | 'pro'
          status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete'
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          trial_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          plan?: 'free' | 'starter' | 'pro'
          status?: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete'
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          trial_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          plan?: 'free' | 'starter' | 'pro'
          status?: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete'
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          trial_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          id: string
          business_id: string
          name: string
          description: string | null
          duration_minutes: number
          price: number | null
          currency: string
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          description?: string | null
          duration_minutes?: number
          price?: number | null
          currency?: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          description?: string | null
          duration_minutes?: number
          price?: number | null
          currency?: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          id: string
          business_id: string
          title: string
          description: string | null
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          applicable_service_ids: string[] | null
          first_time_only: boolean
          valid_from: string | null
          valid_until: string | null
          promo_code: string | null
          max_redemptions: number | null
          redemption_count: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          title: string
          description?: string | null
          discount_type?: 'percentage' | 'fixed'
          discount_value: number
          applicable_service_ids?: string[] | null
          first_time_only?: boolean
          valid_from?: string | null
          valid_until?: string | null
          promo_code?: string | null
          max_redemptions?: number | null
          redemption_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          title?: string
          description?: string | null
          discount_type?: 'percentage' | 'fixed'
          discount_value?: number
          applicable_service_ids?: string[] | null
          first_time_only?: boolean
          valid_from?: string | null
          valid_until?: string | null
          promo_code?: string | null
          max_redemptions?: number | null
          redemption_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_hours: {
        Row: {
          id: string
          business_id: string
          day_of_week: number
          open_time: string
          close_time: string
          is_open: boolean
          respect_public_holidays: boolean
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          day_of_week: number
          open_time: string
          close_time: string
          is_open?: boolean
          respect_public_holidays?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          day_of_week?: number
          open_time?: string
          close_time?: string
          is_open?: boolean
          respect_public_holidays?: boolean
          created_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          business_id: string
          telegram_chat_id: string | null
          whatsapp_phone: string | null
          name: string | null
          phone: string | null
          email: string | null
          notes: string | null
          is_first_time: boolean
          tags: string[] | null
          import_source: 'telegram' | 'whatsapp' | 'manual' | 'csv' | 'xlsx' | 'vcf' | 'json'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          telegram_chat_id?: string | null
          whatsapp_phone?: string | null
          name?: string | null
          phone?: string | null
          email?: string | null
          notes?: string | null
          is_first_time?: boolean
          tags?: string[] | null
          import_source?: 'telegram' | 'whatsapp' | 'manual' | 'csv' | 'xlsx' | 'vcf' | 'json'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          telegram_chat_id?: string | null
          whatsapp_phone?: string | null
          name?: string | null
          phone?: string | null
          email?: string | null
          notes?: string | null
          is_first_time?: boolean
          tags?: string[] | null
          import_source?: 'telegram' | 'whatsapp' | 'manual' | 'csv' | 'xlsx' | 'vcf' | 'json'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          business_id: string
          customer_id: string | null
          service_id: string | null
          service_name: string | null
          service_duration: number | null
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          notes: string | null
          promotion_id: string | null
          google_event_id: string | null
          google_calendar_id: string | null
          booking_channel: 'telegram' | 'whatsapp' | 'manual'
          reminder_24h_sent: boolean
          reminder_1h_sent: boolean
          source: 'telegram' | 'whatsapp' | 'manual' | 'api'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          customer_id?: string | null
          service_id?: string | null
          service_name?: string | null
          service_duration?: number | null
          start_time: string
          end_time: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          notes?: string | null
          promotion_id?: string | null
          google_event_id?: string | null
          google_calendar_id?: string | null
          booking_channel?: 'telegram' | 'whatsapp' | 'manual'
          reminder_24h_sent?: boolean
          reminder_1h_sent?: boolean
          source?: 'telegram' | 'whatsapp' | 'manual' | 'api'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          customer_id?: string | null
          service_id?: string | null
          service_name?: string | null
          service_duration?: number | null
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          notes?: string | null
          promotion_id?: string | null
          google_event_id?: string | null
          google_calendar_id?: string | null
          booking_channel?: 'telegram' | 'whatsapp' | 'manual'
          reminder_24h_sent?: boolean
          reminder_1h_sent?: boolean
          source?: 'telegram' | 'whatsapp' | 'manual' | 'api'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          id: string
          business_id: string
          question: string
          answer: string
          tags: string[] | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          question: string
          answer: string
          tags?: string[] | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          question?: string
          answer?: string
          tags?: string[] | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversation_threads: {
        Row: {
          id: string
          business_id: string
          customer_id: string | null
          telegram_chat_id: string | null
          channel: 'telegram' | 'whatsapp'
          status: 'active' | 'handed_off' | 'closed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          customer_id?: string | null
          telegram_chat_id?: string | null
          channel?: 'telegram' | 'whatsapp'
          status?: 'active' | 'handed_off' | 'closed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          customer_id?: string | null
          telegram_chat_id?: string | null
          channel?: 'telegram' | 'whatsapp'
          status?: 'active' | 'handed_off' | 'closed'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversation_logs: {
        Row: {
          id: string
          business_id: string
          thread_id: string
          role: 'user' | 'assistant' | 'tool'
          content: string
          tool_name: string | null
          tool_call_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          thread_id: string
          role: 'user' | 'assistant' | 'tool'
          content: string
          tool_name?: string | null
          tool_call_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          thread_id?: string
          role?: 'user' | 'assistant' | 'tool'
          content?: string
          tool_name?: string | null
          tool_call_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      handoff_requests: {
        Row: {
          id: string
          business_id: string
          thread_id: string
          customer_id: string | null
          reason: string | null
          status: 'pending' | 'acknowledged' | 'resolved'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          thread_id: string
          customer_id?: string | null
          reason?: string | null
          status?: 'pending' | 'acknowledged' | 'resolved'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          thread_id?: string
          customer_id?: string | null
          reason?: string | null
          status?: 'pending' | 'acknowledged' | 'resolved'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      calendar_connections: {
        Row: {
          id: string
          business_id: string
          google_account_email: string | null
          calendar_id: string
          access_token: string | null
          refresh_token: string | null
          token_expiry: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          google_account_email?: string | null
          calendar_id?: string
          access_token?: string | null
          refresh_token?: string | null
          token_expiry?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          google_account_email?: string | null
          calendar_id?: string
          access_token?: string | null
          refresh_token?: string | null
          token_expiry?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_imports: {
        Row: {
          id: string
          business_id: string
          file_name: string | null
          file_format: 'csv' | 'xlsx' | 'vcf' | 'json' | null
          total_rows: number
          imported_count: number
          skipped_count: number
          error_count: number
          status: 'pending' | 'processing' | 'completed' | 'failed'
          error_log: Array<{ row: number; message: string }>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          file_name?: string | null
          file_format?: 'csv' | 'xlsx' | 'vcf' | 'json' | null
          total_rows?: number
          imported_count?: number
          skipped_count?: number
          error_count?: number
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          error_log?: Array<{ row: number; message: string }>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          file_name?: string | null
          file_format?: 'csv' | 'xlsx' | 'vcf' | 'json' | null
          total_rows?: number
          imported_count?: number
          skipped_count?: number
          error_count?: number
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          error_log?: Array<{ row: number; message: string }>
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_templates: {
        Row: {
          id: string
          business_id: string
          template_name: string
          template_body: string
          variables: string[] | null
          status: 'pending' | 'approved' | 'rejected'
          provider_template_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          template_name: string
          template_body: string
          variables?: string[] | null
          status?: 'pending' | 'approved' | 'rejected'
          provider_template_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          template_name?: string
          template_body?: string
          variables?: string[] | null
          status?: 'pending' | 'approved' | 'rejected'
          provider_template_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Convenience type aliases
export type Business = Database['public']['Tables']['businesses']['Row']
export type BusinessInsert = Database['public']['Tables']['businesses']['Insert']
export type BusinessUpdate = Database['public']['Tables']['businesses']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert']
export type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update']

export type Service = Database['public']['Tables']['services']['Row']
export type ServiceInsert = Database['public']['Tables']['services']['Insert']
export type ServiceUpdate = Database['public']['Tables']['services']['Update']

export type Promotion = Database['public']['Tables']['promotions']['Row']
export type PromotionInsert = Database['public']['Tables']['promotions']['Insert']
export type PromotionUpdate = Database['public']['Tables']['promotions']['Update']

export type BusinessHour = Database['public']['Tables']['business_hours']['Row']
export type BusinessHourInsert = Database['public']['Tables']['business_hours']['Insert']
export type BusinessHourUpdate = Database['public']['Tables']['business_hours']['Update']

export type Customer = Database['public']['Tables']['customers']['Row']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export type Booking = Database['public']['Tables']['bookings']['Row']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
export type BookingUpdate = Database['public']['Tables']['bookings']['Update']

export type FaqItem = Database['public']['Tables']['faq_items']['Row']
export type FaqItemInsert = Database['public']['Tables']['faq_items']['Insert']
export type FaqItemUpdate = Database['public']['Tables']['faq_items']['Update']

export type ConversationThread = Database['public']['Tables']['conversation_threads']['Row']
export type ConversationThreadInsert = Database['public']['Tables']['conversation_threads']['Insert']
export type ConversationThreadUpdate = Database['public']['Tables']['conversation_threads']['Update']

export type ConversationLog = Database['public']['Tables']['conversation_logs']['Row']
export type ConversationLogInsert = Database['public']['Tables']['conversation_logs']['Insert']
export type ConversationLogUpdate = Database['public']['Tables']['conversation_logs']['Update']

export type HandoffRequest = Database['public']['Tables']['handoff_requests']['Row']
export type HandoffRequestInsert = Database['public']['Tables']['handoff_requests']['Insert']
export type HandoffRequestUpdate = Database['public']['Tables']['handoff_requests']['Update']

export type CalendarConnection = Database['public']['Tables']['calendar_connections']['Row']
export type CalendarConnectionInsert = Database['public']['Tables']['calendar_connections']['Insert']
export type CalendarConnectionUpdate = Database['public']['Tables']['calendar_connections']['Update']

export type CustomerImport = Database['public']['Tables']['customer_imports']['Row']
export type CustomerImportInsert = Database['public']['Tables']['customer_imports']['Insert']
export type CustomerImportUpdate = Database['public']['Tables']['customer_imports']['Update']

export type WhatsappTemplate = Database['public']['Tables']['whatsapp_templates']['Row']
export type WhatsappTemplateInsert = Database['public']['Tables']['whatsapp_templates']['Insert']
export type WhatsappTemplateUpdate = Database['public']['Tables']['whatsapp_templates']['Update']
