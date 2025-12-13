const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart'); // Підключаємо модель
const { authenticate } = require('../middleware/auth'); // Підключаємо auth

// ========================================
// SECURITY: Middleware перевірки власника кошика (SEC-003)
// ========================================
const verifyCartOwnership = async (req, res, next) => {
  try {
    const cartId = req.params.cartId || req.body.cartId;
    
    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: 'ID кошика не вказано',
        code: 'CART_ID_MISSING'
      });
    }

    // Знаходимо кошик
    const cart = await Cart.findById(cartId);
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Кошик не знайдено',
        code: 'CART_NOT_FOUND'
      });
    }

    // Перевіряємо, чи користувач є власником
    if (cart.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Ви не маєте доступу до цього кошика',
        code: 'CART_ACCESS_DENIED'
      });
    }

    // Зберігаємо кошик в req для подальшого використання
    req.cart = cart;
    next();
  } catch (error) {
    console.error('Помилка перевірки власника кошика:', error);
    return res.status(500).json({
      success: false,
      message: 'Помилка перевірки доступу',
      code: 'CART_VERIFICATION_ERROR'
    });
  }
};

// ========================================
// ROUTES
// ========================================

// Отримати свій кошик (потрібна авторизація)
router.get('/', authenticate, async (req, res) => {
  try {
    // Шукаємо кошик користувача
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.menuItem');
    
    // Якщо кошика немає - створюємо новий
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.json({
      success: true,
      data: {
        cart: {
          id: cart._id,
          items: cart.items,
          totalItems: cart.totalItems,
          subtotal: cart.subtotal || 0,
          isEmpty: cart.isEmpty
        }
      }
    });
  } catch (error) {
    console.error('Помилка отримання кошика:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка при отриманні кошика'
    });
  }
});

// Додати товар до СВОГО кошика
router.post('/add', authenticate, async (req, res) => {
  try {
    const { menuItemId, quantity, size, customizations, specialInstructions } = req.body;

    // Валідація
    if (!menuItemId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'menuItemId та quantity обов\'язкові'
      });
    }

    // Знаходимо або створюємо кошик користувача
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Додаємо товар
    cart.items.push({
      menuItem: menuItemId,
      quantity: quantity,
      size: size,
      customizations: customizations || [],
      specialInstructions: specialInstructions
    });

    await cart.save();

    res.json({
      success: true,
      message: 'Товар додано до кошика',
      data: { cart }
    });
  } catch (error) {
    console.error('Помилка додавання до кошика:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка при додаванні до кошика'
    });
  }
});

// Видалити товар з СВОГО кошика (перевірка власника)
router.delete('/:cartId/items/:itemId', authenticate, verifyCartOwnership, async (req, res) => {
  try {
    const { itemId } = req.params;
    
    // req.cart вже є завдяки verifyCartOwnership
    req.cart.items = req.cart.items.filter(item => item._id.toString() !== itemId);
    await req.cart.save();

    res.json({
      success: true,
      message: 'Товар видалено з кошика'
    });
  } catch (error) {
    console.error('Помилка видалення з кошика:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка при видаленні товару'
    });
  }
});

// Очистити СВІЙ кошик (перевірка власника)
router.delete('/:cartId', authenticate, verifyCartOwnership, async (req, res) => {
  try {
    req.cart.items = [];
    await req.cart.save();

    res.json({
      success: true,
      message: 'Кошик очищено'
    });
  } catch (error) {
    console.error('Помилка очищення кошика:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка при очищенні кошика'
    });
  }
});

module.exports = router;