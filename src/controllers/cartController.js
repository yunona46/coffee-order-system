const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');

const cartController = {
    // Get user's cart
    async getCart(req, res) {
        try {
            const cart = Cart.getByUserId(req.user.userId);
            const summary = cart.getSummary();

            res.json({
                success: true,
                data: {
                    cart: {
                        id: cart.id,
                        items: cart.items,
                        ...summary,
                        updatedAt: cart.updatedAt
                    }
                }
            });

        } catch (error) {
            console.error('Get cart error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching cart',
                code: 'INTERNAL_SERVER_ERROR'
            });
        }
    },

    // Add item to cart
    async addToCart(req, res) {
        try {
            const { menuItemId, quantity, size, customizations, specialInstructions } = req.body;
            
            if (!menuItemId || !quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Menu item ID and quantity are required',
                    code: 'VALIDATION_ERROR'
                });
            }

            const cart = Cart.getByUserId(req.user.userId);
            const cartItem = cart.addItem(menuItemId, quantity, size, customizations, specialInstructions);
            const summary = cart.getSummary();

            res.status(201).json({
                success: true,
                message: 'Item added to cart',
                data: {
                    cartItem: cartItem,
                    cartSummary: summary
                }
            });

        } catch (error) {
            console.error('Add to cart error:', error);
            if (error.message === 'Menu item not found') {
                return res.status(404).json({
                    success: false,
                    message: 'Menu item not found',
                    code: 'MENU_ITEM_NOT_FOUND'
                });
            }
            if (error.message === 'Menu item is not available') {
                return res.status(400).json({
                    success: false,
                    message: 'Menu item is not available',
                    code: 'ITEM_UNAVAILABLE'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error while adding to cart',
                code: 'INTERNAL_SERVER_ERROR'
            });
        }
    },

    // Remove item from cart
    async removeFromCart(req, res) {
        try {
            const { itemId } = req.params;
            const cart = Cart.getByUserId(req.user.userId);
            
            cart.removeItem(itemId);
            const summary = cart.getSummary();

            res.json({
                success: true,
                message: 'Item removed from cart',
                data: {
                    cartSummary: summary
                }
            });

        } catch (error) {
            console.error('Remove from cart error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while removing from cart',
                code: 'INTERNAL_SERVER_ERROR'
            });
        }
    },

    // Update item quantity
    async updateCartItem(req, res) {
        try {
            const { itemId } = req.params;
            const { quantity } = req.body;
            
            if (!quantity || quantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid quantity is required',
                    code: 'VALIDATION_ERROR'
                });
            }

            const cart = Cart.getByUserId(req.user.userId);
            const updatedItem = cart.updateItemQuantity(itemId, quantity);

            if (!updatedItem) {
                return res.status(404).json({
                    success: false,
                    message: 'Cart item not found',
                    code: 'CART_ITEM_NOT_FOUND'
                });
            }

            const summary = cart.getSummary();

            res.json({
                success: true,
                message: 'Cart item updated',
                data: {
                    cartItem: updatedItem,
                    cartSummary: summary
                }
            });

        } catch (error) {
            console.error('Update cart error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while updating cart',
                code: 'INTERNAL_SERVER_ERROR'
            });
        }
    },

    // Clear cart
    async clearCart(req, res) {
        try {
            const cart = Cart.getByUserId(req.user.userId);
            cart.clear();

            res.json({
                success: true,
                message: 'Cart cleared'
            });

        } catch (error) {
            console.error('Clear cart error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while clearing cart',
                code: 'INTERNAL_SERVER_ERROR'
            });
        }
    }
};

module.exports = cartController;
