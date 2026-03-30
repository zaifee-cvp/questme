-- ============================================================
-- FIELDSERVICE SAAS - COMPLETE DATABASE SCHEMA
-- Migration: 001_initial_schema.sql
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- COMPANIES
-- ============================================================
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  company_slug TEXT NOT NULL UNIQUE,
  company_email TEXT NOT NULL,
  company_phone TEXT,
  company_address TEXT,
  logo_url TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  pdf_footer TEXT DEFAULT 'Thank you for choosing our services.',
  email_template_subject TEXT DEFAULT 'Service Completion Report - {{report_no}}',
  email_template_body TEXT DEFAULT 'Dear {{client_name}},\n\nPlease find attached your service completion report {{report_no}} for the work carried out on {{service_date}}.\n\nThank you for your business.\n\n{{company_name}}',
  swo_prefix TEXT NOT NULL DEFAULT 'SWO',
  report_prefix TEXT NOT NULL DEFAULT 'SR',
  timer_enabled BOOLEAN NOT NULL DEFAULT true,
  timer_minutes INTEGER NOT NULL DEFAULT 3,
  extension_minutes INTEGER NOT NULL DEFAULT 5,
  require_extension_reason BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PROFILES (linked to Supabase auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'technician')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TECHNICIANS
-- ============================================================
CREATE TABLE public.technicians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  employee_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CLIENTS
-- ============================================================
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  contact_person TEXT,
  contact_number TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SERVICES
-- ============================================================
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SERVICE FIELDS (template builder)
-- ============================================================
CREATE TABLE public.service_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  field_label TEXT NOT NULL,
  field_key TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'textarea', 'number', 'dropdown', 'checkbox', 'date')),
  field_options JSONB,
  is_required BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SWO SEQUENCE COUNTER (per company)
