const express = require('express');
const { body, param, query } = require('express-validator');
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const createOrderValidation = [
  body('deliveryType').isIn(['pickup', 'delivery']).withMessage('Тип доставки має бути pickup або delivery'),
  body('paymentMethod').isIn(['cash', 'card', 'online']).withMessage('Метод оплати має бути cash, card або online'),
  body('contactPhone').matches(/^\+380\d{9}$/).withMessage('Номер телефону має бути у форматі +380XXXXXXXXX'),
  body('deliveryAddress').if(body('deliveryType').equals('delivery')).notEmpty()
    .withMessage('Адреса доставки обов\'язкова для delivery'),
  body('deliveryAddress.street').if(body('deliveryType').equals('delivery')).notEmpty()
    .withMessage('Вулиця обов\'язкова'),
  body('deliveryAddress.building').if(body('deliveryType').equals('delivery')).notEmpty()
    .withMessage('Номер будинку обов\'язковий'),
  body('orderNotes').optional().isLength({ max: 500 })
    .withMessage('Коментарі не можуть бути довшими за 500 символів')
];

const updateStatusValidation = [
  param('id').isMongoId().withMessage('Невірний ID замовлення'),
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'])
    .withMessage('Невірний статус замовлення'),
  body('note').optional().isString().trim()
];

// Customer routes
router.use(authenticate);
router.get('/', orderController.getUserOrders);
router.post('/', createOrderValidation, orderController.createOrder);
router.get('/:id', [
  param('id').isMongoId().withMessage('Невірний ID замовлення')
], orderController.getOrderById);
router.post('/:id/cancel', [
  param('id').isMongoId().withMessage('Невірний ID замовлення'),
  body('reason').notEmpty().withMessage('Причина скасування обов\'язкова')
], orderController.cancelOrder);

// Admin routes
router.use(authorize('admin', 'manager'));
router.get('/admin/all', orderController.getAllOrders);
router.put('/admin/:id/status', updateStatusValidation, orderController.updateOrderStatus);
router.get('/admin/statistics', orderController.getOrderStatistics);

module.exports = router;