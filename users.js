const express = require('express');
const { body, param } = require('express-validator');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const updateProfileValidation = [
  body('firstName').optional().trim().isLength({ min: 2, max: 50 })
    .withMessage('Ім\'я має містити від 2 до 50 символів'),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 })
    .withMessage('Прізвище має містити від 2 до 50 символів'),
  body('phone').optional().matches(/^\+380\d{9}$/)
    .withMessage('Номер телефону має бути у форматі +380XXXXXXXXX')
];

const addressValidation = [
  body('name').trim().isLength({ min: 1, max: 50 }).withMessage('Назва адреси обов\'язкова'),
  body('street').trim().isLength({ min: 1, max: 100 }).withMessage('Назва вулиці обов\'язкова'),
  body('building').trim().isLength({ min: 1, max: 10 }).withMessage('Номер будинку обов\'язковий'),
  body('apartment').optional().trim().isLength({ max: 10 }),
  body('floor').optional().isInt({ min: 0, max: 100 }),
  body('entrance').optional().trim().isLength({ max: 10 }),
  body('intercom').optional().trim().isLength({ max: 20 }),
  body('notes').optional().trim().isLength({ max: 200 })
];

// All user routes require authentication
router.use(authenticate);

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileValidation, userController.updateProfile);
router.get('/statistics', userController.getUserStatistics);

// Address routes
router.get('/addresses', userController.getAddresses);
router.post('/addresses', addressValidation, userController.addAddress);
router.put('/addresses/:addressId', [
  param('addressId').isMongoId().withMessage('Невірний ID адреси'),
  ...addressValidation
], userController.updateAddress);
router.delete('/addresses/:addressId', [
  param('addressId').isMongoId().withMessage('Невірний ID адреси')
], userController.deleteAddress);

module.exports = router;