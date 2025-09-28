const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  sessionId: {
    type: String,
    required: false
  },
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Кількість має бути мінімум 1'],
      max: [10, 'Максимальна кількість - 10']
    },
    size: String,
    customizations: [{
      name: String,
      price: {
        type: Number,
        default: 0
      }
    }],
    specialInstructions: {
      type: String,
      maxlength: [200, 'Інструкції не можуть бути довшими за 200 символів']
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  subtotal: {
    type: Number,
    default: 0
  },
  taxes: {
    type: Number,
    default: 0
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

cartSchema.virtual('isEmpty').get(function() {
  return this.items.length === 0;
});

cartSchema.index({ user: 1 });
cartSchema.index({ sessionId: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

cartSchema.methods.addItem = function(menuItemId, quantity, size, customizations, specialInstructions) {
  const existingItemIndex = this.items.findIndex(item => 
    item.menuItem.toString() === menuItemId.toString() && 
    item.size === size &&
    JSON.stringify(item.customizations) === JSON.stringify(customizations)
  );

  if (existingItemIndex > -1) {
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].addedAt = new Date();
  } else {
    this.items.push({
      menuItem: menuItemId,
      quantity,
      size,
      customizations: customizations || [],
      specialInstructions: specialInstructions || '',
      addedAt: new Date()
    });
  }

  this.expiresAt = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);
  return this.save();
};

cartSchema.methods.removeItem = function(itemId) {
  this.items.id(itemId).remove();
  return this.save();
};

cartSchema.methods.updateItemQuantity = function(itemId, quantity) {
  const item = this.items.id(itemId);
  if (item) {
    if (quantity <= 0) {
      item.remove();
    } else {
      item.quantity = Math.min(quantity, 10);
    }
  }
  return this.save();
};

cartSchema.methods.clear = function() {
  this.items = [];
  this.subtotal = 0;
  this.taxes = 0;
  this.deliveryFee = 0;
  this.totalAmount = 0;
  return this.save();
};

cartSchema.statics.findByUserOrSession = function(userId, sessionId) {
  const query = userId ? { user: userId } : { sessionId: sessionId };
  return this.findOne(query).populate('items.menuItem');
};

module.exports = mongoose.model('Cart', cartSchema);
