-- /workspaces/website/supabase/migrations/20260110_phase2_objectives_alerts.sql
-- Description: Phase 2 - Objectives and Alerts system
-- Last modified: 2026-01-10

-- ============================================================
-- 1. OBJECTIVES TABLE
-- ============================================================
-- Track business targets (revenue, expenses, MRR, clients)

CREATE TABLE IF NOT EXISTS objectives (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL DEFAULT 'vmcloud',

  -- Objective type
  type TEXT NOT NULL CHECK (type IN ('revenue', 'expense', 'mrr', 'clients', 'net_profit', 'gross_profit')),

  -- Period configuration
  period TEXT NOT NULL CHECK (period IN ('monthly', 'quarterly', 'yearly')),
  year INTEGER NOT NULL,
  month INTEGER CHECK (month >= 1 AND month <= 12), -- NULL for yearly, 1-12 for monthly
  quarter INTEGER CHECK (quarter >= 1 AND quarter <= 4), -- NULL for non-quarterly

  -- Target values
  target_amount DECIMAL(15,2) NOT NULL,

  -- Optional metadata
  name TEXT, -- Custom name for the objective
  description TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_objectives_company ON objectives(company_id);
CREATE INDEX IF NOT EXISTS idx_objectives_type ON objectives(type);
CREATE INDEX IF NOT EXISTS idx_objectives_year ON objectives(year);
CREATE INDEX IF NOT EXISTS idx_objectives_period ON objectives(company_id, year, period);

-- RLS
ALTER TABLE objectives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on objectives" ON objectives FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 2. ALERTS TABLE
-- ============================================================
-- Automated alerts for business events

CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL DEFAULT 'vmcloud',

  -- Alert classification
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  type TEXT NOT NULL CHECK (type IN (
    'revenue_miss',      -- Revenue below target
    'revenue_beat',      -- Revenue above target
    'expense_overrun',   -- Expenses above budget
    'churn_spike',       -- Unusual churn rate
    'mrr_drop',          -- MRR decreased
    'mrr_growth',        -- MRR milestone reached
    'client_milestone',  -- Client count milestone
    'payment_overdue',   -- Payment past due
    'subscription_expiring', -- Subscription about to expire
    'objective_at_risk', -- Objective unlikely to be met
    'objective_achieved' -- Objective achieved
  )),

  -- Alert content
  title TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Related data
  related_entity_type TEXT, -- 'objective', 'client', 'subscription', etc.
  related_entity_id TEXT,
  metadata JSONB DEFAULT '{}',

  -- Status
  is_read BOOLEAN DEFAULT false,
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by TEXT,

  -- Auto-dismiss
  auto_dismiss_at TIMESTAMPTZ, -- Alert auto-dismisses after this time

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_alerts_company ON alerts(company_id);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);
CREATE INDEX IF NOT EXISTS idx_alerts_unread ON alerts(company_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at DESC);

-- RLS
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on alerts" ON alerts FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 3. ALERT RULES TABLE (Optional - for custom alert triggers)
-- ============================================================

