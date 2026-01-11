-- /workspaces/website/supabase/migrations/20251216_init_schema.sql
-- Description: Initial schema for VMCloud Admin (migrated from Firebase)
-- Last modified: 2025-12-16

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE client_type AS ENUM ('individual', 'business', 'enterprise');
CREATE TYPE client_status AS ENUM ('lead', 'active', 'inactive', 'churned');
CREATE TYPE product_type AS ENUM ('one_time', 'subscription', 'usage_based');
CREATE TYPE product_status AS ENUM ('active', 'inactive', 'discontinued');
CREATE TYPE billing_period AS ENUM ('hourly', 'daily', 'monthly', 'yearly');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');
CREATE TYPE subscription_status AS ENUM ('active', 'paused', 'cancelled', 'expired');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');

-- ============================================================
-- CLIENTS
-- ============================================================

CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL DEFAULT 'vmcloud',

  -- Basic info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,

  -- Business info
  company TEXT,
  vat_number TEXT,
  registration_number TEXT,

  -- Classification
  type client_type NOT NULL DEFAULT 'individual',
  status client_status NOT NULL DEFAULT 'lead',
  tags TEXT[] DEFAULT '{}',

  -- Financial
  currency TEXT DEFAULT 'EUR',
  payment_terms INTEGER,
  credit_limit NUMERIC(12,2),

  -- Stats (computed)
  total_revenue NUMERIC(12,2) DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,

  -- Dates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  first_purchase_at TIMESTAMPTZ,
  last_purchase_at TIMESTAMPTZ,

  -- Notes
  notes TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Indexes for search and filtering
CREATE INDEX idx_clients_company_id ON clients(company_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_type ON clients(type);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_created_at ON clients(created_at);
CREATE INDEX idx_clients_total_revenue ON clients(total_revenue DESC);

-- Full text search index
CREATE INDEX idx_clients_search ON clients USING gin(
  to_tsvector('french', coalesce(name, '') || ' ' || coalesce(email, '') || ' ' || coalesce(company, ''))
);

-- ============================================================
-- PRODUCT CATEGORIES
-- ============================================================

CREATE TABLE product_categories (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL DEFAULT 'vmcloud',
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_categories_company_id ON product_categories(company_id);

-- ============================================================
-- PRODUCTS
-- ============================================================

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL DEFAULT 'vmcloud',

  -- Basic info
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,

  -- Classification
  category_id TEXT REFERENCES product_categories(id),
  type product_type NOT NULL DEFAULT 'one_time',
  status product_status NOT NULL DEFAULT 'active',
  tags TEXT[] DEFAULT '{}',

  -- Pricing
  unit_price NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  billing_period billing_period,
  setup_fee NUMERIC(12,2),

  -- Dates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_products_company_id ON products(company_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_type ON products(type);

-- ============================================================
-- TRANSACTIONS
-- ============================================================

CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL DEFAULT 'vmcloud',

  -- Relations
  client_id TEXT REFERENCES clients(id),
  product_id TEXT REFERENCES products(id),
  subscription_id TEXT,
  invoice_id TEXT,

  -- Transaction details
  description TEXT,
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  tax_rate NUMERIC(5,2) DEFAULT 0,
  tax_amount NUMERIC(12,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) NOT NULL,

  -- Status
  status transaction_status NOT NULL DEFAULT 'completed',

  -- Period (for P&L)
  year INTEGER NOT NULL,
  month TEXT NOT NULL,

  -- Dates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_transactions_company_id ON transactions(company_id);
CREATE INDEX idx_transactions_client_id ON transactions(client_id);
CREATE INDEX idx_transactions_product_id ON transactions(product_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_year_month ON transactions(year, month);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================

CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL DEFAULT 'vmcloud',

  -- Relations
  client_id TEXT REFERENCES clients(id),
  product_id TEXT REFERENCES products(id),

  -- Subscription details
  name TEXT NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  billing_period billing_period NOT NULL DEFAULT 'monthly',

  -- Status
  status subscription_status NOT NULL DEFAULT 'active',

  -- Dates
  start_date DATE NOT NULL,
  end_date DATE,
  next_billing_date DATE,
  last_billed_date DATE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_subscriptions_company_id ON subscriptions(company_id);
CREATE INDEX idx_subscriptions_client_id ON subscriptions(client_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_next_billing_date ON subscriptions(next_billing_date);

-- ============================================================
-- INVOICES
-- ============================================================

CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL DEFAULT 'vmcloud',

  -- Relations
  client_id TEXT REFERENCES clients(id),

  -- Invoice details
  invoice_number TEXT NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  tax_amount NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',

  -- Status
  status invoice_status NOT NULL DEFAULT 'draft',

  -- Dates
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  due_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_invoices_company_id ON invoices(company_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- ============================================================
-- P&L DATA (cached aggregations)
-- ============================================================

CREATE TABLE pnl_data (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL DEFAULT 'vmcloud',
  year INTEGER NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, year)
);

CREATE INDEX idx_pnl_data_company_year ON pnl_data(company_id, year);

-- ============================================================
-- STATS CACHE (for aggregated stats)
-- ============================================================

CREATE TABLE stats_cache (
  key TEXT PRIMARY KEY,
  company_id TEXT NOT NULL DEFAULT 'vmcloud',
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stats_cache_company_id ON stats_cache(company_id);

-- ============================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON product_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE pnl_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats_cache ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (admin panel)
CREATE POLICY "Allow all for authenticated" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON products FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON product_categories FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON transactions FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON subscriptions FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON invoices FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON pnl_data FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON stats_cache FOR ALL USING (true);
