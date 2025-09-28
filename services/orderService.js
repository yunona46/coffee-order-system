import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import MenuItem from "../models/MenuItem.js";
import User from "../models/User.js";
import { AppError } from "../utils/helpers.js";

class OrderService {
  async createOrder(userId, orderData) {
    const { deliveryType, paymentMethod, deliveryAddress, contactPhone, orderNotes } = orderData;

    // Знаходимо користувача
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("Користувач не знайдений", 404);
    }

    // Знаходимо кошик
    const cart = await Cart.findOne({ user: userId }).populate("items.menuItem");
    if (!cart || cart.items.length === 0) {
      throw new AppError("Кошик порожній", 400);
    }

    // Перевіряємо доступність товарів
    for (const cartItem of cart.items) {
      if (!cartItem.menuItem || !cartItem.menuItem.available) {
        throw new AppError(`Товар "${cartItem.menuItem?.name || "Невідомий"}" недоступний`, 400);
      }
    }

    // Створюємо товари замовлення
    const orderItems = cart.items.map(cartItem => {
      let itemPrice = cartItem.menuItem.price;

      // Ціна за розміром
      if (cartItem.size && cartItem.menuItem.sizes.length > 0) {
        const sizeInfo = cartItem.menuItem.sizes.find(s => s.name === cartItem.size);
        if (sizeInfo) {
          itemPrice = sizeInfo.price;
        }
      }

      // Додаємо ціну кастомізацій
      const customizationPrice = cartItem.customizations.reduce((sum, custom) => {
        return sum + (custom.price || 0);
      }, 0);

      const totalItemPrice = (itemPrice + customizationPrice) * cartItem.quantity;

      return {
        menuItem: cartItem.menuItem._id,
        name: cartItem.menuItem.name,
        quantity: cartItem.quantity,
        size: cartItem.size,
        price: itemPrice + customizationPrice,
        customizations: cartItem.customizations,
        specialInstructions: cartItem.specialInstructions,
        totalPrice: totalItemPrice
      };
    });

    // Обчислюємо суми
    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxes = Math.round(subtotal * 0.1 * 100) / 100;
    const deliveryFee = deliveryType === "delivery" ? (subtotal > 200 ? 0 : 25) : 0;
    const totalAmount = subtotal + taxes + deliveryFee;

    // Генеруємо номер замовлення
    const orderNumber = this.generateOrderNumber();

    // Створюємо замовлення
    const order = new Order({
      orderNumber: orderNumber,
      user: userId,
      items: orderItems,
      pricing: {
        subtotal,
        taxes,
        deliveryFee,
        discount: 0,
        totalAmount
      },
      delivery: {
        type: deliveryType,
        address: deliveryType === "delivery" ? deliveryAddress : undefined,
        estimatedTime: this.calculateEstimatedTime()
      },
      payment: {
        method: paymentMethod,
        status: "pending"
      },
      contact: {
        phone: contactPhone,
        email: user.email
      },
      status: "confirmed",
      notes: {
        customer: orderNotes
      },
      estimatedCompletionTime: this.calculateEstimatedTime()
    });

    await order.save();

    // Оновлюємо статистику товарів
    for (const item of orderItems) {
      await MenuItem.findByIdAndUpdate(item.menuItem, {
        $inc: { orderCount: item.quantity }
      });
    }

    // Оновлюємо статистику користувача
    await User.findByIdAndUpdate(userId, {
      $inc: {
        "statistics.totalOrders": 1,
        "statistics.totalSpent": totalAmount
      }
    });

    // Очищаємо кошик
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    return order;
  }

  async getUserOrders(userId, filters = {}) {
    const { status, page = 1, limit = 10 } = filters;
    
    let query = { user: userId };
    
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("items.menuItem", "name images"),
      Order.countDocuments(query)
    ]);

    return {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalItems: totalOrders
      }
    };
  }

  async getOrderById(orderId, userId = null) {
    const query = { _id: orderId };
    if (userId) {
      query.user = userId;
    }

    const order = await Order.findOne(query)
      .populate("user", "firstName lastName email phone")
      .populate("items.menuItem", "name images category");

    if (!order) {
      throw new AppError("Замовлення не знайдено", 404);
    }

    return order;
  }

  generateOrderNumber() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `COF-${date}-${random}`;
  }

  calculateEstimatedTime() {
    const now = new Date();
    const estimatedMinutes = 30 + Math.floor(Math.random() * 15); // 30-45 хвилин
    return new Date(now.getTime() + estimatedMinutes * 60000);
  }
}

export default new OrderService();
