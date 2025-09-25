const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');

// All cart routes require authentication
router.use(authenticateToken);

router.get('/', cartController.getCart);
router.post('/items', cartController.addToCart);
router.delete('/items/:itemId', cartController.removeFromCart);
router.put('/items/:itemId', cartController.updateCartItem);
router.delete('/', cartController.clearCart);

module.exports = router;
