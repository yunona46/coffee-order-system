import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true, // Це вже створює індекс
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Користувач обов'язковий"]
  },
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Кількість має бути мінімум 1"]
    },
    size: String,
    price: {
      type: Number,
      required: true,
      min: [0, "Ціна не може бути від'ємною"]
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
      min: [0, "Загальна ціна не може бути від'ємною"]
    }
  }],
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Підсума не може бути від'ємною"]
    },
    taxes: {
      type: Number,
      required: true,
      min: [0, "Податки не можуть бути від'ємними"]
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: [0, "Вартість доставки не може бути від'ємною"]
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Знижка не може бути від'ємною"]
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Загальна сума не може бути від'ємною"]
    }
  },
  delivery: {
    type: {
      type: String,
      required: true,
      enum: ["pickup", "delivery"]
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
      enum: ["cash", "card", "online"]
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded"],
      default: "pending"
    },
    transactionId: String,
    paidAt: Date,
    refundedAt: Date
  },
  contact: {
    phone: {
      type: String,
      required: [true, "Контактний телефон обов'язковий"],
      match: [/^\+380\d{9}$/, "Номер телефону має бути у форматі +380XXXXXXXXX"]
    },
    email: String,
    preferredContactMethod: {
      type: String,
      enum: ["phone", "email"],
      default: "phone"
    }
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "ready", "delivering", "delivered", "cancelled"],
    default: "pending"
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
      ref: "User"
    }
  }],
  notes: {
    customer: String,
    internal: String,
    courier: String
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
orderSchema.virtual("totalItems").get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

orderSchema.virtual("isDelivery").get(function() {
  return this.delivery.type === "delivery";
});

// Індекси - видаляємо дубльовані
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
// orderSchema.index({ orderNumber: 1 }); // Цей індекс вже створюється через unique: true

const Order = mongoose.model("Order", orderSchema);
export default Order;
