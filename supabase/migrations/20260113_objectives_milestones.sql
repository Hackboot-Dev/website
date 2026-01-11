-- /workspaces/website/supabase/migrations/20260113_objectives_milestones.sql
-- Description: Add milestone and distribution fields to objectives
-- Last modified: 2026-01-11

-- ============================================================
-- 1. Add distribution_type column
-- ============================================================

ALTER TABLE objectives ADD COLUMN IF NOT EXISTS distribution_type TEXT DEFAULT 'linear';

-- Add constraint for distribution_type
ALTER TABLE objectives ADD CONSTRAINT objectives_distribution_type_check CHECK (
  distribution_type IN ('linear', 'front_loaded', 'back_loaded', 'custom')
);

-- ============================================================
-- 2. Add starting_amount column
-- ============================================================

-- Starting amount already achieved at start of period (e.g., rollover from previous period)
ALTER TABLE objectives ADD COLUMN IF NOT EXISTS starting_amount DECIMAL(15,2) DEFAULT 0;

-- ============================================================
-- 3. Add milestones column (JSONB for custom milestones)
-- ============================================================

-- Milestones structure:
-- [
--   { "id": "uuid", "day": 10, "expectedAmount": 1000, "label": "Week 1" },
--   { "id": "uuid", "day": 20, "expectedAmount": 3000, "label": "Mid-month" },
--   ...
-- ]
ALTER TABLE objectives ADD COLUMN IF NOT EXISTS milestones JSONB DEFAULT '[]';

-- ============================================================
-- 4. Create index for distribution_type
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_objectives_distribution_type ON objectives(distribution_type);

-- ============================================================
-- 5. Add validation function for milestones
-- ============================================================

CREATE OR REPLACE FUNCTION validate_objective_milestones()
RETURNS TRIGGER AS $$
DECLARE
  milestone JSONB;
  prev_day INTEGER := -1;
BEGIN
  -- Only validate if milestones is not empty and distribution_type is 'custom'
  IF NEW.distribution_type = 'custom' AND jsonb_array_length(NEW.milestones) > 0 THEN
    -- Check each milestone
    FOR milestone IN SELECT * FROM jsonb_array_elements(NEW.milestones)
    LOOP
      -- Verify required fields exist
      IF NOT (milestone ? 'id' AND milestone ? 'day' AND milestone ? 'expectedAmount') THEN
        RAISE EXCEPTION 'Each milestone must have id, day, and expectedAmount fields';
      END IF;

      -- Verify day is positive
      IF (milestone->>'day')::INTEGER <= 0 THEN
        RAISE EXCEPTION 'Milestone day must be positive';
      END IF;

      -- Verify expectedAmount is non-negative
      IF (milestone->>'expectedAmount')::DECIMAL < 0 THEN
        RAISE EXCEPTION 'Milestone expectedAmount must be non-negative';
      END IF;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for milestone validation
DROP TRIGGER IF EXISTS validate_milestones_trigger ON objectives;
CREATE TRIGGER validate_milestones_trigger
  BEFORE INSERT OR UPDATE ON objectives
  FOR EACH ROW
  EXECUTE FUNCTION validate_objective_milestones();

-- ============================================================
-- 6. Update existing objectives to have default distribution
-- ============================================================

UPDATE objectives
SET distribution_type = 'linear', milestones = '[]'::jsonb
WHERE distribution_type IS NULL;

-- ============================================================
-- 7. Comments
-- ============================================================

COMMENT ON COLUMN objectives.distribution_type IS 'How progress is expected to be distributed over time: linear (even), front_loaded (more early), back_loaded (more late), custom (use milestones)';
COMMENT ON COLUMN objectives.starting_amount IS 'Amount already achieved at the start of the period (e.g., rollover)';
COMMENT ON COLUMN objectives.milestones IS 'JSON array of custom milestones with day, expectedAmount, and optional label';
