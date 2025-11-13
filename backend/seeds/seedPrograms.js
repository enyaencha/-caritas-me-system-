// =====================================================
// SEED SCRIPT - PRIMARY PROGRAMS
// =====================================================

const { Sequelize } = require('sequelize');
const Program = require('../models/Program');
const ProgramCategory = require('../models/ProgramCategory');
const sequelize = require('../config/database');

// 5 Primary/Client-Required Programs
const primaryPrograms = [
    {
        program_code: 'EDU-001',
        program_name: 'Education Support Program',
        description: 'Providing educational support and resources to underserved communities',
        category_name: 'Education',
        category_color: '#3B82F6',
        funding_source: 'UNICEF',
        total_budget: 250000,
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        status: 'Active',
        target_beneficiaries: 500,
        location: 'Nairobi',
        program_manager: 'John Kamau',
        contact_email: 'j.kamau@caritas.org',
        contact_phone: '+254700123456',
        notes: 'Primary education program focusing on primary school students'
    },
    {
        program_code: 'HLT-001',
        program_name: 'Community Health Initiative',
        description: 'Healthcare services and health education for vulnerable populations',
        category_name: 'Healthcare',
        category_color: '#10B981',
        funding_source: 'WHO',
        total_budget: 350000,
        start_date: '2024-01-15',
        end_date: '2025-01-14',
        status: 'Active',
        target_beneficiaries: 1000,
        location: 'Mombasa',
        program_manager: 'Sarah Wanjiku',
        contact_email: 's.wanjiku@caritas.org',
        contact_phone: '+254700234567',
        notes: 'Comprehensive healthcare program including preventive care and treatment'
    },
    {
        program_code: 'NUT-001',
        program_name: 'Child Nutrition Program',
        description: 'Addressing malnutrition and promoting healthy eating habits among children',
        category_name: 'Nutrition',
        category_color: '#F59E0B',
        funding_source: 'WFP',
        total_budget: 180000,
        start_date: '2024-02-01',
        end_date: '2024-11-30',
        status: 'Active',
        target_beneficiaries: 750,
        location: 'Kisumu',
        program_manager: 'Peter Ochieng',
        contact_email: 'p.ochieng@caritas.org',
        contact_phone: '+254700345678',
        notes: 'Focuses on children under 5 years and pregnant mothers'
    },
    {
        program_code: 'WAT-001',
        program_name: 'Clean Water Access Project',
        description: 'Providing clean water and sanitation facilities to rural communities',
        category_name: 'WASH',
        category_color: '#06B6D4',
        funding_source: 'EU',
        total_budget: 450000,
        start_date: '2024-03-01',
        end_date: '2025-02-28',
        status: 'Active',
        target_beneficiaries: 2000,
        location: 'Garissa',
        program_manager: 'Mary Njeri',
        contact_email: 'm.njeri@caritas.org',
        contact_phone: '+254700456789',
        notes: 'Water, Sanitation, and Hygiene program for arid regions'
    },
    {
        program_code: 'LVL-001',
        program_name: 'Livelihood Enhancement Program',
        description: 'Economic empowerment through skills training and microfinance',
        category_name: 'Livelihood',
        category_color: '#8B5CF6',
        funding_source: 'USAID',
        total_budget: 300000,
        start_date: '2024-01-10',
        end_date: '2024-12-31',
        status: 'Active',
        target_beneficiaries: 400,
        location: 'Nakuru',
        program_manager: 'David Mutua',
        contact_email: 'd.mutua@caritas.org',
        contact_phone: '+254700567890',
        notes: 'Focus on vocational training and small business development'
    }
];

const seedPrograms = async () => {
    try {
        console.log('Starting program seeding...');

        // Connect to database
        await sequelize.authenticate();
        console.log('✓ Database connected');

        // Load models and associations
        require('../models/index');

        // Sync database
        await sequelize.sync({ alter: false });
        console.log('✓ Database synced');

        // Check if programs already exist
        const existingProgramsCount = await Program.count();

        if (existingProgramsCount >= 5) {
            console.log(`✓ Database already has ${existingProgramsCount} programs. Skipping seed.`);
            process.exit(0);
        }

        console.log(`\nFound ${existingProgramsCount} existing programs. Seeding primary programs...\n`);

        // Create programs
        for (const programData of primaryPrograms) {
            // Check if this specific program already exists
            const existingProgram = await Program.findOne({
                where: { program_code: programData.program_code }
            });

            if (existingProgram) {
                console.log(`⊘ Program ${programData.program_code} already exists, skipping...`);
                continue;
            }

            // Create or get category
            let category = await ProgramCategory.findOne({
                where: { category_name: programData.category_name }
            });

            if (!category) {
                category = await ProgramCategory.create({
                    category_name: programData.category_name,
                    description: `${programData.category_name} programs and activities`,
                    color_code: programData.category_color,
                    is_active: true
                });
                console.log(`✓ Created category: ${programData.category_name}`);
            }

            // Create program
            const program = await Program.create({
                program_code: programData.program_code,
                program_name: programData.program_name,
                description: programData.description,
                category_id: category.category_id,
                funding_source: programData.funding_source,
                total_budget: programData.total_budget,
                budget_utilized: 0,
                budget_remaining: programData.total_budget,
                start_date: programData.start_date,
                end_date: programData.end_date,
                status: programData.status,
                target_beneficiaries: programData.target_beneficiaries,
                actual_beneficiaries: 0,
                location: programData.location,
                program_manager: programData.program_manager,
                contact_email: programData.contact_email,
                contact_phone: programData.contact_phone,
                notes: programData.notes
            });

            console.log(`✓ Created program: ${program.program_code} - ${program.program_name}`);
        }

        console.log('\n✓ All primary programs seeded successfully!');
        console.log(`\nTotal programs in database: ${await Program.count()}`);

        process.exit(0);

    } catch (error) {
        console.error('✗ Error seeding programs:', error);
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    seedPrograms();
}

module.exports = seedPrograms;
