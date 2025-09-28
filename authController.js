const authService = require('../services/authService');
const { validationResult } = require('express-validator');
const { asyncHandler, AppError } = require('../utils/helpers');

class AuthController {
  register = asyncHandler(async (req, res) => {
    // Перевіряємо валідацію
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: 'Помилка валідації',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }

    const result = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: 'Користувач успішно зареєстрований',
      data: result
    });
  });

  login = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: 'Помилка валідації',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }

    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);

    res.json({
      success: true,
      message: 'Успішна авторизація',
      data: result
    });
  });

  logout = asyncHandler(async (req, res) => {
    // В реальному додатку тут би був blacklist токенів
    res.json({
      success: true,
      message: 'Успішний вихід з системи'
    });
  });

  changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const result = await authService.changePassword(userId, oldPassword, newPassword);

    res.json({
      success: true,
      message: result.message
    });
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);

    res.json({
      success: true,
      message: result.message
    });
  });

  getMe = asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  });
}

module.exports = new AuthController();