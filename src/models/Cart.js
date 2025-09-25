// In-memory cart storage
let carts = new Map(); // userID -> cart

class Cart {
    constructor(userId) {
        this.id = 'cart_' + userId;
        this.userId = userId;
        this.items = [];
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    // Add item to cart
    addItem(menuItemId, quantity = 1, size = 'Середній', customizations = [], specialInstructions = '') {
        // Import MenuItem inside the function to avoid circular dependency
        const MenuItem = require('./MenuItem');
        const menuItem = MenuItem.findById(parseInt(menuItemId));
        
        if (!menuItem) {
            throw new Error('Menu item not found');
        }

        if (!menuItem.available) {
            throw new Error('Menu item is not available');
        }

        // Calculate price based on size
        const sizePrice = menuItem.sizes.find(s => s.name === size)?.price || menuItem.price;
        const customizationPrice = customizations.reduce((sum, custom) => sum + (custom.price || 0), 0);
        const itemPrice = sizePrice + customizationPrice;
        const totalPrice = itemPrice * quantity;

        const cartItem = {
            id: 'cart_item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            menuItemId: parseInt(menuItemId),
            name: menuItem.name,
            quantity: quantity,
            size: size,
            customizations: customizations,
            specialInstructions: specialInstructions,
            itemPrice: itemPrice,
            totalPrice: totalPrice,
            addedAt: new Date().toISOString()
        };

        // Check if similar item already exists in cart
        const existingItemIndex = this.items.findIndex(item => 
            item.menuItemId === cartItem.menuItemId && 
            item.size === cartItem.size &&
            JSON.stringify(item.customizations) === JSON.stringify(cartItem.customizations)
        );

        if (existingItemIndex >= 0) {
            // Update quantity of existing item
            this.items[existingItemIndex].quantity += quantity;
            this.items[existingItemIndex].totalPrice = this.items[existingItemIndex].itemPrice * this.items[existingItemIndex].quantity;
        } else {
            // Add new item
            this.items.push(cartItem);
        }

        this.updatedAt = new Date().toISOString();
        this.save();

        return cartItem;
    }

    // Remove item from cart
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.updatedAt = new Date().toISOString();
        this.save();
        return true;
    }

    // Update item quantity
    updateItemQuantity(itemId, quantity) {
        const item = this.items.find(item => item.id === itemId);
        if (item && quantity > 0) {
            item.quantity = quantity;
            item.totalPrice = item.itemPrice * quantity;
            this.updatedAt = new Date().toISOString();
            this.save();
            return item;
        }
        return null;
    }

    // Clear cart
    clear() {
        this.items = [];
        this.updatedAt = new Date().toISOString();
        this.save();
        return true;
    }

    // Get cart summary
    getSummary() {
        const subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
        const taxes = subtotal * 0.1; // 10% tax
        const deliveryFee = subtotal > 200 ? 0 : 25; // Free delivery for orders over 200₴
        const totalAmount = subtotal + taxes + deliveryFee;

        return {
            totalItems: this.items.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: subtotal,
            taxes: taxes,
            deliveryFee: deliveryFee,
            totalAmount: totalAmount
        };
    }

    // Save cart to memory
    save() {
        carts.set(this.userId, this);
        return this;
    }

    // Static method to get user's cart
    static getByUserId(userId) {
        if (!carts.has(userId)) {
            const newCart = new Cart(userId);
            newCart.save();
        }
        return carts.get(userId);
    }

    // Static method to delete user's cart
    static deleteByUserId(userId) {
        carts.delete(userId);
        return true;
    }
}

module.exports = Cart;
