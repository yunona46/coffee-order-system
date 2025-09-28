const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { AppError } = require('../utils/helpers');

class AuthService {
  async registerUser(userData) {
    const { firstName, lastName, email, password, phone } = userData;

    // Перевіряємо чи користувач вже існує
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new AppError('Користувач з таким email вже існує', 409);
    }

    // Створюємо нового користувача
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone
    });

    await user.save();

    // Генеруємо JWT токен
    const token = user.generateJWT();

    // Повертаємо користувача без паролю
    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      user: userResponse,
      accessToken: token
    };
  }

  async loginUser(email, password) {
    // Знаходимо користувача з паролем
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user || !await user.comparePassword(password)) {
      throw new AppError('Невірний email або пароль', 401);
    }

    if (!user.isActive) {
      throw new AppError('Акаунт деактивовано', 401);
    }

    // Оновлюємо час останнього входу
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    // Генеруємо токен
    const token = user.generateJWT();

    // Повертаємо користувача без паролю
    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      user: userResponse,
      accessToken: token
    };
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new AppError('Користувач не знайдений', 401);
      }

      if (!user.isActive) {
        throw new AppError('Акаунт деактивовано', 401);
      }

      // Перевіряємо чи пароль не був змінений після видачі токену
      if (user.changedPasswordAfter(decoded.iat)) {
        throw new AppError('Пароль було змінено. Увійдіть знову.', 401);
      }

      return user;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Термін дії токену закінчився', 401);
      }
      if (error.name === 'JsonWebTokenError') {
        throw new AppError('Невірний токен', 401);
      }
      throw error;
    }
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    
    if (!await user.comparePassword(oldPassword)) {
      throw new AppError('Поточний пароль невірний', 400);
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Пароль успішно змінено' };
  }

  async forgotPassword(email) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new AppError('Користувач з таким email не знайдений', 404);
    }

    // Генеруємо токен для скидання паролю
    const resetToken = jwt.sign(
      { userId: user._id, type: 'password-reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 година
    await user.save({ validateBeforeSave: false });

    // В реальному додатку тут буде відправка email
    return {
      message: 'Інструкції для скидання паролю надіслано на email',
      resetToken // В продакшені не повертаємо токен
    };
  }
}

module.exports = new AuthService();