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
    category_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT
    },
    color_code: {
        type: DataTypes.STRING(7),
        defaultValue: '#3B82F6'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'program_categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = ProgramCategory;
