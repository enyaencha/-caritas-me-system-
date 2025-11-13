// =====================================================
// PROGRAM ROUTES
// =====================================================

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getAllPrograms,
    getProgramById,
    createProgram,
    updateProgram,
    deleteProgram,
    getProgramStats,
    getCategories,
    createCategory,
    addIndicator,
    updateIndicator,
    deleteIndicator
} = require('../controllers/program.controller');

// Statistics route (must be before /:id route)
router.get('/stats/summary', protect, getProgramStats);

// Category routes
router.route('/categories')
    .get(protect, getCategories)
    .post(protect, createCategory);

// Indicator routes
router.post('/:id/indicators', protect, addIndicator);
router.route('/indicators/:indicatorId')
    .put(protect, updateIndicator)
    .delete(protect, deleteIndicator);

// CRUD routes for programs
router.route('/')
    .get(protect, getAllPrograms)
    .post(protect, createProgram);

router.route('/:id')
    .get(protect, getProgramById)
    .put(protect, updateProgram)
    .delete(protect, deleteProgram);

module.exports = router;
