-- /workspaces/website/supabase/migrations/20260110_add_client_name_to_pnl_transactions.sql
-- Description: Add client_name column to pnl_transactions for better display
-- Last modified: 2026-01-10

-- Add client_name column to store client name at transaction time
ALTER TABLE pnl_transactions
ADD COLUMN IF NOT EXISTS client_name TEXT;

-- Add index for potential searches
CREATE INDEX IF NOT EXISTS idx_pnl_transactions_client_name ON pnl_transactions(client_name);

-- Comment explaining the column
COMMENT ON COLUMN pnl_transactions.client_name IS 'Client name stored at transaction time for display purposes';
