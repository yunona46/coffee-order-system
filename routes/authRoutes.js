const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { authenticate } = require('../middleware/auth');

// ========================================
// REGISTRATION (Реєстрація)
// ========================================
router.post('/register', async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Користувач успішно зареєстрований',
      user: result.user,
      accessToken: result.accessToken
    });
  } catch (error) {
    console.error('Помилка реєстрації:', error);
    
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Помилка при реєстрації',
      code: error.code || 'REGISTRATION_ERROR'
    });
  }
});

// ========================================
// LOGIN (Вхід)
// ========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Валідація наявності полів
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email та пароль обов\'язкові',
        code: 'MISSING_CREDENTIALS'
      });
    }
    
    // Валідація типів (захист від об'єктів)
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Email та пароль мають бути рядками',
        code: 'INVALID_INPUT_TYPE'
      });
    }
    
    // Логіка логіну
    const result = await authService.loginUser(email, password);
    
    res.json({
      success: true,
      message: 'Успішний вхід',
      user: result.user,
      accessToken: result.accessToken
    });
  } catch (error) {
    if (error.statusCode === 401) {
      return res.status(401).json({
        success: false,
        message: error.message,
        code: error.code || 'LOGIN_ERROR'
      });
    }
    
    console.error('Помилка входу:', error);
    
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Помилка при вході',
      code: error.code || 'LOGIN_ERROR'
    });
  }
});

// ========================================
// GET PROFILE (Отримати профіль)
// ========================================
router.get('/profile', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Помилка отримання профілю:', error);
    
    res.status(500).json({
      success: false,
      message: 'Помилка при отриманні профілю'
    });
  }
});

// ========================================
// CHANGE PASSWORD (Зміна паролю)
// ========================================
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Старий та новий пароль обов\'язкові'
      });
    }
    
    await authService.changePassword(req.user.id, oldPassword, newPassword);
    
    res.json({
      success: true,
      message: 'Пароль успішно змінено'
    });
  } catch (error) {
    console.error('Помилка зміни паролю:', error);
    
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Помилка при зміні паролю'
    });
  }
});

// ========================================
// FORGOT PASSWORD (Відновлення паролю)
// ========================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email обов\'язковий'
      });
    }
    
    const result = await authService.forgotPassword(email);
    
    res.json({
      success: true,
      message: result.message,
      // В продакшені не повертаємо токен!
      resetToken: result.resetToken
    });
  } catch (error) {
    console.error('Помилка відновлення паролю:', error);
    
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Помилка при відновленні паролю'
    });
  }
});

module.exports = router;