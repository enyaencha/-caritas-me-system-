// =====================================================
// MODEL ASSOCIATIONS
// =====================================================

const Beneficiary = require('./Beneficiary');
const Program = require('./Program');
const ProgramCategory = require('./ProgramCategory');
const ProgramIndicator = require('./ProgramIndicator');

// Program belongs to ProgramCategory
Program.belongsTo(ProgramCategory, {
    foreignKey: 'category_id',
    as: 'category'
});

// ProgramCategory has many Programs
ProgramCategory.hasMany(Program, {
    foreignKey: 'category_id',
    as: 'programs'
});

// Program has many ProgramIndicators
Program.hasMany(ProgramIndicator, {
    foreignKey: 'program_id',
    as: 'indicators',
    onDelete: 'CASCADE'
});

// ProgramIndicator belongs to Program
ProgramIndicator.belongsTo(Program, {
    foreignKey: 'program_id',
    as: 'program'
});

module.exports = {
    Beneficiary,
    Program,
    ProgramCategory,
    ProgramIndicator
};
