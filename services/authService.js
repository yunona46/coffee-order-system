const User = require('../models/User'); // ← Змінено
const jwt = require('jsonwebtoken'); // ← Змінено
const bcrypt = require('bcryptjs'); // ← Змінено

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.code = 'APP_ERROR';
  }
}

class AuthService {
  async registerUser(userData) {
    const { firstName, lastName, email, password, phone } = userData;

    // Перевіряємо чи користувач вже існує
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError("Користувач з таким email вже існує", 409);
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
    const token = this.generateToken(user._id);

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
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Невірний email або пароль", 401);
    }

    if (!user.isActive) {
      throw new AppError("Акаунт деактивовано", 401);
    }

    // Оновлюємо час останнього входу
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    // Генеруємо токен
    const token = this.generateToken(user._id);

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
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      const user = await User.findById(decoded.userId);
      if (!user) {
        const error = new AppError("Користувач не знайдений", 401);
        error.code = 'USER_NOT_FOUND';
        throw error;
      }

      if (!user.isActive) {
        const error = new AppError("Акаунт деактивовано", 401);
        error.code = 'ACCOUNT_DEACTIVATED';
        throw error;
      }

      // Додаємо id для зручності
      return {
        id: user._id.toString(),
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      };
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        const err = new AppError("Термін дії токену закінчився", 401);
        err.code = 'TOKEN_EXPIRED';
        throw err;
      }
      if (error.name === "JsonWebTokenError") {
        const err = new AppError("Невірний токен", 401);
        err.code = 'INVALID_TOKEN';
        throw err;
      }
      throw error;
    }
  }

  generateToken(userId) {
    return jwt.sign(
      { userId: userId.toString() },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId).select("+password");
    
    if (!(await user.comparePassword(oldPassword))) {
      throw new AppError("Поточний пароль невірний", 400);
    }

    user.password = newPassword;
    await user.save();

    return { message: "Пароль успішно змінено" };
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError("Користувач з таким email не знайдений", 404);
    }

    // Генеруємо токен для скидання паролю
    const resetToken = jwt.sign(
      { userId: user._id, type: "password-reset" },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: "1h" }
    );

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    return {
      message: "Інструкції для скидання паролю надіслано на email",
      resetToken
    };
  }
}

module.exports = new AuthService(); // ← Змінено export