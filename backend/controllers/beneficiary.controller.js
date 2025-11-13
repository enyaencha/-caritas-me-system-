// =====================================================
// BENEFICIARY CONTROLLER
// =====================================================

const { Op } = require('sequelize');
const Beneficiary = require('../models/Beneficiary');

/**
 * @desc    Get all beneficiaries with search and filter
 * @route   GET /api/v1/beneficiaries
 * @access  Private
 */
exports.getAllBeneficiaries = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            status = '',
            gender = '',
            sortBy = 'created_at',
            sortOrder = 'DESC'
        } = req.query;

        // Build where clause for filtering
        const whereClause = {};

        // Search by name, registration number, phone, or email
        if (search) {
            whereClause[Op.or] = [
                { first_name: { [Op.iLike]: `%${search}%` } },
                { last_name: { [Op.iLike]: `%${search}%` } },
                { registration_number: { [Op.iLike]: `%${search}%` } },
                { phone_number: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ];
        }

        // Filter by status
        if (status) {
            whereClause.status = status;
        }

        // Filter by gender
        if (gender) {
            whereClause.gender = gender;
        }

        // Calculate pagination
        const offset = (page - 1) * limit;

        // Fetch beneficiaries
        const { count, rows: beneficiaries } = await Beneficiary.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sortBy, sortOrder]],
            attributes: { exclude: [] }
        });

        res.json({
            success: true,
            data: {
                beneficiaries,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    pages: Math.ceil(count / limit),
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Get beneficiaries error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching beneficiaries',
            error: error.message
        });
    }
};

/**
 * @desc    Get single beneficiary by ID
 * @route   GET /api/v1/beneficiaries/:id
 * @access  Private
 */
exports.getBeneficiaryById = async (req, res) => {
    try {
        const { id } = req.params;

        const beneficiary = await Beneficiary.findByPk(id);

        if (!beneficiary) {
            return res.status(404).json({
                success: false,
                message: 'Beneficiary not found'
            });
        }

        res.json({
            success: true,
            data: beneficiary
        });

    } catch (error) {
        console.error('Get beneficiary error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching beneficiary',
            error: error.message
        });
    }
};

/**
 * @desc    Create new beneficiary
 * @route   POST /api/v1/beneficiaries
 * @access  Private
 */
exports.createBeneficiary = async (req, res) => {
    try {
        const {
            registration_number,
            first_name,
            middle_name,
            last_name,
            date_of_birth,
            gender,
            national_id,
            phone_number,
            email,
            marital_status,
            education_level,
            occupation,
            disability_status,
            household_size,
            monthly_income,
            registration_date,
            status,
            photo
        } = req.body;

        // Validate required fields
        if (!registration_number || !first_name || !last_name || !date_of_birth || !gender) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if registration number already exists
        const existingBeneficiary = await Beneficiary.findOne({
            where: { registration_number }
        });

        if (existingBeneficiary) {
            return res.status(400).json({
                success: false,
                message: 'Registration number already exists'
            });
        }

        // Sanitize fields - convert empty strings to null
        const sanitizedHouseholdSize = household_size === '' || household_size === null || household_size === undefined ? null : parseInt(household_size);
        const sanitizedMonthlyIncome = monthly_income === '' || monthly_income === null || monthly_income === undefined ? null : parseFloat(monthly_income);

        // Sanitize nullable string fields
        const sanitizedEmail = email === '' || email === null || email === undefined ? null : email;
        const sanitizedMiddleName = middle_name === '' || middle_name === null || middle_name === undefined ? null : middle_name;
        const sanitizedDisabilityStatus = disability_status === '' || disability_status === null || disability_status === undefined ? null : disability_status;
        const sanitizedMaritalStatus = marital_status === '' || marital_status === null || marital_status === undefined ? null : marital_status;
        const sanitizedEducationLevel = education_level === '' || education_level === null || education_level === undefined ? null : education_level;
        const sanitizedOccupation = occupation === '' || occupation === null || occupation === undefined ? null : occupation;

        // Create beneficiary
        const beneficiary = await Beneficiary.create({
            registration_number,
            first_name,
            middle_name: sanitizedMiddleName,
            last_name,
            date_of_birth,
            gender,
            national_id,
            phone_number,
            email: sanitizedEmail,
            marital_status: sanitizedMaritalStatus,
            education_level: sanitizedEducationLevel,
            occupation: sanitizedOccupation,
            disability_status: sanitizedDisabilityStatus,
            household_size: sanitizedHouseholdSize,
            monthly_income: sanitizedMonthlyIncome,
            registration_date: registration_date || new Date(),
            status: status || 'Active',
            photo
        });

        res.status(201).json({
            success: true,
            message: 'Beneficiary created successfully',
            data: beneficiary
        });

    } catch (error) {
        console.error('Create beneficiary error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating beneficiary',
            error: error.message
        });
    }
};

