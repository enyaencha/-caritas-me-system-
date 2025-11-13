// =====================================================
// BENEFICIARY ROUTES
// =====================================================

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadBeneficiaryPhoto } = require('../middleware/upload');
const {
    getAllBeneficiaries,
    getBeneficiaryById,
    createBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    getBeneficiaryStats,
    uploadPhoto
} = require('../controllers/beneficiary.controller');

// Statistics route (must be before /:id route)
router.get('/stats/summary', protect, getBeneficiaryStats);

// CRUD routes
router.route('/')
    .get(protect, getAllBeneficiaries)
    .post(protect, createBeneficiary);

router.route('/:id')
    .get(protect, getBeneficiaryById)
    .put(protect, updateBeneficiary)
    .delete(protect, deleteBeneficiary);

// Photo upload route
router.post('/:id/photo', protect, uploadBeneficiaryPhoto, uploadPhoto);

module.exports = router;
