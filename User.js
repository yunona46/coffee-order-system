const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    select: false // не включати пароль в запити за замовчуванням
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
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  addresses: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    street: {
      type: String,
      required: true,
      trim: true
    },
    building: {
      type: String,
      required: true,
      trim: true
    },
    apartment: String,
    floor: Number,
    entrance: String,
    intercom: String,
    notes: String,
    isDefault: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    favoriteCategories: [{
      type: String,
      enum: ['espresso', 'americano', 'latte', 'cappuccino', 'frappuccino']
    }]
  },
  statistics: {
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    favoriteItems: [{
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem'
      },
      orderCount: {
        type: Number,
        default: 1
      }
    }]
  },
  lastLoginAt: Date,
  passwordChangedAt: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Віртуальні поля
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('averageOrderValue').get(function() {
  return this.statistics.totalOrders > 0 
    ? Math.round(this.statistics.totalSpent / this.statistics.totalOrders) 
    : 0;
});

// Індекси
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Middleware - хешування паролю перед збереженням
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, parseInt(process.env.BCRYPT_ROUNDS) || 12);
  this.passwordChangedAt = new Date();
  next();
});

// Методи схеми
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateJWT = function() {
  return jwt.sign(
    { 
      userId: this._id, 
      email: this.email, 
      role: this.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Статичні методи
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

module.exports = mongoose.model('User', userSchema);