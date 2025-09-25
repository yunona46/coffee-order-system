const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Simple admin check middleware
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required',
            code: 'ACCESS_DENIED'
        });
    }
    next();
};

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Simple admin endpoint for testing
router.get('/statistics', (req, res) => {
    res.json({
        success: true,
        message: 'Admin endpoint works!',
        data: {
            totalUsers: 3,
            totalOrders: 2,
            totalRevenue: 176.5,
            system: 'Coffee Order System',
            version: '1.0.0'
        }
    });
});

// Simple orders endpoint for admin
router.get('/orders', (req, res) => {
    res.json({
        success: true,
        message: 'Admin orders endpoint works!',
        data: {
            orders: [],
            total: 0
        }
    });
});

module.exports = router;
