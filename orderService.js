const Order = require('../models/Order');
const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const { AppError } = require('../utils/helpers');

class OrderService {
  async createOrder(userId, orderData) {
    const { deliveryType, paymentMethod, deliveryAddress, contactPhone, preferredDeliveryTime, orderNotes } = orderData;

    // Знаходимо користувача
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('Користувач не знайдений', 404);
    }

    // Знаходимо кошик
    const cart = await Cart.findOne({ user: userId }).populate('items.menuItem');
    if (!cart || cart.items.length === 0) {
      throw new AppError('Кошик порожній', 400);
    }

    // Перевіряємо доступність товарів
    for (const cartItem of cart.items) {
      if (!cartItem.menuItem || !cartItem.menuItem.available) {
        throw new AppError(`Товар "${cartItem.menuItem?.name || 'Невідомий'}" недоступний`, 400);
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
    const deliveryFee = deliveryType === 'delivery' ? (subtotal > 200 ? 0 : 25) : 0;
    const totalAmount = subtotal + taxes + deliveryFee;

    // Створюємо замовлення
    const order = new Order({
      orderNumber: Order.generateOrderNumber(),
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
        address: deliveryType === 'delivery' ? deliveryAddress : undefined,
        estimatedTime: preferredDeliveryTime ? new Date(preferredDeliveryTime) : this.calculateEstimatedTime()
      },
      payment: {
        method: paymentMethod,
        status: 'pending'
      },
      contact: {
        phone: contactPhone,
        email: user.email
      },
      status: 'confirmed',
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
        'statistics.totalOrders': 1,
        'statistics.totalSpent': totalAmount
      }
    });

    // Очищаємо кошик
    await cart.clear();

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
        .populate('items.menuItem', 'name images'),
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
      .populate('user', 'firstName lastName email phone')
      .populate('items.menuItem', 'name images category');

    if (!order) {
      throw new AppError('Замовлення не знайдено', 404);
    }

    return order;
  }

  async updateOrderStatus(orderId, newStatus, note, updatedBy) {
    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new AppError('Замовлення не знайдено', 404);
    }

    // Перевіряємо чи можна змінити статус
    const validTransitions = this.getValidStatusTransitions(order.status);
    if (!validTransitions.includes(newStatus)) {
      throw new AppError(`Неможливо змінити статус з "${order.status}" на "${newStatus}"`, 400);
    }

    await order.updateStatus(newStatus, note, updatedBy);
    return order;
  }

  async cancelOrder(orderId, userId, reason) {
    const order = await Order.findOne({ _id: orderId, user: userId });
    
    if (!order) {
      throw new AppError('Замовлення не знайдено', 404);
    }

    if (!order.canBeCancelled) {
      throw new AppError('Це замовлення не можна скасувати', 400);
    }

    order.cancelReason = reason;
    await order.updateStatus('cancelled', `Замовлення скасовано клієнтом. Причина: ${reason}`);

    return order;
  }

  async getOrderStatistics(filters = {}) {
    const { startDate, endDate } = filters;
    
    let matchQuery = {};
    
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    const stats = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.totalAmount' },
          avgOrderValue: { $avg: '$pricing.totalAmount' },
          ordersByStatus: {
            $push: '$status'
          }
        }
      }
    ]);

    return stats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
      ordersByStatus: []
    };
  }
async getAllOrders(filters = {}) {
  const { status, page = 1, limit = 20 } = filters;
  
  const query = {};
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  const [orders, totalOrders] = await Promise.all([
    Order.find(query)
      .populate('user', 'firstName lastName email phone')
      .populate('items.menuItem', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
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

  calculateEstimatedTime() {
    const now = new Date();
    const estimatedMinutes = 30 + Math.floor(Math.random() * 15); // 30-45 хвилин
    return new Date(now.getTime() + estimatedMinutes * 60000);
  }

  getValidStatusTransitions(currentStatus) {
    const transitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['preparing', 'cancelled'],
      'preparing': ['ready', 'cancelled'],
      'ready': ['delivering', 'delivered'], // delivered для pickup
      'delivering': ['delivered'],
      'delivered': [], // кінцевий статус
      'cancelled': [] // кінцевий статус
    };

    return transitions[currentStatus] || [];
  }
}

module.exports = new OrderService();