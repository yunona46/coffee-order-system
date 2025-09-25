// In-memory order storage
let orders = [];
let currentOrderId = 1;

class Order {
    constructor(data) {
        this.id = data.id || currentOrderId++;
        this.orderNumber = 'COF-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + this.id.toString().padStart(3, '0');
        this.userId = data.userId;
        this.status = data.status || 'pending';
        this.items = data.items || [];
        this.subtotal = data.subtotal || 0;
        this.taxes = data.taxes || 0;
        this.deliveryFee = data.deliveryFee || 0;
        this.totalAmount = data.totalAmount || 0;
        this.deliveryType = data.deliveryType;
        this.deliveryAddress = data.deliveryAddress || null;
        this.contactPhone = data.contactPhone;
        this.paymentMethod = data.paymentMethod;
        this.paymentStatus = data.paymentStatus || 'pending';
        this.preferredDeliveryTime = data.preferredDeliveryTime || null;
        this.orderNotes = data.orderNotes || '';
        this.statusHistory = [{
            status: 'pending',
            timestamp: new Date().toISOString(),
            note: 'Order created'
        }];
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    // Update order status
    updateStatus(newStatus, note = '') {
        this.status = newStatus;
        this.statusHistory.push({
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: note
        });
        this.updatedAt = new Date().toISOString();
        this.save();
        return this;
    }

    // Calculate estimated delivery time
    getEstimatedDeliveryTime() {
        const now = new Date();
        if (this.deliveryType === 'pickup') {
            const deliveryTime = new Date(now.getTime() + 15 * 60000);
            return deliveryTime.toISOString();
        } else {
            const deliveryTime = new Date(now.getTime() + 30 * 60000);
            return deliveryTime.toISOString();
        }
    }

    // Save order to memory
    save() {
        const existingIndex = orders.findIndex(o => o.id === this.id);
        if (existingIndex >= 0) {
            orders[existingIndex] = this;
        } else {
            orders.push(this);
        }
        return this;
    }

    // Static method to find order by ID
    static findById(id) {
        return orders.find(o => o.id === parseInt(id));
    }

    // Static method to find orders by user ID
    static findByUserId(userId, options = {}) {
        let userOrders = orders.filter(o => o.userId === userId);
        
        // Filter by status
        if (options.status) {
            userOrders = userOrders.filter(o => o.status === options.status);
        }
        
        // Sort by creation date (newest first)
        userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Pagination
        const page = options.page || 1;
        const limit = options.limit || 20;
        const startIndex = (page - 1) * limit;
        const paginatedOrders = userOrders.slice(startIndex, startIndex + limit);
        
        return {
            orders: paginatedOrders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(userOrders.length / limit),
                totalItems: userOrders.length,
                itemsPerPage: limit
            }
        };
    }
}

// Create some sample orders for testing
new Order({
    userId: 2, // John Doe
    items: [
        {
            menuItemId: 3,
            name: 'Класичний Латте',
            quantity: 2,
            size: 'Середній',
            price: 55,
            totalPrice: 110
        }
    ],
    subtotal: 110,
    taxes: 11,
    deliveryFee: 25,
    totalAmount: 146,
    deliveryType: 'delivery',
    contactPhone: '+380501234567',
    paymentMethod: 'card',
    status: 'delivered'
}).save();

module.exports = Order;
