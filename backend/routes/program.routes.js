// =====================================================
// PROGRAM ROUTES
// =====================================================

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAllPrograms,
    getProgramById,
    createProgram,
    updateProgram,
    deleteProgram,
    getProgramStats,
    getAllCategories,
    getCategoryStats,
    createCategory,
    addIndicator,
    updateIndicator,
    deleteIndicator
} = require('../controllers/program.controller');

// Statistics route (must be before /:id route)
router.get('/stats/summary', protect, getProgramStats);

// Category routes
router.get('/categories/stats', protect, getCategoryStats);
router.route('/categories')
    .get(protect, getAllCategories)
    .post(protect, authorize('Admin'), createCategory);

// Indicator routes
router.route('/:id/indicators')
    .post(protect, addIndicator);

router.route('/indicators/:indicatorId')
    .put(protect, updateIndicator)
    .delete(protect, deleteIndicator);

// CRUD routes
router.route('/')
    .get(protect, getAllPrograms)
    .post(protect, createProgram);

router.route('/:id')
    .get(protect, getProgramById)
    .put(protect, updateProgram)
    .delete(protect, deleteProgram);

module.exports = router;