-- ============================================================
CREATE TABLE public.swo_counters (
  company_id UUID PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  last_number INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- REPORT SEQUENCE COUNTER (per company)
-- ============================================================
CREATE TABLE public.report_counters (
  company_id UUID PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  last_number INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SWOS (Service Work Orders)
-- ============================================================
CREATE TABLE public.swos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  swo_no TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  technician_id UUID REFERENCES public.technicians(id) ON DELETE SET NULL,
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  source_type TEXT NOT NULL DEFAULT 'admin' CHECK (source_type IN ('admin', 'technician')),
  service_address TEXT,
  job_instructions TEXT,
  scheduled_date DATE,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Assigned', 'In Progress', 'Completed', 'Cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (company_id, swo_no)
);

-- ============================================================
-- WORK ORDERS (Completed Service Reports)
-- ============================================================
CREATE TABLE public.work_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  swo_id UUID REFERENCES public.swos(id) ON DELETE SET NULL,
  service_report_no TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  technician_id UUID REFERENCES public.technicians(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  contact_number TEXT,
  client_email TEXT,
  service_address TEXT,
  technician_name TEXT NOT NULL,
  service_date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  duration_minutes INTEGER,
  work_summary TEXT,
  signature_url TEXT,
  pdf_url TEXT,
  report_started_at TIMESTAMPTZ,
  report_submitted_at TIMESTAMPTZ,
  extension_requested BOOLEAN NOT NULL DEFAULT false,
  extension_reason TEXT,
  extension_minutes INTEGER,
  status TEXT NOT NULL DEFAULT 'Completed' CHECK (status IN ('Draft', 'Completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (company_id, service_report_no)
);

-- ============================================================
-- WORK ORDER FIELD VALUES
-- ============================================================
CREATE TABLE public.work_order_field_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  service_field_id UUID REFERENCES public.service_fields(id) ON DELETE SET NULL,
  field_label TEXT NOT NULL,
  field_key TEXT NOT NULL,
  value_text TEXT,
  value_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- QR CODES
-- ============================================================
CREATE TABLE public.qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES public.technicians(id) ON DELETE CASCADE,
  qr_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- EMAIL LOGS
-- ============================================================
CREATE TABLE public.email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  work_order_id UUID REFERENCES public.work_orders(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('client', 'company')),
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  provider_message_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_technicians_updated_at BEFORE UPDATE ON public.technicians FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_fields_updated_at BEFORE UPDATE ON public.service_fields FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_swos_updated_at BEFORE UPDATE ON public.swos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON public.work_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_qr_codes_updated_at BEFORE UPDATE ON public.qr_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SECURE SWO NUMBER GENERATOR (race-condition safe)
-- ============================================================
CREATE OR REPLACE FUNCTION generate_swo_number(p_company_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_prefix TEXT;
  v_next_number INTEGER;
  v_swo_no TEXT;
BEGIN
  -- Get company prefix
  SELECT swo_prefix INTO v_prefix FROM public.companies WHERE id = p_company_id;
  
  -- Upsert and increment counter atomically
  INSERT INTO public.swo_counters (company_id, last_number)
  VALUES (p_company_id, 1)
  ON CONFLICT (company_id) DO UPDATE
  SET last_number = swo_counters.last_number + 1,
      updated_at = NOW()
  RETURNING last_number INTO v_next_number;
  
  v_swo_no := v_prefix || '-' || LPAD(v_next_number::TEXT, 6, '0');
  RETURN v_swo_no;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- SECURE REPORT NUMBER GENERATOR (race-condition safe)
-- ============================================================
CREATE OR REPLACE FUNCTION generate_report_number(p_company_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_prefix TEXT;
  v_next_number INTEGER;
  v_report_no TEXT;
BEGIN
  -- Get company prefix
  SELECT report_prefix INTO v_prefix FROM public.companies WHERE id = p_company_id;
  
  -- Upsert and increment counter atomically
  INSERT INTO public.report_counters (company_id, last_number)
  VALUES (p_company_id, 1)
  ON CONFLICT (company_id) DO UPDATE
  SET last_number = report_counters.last_number + 1,
      updated_at = NOW()
  RETURNING last_number INTO v_next_number;
  
  v_report_no := v_prefix || '-' || LPAD(v_next_number::TEXT, 6, '0');
  RETURN v_report_no;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_technicians_company_id ON public.technicians(company_id);
CREATE INDEX idx_technicians_status ON public.technicians(status);
CREATE INDEX idx_clients_company_id ON public.clients(company_id);
CREATE INDEX idx_clients_client_name ON public.clients(company_id, client_name);
CREATE INDEX idx_services_company_id ON public.services(company_id);
CREATE INDEX idx_service_fields_service_id ON public.service_fields(service_id);
CREATE INDEX idx_swos_company_id ON public.swos(company_id);
CREATE INDEX idx_swos_swo_no ON public.swos(company_id, swo_no);
CREATE INDEX idx_swos_technician_id ON public.swos(technician_id);
CREATE INDEX idx_swos_status ON public.swos(company_id, status);
CREATE INDEX idx_swos_client_id ON public.swos(client_id);
CREATE INDEX idx_work_orders_company_id ON public.work_orders(company_id);
CREATE INDEX idx_work_orders_report_no ON public.work_orders(company_id, service_report_no);
CREATE INDEX idx_work_orders_swo_id ON public.work_orders(swo_id);
CREATE INDEX idx_work_orders_client_id ON public.work_orders(client_id);
CREATE INDEX idx_work_orders_technician_id ON public.work_orders(technician_id);
CREATE INDEX idx_work_orders_service_date ON public.work_orders(company_id, service_date);
CREATE INDEX idx_work_order_field_values_work_order_id ON public.work_order_field_values(work_order_id);
CREATE INDEX idx_qr_codes_company_id ON public.qr_codes(company_id);
CREATE INDEX idx_qr_codes_token ON public.qr_codes(qr_token);
CREATE INDEX idx_qr_codes_technician_id ON public.qr_codes(technician_id);
CREATE INDEX idx_email_logs_work_order_id ON public.email_logs(work_order_id);
CREATE INDEX idx_email_logs_company_id ON public.email_logs(company_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swo_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_field_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- ---- Helper function to get current user's company_id ----
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ---- Helper function to get current user's role ----
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ---- COMPANIES POLICIES ----
CREATE POLICY "Users can view their own company"
  ON public.companies FOR SELECT
  USING (id = get_user_company_id());

CREATE POLICY "Admins can update their own company"
  ON public.companies FOR UPDATE
  USING (id = get_user_company_id() AND get_user_role() = 'admin');

-- ---- PROFILES POLICIES ----
CREATE POLICY "Users can view profiles in their company"
  ON public.profiles FOR SELECT
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

-- ---- TECHNICIANS POLICIES ----
CREATE POLICY "Company members can view their technicians"
  ON public.technicians FOR SELECT
  USING (company_id = get_user_company_id());

CREATE POLICY "Admins can insert technicians"
  ON public.technicians FOR INSERT
  WITH CHECK (company_id = get_user_company_id() AND get_user_role() = 'admin');

CREATE POLICY "Admins can update technicians"
  ON public.technicians FOR UPDATE
  USING (company_id = get_user_company_id() AND get_user_role() = 'admin');

CREATE POLICY "Admins can delete technicians"
  ON public.technicians FOR DELETE
  USING (company_id = get_user_company_id() AND get_user_role() = 'admin');

-- ---- CLIENTS POLICIES ----
CREATE POLICY "Company members can view their clients"
  ON public.clients FOR SELECT
  USING (company_id = get_user_company_id());

CREATE POLICY "Company members can insert clients"
  ON public.clients FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Company members can update clients"
  ON public.clients FOR UPDATE
  USING (company_id = get_user_company_id());

CREATE POLICY "Admins can delete clients"
  ON public.clients FOR DELETE
  USING (company_id = get_user_company_id() AND get_user_role() = 'admin');

-- ---- SERVICES POLICIES ----
CREATE POLICY "Company members can view their services"
  ON public.services FOR SELECT
  USING (company_id = get_user_company_id());

CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  USING (company_id = get_user_company_id() AND get_user_role() = 'admin');

-- ---- SERVICE FIELDS POLICIES ----
CREATE POLICY "Company members can view service fields"
  ON public.service_fields FOR SELECT
  USING (company_id = get_user_company_id());

CREATE POLICY "Admins can manage service fields"
  ON public.service_fields FOR ALL
  USING (company_id = get_user_company_id() AND get_user_role() = 'admin');

-- ---- SWOS POLICIES ----
CREATE POLICY "Company members can view their SWOs"
  ON public.swos FOR SELECT
  USING (company_id = get_user_company_id());

CREATE POLICY "Company members can insert SWOs"
  ON public.swos FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Company members can update SWOs"
  ON public.swos FOR UPDATE
  USING (company_id = get_user_company_id());

CREATE POLICY "Admins can delete SWOs"
  ON public.swos FOR DELETE
  USING (company_id = get_user_company_id() AND get_user_role() = 'admin');

-- ---- WORK ORDERS POLICIES ----
CREATE POLICY "Company members can view their work orders"
  ON public.work_orders FOR SELECT
  USING (company_id = get_user_company_id());

CREATE POLICY "Company members can insert work orders"
  ON public.work_orders FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Company members can update work orders"
  ON public.work_orders FOR UPDATE
  USING (company_id = get_user_company_id());

-- ---- WORK ORDER FIELD VALUES POLICIES ----
CREATE POLICY "Company members can view their field values"
  ON public.work_order_field_values FOR SELECT
  USING (
    work_order_id IN (
      SELECT id FROM public.work_orders WHERE company_id = get_user_company_id()
    )
  );

CREATE POLICY "Company members can insert field values"
  ON public.work_order_field_values FOR INSERT
  WITH CHECK (
    work_order_id IN (
      SELECT id FROM public.work_orders WHERE company_id = get_user_company_id()
    )
  );

-- ---- QR CODES POLICIES ----
CREATE POLICY "Company admins can manage QR codes"
  ON public.qr_codes FOR ALL
  USING (company_id = get_user_company_id() AND get_user_role() = 'admin');

-- ---- EMAIL LOGS POLICIES ----
CREATE POLICY "Company admins can view email logs"
  ON public.email_logs FOR SELECT
  USING (company_id = get_user_company_id() AND get_user_role() = 'admin');

CREATE POLICY "Company members can insert email logs"
  ON public.email_logs FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

-- ---- COUNTER POLICIES (service role only - no direct user access) ----
CREATE POLICY "Service role manages swo_counters"
  ON public.swo_counters FOR ALL
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Service role manages report_counters"
  ON public.report_counters FOR ALL
  USING (false)
  WITH CHECK (false);

-- ============================================================
-- QR CODE VALIDATION FUNCTION (bypasses RLS for token lookup)
-- ============================================================
CREATE OR REPLACE FUNCTION validate_qr_token(p_token TEXT)
RETURNS TABLE(
  technician_id UUID,
  technician_name TEXT,
  company_id UUID,
  company_name TEXT,
  qr_id UUID
) AS $$
BEGIN
  -- Update last_used_at
  UPDATE public.qr_codes
  SET last_used_at = NOW()
  WHERE qr_token = p_token AND status = 'active';
  
  RETURN QUERY
  SELECT 
    t.id AS technician_id,
    t.name AS technician_name,
    c.id AS company_id,
    c.company_name,
    qr.id AS qr_id
  FROM public.qr_codes qr
  JOIN public.technicians t ON t.id = qr.technician_id
  JOIN public.companies c ON c.id = qr.company_id
  WHERE qr.qr_token = p_token 
    AND qr.status = 'active'
    AND t.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- HANDLE NEW USER SIGNUP
-- Create profile for new auth users (called by trigger or manually)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert if metadata contains company_id (set during sign-up)
  IF NEW.raw_user_meta_data->>'company_id' IS NOT NULL THEN
    INSERT INTO public.profiles (id, company_id, role, name, email)
    VALUES (
      NEW.id,
      (NEW.raw_user_meta_data->>'company_id')::UUID,
      COALESCE(NEW.raw_user_meta_data->>'role', 'admin'),
      COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
      NEW.email
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- STORAGE BUCKET SETUP
-- Run these in Supabase dashboard Storage section or via API
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--   'fieldsign-assets',
--   'fieldsign-assets', 
--   false,
--   52428800,
--   ARRAY['image/jpeg','image/png','image/gif','image/webp','application/pdf']
-- );

-- Storage RLS Policies (run after bucket creation):
-- CREATE POLICY "Company members can upload their own files"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'fieldsign-assets' AND
--     (storage.foldername(name))[1] = 'companies' AND
--     (storage.foldername(name))[2] = get_user_company_id()::TEXT
--   );
-- 
-- CREATE POLICY "Company members can view their own files"
--   ON storage.objects FOR SELECT
--   USING (
--     bucket_id = 'fieldsign-assets' AND
--     (storage.foldername(name))[1] = 'companies' AND
--     (storage.foldername(name))[2] = get_user_company_id()::TEXT
--   );
