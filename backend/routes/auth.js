const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.get('/users', authenticateToken, authController.getUsers);

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes working!' });
});

module.exports = router;
