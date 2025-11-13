// =====================================================
// CARITAS M&E SYSTEM - MAIN SERVER FILE
// =====================================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// =====================================================
// MIDDLEWARE
// =====================================================

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX || 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Static files
app.use('/uploads', express.static('uploads'));

// =====================================================
// ROUTES
// =====================================================

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Caritas M&E System API is running',
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || 'v1'
    });
});

// API Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/users', require('./routes/user.routes'));
app.use('/api/v1/beneficiaries', require('./routes/beneficiary.routes'));
app.use('/api/v1/programs', require('./routes/program.routes'));
app.use('/api/v1/activities', require('./routes/activity.routes'));
app.use('/api/v1/reports', require('./routes/report.routes'));
app.use('/api/v1/dashboard', require('./routes/dashboard.routes'));

// 404 Handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// =====================================================
// DATABASE CONNECTION & SERVER START
// =====================================================

const db = require('./config/database');

// Load models and associations
require('./models/index');

// Test database connection
db.authenticate()
    .then(() => {
        console.log('✓ Database connected successfully');
        
        // Sync models (don't use force: true in production!)
        //return db.sync({ alter: process.env.NODE_ENV === 'development' });
        return db.sync({ alter: false }); // Don't alter existing tables
    })
    .then(() => {
        console.log('✓ Database models synchronized');
        
        // Start server
        app.listen(PORT, () => {
            console.log('');
            console.log('===========================================');
            console.log('  CARITAS M&E SYSTEM - API SERVER');
            console.log('===========================================');
            console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`  Server running on: http://localhost:${PORT}`);
            console.log(`  API Version: ${process.env.API_VERSION || 'v1'}`);
            console.log(`  Health Check: http://localhost:${PORT}/health`);
            console.log('===========================================');
            console.log('');
        });
    })
    .catch(err => {
        console.error('✗ Unable to connect to database:', err);
        process.exit(1);
    });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

module.exports = app;
