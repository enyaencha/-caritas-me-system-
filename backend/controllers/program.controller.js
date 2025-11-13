// =====================================================
// PROGRAM CONTROLLER
// =====================================================

const { Op } = require('sequelize');
const Program = require('../models/Program');
const ProgramCategory = require('../models/ProgramCategory');
const ProgramIndicator = require('../models/ProgramIndicator');

/**
 * @desc    Get all programs with search and filter
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
            category = '',
            funding_source = '',
            sortBy = 'created_at',
            sortOrder = 'DESC'
        } = req.query;

        // Build where clause for filtering
        const whereClause = {};

        // Search by name, code, or location
        if (search) {
            whereClause[Op.or] = [
                { program_name: { [Op.iLike]: `%${search}%` } },
                { program_code: { [Op.iLike]: `%${search}%` } },
                { location: { [Op.iLike]: `%${search}%` } }
            ];
        }

        // Filter by status
        if (status) {
            whereClause.status = status;
        }

        // Filter by category
        if (category) {
            whereClause.category_id = category;
        }

        // Filter by funding source
        if (funding_source) {
            whereClause.funding_source = { [Op.iLike]: `%${funding_source}%` };
        }

        // Calculate pagination
        const offset = (page - 1) * limit;

        // Fetch programs with category details
        const { count, rows: programs } = await Program.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sortBy, sortOrder]],
            include: [
                {
                    model: ProgramCategory,
                    as: 'category',
                    attributes: ['category_id', 'category_name', 'color_code']
                }
            ]
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

        const program = await Program.findByPk(id, {
            include: [
                {
                    model: ProgramCategory,
                    as: 'category',
                    attributes: ['category_id', 'category_name', 'description', 'color_code']
                },
                {
                    model: ProgramIndicator,
                    as: 'indicators',
                    order: [['indicator_type', 'ASC']]
                }
            ]
        });

        if (!program) {
            return res.status(404).json({
                success: false,
                message: 'Program not found'
            });
        }

        res.json({
            success: true,
            data: program
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
            description,
            category_id,
            funding_source,
            total_budget,
            start_date,
            end_date,
            status,
            target_beneficiaries,
            location,
            program_manager,
            contact_email,
            contact_phone,
            notes
        } = req.body;

        // Validate required fields
        if (!program_code || !program_name || !category_id || !start_date) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields (program_code, program_name, category_id, start_date)'
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

        // Verify category exists
        const category = await ProgramCategory.findByPk(category_id);
        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category ID'
            });
        }

        // Create program
        const program = await Program.create({
            program_code,
            program_name,
            description,
            category_id,
            funding_source,
            total_budget: total_budget || 0,
            budget_utilized: 0,
            budget_remaining: total_budget || 0,
            start_date,
            end_date,
            status: status || 'Planning',
            target_beneficiaries: target_beneficiaries || 0,
            actual_beneficiaries: 0,
            location,
            program_manager,
            contact_email,
            contact_phone,
            notes
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

        // Find program
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

        // If category is being updated, verify it exists
        if (updateData.category_id && updateData.category_id !== program.category_id) {
            const category = await ProgramCategory.findByPk(updateData.category_id);
            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid category ID'
                });
            }
        }

        // Update program
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

        // Soft delete by updating status
        await program.update({ status: 'Cancelled' });

        res.json({
            success: true,
            message: 'Program deleted successfully'
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

        // Calculate total budget and spending
        const programs = await Program.findAll({
            attributes: ['total_budget', 'budget_utilized']
        });

        let totalBudget = 0;
        let totalSpent = 0;

        programs.forEach(program => {
            totalBudget += parseFloat(program.total_budget || 0);
            totalSpent += parseFloat(program.budget_utilized || 0);
        });

        res.json({
            success: true,
            data: {
                total,
                active,
                planning,
                completed,
                totalBudget,
                totalSpent,
                budgetRemaining: totalBudget - totalSpent
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
exports.getAllCategories = async (req, res) => {
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
 * @access  Private (Admin only)
 */
exports.createCategory = async (req, res) => {
    try {
        const { category_name, description, color_code } = req.body;

        if (!category_name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        const category = await ProgramCategory.create({
            category_name,
            description,
            color_code: color_code || '#3B82F6'
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
            indicator_name,
            indicator_type,
            description,
            unit_of_measure,
            target_value,
            baseline_value,
            data_source,
            collection_frequency,
            responsible_person
        } = req.body;

        // Verify program exists
        const program = await Program.findByPk(id);
        if (!program) {
            return res.status(404).json({
                success: false,
                message: 'Program not found'
            });
        }

        // Validate required fields
        if (!indicator_name || !indicator_type || !unit_of_measure || !target_value) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Create indicator
        const indicator = await ProgramIndicator.create({
            program_id: id,
            indicator_name,
            indicator_type,
            description,
            unit_of_measure,
            target_value,
            baseline_value: baseline_value || 0,
            current_value: 0,
            data_source,
            collection_frequency: collection_frequency || 'Monthly',
            responsible_person,
            status: 'On Track'
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
