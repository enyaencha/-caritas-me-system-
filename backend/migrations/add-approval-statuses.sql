-- =====================================================
-- SQL Script: Add Approval Workflow Statuses
-- Run this directly on your PostgreSQL database
-- =====================================================

-- Add new status values to beneficiaries table
ALTER TABLE beneficiaries
    ALTER COLUMN status TYPE VARCHAR(50);

ALTER TABLE beneficiaries
    ALTER COLUMN status DROP DEFAULT;

ALTER TABLE beneficiaries
    ALTER COLUMN status TYPE VARCHAR(50);

UPDATE beneficiaries SET status = 'Active' WHERE status IS NULL;

-- Now update the ENUM constraint
ALTER TABLE beneficiaries
    DROP CONSTRAINT IF EXISTS beneficiaries_status_check;

ALTER TABLE beneficiaries
    ADD CONSTRAINT beneficiaries_status_check
    CHECK (status IN ('Active', 'Inactive', 'Deceased', 'Relocated', 'Draft', 'Pending Approval', 'Rejected'));

ALTER TABLE beneficiaries
    ALTER COLUMN status SET DEFAULT 'Active';

-- Add new status values to programs table
ALTER TABLE programs
    ALTER COLUMN status TYPE VARCHAR(50);

ALTER TABLE programs
    ALTER COLUMN status DROP DEFAULT;

ALTER TABLE programs
    ALTER COLUMN status TYPE VARCHAR(50);

UPDATE programs SET status = 'Planning' WHERE status IS NULL;

-- Now update the ENUM constraint
ALTER TABLE programs
    DROP CONSTRAINT IF EXISTS programs_status_check;

ALTER TABLE programs
    ADD CONSTRAINT programs_status_check
    CHECK (status IN ('Planning', 'Active', 'Completed', 'On Hold', 'Cancelled', 'Draft', 'Pending Approval', 'Rejected'));

ALTER TABLE programs
    ALTER COLUMN status SET DEFAULT 'Planning';

-- Verify the changes
SELECT 'Beneficiary statuses updated' AS message;
SELECT 'Program statuses updated' AS message;
