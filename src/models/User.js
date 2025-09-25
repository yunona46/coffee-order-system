// In-memory user storage
let users = [];
let currentId = 1;

class User {
    constructor(data) {
        this.id = data.id || currentId++;
        this.firstName = data.firstName || 'User'; // Не обов'язкове поле
        this.lastName = data.lastName || '';       // Не обов'язкове поле
        this.email = data.email;
        this.password = data.password;
        this.phone = data.phone || '';
        this.role = data.role || 'customer';
        this.addresses = data.addresses || [];
        this.preferences = data.preferences || {
            notifications: { email: true, sms: false, push: true }
        };
        this.createdAt = data.createdAt || new Date().toISOString();
        this.lastLoginAt = data.lastLoginAt || null;
    }

    // Save user to memory
    save() {
        const existingIndex = users.findIndex(u => u.id === this.id);
        if (existingIndex >= 0) {
            users[existingIndex] = this;
        } else {
            users.push(this);
        }
        return this;
    }

    // Find user by ID
    static findById(id) {
        return users.find(u => u.id === id);
    }

    // Find user by email
    static findByEmail(email) {
        return users.find(u => u.email === email);
    }

    // Get all users
    static findAll() {
        return users;
    }

    // Delete user
    static deleteById(id) {
        users = users.filter(u => u.id !== id);
        return true;
    }

    // Get user statistics
    getStatistics() {
        const userOrders = [];
        return {
            totalOrders: userOrders.length,
            totalSpent: userOrders.reduce((sum, order) => sum + order.totalAmount, 0),
            averageOrderValue: userOrders.length > 0 ?
                userOrders.reduce((sum, order) => sum + order.totalAmount, 0) / userOrders.length : 0
        };
    }
}

// Create some sample users for testing
new User({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@coffee.com',
    password: 'admin123',
    role: 'admin'
}).save();

new User({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '+380501234567'
}).save();

module.exports = User;
