-- /workspaces/website/supabase/migrations/20260112_objectives_v2.sql
-- Description: Enhanced objectives schema with categories, granular types, and coherence
-- Last modified: 2026-01-10

-- ============================================================
-- 1. Add new columns to objectives table
-- ============================================================

-- Category column
ALTER TABLE objectives ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'financial';

-- Target unit (currency, count, percent)
ALTER TABLE objectives ADD COLUMN IF NOT EXISTS target_unit TEXT DEFAULT 'currency';

-- Priority
ALTER TABLE objectives ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';

-- Granular filters
ALTER TABLE objectives ADD COLUMN IF NOT EXISTS product_id TEXT;
ALTER TABLE objectives ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE objectives ADD COLUMN IF NOT EXISTS product_category_id TEXT;
ALTER TABLE objectives ADD COLUMN IF NOT EXISTS product_category_name TEXT;
ALTER TABLE objectives ADD COLUMN IF NOT EXISTS client_id TEXT;
ALTER TABLE objectives ADD COLUMN IF NOT EXISTS client_name TEXT;
ALTER TABLE objectives ADD COLUMN IF NOT EXISTS client_segment TEXT;
ALTER TABLE objectives ADD COLUMN IF NOT EXISTS expense_category TEXT;

-- ============================================================
-- 2. Update type column to allow new types
-- ============================================================

-- Drop old constraint if exists
ALTER TABLE objectives DROP CONSTRAINT IF EXISTS objectives_type_check;

-- Add new constraint with all types
ALTER TABLE objectives ADD CONSTRAINT objectives_type_check CHECK (type IN (
  -- Financial - Revenue
  'revenue', 'revenue_total', 'revenue_product', 'revenue_category', 'revenue_client', 'revenue_segment',
  -- Financial - Expenses
  'expense', 'expenses_total', 'expenses_category',
  -- Financial - Profit
  'gross_profit', 'net_profit', 'gross_margin_pct', 'net_margin_pct',
  -- Clients
  'clients', 'clients_total', 'clients_new', 'clients_retention', 'clients_segment',
  -- Subscriptions
  'mrr', 'mrr_total', 'mrr_growth', 'arr_total', 'churn_rate', 'arpu'
));

-- ============================================================
-- 3. Add category constraint
-- ============================================================

ALTER TABLE objectives ADD CONSTRAINT objectives_category_check CHECK (category IN (
  'financial', 'clients', 'subscriptions', 'products'
));

-- ============================================================
-- 4. Add priority constraint
-- ============================================================

ALTER TABLE objectives ADD CONSTRAINT objectives_priority_check CHECK (priority IN (
  'low', 'medium', 'high', 'critical'
));

-- ============================================================
-- 5. Add target_unit constraint
-- ============================================================

ALTER TABLE objectives ADD CONSTRAINT objectives_target_unit_check CHECK (target_unit IN (
  'currency', 'count', 'percent'
));

-- ============================================================
-- 6. Add client_segment constraint
-- ============================================================

ALTER TABLE objectives ADD CONSTRAINT objectives_client_segment_check CHECK (
  client_segment IS NULL OR client_segment IN ('individual', 'business', 'enterprise')
);

-- ============================================================
-- 7. Create indexes for new columns
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_objectives_category ON objectives(category);
CREATE INDEX IF NOT EXISTS idx_objectives_priority ON objectives(priority);
CREATE INDEX IF NOT EXISTS idx_objectives_product ON objectives(product_id) WHERE product_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_objectives_client ON objectives(client_id) WHERE client_id IS NOT NULL;

-- ============================================================
-- 8. Update existing objectives to use new types
-- ============================================================

-- Map old types to new types
UPDATE objectives SET
  type = 'revenue_total',
  category = 'financial'
WHERE type = 'revenue';

UPDATE objectives SET
  type = 'expenses_total',
  category = 'financial'
WHERE type = 'expense';

UPDATE objectives SET
  type = 'mrr_total',
  category = 'subscriptions'
WHERE type = 'mrr';

UPDATE objectives SET
  type = 'clients_total',
  category = 'clients'
WHERE type = 'clients';

UPDATE objectives SET
  category = 'financial'
WHERE type IN ('gross_profit', 'net_profit') AND category IS NULL;

-- ============================================================
-- 9. Create budget_plans table for grouping objectives
-- ============================================================

CREATE TABLE IF NOT EXISTS budget_plans (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL DEFAULT 'vmcloud',
  year INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_budget_plans_company ON budget_plans(company_id);
CREATE INDEX IF NOT EXISTS idx_budget_plans_year ON budget_plans(year);
CREATE INDEX IF NOT EXISTS idx_budget_plans_status ON budget_plans(status);

-- RLS
ALTER TABLE budget_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on budget_plans" ON budget_plans FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 10. Add budget_plan_id to objectives
-- ============================================================

ALTER TABLE objectives ADD COLUMN IF NOT EXISTS budget_plan_id TEXT REFERENCES budget_plans(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_objectives_budget_plan ON objectives(budget_plan_id) WHERE budget_plan_id IS NOT NULL;
