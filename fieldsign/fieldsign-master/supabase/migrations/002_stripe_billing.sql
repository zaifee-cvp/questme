-- ============================================================
-- STRIPE BILLING COLUMNS
-- Run this in your Supabase SQL Editor after 001_initial_schema.sql
-- ============================================================

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS stripe_customer_id    text UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS subscription_status   text,
  ADD COLUMN IF NOT EXISTS subscription_plan     text DEFAULT 'starter',
  ADD COLUMN IF NOT EXISTS trial_ends_at         timestamptz,
  ADD COLUMN IF NOT EXISTS current_period_end    timestamptz;

-- Index for webhook lookups by stripe IDs
CREATE INDEX IF NOT EXISTS idx_companies_stripe_customer_id
  ON companies (stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_companies_stripe_subscription_id
  ON companies (stripe_subscription_id);
