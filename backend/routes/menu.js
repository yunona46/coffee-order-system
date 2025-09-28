const express = require('express');
const { body, param, query } = require('express-validator');
const menuController = require('../controllers/menuController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const menuItemValidation = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Назва має містити від 1 до 100 символів'),
  body('description').trim().isLength({ min: 10, max: 500 }).withMessage('Опис має містити від 10 до 500 символів'),
  body('category').isIn(['espresso', 'americano', 'latte', 'cappuccino', 'frappuccino'])
    .withMessage('Невірна категорія'),
  body('price').isFloat({ min: 0, max: 10000 }).withMessage('Ціна має бути від 0 до 10000'),
  body('preparationTime').isInt({ min: 1, max: 60 }).withMessage('Час приготування має бути від 1 до 60 хвилин')
];

const searchValidation = [
  query('q').isLength({ min: 2 }).withMessage('Пошуковий запит має містити мінімум 2 символи')
];

// Public routes
router.get('/', menuController.getAllItems);
router.get('/popular', menuController.getPopularItems);
router.get('/featured', menuController.getFeaturedItems);
router.get('/categories', menuController.getCategories);
router.get('/search', searchValidation, menuController.searchItems);
router.get('/:id', [
  param('id').isMongoId().withMessage('Невірний ID товару')
], menuController.getItemById);

// Admin routes
router.use(authenticate, authorize('admin', 'manager'));
router.post('/', menuItemValidation, menuController.createItem);
router.put('/:id', [
  param('id').isMongoId().withMessage('Невірний ID товару'),
  ...menuItemValidation
], menuController.updateItem);
router.delete('/:id', [
  param('id').isMongoId().withMessage('Невірний ID товару')
], menuController.deleteItem);

module.exports = router;