// =====================================================
// BENEFICIARY MODEL
// =====================================================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Beneficiary = sequelize.define('Beneficiary', {
    beneficiary_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    registration_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    middle_name: {
        type: DataTypes.STRING(100)
    },
    last_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: false
    },
    national_id: {
        type: DataTypes.STRING(50)
    },
    phone_number: {
        type: DataTypes.STRING(20)
    },
    email: {
        type: DataTypes.STRING(100),
        validate: {
            isEmail: true
        }
    },
    marital_status: {
        type: DataTypes.ENUM('Single', 'Married', 'Divorced', 'Widowed', 'Separated')
    },
    education_level: {
        type: DataTypes.STRING(50)
    },
    occupation: {
        type: DataTypes.STRING(100)
    },
    disability_status: {
        type: DataTypes.STRING(50)
    },
    household_size: {
        type: DataTypes.INTEGER
    },
    monthly_income: {
        type: DataTypes.DECIMAL(12, 2)
    },
    registration_date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive', 'Deceased', 'Relocated', 'Draft', 'Pending Approval', 'Rejected'),
        defaultValue: 'Active'
    },
    photo: {
        type: DataTypes.STRING(255)
    }
}, {
    tableName: 'beneficiaries',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Beneficiary;
