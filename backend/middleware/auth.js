// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Protect routes - require authentication
 */
const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route - No token provided'
            });
        }

        try {
            // Verify token
            const decoded = verifyToken(token);

            // Get user from token
            const user = await User.findByPk(decoded.user_id, {
                attributes: { exclude: ['password_hash'] }
            });

            if (!user || user.status !== 'Active') {
                return res.status(401).json({
                    success: false,
                    message: 'User not found or inactive'
                });
            }

            // Add user to request object
            req.user = user;
            next();

        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized - Invalid token'
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error in authentication',
            error: error.message
        });
    }
};

/**
 * Authorize specific roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized - User not found'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }

        next();
    };
};

module.exports = { protect, authorize };
