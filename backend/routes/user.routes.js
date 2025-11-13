// =====================================================
// USER ROUTES
// =====================================================

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    resetPassword,
    getUserStats
} = require('../controllers/user.controller');

// Get user statistics
router.get('/stats', protect, authorize('Admin', 'M&E Officer'), getUserStats);

// Get all users (with search, filter, pagination)
router.get('/', protect, authorize('Admin', 'M&E Officer'), getAllUsers);

// Get single user by ID
router.get('/:id', protect, getUserById);

// Create new user (Admin only)
router.post('/', protect, authorize('Admin'), createUser);

// Update user (Admin only)
router.put('/:id', protect, authorize('Admin'), updateUser);

// Delete user (Admin only)
router.delete('/:id', protect, authorize('Admin'), deleteUser);

// Reset user password (Admin only)
router.put('/:id/reset-password', protect, authorize('Admin'), resetPassword);

module.exports = router;