const mongoose = require('mongoose'); // ← Змінено з import на require

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  sessionId: {
    type: String,
    required: false
  },
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Кількість має бути мінімум 1"],
      max: [10, "Максимальна кількість - 10"]
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
      maxlength: [200, "Інструкції не можуть бути довшими за 200 символів"]
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7
  },
  calculatedTotal: Number,
  subtotal: Number,
  taxes: Number,
  deliveryFee: Number
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Віртуальні поля
cartSchema.virtual("totalItems").get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

cartSchema.virtual("isEmpty").get(function() {
  return this.items.length === 0;
});

// Індекси
cartSchema.index({ user: 1 });
cartSchema.index({ sessionId: 1 });

module.exports = mongoose.model("Cart", cartSchema); // ← Змінено export на module.exports