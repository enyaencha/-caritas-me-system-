// =====================================================
// MIGRATION: Add Approval Workflow Statuses
// =====================================================

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add new status values to beneficiaries table
        await queryInterface.sequelize.query(`
            ALTER TABLE beneficiaries
            MODIFY COLUMN status ENUM(
                'Active',
                'Inactive',
                'Deceased',
                'Relocated',
                'Draft',
                'Pending Approval',
                'Rejected'
            ) DEFAULT 'Active';
        `);

        // Add new status values to programs table
        await queryInterface.sequelize.query(`
            ALTER TABLE programs
            MODIFY COLUMN status ENUM(
                'Planning',
                'Active',
                'Completed',
                'On Hold',
                'Cancelled',
                'Draft',
                'Pending Approval',
                'Rejected'
            ) DEFAULT 'Planning';
        `);

        console.log('✅ Added approval workflow statuses to beneficiaries and programs');
    },

    down: async (queryInterface, Sequelize) => {
        // Revert beneficiaries status ENUM
        await queryInterface.sequelize.query(`
            ALTER TABLE beneficiaries
            MODIFY COLUMN status ENUM(
                'Active',
                'Inactive',
                'Deceased',
                'Relocated'
            ) DEFAULT 'Active';
        `);

        // Revert programs status ENUM
        await queryInterface.sequelize.query(`
            ALTER TABLE programs
            MODIFY COLUMN status ENUM(
                'Planning',
                'Active',
                'Completed',
                'On Hold',
                'Cancelled'
            ) DEFAULT 'Planning';
        `);

        console.log('✅ Removed approval workflow statuses from beneficiaries and programs');
    }
};
