// =====================================================
// PROGRAM CONTROLLER
// =====================================================

const { Op } = require('sequelize');
const Program = require('../models/Program');
const ProgramCategory = require('../models/ProgramCategory');
const ProgramIndicator = require('../models/ProgramIndicator');
const sequelize = require('../config/database');

/**
 * @desc    Get all programs with filters
 * @route   GET /api/v1/programs
 * @access  Private
 */
exports.getAllPrograms = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            status = '',
            category_id = '',
            sortBy = 'created_at',
            sortOrder = 'DESC'
        } = req.query;

        // Build where clause
        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { program_name: { [Op.iLike]: `%${search}%` } },
                { program_code: { [Op.iLike]: `%${search}%` } },
                { funding_source: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (status) {
            whereClause.status = status;
        }

        if (category_id) {
            whereClause.category_id = category_id;
        }

        // Calculate pagination
        const offset = (page - 1) * limit;

        // Fetch programs
        const { count, rows: programs } = await Program.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sortBy, sortOrder]]
        });

        res.json({
            success: true,
            data: {
                programs,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    pages: Math.ceil(count / limit),
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get programs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching programs',
            error: error.message
        });
    }
};

/**
 * @desc    Get single program by ID with indicators
 * @route   GET /api/v1/programs/:id
 * @access  Private
 */
exports.getProgramById = async (req, res) => {
    try {
        const { id } = req.params;

        const program = await Program.findByPk(id);

        if (!program) {
            return res.status(404).json({
                success: false,
                message: 'Program not found'
            });
        }

        // Get program indicators
        const indicators = await ProgramIndicator.findAll({
            where: { program_id: id },
            order: [['indicator_type', 'ASC']]
        });

        // Get program statistics (activities, beneficiaries, budget utilization)
        const [activityStats] = await sequelize.query(`
            SELECT
                COUNT(*) as total_activities,
                COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed_activities,
                COALESCE(SUM(actual_budget), 0) as total_spent
            FROM activities
            WHERE program_id = :programId
        `, {
            replacements: { programId: id },
            type: sequelize.QueryTypes.SELECT
        });

        const [beneficiaryCount] = await sequelize.query(`
            SELECT COUNT(DISTINCT ab.beneficiary_id) as total_beneficiaries
            FROM activity_beneficiaries ab
            JOIN activities a ON ab.activity_id = a.activity_id
            WHERE a.program_id = :programId
        `, {
            replacements: { programId: id },
            type: sequelize.QueryTypes.SELECT
        });

        res.json({
            success: true,
            data: {
                program,
                indicators,
                stats: {
                    total_activities: parseInt(activityStats.total_activities) || 0,
                    completed_activities: parseInt(activityStats.completed_activities) || 0,
                    total_beneficiaries: parseInt(beneficiaryCount.total_beneficiaries) || 0,
                    total_spent: parseFloat(activityStats.total_spent) || 0,
                    budget_utilization: program.budget > 0
                        ? ((parseFloat(activityStats.total_spent) / parseFloat(program.budget)) * 100).toFixed(2)
                        : 0
                }
            }
        });

    } catch (error) {
        console.error('Get program error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching program',
            error: error.message
        });
    }
};

/**
 * @desc    Create new program
 * @route   POST /api/v1/programs
 * @access  Private
 */
exports.createProgram = async (req, res) => {
    try {
        const {
            program_code,
            program_name,
            category_id,
            description,
            start_date,
            end_date,
            budget,
            funding_source,
            program_manager,
            status
        } = req.body;

        // Validate required fields
        if (!program_code || !program_name || !start_date) {
            return res.status(400).json({
                success: false,
                message: 'Please provide program code, name, and start date'
            });
        }

        // Check if program code already exists
        const existingProgram = await Program.findOne({
            where: { program_code }
        });

        if (existingProgram) {
            return res.status(400).json({
                success: false,
                message: 'Program code already exists'
            });
        }

        // Create program
        const program = await Program.create({
            program_code,
            program_name,
            category_id,
            description,
            start_date,
            end_date,
            budget,
            funding_source,
            program_manager,
            status: status || 'Planning',
            created_by: req.user.user_id
        });

        res.status(201).json({
            success: true,
            message: 'Program created successfully',
            data: program
        });

    } catch (error) {
        console.error('Create program error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating program',
            error: error.message
        });
    }
};

/**
 * @desc    Update program
 * @route   PUT /api/v1/programs/:id
 * @access  Private
 */
exports.updateProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const program = await Program.findByPk(id);

        if (!program) {
            return res.status(404).json({
                success: false,
                message: 'Program not found'
            });
        }

        // If program code is being updated, check for duplicates
        if (updateData.program_code && updateData.program_code !== program.program_code) {
            const existingProgram = await Program.findOne({
                where: { program_code: updateData.program_code }
            });

            if (existingProgram) {
                return res.status(400).json({
                    success: false,
                    message: 'Program code already exists'
                });
            }
        }

        await program.update(updateData);

        res.json({
            success: true,
            message: 'Program updated successfully',
            data: program
        });

    } catch (error) {
        console.error('Update program error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating program',
            error: error.message
        });
    }
};

