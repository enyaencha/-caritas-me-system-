# Database Seeding Guide

## Overview
This directory contains seed scripts to initialize the database with primary/client-required data.

## Primary Programs
The system includes 5 primary client-required programs that should be seeded into the database:

1. **Education Support Program** (EDU-001) - Education category
2. **Community Health Initiative** (HLT-001) - Healthcare category
3. **Child Nutrition Program** (NUT-001) - Nutrition category
4. **Clean Water Access Project** (WAT-001) - WASH category
5. **Livelihood Enhancement Program** (LVL-001) - Livelihood category

## Running the Seed Script

### From the backend directory:
```bash
npm run seed
```

Or:
```bash
npm run seed:programs
```

Or directly:
```bash
node seeds/seedPrograms.js
```

## What the Seed Script Does

1. **Checks existing programs**: If 5 or more programs already exist, the script skips seeding
2. **Creates categories**: Automatically creates the program categories if they don't exist
3. **Creates programs**: Seeds the 5 primary programs with complete details including:
   - Program codes and names
   - Descriptions
   - Categories with color codes
   - Budget information
   - Target beneficiaries
   - Locations and contacts
   - Timeline (start/end dates)

## Features

- **Idempotent**: Can be run multiple times safely - won't duplicate existing programs
- **Smart checking**: Verifies each program by code before creating
- **Category management**: Automatically creates categories with appropriate color codes
- **Detailed logging**: Shows what's being created or skipped

## Admin Functionality

After seeding, administrators can still:
- Create new programs via the UI (`/programs/create`)
- Edit existing programs
- Add program indicators
- Create new categories
- Manage all program details

The seed data provides the foundation, but the system remains fully flexible for admins to manage programs as needed.

## Database Requirements

Ensure PostgreSQL is running and properly configured in `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=caritas_me
DB_USER=root
DB_PASSWORD=test
DB_DIALECT=postgres
```

## Troubleshooting

**Error: "connect ECONNREFUSED"**
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `createdb caritas_me`

**Error: "Already exists"**
- The program codes are unique - this is normal if programs were previously seeded
- Check database: `SELECT * FROM programs;`
