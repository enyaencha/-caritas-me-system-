// =====================================================
// PROGRAM CATEGORY MODEL
// =====================================================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProgramCategory = sequelize.define('ProgramCategory', {
    category_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    category_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    category_name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    icon: {
        type: DataTypes.STRING(50)
    },
    color: {
        type: DataTypes.STRING(20)
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'program_categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = ProgramCategory;
