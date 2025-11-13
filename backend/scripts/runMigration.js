// =====================================================
// RUN DATABASE MIGRATION SCRIPT
// =====================================================

const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');

async function runMigration() {
    try {
        console.log('🔄 Starting database migration...\n');

        // Test database connection
        await sequelize.authenticate();
        console.log('✓ Database connected\n');

        // Read migration file
        const migrationPath = path.join(__dirname, '../../database/migrations/fix_programs_table_columns.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

        console.log('📝 Executing migration SQL...\n');

        // Execute migration
        await sequelize.query(migrationSQL);

        console.log('✅ Migration completed successfully!\n');

        // Close connection
        await sequelize.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

// Run migration
runMigration();
