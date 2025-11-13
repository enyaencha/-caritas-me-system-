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
        allowNull: false
    },
    indicator_code: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    indicator_name: {
        type: DataTypes.STRING(300),
        allowNull: false
    },
    indicator_type: {
        type: DataTypes.ENUM('Input', 'Output', 'Outcome', 'Impact')
    },
    measurement_unit: {
        type: DataTypes.STRING(50)
    },
    baseline_value: {
        type: DataTypes.DECIMAL(12, 2)
    },
    target_value: {
        type: DataTypes.DECIMAL(12, 2)
    },
    current_value: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
    },
    data_source: {
        type: DataTypes.STRING(200)
    },
    frequency: {
        type: DataTypes.STRING(50)
    }
}, {
    tableName: 'program_indicators',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = ProgramIndicator;
