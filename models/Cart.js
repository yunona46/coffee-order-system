import mongoose from "mongoose";

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
    expires: 60 * 60 * 24 * 7 // TTL index - не потрібно додаткового індексу
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

// Індекси - видаляємо дубльовані
cartSchema.index({ user: 1 });
cartSchema.index({ sessionId: 1 });
// cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Цей індекс вже створюється через expires

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
