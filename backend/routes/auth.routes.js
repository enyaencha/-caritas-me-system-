// =====================================================
// AUTHENTICATION ROUTES
// =====================================================

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    login,
    getMe,
    logout,
    changePassword
} = require('../controllers/auth.controller');

// Public routes
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/change-password', protect, changePassword);

module.exports = router;
