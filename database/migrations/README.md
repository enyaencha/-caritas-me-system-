# Database Migration - Fix Programs Table

## Issue

The seed script was failing with the error:
```
Error: column "total_budget" does not exist
```

This was caused by a mismatch between the Sequelize models and the database schema. The `Program` and `ProgramIndicator` models expected columns that didn't exist in the database.

## Changes Made

### Programs Table
Added the following columns:
- `total_budget` DECIMAL(15,2) - Total program budget
- `budget_utilized` DECIMAL(15,2) - Amount of budget used
- `budget_remaining` DECIMAL(15,2) - Remaining budget
- `target_beneficiaries` INTEGER - Target number of beneficiaries
- `actual_beneficiaries` INTEGER - Actual number reached
- `location` VARCHAR(200) - Program location
- `contact_email` VARCHAR(100) - Contact email
- `contact_phone` VARCHAR(20) - Contact phone
- `notes` TEXT - Additional notes

Also changed:
- Replaced single `budget` column with three budget tracking columns
- Changed `program_manager` from UUID (user reference) to VARCHAR(100) (manager name)
- Updated status CHECK constraint to match model

### Program Indicators Table
Added the following columns:
- `description` TEXT - Indicator description
- `responsible_person` VARCHAR(100) - Person responsible
- `status` VARCHAR(50) - Indicator status
- `notes` TEXT - Additional notes
- `updated_at` TIMESTAMP - Last update timestamp

Also changed:
- Renamed `measurement_unit` to `unit_of_measure`
- Renamed `frequency` to `collection_frequency`
- Removed `indicator_code` column
- Updated decimal precision from (12,2) to (15,2)
- Added CHECK constraints for status and collection_frequency

## How to Run the Migration

### Option 1: Using npm script (Recommended)
```bash
cd backend
npm run migrate
```

### Option 2: Using psql directly
```bash
cd database/migrations
PGPASSWORD=your_password psql -h localhost -p 5432 -U your_user -d caritas_me -f fix_programs_table_columns.sql
```

### Option 3: Using the Node.js script directly
```bash
cd backend
node scripts/runMigration.js
```

## Prerequisites

- PostgreSQL server must be running
- Database `caritas_me` must exist
- Database connection details in `backend/.env` must be correct

## After Migration

Once the migration is complete, you can run the seed script:
```bash
cd backend
npm run seed
```

## Files Updated

1. `/database/schema.sql` - Updated to match model definitions
2. `/database/migrations/fix_programs_table_columns.sql` - Migration script
3. `/backend/scripts/runMigration.js` - Node.js migration runner
4. `/backend/package.json` - Added migrate script
