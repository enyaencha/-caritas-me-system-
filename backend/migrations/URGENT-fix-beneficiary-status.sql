-- =====================================================
-- URGENT FIX: Update Beneficiary Status Constraint
-- Run this first to allow approval workflow
-- =====================================================

-- Drop the old constraint
ALTER TABLE beneficiaries DROP CONSTRAINT IF EXISTS beneficiaries_status_check;

-- Add the new constraint with approval statuses
ALTER TABLE beneficiaries ADD CONSTRAINT beneficiaries_status_check
  CHECK (status IN ('Active', 'Inactive', 'Deceased', 'Relocated', 'Draft', 'Pending Approval', 'Rejected'));

-- Verify it worked
SELECT 'Beneficiary status constraint updated successfully!' AS result;
