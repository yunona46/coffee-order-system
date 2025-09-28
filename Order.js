const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Користувач обов\'язковий']
  },
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Кількість має бути мінімум 1']
    },
    size: String,
    price: {
      type: Number,
      required: true,
      min: [0, 'Ціна не може бути від\'ємною']
    },
    customizations: [{
      name: String,
      price: {
        type: Number,
        default: 0
      }
    }],
    specialInstructions: String,
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Загальна ціна не може бути від\'ємною']
    }
  }],
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Підсума не може бути від\'ємною']
    },
    taxes: {
      type: Number,
      required: true,
      min: [0, 'Податки не можуть бути від\'ємними']
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: [0, 'Вартість доставки не може бути від\'ємною']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Знижка не може бути від\'ємною']
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Загальна сума не може бути від\'ємною']
    }
  },
  delivery: {
    type: {
      type: String,
      required: true,
      enum: ['pickup', 'delivery']
    },
    address: {
      street: String,
      building: String,
      apartment: String,
      floor: Number,
      entrance: String,
      intercom: String,
      notes: String
    },
    estimatedTime: Date,
    actualTime: Date,
    courierNotes: String
  },
  payment: {
    method: {
      type: String,
      required: true,
      enum: ['cash', 'card', 'online']
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    refundedAt: Date
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Контактний телефон обов\'язковий'],
      match: [/^\+380\d{9}$/, 'Номер телефону має бути у форматі +380XXXXXXXXX']
    },
    email: String,
    preferredContactMethod: {
      type: String,
      enum: ['phone', 'email'],
      default: 'phone'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  notes: {
    customer: String,
    internal: String,
    courier: String
  },
  feedback: {
    rating: {
      type: Number,
      min: [1, 'Оцінка має бути мінімум 1'],
      max: [5, 'Оцінка має бути максимум 5']
    },
    comment: String,
    createdAt: Date
  },
  estimatedCompletionTime: Date,
  actualCompletionTime: Date,
  cancelledAt: Date,
  cancelReason: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Віртуальні поля
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

orderSchema.virtual('isDelivery').get(function() {
  return this.delivery.type === 'delivery';
});

orderSchema.virtual('canBeCancelled').get(function() {
  return ['pending', 'confirmed'].includes(this.status);
});

// Індекси
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'payment.status': 1 });

// Middleware
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: 'Замовлення створено'
    });
  }
  next();
});

// Методи схеми
orderSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note: note || `Статус змінено на ${newStatus}`,
    updatedBy: updatedBy
  });
  
  if (newStatus === 'delivered') {
    this.actualCompletionTime = new Date();
  }
  
  if (newStatus === 'cancelled') {
    this.cancelledAt = new Date();
  }
  
  return this.save();
};

orderSchema.methods.calculateTotal = function() {
  const subtotal = this.items.reduce((total, item) => total + item.totalPrice, 0);
  const taxes = Math.round(subtotal * 0.1 * 100) / 100; // 10% податок
  const deliveryFee = this.delivery.type === 'delivery' ? 25 : 0;
  
  this.pricing = {
    subtotal,
    taxes,
    deliveryFee,
    discount: this.pricing?.discount || 0,
    totalAmount: subtotal + taxes + deliveryFee - (this.pricing?.discount || 0)
  };
  
  return this.pricing.totalAmount;
};

// Статичні методи
orderSchema.statics.generateOrderNumber = function() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `COF-${date}-${random}`;
};

orderSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

orderSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Order', orderSchema);