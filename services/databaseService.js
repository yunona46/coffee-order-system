const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/database.json');

// Створюємо папку data якщо не існує
if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

// Ініціалізуємо базу даних якщо не існує
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({
        users: [],
        menuItems: [],
        orders: [],
        carts: []
    }, null, 2));
}

function readDatabase() {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Помилка читання бази даних:', error);
        return { users: [], menuItems: [], orders: [], carts: [] };
    }
}

function writeDatabase(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Помилка запису в базу даних:', error);
        return false;
    }
}

module.exports = {
    readDatabase,
    writeDatabase,
    
    // Користувачі
    findUserByEmail: (email) => {
        const db = readDatabase();
        return db.users.find(user => user.email === email);
    },
    
    findUserById: (userId) => {
        const db = readDatabase();
        return db.users.find(user => user.id === userId);
    },
    
    addUser: (userData) => {
        const db = readDatabase();
        const user = {
            id: 'user_' + Date.now(),
            ...userData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        db.users.push(user);
        writeDatabase(db);
        return user;
    },
    
    updateUser: (userId, updateData) => {
        const db = readDatabase();
        const userIndex = db.users.findIndex(user => user.id === userId);
        
        if (userIndex === -1) return null;
        
        db.users[userIndex] = {
            ...db.users[userIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        
        writeDatabase(db);
        return db.users[userIndex];
    },
    
    // Меню
    getAllMenuItems: () => {
        const db = readDatabase();
        return db.menuItems;
    },
    
    addMenuItem: (itemData) => {
        const db = readDatabase();
        const item = {
            id: 'item_' + Date.now(),
            ...itemData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        db.menuItems.push(item);
        writeDatabase(db);
        return item;
    },
    
    findMenuItemById: (itemId) => {
        const db = readDatabase();
        return db.menuItems.find(item => item.id === itemId);
    },
    
    // Замовлення
    createOrder: (orderData) => {
        const db = readDatabase();
        const order = {
            id: 'order_' + Date.now(),
            ...orderData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        db.orders.push(order);
        writeDatabase(db);
        return order;
    },
    
    findOrderById: (orderId) => {
        const db = readDatabase();
        return db.orders.find(order => order.id === orderId);
    },
    
    findUserOrders: (userId) => {
        const db = readDatabase();
        return db.orders.filter(order => order.userId === userId)
                       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    
    updateOrderStatus: (orderId, status, note = '') => {
        const db = readDatabase();
        const orderIndex = db.orders.findIndex(order => order.id === orderId);
        
        if (orderIndex === -1) return null;
        
        db.orders[orderIndex] = {
            ...db.orders[orderIndex],
            status: status,
            statusNote: note,
            updatedAt: new Date().toISOString()
        };
        
        writeDatabase(db);
        return db.orders[orderIndex];
    }
};
