// =====================================================
// USER MANAGEMENT CONTROLLER
// =====================================================

const User = require('../models/User');
const { Op } = require('sequelize');

/**
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Private (Admin, M&E Officer)
 */
exports.getAllUsers = async (req, res) => {
    try {
        const { search, role, status, page = 1, limit = 10 } = req.query;

        // Build where clause
        const where = {};

        if (search) {
            where[Op.or] = [
                { username: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                { first_name: { [Op.iLike]: `%${search}%` } },
                { last_name: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (role) {
            where.role = role;
        }

        if (status) {
            where.status = status;
        }

        // Calculate pagination
        const offset = (page - 1) * limit;

        // Fetch users
        const { count, rows: users } = await User.findAndCountAll({
            where,
            attributes: { exclude: ['password_hash'] },
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(count / limit)
                }
            }
        });

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

/**
 * @desc    Get single user by ID
 * @route   GET /api/v1/users/:id
 * @access  Private
 */
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password_hash'] }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

/**
 * @desc    Create new user
 * @route   POST /api/v1/users
 * @access  Private (Admin only)
 */
exports.createUser = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            first_name,
            last_name,
            phone_number,
            role,
            status = 'Active'
        } = req.body;

        // Validate required fields
        if (!username || !email || !password || !first_name || !last_name || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password_hash: password, // Will be hashed by model hook
            first_name,
            last_name,
            phone_number,
            role,
            status
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user.toSafeObject()
        });

    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
};

/**
 * @desc    Update user
 * @route   PUT /api/v1/users/:id
 * @access  Private (Admin only)
 */
exports.updateUser = async (req, res) => {
    try {
        const {
            username,
            email,
            first_name,
            last_name,
            phone_number,
            role,
            status
        } = req.body;

        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if new username already exists (if username is being changed)
        if (username && username !== user.username) {
            const existingUsername = await User.findOne({ where: { username } });
            if (existingUsername) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already exists'
                });
            }
        }

        // Check if new email already exists (if email is being changed)
        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ where: { email } });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
        }

        // Update user
        await user.update({
            ...(username && { username }),
            ...(email && { email }),
            ...(first_name && { first_name }),
            ...(last_name && { last_name }),
            ...(phone_number !== undefined && { phone_number }),
            ...(role && { role }),
            ...(status && { status })
        });

        res.json({
            success: true,
            message: 'User updated successfully',
            data: user.toSafeObject()
        });

    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/v1/users/:id
 * @access  Private (Admin only)
 */
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent deleting own account
        if (user.user_id === req.user.user_id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        await user.destroy();

        res.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
};

/**
 * @desc    Reset user password
 * @route   PUT /api/v1/users/:id/reset-password
 * @access  Private (Admin only)
 */
exports.resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide new password'
            });
        }

        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update password
        user.password_hash = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password',
            error: error.message
        });
    }
};

/**
 * @desc    Get user statistics
 * @route   GET /api/v1/users/stats
 * @access  Private (Admin, M&E Officer)
 */
exports.getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const activeUsers = await User.count({ where: { status: 'Active' } });
        const inactiveUsers = await User.count({ where: { status: 'Inactive' } });

        // Count by role
        const roleStats = await User.findAll({
            attributes: [
                'role',
                [User.sequelize.fn('COUNT', User.sequelize.col('role')), 'count']
            ],
            group: ['role']
        });

        res.json({
            success: true,
            data: {
                total: totalUsers,
                active: activeUsers,
                inactive: inactiveUsers,
                byRole: roleStats
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user statistics',
            error: error.message
        });
    }
};