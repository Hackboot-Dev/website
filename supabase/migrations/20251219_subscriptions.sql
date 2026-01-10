-- Migration: Subscriptions Module
-- Description: Extend subscriptions with plans and events
-- Date: 2025-12-19

-- ============================================================
-- SUBSCRIPTION PLANS (Les offres d'abonnement)
-- ============================================================

CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL DEFAULT 'vmcloud',

  -- Basic info
  name TEXT NOT NULL,
  description TEXT,

  -- Pricing
  price DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  billing_period TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_period IN ('monthly', 'quarterly', 'yearly')),
  billing_period_count INTEGER DEFAULT 1,

  -- Trial
  trial_days INTEGER DEFAULT 0,

  -- Product link (optional - for linking to catalogue)
  product_id TEXT,

  -- Features (JSON array of strings)
  features JSONB DEFAULT '[]',

  -- Limits (optional)
  max_users INTEGER,
  max_storage_gb INTEGER,

  -- Status
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,

  -- Metadata
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for listing plans by company
CREATE INDEX IF NOT EXISTS idx_subscription_plans_company
ON subscription_plans(company_id, is_active, sort_order);

-- ============================================================
-- EXTEND SUBSCRIPTIONS TABLE (add missing columns)
-- ============================================================

-- Add plan_id reference
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan_id TEXT REFERENCES subscription_plans(id) ON DELETE SET NULL;

-- Add trial columns
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

-- Add period tracking
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMPTZ;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;

-- Add cancellation tracking
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT false;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS cancel_reason TEXT;

-- Add pause tracking
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS paused_at TIMESTAMPTZ;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS pause_reason TEXT;

-- Add pricing flexibility
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS price DECIMAL(15,2);
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'EUR';
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS discount_percent DECIMAL(5,2) DEFAULT 0;

-- Add invoice tracking
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS last_invoice_id TEXT;

-- Add notes
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update price from unit_price if null
UPDATE subscriptions SET price = unit_price WHERE price IS NULL;

-- Create index on plan_id
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON subscriptions(plan_id);

-- ============================================================
-- SUBSCRIPTION EVENTS (Historique des changements)
-- ============================================================

CREATE TABLE IF NOT EXISTS subscription_events (
  id TEXT PRIMARY KEY,
  subscription_id TEXT NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,

  -- Event type
  event_type TEXT NOT NULL CHECK (event_type IN (
    'created', 'activated', 'trial_started', 'trial_ended',
    'upgraded', 'downgraded', 'price_changed',
    'paused', 'resumed',
    'cancelled', 'cancel_scheduled',
    'renewed', 'expired',
    'payment_failed', 'payment_succeeded'
  )),

  -- Changes (for upgrades/downgrades)
  old_plan_id TEXT,
  new_plan_id TEXT,
  old_price DECIMAL(15,2),
  new_price DECIMAL(15,2),

  -- Context
  reason TEXT,
  performed_by TEXT,  -- User ID or 'system' for automatic events

  -- Metadata
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for listing events by subscription
CREATE INDEX IF NOT EXISTS idx_subscription_events_subscription
ON subscription_events(subscription_id, created_at DESC);

-- ============================================================
-- UPDATE SUBSCRIPTION STATUS ENUM (add new statuses)
-- ============================================================

-- Add new status values if they don't exist (PostgreSQL 10+)
DO $$
BEGIN
  -- Add 'trial' status
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'trial' AND enumtypid = 'subscription_status'::regtype) THEN
    ALTER TYPE subscription_status ADD VALUE 'trial';
  END IF;

  -- Add 'past_due' status
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'past_due' AND enumtypid = 'subscription_status'::regtype) THEN
    ALTER TYPE subscription_status ADD VALUE 'past_due';
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for subscription_plans
DROP TRIGGER IF EXISTS trigger_subscription_plans_updated_at ON subscription_plans;
CREATE TRIGGER trigger_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_updated_at();

-- ============================================================
-- FUNCTION: Calculate MRR for a company
-- ============================================================

CREATE OR REPLACE FUNCTION get_mrr(p_company_id TEXT)
RETURNS DECIMAL(15,2) AS $$
DECLARE
  total_mrr DECIMAL(15,2);
BEGIN
  SELECT COALESCE(SUM(
    CASE billing_period
      WHEN 'monthly' THEN COALESCE(price, unit_price) * (1 - COALESCE(discount_percent, 0) / 100)
      WHEN 'quarterly' THEN COALESCE(price, unit_price) * (1 - COALESCE(discount_percent, 0) / 100) / 3
      WHEN 'yearly' THEN COALESCE(price, unit_price) * (1 - COALESCE(discount_percent, 0) / 100) / 12
      ELSE COALESCE(price, unit_price) * (1 - COALESCE(discount_percent, 0) / 100)
    END
  ), 0) INTO total_mrr
  FROM subscriptions
  WHERE company_id = p_company_id
    AND status = 'active';

  RETURN total_mrr;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FUNCTION: Get subscription metrics
