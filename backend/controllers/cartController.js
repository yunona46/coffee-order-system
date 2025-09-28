const cartService = require('../services/cartService');
const { asyncHandler } = require('../utils/helpers');

class CartController {
  getCart = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const sessionId = req.sessionID || req.headers['x-session-id'];

    const cart = await cartService.getCart(userId, sessionId);

    res.json({
      success: true,
      data: { cart }
    });
  });

  addItem = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const sessionId = req.sessionID || req.headers['x-session-id'];

    const result = await cartService.addItemToCart(userId, sessionId, req.body);

    res.status(201).json({
      success: true,
      message: 'Товар додано до кошика',
      data: result
    });
  });

  updateItemQuantity = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const sessionId = req.sessionID || req.headers['x-session-id'];
    const { itemId } = req.params;
    const { quantity } = req.body;

    const result = await cartService.updateCartItemQuantity(userId, sessionId, itemId, quantity);

    res.json({
      success: true,
      message: 'Кількість товару оновлено',
      data: result
    });
  });

  removeItem = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const sessionId = req.sessionID || req.headers['x-session-id'];
    const { itemId } = req.params;

    const result = await cartService.removeItemFromCart(userId, sessionId, itemId);

    res.json({
      success: true,
      message: 'Товар видалено з кошика',
      data: result
    });
  });

  clearCart = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const sessionId = req.sessionID || req.headers['x-session-id'];

    await cartService.clearCart(userId, sessionId);

    res.json({
      success: true,
      message: 'Кошик очищено'
    });
  });
}

module.exports = new CartController();
