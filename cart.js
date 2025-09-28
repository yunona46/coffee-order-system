const express = require('express');
const { body, param } = require('express-validator');
const cartController = require('../controllers/cartController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const addItemValidation = [
  body('menuItemId').isMongoId().withMessage('Невірний ID товару'),
  body('quantity').isInt({ min: 1, max: 10 }).withMessage('Кількість має бути від 1 до 10'),
  body('size').optional().isString().trim(),
  body('specialInstructions').optional().isLength({ max: 200 })
    .withMessage('Інструкції не можуть бути довшими за 200 символів')
];

const updateQuantityValidation = [
  param('itemId').isMongoId().withMessage('Невірний ID товару'),
  body('quantity').isInt({ min: 0, max: 10 }).withMessage('Кількість має бути від 0 до 10') // Змініть min на 0
];

// Apply optional authentication to all cart routes
router.use(optionalAuth);

// Routes
router.get('/', cartController.getCart);
router.post('/items', addItemValidation, cartController.addItem);
router.put('/items/:itemId', updateQuantityValidation, cartController.updateItemQuantity);
router.delete('/items/:itemId', [
  param('itemId').isMongoId().withMessage('Невірний ID товару')
], cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;