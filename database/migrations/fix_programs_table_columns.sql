-- =====================================================
-- FIX PROGRAMS AND PROGRAM_INDICATORS TABLES
-- Migration to add missing columns and fix column mismatches
-- =====================================================

-- =============================================================================
-- PROGRAMS TABLE FIXES
-- =============================================================================

-- Add budget columns
ALTER TABLE programs
  ADD COLUMN IF NOT EXISTS total_budget DECIMAL(15,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS budget_utilized DECIMAL(15,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS budget_remaining DECIMAL(15,2) DEFAULT 0.00;

-- Add beneficiary tracking columns
ALTER TABLE programs
  ADD COLUMN IF NOT EXISTS target_beneficiaries INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS actual_beneficiaries INTEGER DEFAULT 0;

-- Add location and contact columns
ALTER TABLE programs
  ADD COLUMN IF NOT EXISTS location VARCHAR(200),
  ADD COLUMN IF NOT EXISTS contact_email VARCHAR(100),
  ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20),
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update status ENUM to match model (including approval statuses)
ALTER TABLE programs DROP CONSTRAINT IF EXISTS programs_status_check;
ALTER TABLE programs ADD CONSTRAINT programs_status_check
  CHECK (status IN ('Planning', 'Active', 'Completed', 'On Hold', 'Cancelled', 'Draft', 'Pending Approval', 'Rejected'));

-- If there was an old budget column, migrate the data
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'programs' AND column_name = 'budget'
  ) THEN
    UPDATE programs SET total_budget = budget WHERE budget IS NOT NULL AND total_budget = 0;
    ALTER TABLE programs DROP COLUMN budget;
  END IF;
END $$;

-- Handle program_manager column migration
DO $$
BEGIN
  -- Case 1: program_manager is UUID type, need to convert to VARCHAR
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'programs' AND column_name = 'program_manager'
    AND data_type = 'uuid'
  ) THEN
    -- Drop the UUID column and create a new VARCHAR one
    ALTER TABLE programs DROP COLUMN program_manager;
    ALTER TABLE programs ADD COLUMN program_manager VARCHAR(100);
  -- Case 2: program_manager doesn't exist yet
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'programs' AND column_name = 'program_manager'
  ) THEN
    ALTER TABLE programs ADD COLUMN program_manager VARCHAR(100);
  END IF;

  -- Clean up program_manager_name if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'programs' AND column_name = 'program_manager_name'
  ) THEN
    ALTER TABLE programs DROP COLUMN program_manager_name;
  END IF;
END $$;

-- =============================================================================
-- PROGRAM_INDICATORS TABLE FIXES
-- =============================================================================

-- Remove old indicator_code column if it exists
ALTER TABLE program_indicators DROP COLUMN IF EXISTS indicator_code;

-- Rename measurement_unit to unit_of_measure
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'program_indicators' AND column_name = 'measurement_unit'
  ) THEN
    ALTER TABLE program_indicators RENAME COLUMN measurement_unit TO unit_of_measure;
  END IF;
END $$;

-- Rename frequency to collection_frequency
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'program_indicators' AND column_name = 'frequency'
  ) THEN
    ALTER TABLE program_indicators RENAME COLUMN frequency TO collection_frequency;
  END IF;
END $$;

-- Add missing columns to program_indicators
ALTER TABLE program_indicators
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS responsible_person VARCHAR(100),
  ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'On Track',
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update indicator_name length from 300 to 200 if needed
ALTER TABLE program_indicators ALTER COLUMN indicator_name TYPE VARCHAR(200);

-- Make unit_of_measure and target_value NOT NULL if they aren't already
ALTER TABLE program_indicators ALTER COLUMN unit_of_measure SET NOT NULL;
ALTER TABLE program_indicators ALTER COLUMN target_value SET NOT NULL;
ALTER TABLE program_indicators ALTER COLUMN indicator_type SET NOT NULL;

-- Update indicator_type constraint
ALTER TABLE program_indicators DROP CONSTRAINT IF EXISTS program_indicators_indicator_type_check;
ALTER TABLE program_indicators ADD CONSTRAINT program_indicators_indicator_type_check
  CHECK (indicator_type IN ('Input', 'Output', 'Outcome', 'Impact'));

-- Add collection_frequency constraint
ALTER TABLE program_indicators DROP CONSTRAINT IF EXISTS program_indicators_collection_frequency_check;
ALTER TABLE program_indicators ADD CONSTRAINT program_indicators_collection_frequency_check
  CHECK (collection_frequency IN ('Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually'));

-- Add status constraint
ALTER TABLE program_indicators DROP CONSTRAINT IF EXISTS program_indicators_status_check;
ALTER TABLE program_indicators ADD CONSTRAINT program_indicators_status_check
  CHECK (status IN ('On Track', 'Behind', 'At Risk', 'Achieved'));

-- Update decimal precision for consistency
ALTER TABLE program_indicators ALTER COLUMN baseline_value TYPE DECIMAL(15,2);
ALTER TABLE program_indicators ALTER COLUMN target_value TYPE DECIMAL(15,2);
ALTER TABLE program_indicators ALTER COLUMN current_value TYPE DECIMAL(15,2);