/**
 * @desc    Update beneficiary
 * @route   PUT /api/v1/beneficiaries/:id
 * @access  Private
 */
exports.updateBeneficiary = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Find beneficiary
        const beneficiary = await Beneficiary.findByPk(id);

        if (!beneficiary) {
            return res.status(404).json({
                success: false,
                message: 'Beneficiary not found'
            });
        }

        // If registration number is being updated, check for duplicates
        if (updateData.registration_number && updateData.registration_number !== beneficiary.registration_number) {
            const existingBeneficiary = await Beneficiary.findOne({
                where: { registration_number: updateData.registration_number }
            });

            if (existingBeneficiary) {
                return res.status(400).json({
                    success: false,
                    message: 'Registration number already exists'
                });
            }
        }

        // Sanitize numeric fields - convert empty strings to null
        if (updateData.household_size !== undefined) {
            updateData.household_size = updateData.household_size === '' || updateData.household_size === null ? null : parseInt(updateData.household_size);
        }
        if (updateData.monthly_income !== undefined) {
            updateData.monthly_income = updateData.monthly_income === '' || updateData.monthly_income === null ? null : parseFloat(updateData.monthly_income);
        }

        // Sanitize nullable string fields - convert empty strings to null
        if (updateData.email !== undefined) {
            updateData.email = updateData.email === '' || updateData.email === null ? null : updateData.email;
        }
        if (updateData.middle_name !== undefined) {
            updateData.middle_name = updateData.middle_name === '' || updateData.middle_name === null ? null : updateData.middle_name;
        }
        if (updateData.disability_status !== undefined) {
            updateData.disability_status = updateData.disability_status === '' || updateData.disability_status === null ? null : updateData.disability_status;
        }
        if (updateData.marital_status !== undefined) {
            updateData.marital_status = updateData.marital_status === '' || updateData.marital_status === null ? null : updateData.marital_status;
        }
        if (updateData.education_level !== undefined) {
            updateData.education_level = updateData.education_level === '' || updateData.education_level === null ? null : updateData.education_level;
        }
        if (updateData.occupation !== undefined) {
            updateData.occupation = updateData.occupation === '' || updateData.occupation === null ? null : updateData.occupation;
        }

        // Update beneficiary
        await beneficiary.update(updateData);

        res.json({
            success: true,
            message: 'Beneficiary updated successfully',
            data: beneficiary
        });

    } catch (error) {
        console.error('Update beneficiary error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating beneficiary',
            error: error.message
        });
    }
};

/**
 * @desc    Delete beneficiary
 * @route   DELETE /api/v1/beneficiaries/:id
 * @access  Private
 */
exports.deleteBeneficiary = async (req, res) => {
    try {
        const { id } = req.params;

        const beneficiary = await Beneficiary.findByPk(id);

        if (!beneficiary) {
            return res.status(404).json({
                success: false,
                message: 'Beneficiary not found'
            });
        }

        // Soft delete by updating status to Inactive
        await beneficiary.update({ status: 'Inactive' });

        res.json({
            success: true,
            message: 'Beneficiary deleted successfully'
        });

    } catch (error) {
        console.error('Delete beneficiary error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting beneficiary',
            error: error.message
        });
    }
};

/**
 * @desc    Get beneficiary statistics
 * @route   GET /api/v1/beneficiaries/stats/summary
 * @access  Private
 */
exports.getBeneficiaryStats = async (req, res) => {
    try {
        const total = await Beneficiary.count();
        const active = await Beneficiary.count({ where: { status: 'Active' } });
        const inactive = await Beneficiary.count({ where: { status: 'Inactive' } });

        const male = await Beneficiary.count({ where: { gender: 'Male' } });
        const female = await Beneficiary.count({ where: { gender: 'Female' } });

        res.json({
            success: true,
            data: {
                total,
                active,
                inactive,
                male,
                female
            }
        });

    } catch (error) {
        console.error('Get beneficiary stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching beneficiary statistics',
            error: error.message
        });
    }
};

/**
 * @desc    Upload beneficiary photo
 * @route   POST /api/v1/beneficiaries/:id/photo
 * @access  Private
 */
exports.uploadPhoto = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const beneficiary = await Beneficiary.findByPk(id);

        if (!beneficiary) {
            return res.status(404).json({
                success: false,
                message: 'Beneficiary not found'
            });
        }

        // Update photo path
        const photoPath = `/uploads/beneficiaries/${req.file.filename}`;
        await beneficiary.update({ photo: photoPath });

        res.json({
            success: true,
            message: 'Photo uploaded successfully',
            data: {
                photo: photoPath
            }
        });

    } catch (error) {
        console.error('Upload photo error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading photo',
            error: error.message
        });
    }
};
