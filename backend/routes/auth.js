const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate, registerSchema, loginSchema } = require('../utils/validators');

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('Ім\'я має містити від 2 до 50 символів'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Прізвище має містити від 2 до 50 символів'),
  body('email').isEmail().normalizeEmail().withMessage('Введіть коректний email'),
  body('password').isLength({ min: 6 }).withMessage('Пароль має містити мінімум 6 символів'),
  body('phone').optional().matches(/^\+380\d{9}$/).withMessage('Номер телефону має бути у форматі +380XXXXXXXXX')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Введіть коректний email'),
  body('password').notEmpty().withMessage('Пароль обов\'язковий')
];

const changePasswordValidation = [
  body('oldPassword').notEmpty().withMessage('Поточний пароль обов\'язковий'),
  body('newPassword').isLength({ min: 6 }).withMessage('Новий пароль має містити мінімум 6 символів')
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Введіть коректний email')
], authController.forgotPassword);

// Protected routes
router.use(authenticate);
router.get('/me', authController.getMe);
router.post('/change-password', changePasswordValidation, authController.changePassword);

module.exports = router;