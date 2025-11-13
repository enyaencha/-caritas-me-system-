// =====================================================
// PROGRAM MODEL
// =====================================================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Program = sequelize.define('Program', {
    program_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    program_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    program_name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    category_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'program_categories',
            key: 'category_id'
        }
    },
    funding_source: {
        type: DataTypes.STRING(200)
    },
    total_budget: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.00
    },
    budget_utilized: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.00
    },
    budget_remaining: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.00
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATEONLY
    },
    status: {
        type: DataTypes.ENUM('Planning', 'Active', 'Completed', 'On Hold', 'Cancelled', 'Draft', 'Pending Approval', 'Rejected'),
        defaultValue: 'Planning'
    },
    target_beneficiaries: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    actual_beneficiaries: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    location: {
        type: DataTypes.STRING(200)
    },
    program_manager: {
        type: DataTypes.STRING(100)
    },
    contact_email: {
        type: DataTypes.STRING(100),
        validate: {
            isEmail: true
        }
    },
    contact_phone: {
        type: DataTypes.STRING(20)
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'programs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeSave: (program) => {
            // Calculate budget remaining
            if (program.total_budget && program.budget_utilized) {
                program.budget_remaining = parseFloat(program.total_budget) - parseFloat(program.budget_utilized);
            }
        }
    }
});

module.exports = Program;
