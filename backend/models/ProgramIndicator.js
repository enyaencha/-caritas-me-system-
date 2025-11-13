// =====================================================
// PROGRAM INDICATOR MODEL
// =====================================================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProgramIndicator = sequelize.define('ProgramIndicator', {
    indicator_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    program_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'programs',
            key: 'program_id'
        },
        onDelete: 'CASCADE'
    },
    indicator_name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    indicator_type: {
        type: DataTypes.ENUM('Input', 'Output', 'Outcome', 'Impact'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    unit_of_measure: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    target_value: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    current_value: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.00
    },
    baseline_value: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.00
    },
    data_source: {
        type: DataTypes.STRING(200)
    },
    collection_frequency: {
        type: DataTypes.ENUM('Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually'),
        defaultValue: 'Monthly'
    },
    responsible_person: {
        type: DataTypes.STRING(100)
    },
    status: {
        type: DataTypes.ENUM('On Track', 'Behind', 'At Risk', 'Achieved'),
        defaultValue: 'On Track'
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'program_indicators',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = ProgramIndicator;