/**
 * @desc    Delete program
 * @route   DELETE /api/v1/programs/:id
 * @access  Private
 */
exports.deleteProgram = async (req, res) => {
    try {
        const { id } = req.params;

        const program = await Program.findByPk(id);

        if (!program) {
            return res.status(404).json({
                success: false,
                message: 'Program not found'
            });
        }

        // Soft delete by setting status to Closed
        await program.update({ status: 'Closed' });

        res.json({
            success: true,
            message: 'Program closed successfully'
        });

    } catch (error) {
        console.error('Delete program error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting program',
            error: error.message
        });
    }
};

/**
 * @desc    Get program statistics
 * @route   GET /api/v1/programs/stats/summary
 * @access  Private
 */
exports.getProgramStats = async (req, res) => {
    try {
        const total = await Program.count();
        const active = await Program.count({ where: { status: 'Active' } });
        const planning = await Program.count({ where: { status: 'Planning' } });
        const completed = await Program.count({ where: { status: 'Completed' } });

        // Total budget across all programs
        const [budgetStats] = await sequelize.query(`
            SELECT
                COALESCE(SUM(budget), 0) as total_budget,
                COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_programs
            FROM programs
        `, {
            type: sequelize.QueryTypes.SELECT
        });

        res.json({
            success: true,
            data: {
                total,
                active,
                planning,
                completed,
                total_budget: parseFloat(budgetStats.total_budget) || 0
            }
        });

    } catch (error) {
        console.error('Get program stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching program statistics',
            error: error.message
        });
    }
};

/**
 * @desc    Get all program categories
 * @route   GET /api/v1/programs/categories
 * @access  Private
 */
exports.getCategories = async (req, res) => {
    try {
        const categories = await ProgramCategory.findAll({
            where: { is_active: true },
            order: [['category_name', 'ASC']]
        });

        res.json({
            success: true,
            data: categories
        });

    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};

/**
 * @desc    Create program category
 * @route   POST /api/v1/programs/categories
 * @access  Private
 */
exports.createCategory = async (req, res) => {
    try {
        const { category_code, category_name, description, icon, color } = req.body;

        if (!category_code || !category_name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide category code and name'
            });
        }

        const category = await ProgramCategory.create({
            category_code,
            category_name,
            description,
            icon,
            color
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });

    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating category',
            error: error.message
        });
    }
};

/**
 * @desc    Add indicator to program
 * @route   POST /api/v1/programs/:id/indicators
 * @access  Private
 */
exports.addIndicator = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            indicator_code,
            indicator_name,
            indicator_type,
            measurement_unit,
            baseline_value,
            target_value,
            data_source,
            frequency
        } = req.body;

        // Verify program exists
        const program = await Program.findByPk(id);
        if (!program) {
            return res.status(404).json({
                success: false,
                message: 'Program not found'
            });
        }

        const indicator = await ProgramIndicator.create({
            program_id: id,
            indicator_code,
            indicator_name,
            indicator_type,
            measurement_unit,
            baseline_value,
            target_value,
            current_value: baseline_value || 0,
            data_source,
            frequency
        });

        res.status(201).json({
            success: true,
            message: 'Indicator added successfully',
            data: indicator
        });

    } catch (error) {
        console.error('Add indicator error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding indicator',
            error: error.message
        });
    }
};

/**
 * @desc    Update indicator
 * @route   PUT /api/v1/programs/indicators/:indicatorId
 * @access  Private
 */
exports.updateIndicator = async (req, res) => {
    try {
        const { indicatorId } = req.params;
        const updateData = req.body;

        const indicator = await ProgramIndicator.findByPk(indicatorId);

        if (!indicator) {
            return res.status(404).json({
                success: false,
                message: 'Indicator not found'
            });
        }

        await indicator.update(updateData);

        res.json({
            success: true,
            message: 'Indicator updated successfully',
            data: indicator
        });

    } catch (error) {
        console.error('Update indicator error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating indicator',
            error: error.message
        });
    }
};

/**
 * @desc    Delete indicator
 * @route   DELETE /api/v1/programs/indicators/:indicatorId
 * @access  Private
 */
exports.deleteIndicator = async (req, res) => {
    try {
        const { indicatorId } = req.params;

        const indicator = await ProgramIndicator.findByPk(indicatorId);

        if (!indicator) {
            return res.status(404).json({
                success: false,
                message: 'Indicator not found'
            });
        }

        await indicator.destroy();

        res.json({
            success: true,
            message: 'Indicator deleted successfully'
        });

    } catch (error) {
        console.error('Delete indicator error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting indicator',
            error: error.message
        });
    }
};
