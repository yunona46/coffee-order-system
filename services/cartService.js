import Cart from "../models/Cart.js";
import MenuItem from "../models/MenuItem.js";
import { AppError } from "../utils/helpers.js";

class CartService {
  async getCart(userId, sessionId) {
    let cart = await this.findCart(userId, sessionId);
    
    if (!cart) {
      // Створюємо новий кошик
      cart = new Cart({
        user: userId || undefined,
        sessionId: !userId ? sessionId : undefined,
        items: []
      });
      await cart.save();
    }

    // Обчислюємо загальні суми
    await this.calculateCartTotals(cart);

    return cart;
  }

  async addItemToCart(userId, sessionId, itemData) {
    const { menuItemId, quantity, size, customizations, specialInstructions } = itemData;

    // Перевіряємо чи існує позиція меню
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      throw new AppError("Позицію меню не знайдено", 404);
    }

    if (!menuItem.available) {
      throw new AppError("Цей товар недоступний", 400);
    }

    // Знаходимо або створюємо кошик
    let cart = await this.findCart(userId, sessionId);
    
    if (!cart) {
      cart = new Cart({
        user: userId || undefined,
        sessionId: !userId ? sessionId : undefined,
        items: []
      });
    }

    // Додаємо товар до кошика
    await this.addItem(cart, menuItemId, quantity, size, customizations, specialInstructions);
    
    // Обчислюємо суми
    const cartWithTotals = await this.calculateCartTotals(cart);

    return {
      cartItem: cart.items[cart.items.length - 1],
      cartSummary: {
        totalItems: cartWithTotals.totalItems,
        totalAmount: cartWithTotals.calculatedTotal
      }
    };
  }

  async findCart(userId, sessionId) {
    const query = userId ? { user: userId } : { sessionId: sessionId };
    return await Cart.findOne(query).populate("items.menuItem");
  }

  async addItem(cart, menuItemId, quantity, size, customizations, specialInstructions) {
    const existingItemIndex = cart.items.findIndex(item => 
      item.menuItem.toString() === menuItemId.toString() && 
      item.size === size
    );

    if (existingItemIndex > -1) {
      // Оновити кількість існуючого товару
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].addedAt = new Date();
    } else {
      // Додати новий товар
      cart.items.push({
        menuItem: menuItemId,
        quantity,
        size,
        customizations: customizations || [],
        specialInstructions: specialInstructions || "",
        addedAt: new Date()
      });
    }

    // Оновити час закінчення
    cart.expiresAt = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);
    return await cart.save();
  }

  async calculateCartTotals(cart) {
    let subtotal = 0;

    // Отримуємо актуальні ціни товарів
    for (const item of cart.items) {
      const menuItem = await MenuItem.findById(item.menuItem);
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

    const taxes = Math.round(subtotal * 0.1 * 100) / 100; // 10% податок
    const deliveryFee = subtotal > 200 ? 0 : 25; // Безкоштовна доставка від 200 грн
    const totalAmount = subtotal + taxes + deliveryFee;

    // Зберігаємо обчислені значення
    cart.calculatedTotal = totalAmount;
    cart.subtotal = subtotal;
    cart.taxes = taxes;
    cart.deliveryFee = deliveryFee;

    return cart;
  }
}

export default new CartService();
