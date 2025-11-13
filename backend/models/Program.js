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
    category_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATEONLY
    },
    budget: {
        type: DataTypes.DECIMAL(15, 2)
    },
    funding_source: {
        type: DataTypes.STRING(200)
    },
    program_manager: {
        type: DataTypes.UUID
    },
    status: {
        type: DataTypes.ENUM('Planning', 'Active', 'Completed', 'Suspended', 'Closed'),
        defaultValue: 'Planning'
    }
}, {
    tableName: 'programs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Program;