-- ============================================================

CREATE OR REPLACE FUNCTION get_subscription_metrics(p_company_id TEXT)
RETURNS TABLE (
  total_subscriptions BIGINT,
  active_subscriptions BIGINT,
  trial_subscriptions BIGINT,
  paused_subscriptions BIGINT,
  cancelled_this_month BIGINT,
  mrr DECIMAL(15,2),
  arr DECIMAL(15,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_subscriptions,
    COUNT(*) FILTER (WHERE status = 'active')::BIGINT as active_subscriptions,
    COUNT(*) FILTER (WHERE status = 'trial')::BIGINT as trial_subscriptions,
    COUNT(*) FILTER (WHERE status = 'paused')::BIGINT as paused_subscriptions,
    COUNT(*) FILTER (WHERE status = 'cancelled' AND cancelled_at >= date_trunc('month', NOW()))::BIGINT as cancelled_this_month,
    get_mrr(p_company_id) as mrr,
    get_mrr(p_company_id) * 12 as arr
  FROM subscriptions
  WHERE company_id = p_company_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FUNCTION: Get MRR by month for charting
-- ============================================================

CREATE OR REPLACE FUNCTION get_mrr_history(p_company_id TEXT, p_months INTEGER DEFAULT 12)
RETURNS TABLE (
  month_date DATE,
  mrr DECIMAL(15,2),
  subscription_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH months AS (
    SELECT generate_series(
      date_trunc('month', NOW() - (p_months || ' months')::INTERVAL),
      date_trunc('month', NOW()),
      '1 month'::INTERVAL
    )::DATE as month_date
  )
  SELECT
    m.month_date,
    COALESCE(SUM(
      CASE s.billing_period
        WHEN 'monthly' THEN COALESCE(s.price, s.unit_price)
        WHEN 'quarterly' THEN COALESCE(s.price, s.unit_price) / 3
        WHEN 'yearly' THEN COALESCE(s.price, s.unit_price) / 12
        ELSE COALESCE(s.price, s.unit_price)
      END * (1 - COALESCE(s.discount_percent, 0) / 100)
    ), 0)::DECIMAL(15,2) as mrr,
    COUNT(s.id)::BIGINT as subscription_count
  FROM months m
  LEFT JOIN subscriptions s ON
    s.company_id = p_company_id
    AND s.status = 'active'
    AND s.start_date <= m.month_date + INTERVAL '1 month'
    AND (s.end_date IS NULL OR s.end_date >= m.month_date)
  GROUP BY m.month_date
  ORDER BY m.month_date;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- RLS POLICIES (Row Level Security)
-- ============================================================

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

-- Policies for subscription_plans (allow all for now, restrict later)
DROP POLICY IF EXISTS "Allow all for subscription_plans" ON subscription_plans;
CREATE POLICY "Allow all for subscription_plans" ON subscription_plans
  FOR ALL USING (true);

-- Policies for subscription_events
DROP POLICY IF EXISTS "Allow all for subscription_events" ON subscription_events;
CREATE POLICY "Allow all for subscription_events" ON subscription_events
  FOR ALL USING (true);

-- ============================================================
-- SEED DATA: Default plans for VMCloud
-- ============================================================

INSERT INTO subscription_plans (id, company_id, name, description, price, billing_period, features, sort_order)
VALUES
  ('plan_vps_starter', 'vmcloud', 'VPS Starter', 'Idéal pour les petits projets', 9.99, 'monthly',
   '["1 vCPU", "2 GB RAM", "20 GB SSD", "1 TB Bandwidth", "Support email"]'::jsonb, 1),
  ('plan_vps_pro', 'vmcloud', 'VPS Pro', 'Pour les applications en production', 29.99, 'monthly',
   '["2 vCPU", "4 GB RAM", "80 GB SSD", "3 TB Bandwidth", "Support prioritaire"]'::jsonb, 2),
  ('plan_vps_business', 'vmcloud', 'VPS Business', 'Haute performance garantie', 79.99, 'monthly',
   '["4 vCPU", "8 GB RAM", "160 GB SSD", "5 TB Bandwidth", "Support 24/7", "Backup quotidien"]'::jsonb, 3),
  ('plan_vps_enterprise', 'vmcloud', 'VPS Enterprise', 'Pour les charges critiques', 199.99, 'monthly',
   '["8 vCPU", "16 GB RAM", "320 GB SSD", "10 TB Bandwidth", "Support dédié", "SLA 99.9%", "IP dédiée"]'::jsonb, 4)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  features = EXCLUDED.features;
