// =====================================================
// FILE UPLOAD MIDDLEWARE
// =====================================================

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = [
    'uploads',
    'uploads/beneficiaries',
    'uploads/activities',
    'uploads/documents'
];

uploadDirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

// Configure storage for beneficiary photos
const beneficiaryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/beneficiaries'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'beneficiary-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Configure storage for activity documents
const activityStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/activities'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'activity-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Configure storage for general documents
const documentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/documents'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'document-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images
const imageFilter = function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
    }
};

// File filter for documents
const documentFilter = function (req, file, cb) {
    const allowedTypes = /pdf|doc|docx|xls|xlsx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only document files are allowed (pdf, doc, docx, xls, xlsx, txt)'));
    }
};

// Configure multer uploads
exports.uploadBeneficiaryPhoto = multer({
    storage: beneficiaryStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: imageFilter
}).single('photo');

exports.uploadActivityFiles = multer({
    storage: activityStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
}).array('files', 10);

exports.uploadDocument = multer({
    storage: documentStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: documentFilter
}).single('document');
