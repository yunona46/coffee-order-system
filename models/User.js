const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Ім\'я обов\'язкове'],
    trim: true,
    minlength: [2, 'Ім\'я має містити мінімум 2 символи'],
    maxlength: [50, 'Ім\'я не може бути довшим за 50 символів']
  },
  lastName: {
    type: String,
    required: [true, 'Прізвище обов\'язкове'],
    trim: true,
    minlength: [2, 'Прізвище має містити мінімум 2 символи'],
    maxlength: [50, 'Прізвище не може бути довшим за 50 символів']
  },
  email: {
    type: String,
    required: [true, 'Email обов\'язковий'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Введіть валідний email']
  },
  password: {
    type: String,
    required: [true, 'Пароль обов\'язковий'],
    minlength: [6, 'Пароль має містити мінімум 6 символів'],
    select: false
  },
  phone: {
    type: String,
    match: [/^\+380\d{9}$/, 'Номер телефону має бути у форматі +380XXXXXXXXX']
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'manager'],
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: {
    type: Date
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date
}, {
  timestamps: true
});


userSchema.pre('save', async function() {
  // Хешуємо пароль тільки якщо він змінився
  if (!this.isModified('password')) return;
  
  this.password = await bcrypt.hash(this.password, 12);
  
  // Якщо пароль змінено (не при першому створенні)
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000; // -1 сек для синхронізації
  }
});

// Метод порівняння паролів
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Перевірка чи змінено пароль після видачі токену
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);