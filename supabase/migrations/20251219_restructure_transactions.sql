-- /workspaces/website/supabase/migrations/20251219_restructure_transactions.sql
-- Description: Restructure transactions to proper relational model
-- Last modified: 2025-12-19

-- ============================================================
-- 1. CREATE PNL_TRANSACTIONS TABLE
-- ============================================================
-- This replaces the JSON blob in pnl_data for transaction storage

CREATE TABLE IF NOT EXISTS pnl_transactions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL DEFAULT 'vmcloud',

  -- Client reference (FK)
  client_id TEXT REFERENCES clients(id) ON DELETE SET NULL,

  -- Product reference
  product_id TEXT NOT NULL,
  product_label TEXT NOT NULL,
  category_id TEXT NOT NULL,
  category_label TEXT NOT NULL,

  -- Transaction details
  amount NUMERIC(12,2) NOT NULL,
  discount NUMERIC(12,2) DEFAULT 0,
  note TEXT,

  -- Time period
  month TEXT NOT NULL, -- 'jan', 'feb', etc.
  year INTEGER NOT NULL,

  -- Flags
  is_recurring BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_pnl_transactions_company ON pnl_transactions(company_id);
CREATE INDEX IF NOT EXISTS idx_pnl_transactions_client ON pnl_transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_pnl_transactions_year_month ON pnl_transactions(year, month);
CREATE INDEX IF NOT EXISTS idx_pnl_transactions_product ON pnl_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_pnl_transactions_category ON pnl_transactions(category_id);

-- RLS
ALTER TABLE pnl_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON pnl_transactions FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 2. CREATE VIEW FOR CLIENT STATS (calculated from transactions)
-- ============================================================

CREATE OR REPLACE VIEW client_stats AS
SELECT
  c.id,
  c.company_id,
  c.name,
  c.email,
  COALESCE(SUM(t.amount - COALESCE(t.discount, 0)), 0) AS total_revenue,
  COUNT(t.id) AS total_transactions,
  MIN(t.created_at) AS first_purchase_at,
  MAX(t.created_at) AS last_purchase_at
FROM clients c
LEFT JOIN pnl_transactions t ON t.client_id = c.id
GROUP BY c.id, c.company_id, c.name, c.email;

-- ============================================================
-- 3. TRIGGER TO AUTO-UPDATE CLIENT STATS
-- ============================================================
-- For performance, we keep total_revenue/total_transactions in clients table
-- but update them automatically via trigger

CREATE OR REPLACE FUNCTION update_client_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update stats for affected client
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE clients SET
      total_revenue = COALESCE((
        SELECT SUM(amount - COALESCE(discount, 0))
        FROM pnl_transactions
        WHERE client_id = NEW.client_id
      ), 0),
      total_transactions = COALESCE((
        SELECT COUNT(*)
        FROM pnl_transactions
        WHERE client_id = NEW.client_id
      ), 0),
      first_purchase_at = (
        SELECT MIN(created_at)
        FROM pnl_transactions
        WHERE client_id = NEW.client_id
      ),
      last_purchase_at = (
        SELECT MAX(created_at)
        FROM pnl_transactions
        WHERE client_id = NEW.client_id
      ),
      updated_at = NOW()
    WHERE id = NEW.client_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE clients SET
      total_revenue = COALESCE((
        SELECT SUM(amount - COALESCE(discount, 0))
        FROM pnl_transactions
        WHERE client_id = OLD.client_id
      ), 0),
      total_transactions = COALESCE((
        SELECT COUNT(*)
        FROM pnl_transactions
        WHERE client_id = OLD.client_id
      ), 0),
      first_purchase_at = (
        SELECT MIN(created_at)
        FROM pnl_transactions
        WHERE client_id = OLD.client_id
      ),
      last_purchase_at = (
        SELECT MAX(created_at)
        FROM pnl_transactions
        WHERE client_id = OLD.client_id
      ),
      updated_at = NOW()
    WHERE id = OLD.client_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_update_client_stats ON pnl_transactions;
CREATE TRIGGER trigger_update_client_stats
AFTER INSERT OR UPDATE OR DELETE ON pnl_transactions
FOR EACH ROW EXECUTE FUNCTION update_client_stats();

-- ============================================================
-- 4. FUNCTION TO GET P&L SUMMARY BY MONTH
-- ============================================================

CREATE OR REPLACE FUNCTION get_pnl_summary(
  p_company_id TEXT,
  p_year INTEGER
)
RETURNS TABLE (
  month TEXT,
  category_id TEXT,
  category_label TEXT,
  product_id TEXT,
  product_label TEXT,
  transaction_count BIGINT,
  gross_revenue NUMERIC,
  total_discounts NUMERIC,
  net_revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.month,
    t.category_id,
    t.category_label,
    t.product_id,
    t.product_label,
    COUNT(t.id) AS transaction_count,
    SUM(t.amount) AS gross_revenue,
    SUM(COALESCE(t.discount, 0)) AS total_discounts,
    SUM(t.amount - COALESCE(t.discount, 0)) AS net_revenue
  FROM pnl_transactions t
  WHERE t.company_id = p_company_id
    AND t.year = p_year
  GROUP BY t.month, t.category_id, t.category_label, t.product_id, t.product_label
  ORDER BY t.category_id, t.product_id, t.month;
END;
$$ LANGUAGE plpgsql;
