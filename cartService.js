const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');
const { AppError } = require('../utils/helpers');

class CartService {
  async getCart(userId, sessionId) {
    let cart = await Cart.findByUserOrSession(userId, sessionId);
    
    if (!cart) {
      cart = new Cart({
        user: userId || undefined,
        sessionId: !userId ? sessionId : undefined,
        items: []
      });
      await cart.save();
    }

    // Обчислюємо загальні суми
    const totals = await this.calculateCartTotals(cart);

    // Повертаємо кошик з totals
    return {
      ...cart.toObject(),
      ...totals
    };
  }

  async addItemToCart(userId, sessionId, itemData) {
    const { menuItemId, quantity, size, customizations, specialInstructions } = itemData;

    // Перевіряємо чи існує позиція меню
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      throw new AppError('Позицію меню не знайдено', 404);
    }

    if (!menuItem.available) {
      throw new AppError('Цей товар недоступний', 400);
    }

    // Знаходимо або створюємо кошик
    let cart = await Cart.findByUserOrSession(userId, sessionId);
    
    if (!cart) {
      cart = new Cart({
        user: userId || undefined,
        sessionId: !userId ? sessionId : undefined,
        items: []
      });
    }

    // Додаємо товар до кошика
    await cart.addItem(menuItemId, quantity, size, customizations, specialInstructions);
    
    // Обчислюємо суми
    const totals = await this.calculateCartTotals(cart);

    return {
      cartItem: cart.items[cart.items.length - 1],
      cartSummary: {
        totalItems: cart.totalItems,
        totalAmount: totals.totalAmount
      }
    };
  }

  async updateCartItemQuantity(userId, sessionId, itemId, quantity) {
    const cart = await Cart.findByUserOrSession(userId, sessionId);
    
    if (!cart) {
      throw new AppError('Кошик не знайдено', 404);
    }

    await cart.updateItemQuantity(itemId, quantity);
    
    const totals = await this.calculateCartTotals(cart);

    return {
      cartSummary: {
        totalItems: cart.totalItems,
        totalAmount: totals.totalAmount
      }
    };
  }

  async removeItemFromCart(userId, sessionId, itemId) {
    const cart = await Cart.findByUserOrSession(userId, sessionId);
    
    if (!cart) {
      throw new AppError('Кошик не знайдено', 404);
    }

    const itemExists = cart.items.id(itemId);
    if (!itemExists) {
      throw new AppError('Товар в кошику не знайдено', 404);
    }

    await cart.removeItem(itemId);
    
    const totals = await this.calculateCartTotals(cart);

    return {
      cartSummary: {
        totalItems: cart.totalItems,
        totalAmount: totals.totalAmount
      }
    };
  }

  async clearCart(userId, sessionId) {
    const cart = await Cart.findByUserOrSession(userId, sessionId);
    
    if (!cart) {
      throw new AppError('Кошик не знайдено', 404);
    }

    await cart.clear();
    return { message: 'Кошик очищено' };
  }

  async calculateCartTotals(cart) {
    let subtotal = 0;

    // Отримуємо актуальні ціни товарів
    for (const item of cart.items) {
      await item.populate('menuItem');
      const menuItem = item.menuItem;
      
      if (!menuItem || !menuItem.available) {
        continue;
      }

      let itemPrice = menuItem.price;

      // Знаходимо ціну за розміром
      if (item.size && menuItem.sizes.length > 0) {
        const sizeInfo = menuItem.sizes.find(s => s.name === item.size);
        if (sizeInfo) {
          itemPrice = sizeInfo.price;
        }
      }

      // Додаємо ціну кастомізацій
      if (item.customizations && item.customizations.length > 0) {
        const customizationPrice = item.customizations.reduce((sum, custom) => {
          return sum + (custom.price || 0);
        }, 0);
        itemPrice += customizationPrice;
      }

      subtotal += itemPrice * item.quantity;
    }

    // Виправлено: використовуємо різні імена змінних
    const calculatedTaxes = Math.round(subtotal * 0.1 * 100) / 100; // 10% податок
    const deliveryFee = subtotal > 200 ? 0 : 25; // Безкоштовна доставка від 200 грн
    const totalAmount = subtotal + calculatedTaxes + deliveryFee;

    return {
      subtotal,
      taxes: calculatedTaxes,
      deliveryFee,
      totalAmount,
      totalItems: cart.items.reduce((total, item) => total + item.quantity, 0)
    };
  }

  async transferCartToUser(sessionId, userId) {
    // Знаходимо анонімний кошик
    const anonymousCart = await Cart.findOne({ sessionId });
    if (!anonymousCart || anonymousCart.items.length === 0) {
      return null;
    }

    // Знаходимо або створюємо кошик користувача
    let userCart = await Cart.findOne({ user: userId });
    
    if (!userCart) {
      // Переносимо анонімний кошик користувачу
      anonymousCart.user = userId;
      anonymousCart.sessionId = undefined;
      await anonymousCart.save();
      return anonymousCart;
    }

    // Об'єднуємо кошики
    for (const item of anonymousCart.items) {
      await userCart.addItem(
        item.menuItem,
        item.quantity,
        item.size,
        item.customizations,
        item.specialInstructions
      );
    }

    // Видаляємо анонімний кошик
    await Cart.findByIdAndDelete(anonymousCart._id);

    return userCart;
  }
}

module.exports = new CartService();