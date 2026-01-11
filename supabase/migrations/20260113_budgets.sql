-- Migration: Create budgets table for expense tracking
-- Date: 2026-01-12

-- ============================================================
-- 1. Create budgets table
-- ============================================================

CREATE TABLE IF NOT EXISTS budgets (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  company_id TEXT NOT NULL DEFAULT 'vmcloud',
  year INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'salaries', 'infrastructure', 'marketing', 'software',
    'office', 'legal', 'telecom', 'travel', 'training', 'other'
  )),
  total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_budgets_company ON budgets(company_id);
CREATE INDEX IF NOT EXISTS idx_budgets_year ON budgets(year);
CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category);

-- RLS
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on budgets" ON budgets FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 2. Create budget_expenses table for tracking spending
-- ============================================================

CREATE TABLE IF NOT EXISTS budget_expenses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  budget_id TEXT NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_budget_expenses_budget ON budget_expenses(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_expenses_date ON budget_expenses(expense_date);

-- RLS
ALTER TABLE budget_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on budget_expenses" ON budget_expenses FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 3. Function to get budget with spent amount
-- ============================================================

CREATE OR REPLACE FUNCTION get_budgets_with_progress(
  p_company_id TEXT,
  p_year INTEGER
)
RETURNS TABLE (
  id TEXT,
  company_id TEXT,
  year INTEGER,
  name TEXT,
  description TEXT,
  category TEXT,
  total_amount DECIMAL,
  spent_amount DECIMAL,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.company_id,
    b.year,
    b.name,
    b.description,
    b.category,
    b.total_amount,
    COALESCE(SUM(be.amount), 0) as spent_amount,
    b.created_at,
    b.updated_at
  FROM budgets b
  LEFT JOIN budget_expenses be ON be.budget_id = b.id
  WHERE b.company_id = p_company_id
    AND b.year = p_year
  GROUP BY b.id, b.company_id, b.year, b.name, b.description, b.category, b.total_amount, b.created_at, b.updated_at
  ORDER BY b.category, b.name;
END;
$$;