CREATE TABLE IF NOT EXISTS alert_rules (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL DEFAULT 'vmcloud',

  -- Rule configuration
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,

  -- Trigger conditions
  metric TEXT NOT NULL, -- 'revenue', 'mrr', 'churn_rate', 'client_count', etc.
  condition TEXT NOT NULL CHECK (condition IN ('above', 'below', 'equals', 'change_percent')),
  threshold DECIMAL(15,2) NOT NULL,

  -- Alert settings
  alert_severity TEXT NOT NULL DEFAULT 'warning',
  alert_title_template TEXT NOT NULL,
  alert_message_template TEXT NOT NULL,

  -- Frequency
  check_frequency TEXT DEFAULT 'daily' CHECK (check_frequency IN ('hourly', 'daily', 'weekly', 'monthly')),
  last_triggered_at TIMESTAMPTZ,
  cooldown_hours INTEGER DEFAULT 24, -- Don't trigger again within this period

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_alert_rules_company ON alert_rules(company_id);
CREATE INDEX IF NOT EXISTS idx_alert_rules_active ON alert_rules(company_id, is_active) WHERE is_active = true;

-- RLS
ALTER TABLE alert_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on alert_rules" ON alert_rules FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 4. FUNCTION: Calculate objective progress
-- ============================================================

CREATE OR REPLACE FUNCTION get_objective_progress(
  p_company_id TEXT,
  p_year INTEGER
)
RETURNS TABLE (
  objective_id TEXT,
  type TEXT,
  period TEXT,
  month INTEGER,
  quarter INTEGER,
  target_amount DECIMAL,
  actual_amount DECIMAL,
  progress_percent DECIMAL,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH objective_actuals AS (
    SELECT
      o.id,
      o.type,
      o.period,
      o.month,
      o.quarter,
      o.target_amount,
      CASE
        -- Revenue: sum of transactions
        WHEN o.type = 'revenue' AND o.period = 'monthly' THEN
          COALESCE((
            SELECT SUM(t.amount - COALESCE(t.discount, 0))
            FROM pnl_transactions t
            WHERE t.company_id = p_company_id
              AND t.year = p_year
              AND t.month = (SELECT mk FROM unnest(ARRAY['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']) WITH ORDINALITY AS m(mk, idx) WHERE idx = o.month)
          ), 0)
        WHEN o.type = 'revenue' AND o.period = 'yearly' THEN
          COALESCE((
            SELECT SUM(t.amount - COALESCE(t.discount, 0))
            FROM pnl_transactions t
            WHERE t.company_id = p_company_id
              AND t.year = p_year
          ), 0)
        -- Clients: count of active clients
        WHEN o.type = 'clients' THEN
          COALESCE((
            SELECT COUNT(*)::DECIMAL
            FROM clients c
            WHERE c.company_id = p_company_id
              AND c.status = 'active'
          ), 0)
        -- MRR: from subscriptions (simplified - active subscriptions * amount)
        WHEN o.type = 'mrr' THEN
          COALESCE((
            SELECT SUM(s.amount)
            FROM subscriptions s
            WHERE s.company_id = p_company_id
              AND s.status = 'active'
              AND s.cycle = 'monthly'
          ), 0)
        ELSE 0
      END as actual_amount
    FROM objectives o
    WHERE o.company_id = p_company_id
      AND o.year = p_year
  )
  SELECT
    oa.id,
    oa.type,
    oa.period,
    oa.month,
    oa.quarter,
    oa.target_amount,
    oa.actual_amount,
    CASE
      WHEN oa.target_amount > 0 THEN ROUND((oa.actual_amount / oa.target_amount) * 100, 1)
      ELSE 0
    END as progress_percent,
    CASE
      WHEN oa.actual_amount >= oa.target_amount THEN 'achieved'
      WHEN oa.actual_amount >= oa.target_amount * 0.9 THEN 'on_track'
      WHEN oa.actual_amount >= oa.target_amount * 0.7 THEN 'at_risk'
      ELSE 'behind'
    END as status
  FROM objective_actuals oa;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 5. FUNCTION: Get unread alerts count
-- ============================================================

CREATE OR REPLACE FUNCTION get_unread_alerts_count(p_company_id TEXT)
RETURNS TABLE (
  total INTEGER,
  critical INTEGER,
  warning INTEGER,
  info INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total,
    COUNT(*) FILTER (WHERE severity = 'critical')::INTEGER as critical,
    COUNT(*) FILTER (WHERE severity = 'warning')::INTEGER as warning,
    COUNT(*) FILTER (WHERE severity = 'info')::INTEGER as info
  FROM alerts
  WHERE company_id = p_company_id
    AND is_read = false
    AND (auto_dismiss_at IS NULL OR auto_dismiss_at > NOW());
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 6. Insert default alert rules
-- ============================================================

INSERT INTO alert_rules (id, company_id, name, description, metric, condition, threshold, alert_severity, alert_title_template, alert_message_template)
VALUES
  ('rule_revenue_drop', 'vmcloud', 'Revenue Drop Alert', 'Alert when monthly revenue drops significantly', 'revenue_mom_change', 'below', -20, 'critical', 'Revenue Alert', 'Monthly revenue has dropped by more than 20% compared to last month'),
  ('rule_churn_spike', 'vmcloud', 'Churn Spike Alert', 'Alert when churn rate increases', 'churn_rate', 'above', 10, 'warning', 'Churn Alert', 'Churn rate has exceeded 10%'),
  ('rule_mrr_milestone', 'vmcloud', 'MRR Milestone', 'Alert when MRR reaches milestones', 'mrr', 'above', 10000, 'info', 'MRR Milestone!', 'Congratulations! MRR has reached €10,000')
ON CONFLICT (id) DO NOTHING;

-- Same for hackboot
INSERT INTO alert_rules (id, company_id, name, description, metric, condition, threshold, alert_severity, alert_title_template, alert_message_template)
VALUES
  ('rule_revenue_drop_hb', 'hackboot', 'Revenue Drop Alert', 'Alert when monthly revenue drops significantly', 'revenue_mom_change', 'below', -20, 'critical', 'Revenue Alert', 'Monthly revenue has dropped by more than 20% compared to last month'),
  ('rule_churn_spike_hb', 'hackboot', 'Churn Spike Alert', 'Alert when churn rate increases', 'churn_rate', 'above', 10, 'warning', 'Churn Alert', 'Churn rate has exceeded 10%'),
  ('rule_mrr_milestone_hb', 'hackboot', 'MRR Milestone', 'Alert when MRR reaches milestones', 'mrr', 'above', 5000, 'info', 'MRR Milestone!', 'Congratulations! MRR has reached €5,000')
ON CONFLICT (id) DO NOTHING;
