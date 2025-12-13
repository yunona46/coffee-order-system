// backend/scripts/seed.js
// Скрипт для заповнення бази даних тестовими даними

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Імпорт моделей
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

// Підключення до БД
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Очищення бази даних
const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Database cleared');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
};

// Створення користувачів
const createUsers = async () => {
  try {
    const users = [
      {
        name: 'Адмін Кав\'ярні',
        email: 'admin@coffee.com',
        password: await bcrypt.hash('admin123', 10),
        phone: '+380501111111',
        role: 'admin'
      },
      {
        name: 'Олена Шевченко',
        email: 'customer@coffee.com',
        password: await bcrypt.hash('customer123', 10),
        phone: '+380502222222',
        role: 'customer'
      },
      {
        name: 'Іван Петренко',
        email: 'ivan@example.com',
        password: await bcrypt.hash('password123', 10),
        phone: '+380503333333',
        role: 'customer'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error('❌ Error creating users:', error);
    return [];
  }
};

// Створення меню
const createMenu = async () => {
  try {
    const menuItems = [
      // Кава
      {
        name: 'Еспресо',
        description: 'Класичний міцний кавовий напій з насиченим смаком та щільною крема',
        price: 35,
        category: 'coffee',
        image: 'espresso.jpg',
        available: true,
        ingredients: ['кавові зерна 100% арабіка', 'вода'],
        volume: '30 мл',
        calories: 5,
        caffeine: 65,
        preparationTime: 2
      },
      {
        name: 'Американо',
        description: 'Еспресо, розбавлений гарячою водою для м\'якшого смаку',
        price: 40,
        category: 'coffee',
        image: 'americano.jpg',
        available: true,
        ingredients: ['еспресо', 'гаряча вода'],
        volume: '120 мл',
        calories: 5,
        caffeine: 65,
        preparationTime: 2
      },
      {
        name: 'Капучино',
        description: 'Еспресо з молоком та пишною молочною пінкою',
        price: 45,
        category: 'coffee',
        image: 'cappuccino.jpg',
        available: true,
        ingredients: ['еспресо', 'молоко 3.2%', 'молочна піна'],
        volume: '200 мл',
        calories: 120,
        caffeine: 65,
        preparationTime: 3
      },
      {
        name: 'Латте',
        description: 'Ніжна кава з великою кількістю теплого молока',
        price: 50,
        category: 'coffee',
        image: 'latte.jpg',
        available: true,
        ingredients: ['еспресо', 'молоко', 'молочна піна'],
        volume: '300 мл',
        calories: 150,
        caffeine: 65,
        preparationTime: 3
      },
      {
        name: 'Флет Вайт',
        description: 'Подвійний еспресо з мікропінкою',
        price: 55,
        category: 'coffee',
        image: 'flat-white.jpg',
        available: true,
        ingredients: ['подвійний еспресо', 'молоко', 'мікропінка'],
        volume: '180 мл',
        calories: 110,
        caffeine: 130,
        preparationTime: 3
      },
      {
        name: 'Мокка',
        description: 'Латте з додаванням шоколаду',
        price: 60,
        category: 'coffee',
        image: 'mocha.jpg',
        available: true,
        ingredients: ['еспресо', 'молоко', 'шоколадний сироп', 'вершки'],
        volume: '300 мл',
        calories: 250,
        caffeine: 65,
        preparationTime: 4
      },
      {
        name: 'Карамельний Макіато',
        description: 'Еспресо з молоком, ванільним та карамельним сиропом',
        price: 65,
        category: 'coffee',
        image: 'caramel-macchiato.jpg',
        available: true,
        ingredients: ['еспресо', 'молоко', 'ванільний сироп', 'карамельний топінг'],
        volume: '350 мл',
        calories: 280,
        caffeine: 65,
        preparationTime: 4
      },
      {
        name: 'Айс Латте',
        description: 'Холодний латте з льодом',
        price: 55,
        category: 'coffee',
        image: 'iced-latte.jpg',
        available: true,
        ingredients: ['еспресо', 'холодне молоко', 'лід'],
        volume: '350 мл',
        calories: 140,
        caffeine: 65,
        preparationTime: 3
      },

      // Чай
      {
        name: 'Чорний чай',
        description: 'Класичний цейлонський чорний чай',
        price: 30,
        category: 'tea',
        image: 'black-tea.jpg',
        available: true,
        ingredients: ['чорний чай'],
        volume: '300 мл',
        calories: 2,
        caffeine: 40,
        preparationTime: 5
      },
      {
        name: 'Зелений чай',
        description: 'Освіжаючий зелений чай',
        price: 30,
        category: 'tea',
        image: 'green-tea.jpg',
        available: true,
        ingredients: ['зелений чай'],
        volume: '300 мл',
        calories: 2,
        caffeine: 25,
        preparationTime: 5
      },
      {
        name: 'М\'ятний чай',
        description: 'Трав\'яний чай з м\'ятою',
        price: 35,
        category: 'tea',
        image: 'mint-tea.jpg',
        available: true,
        ingredients: ['м\'ята', 'мелісса', 'лимон'],
        volume: '300 мл',
        calories: 2,
        caffeine: 0,
        preparationTime: 5
      },

      // Десерти
      {
        name: 'Круасан',
        description: 'Французький масляний круасан',
        price: 45,
        category: 'dessert',
        image: 'croissant.jpg',
        available: true,
        ingredients: ['борошно', 'масло', 'дріжджі'],
        volume: '80 г',
        calories: 230,
        caffeine: 0,
        preparationTime: 0
      },
      {
        name: 'Чізкейк',
        description: 'Ніжний сирний десерт з ягідним топінгом',
        price: 70,
        category: 'dessert',
        image: 'cheesecake.jpg',
        available: true,
        ingredients: ['сирний крем', 'печиво', 'ягоди'],
        volume: '120 г',
        calories: 320,
        caffeine: 0,
        preparationTime: 0
      },
      {
        name: 'Шоколадний брауні',
        description: 'Вологий шоколадний брауні з горіхами',
        price: 60,
        category: 'dessert',
        image: 'brownie.jpg',
        available: true,
        ingredients: ['шоколад', 'какао', 'горіхи'],
        volume: '100 г',
        calories: 380,
        caffeine: 15,
        preparationTime: 0
      },

      // Інші напої
      {
        name: 'Гарячий шоколад',
        description: 'Густий гарячий шоколад з маршмелоу',
        price: 50,
        category: 'drinks',
        image: 'hot-chocolate.jpg',
        available: true,
        ingredients: ['молоко', 'темний шоколад', 'маршмелоу'],
        volume: '300 мл',
        calories: 350,
        caffeine: 25,
        preparationTime: 4
      },
      {
        name: 'Фреш апельсиновий',
        description: 'Свіжовичавлений апельсиновий сік',
        price: 55,
        category: 'drinks',
        image: 'orange-juice.jpg',
        available: true,
        ingredients: ['апельсини'],
        volume: '250 мл',
        calories: 110,
        caffeine: 0,
        preparationTime: 3
      },
      {
        name: 'Лимонад',
        description: 'Домашній лимонад з м\'ятою',
        price: 40,
        category: 'drinks',
        image: 'lemonade.jpg',
        available: true,
        ingredients: ['лимон', 'цукровий сироп', 'м\'ята', 'вода'],
        volume: '400 мл',
        calories: 120,
        caffeine: 0,
        preparationTime: 3
      }
    ];

    const createdItems = await MenuItem.insertMany(menuItems);
    console.log(`✅ Created ${createdItems.length} menu items`);
    return createdItems;
  } catch (error) {
    console.error('❌ Error creating menu:', error);
    return [];
  }
};

// Створення тестових замовлень
const createOrders = async (users, menuItems) => {
  try {
    if (users.length === 0 || menuItems.length === 0) {
      console.log('⚠️  Skipping orders creation - no users or menu items');
      return;
    }

    const customer = users.find(u => u.role === 'customer');
    
    const orders = [
      {
        orderNumber: `ORD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-0001`,
        customer: customer._id,
        items: [
          {
            menuItem: menuItems[0]._id,
            quantity: 2,
            price: menuItems[0].price,
            subtotal: menuItems[0].price * 2
          },
          {
            menuItem: menuItems[2]._id,
            quantity: 1,
            price: menuItems[2].price,
            subtotal: menuItems[2].price
          }
        ],
        subtotal: menuItems[0].price * 2 + menuItems[2].price,
        deliveryFee: 30,
        totalAmount: menuItems[0].price * 2 + menuItems[2].price + 30,
        status: 'completed',
        paymentMethod: 'card',
        paymentStatus: 'paid',
        deliveryType: 'delivery',
        deliveryAddress: {
          street: 'вул. Хрещатик, 22',
          city: 'Київ',
          apartment: 'кв. 15',
          postalCode: '01001'
        },
        notes: 'Без цукру',
        statusHistory: [
          { status: 'pending', timestamp: new Date(Date.now() - 3600000) },
          { status: 'confirmed', timestamp: new Date(Date.now() - 3300000) },
          { status: 'preparing', timestamp: new Date(Date.now() - 3000000) },
          { status: 'ready', timestamp: new Date(Date.now() - 2400000) },
          { status: 'delivering', timestamp: new Date(Date.now() - 1800000) },
          { status: 'completed', timestamp: new Date(Date.now() - 600000) }
        ],
        createdAt: new Date(Date.now() - 3600000),
        estimatedDelivery: new Date(Date.now() - 600000)
      },
      {
        orderNumber: `ORD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-0002`,
        customer: customer._id,
        items: [
          {
            menuItem: menuItems[3]._id,
            quantity: 1,
            price: menuItems[3].price,
            subtotal: menuItems[3].price
          },
          {
            menuItem: menuItems[12]._id,
            quantity: 1,
            price: menuItems[12].price,
            subtotal: menuItems[12].price
          }
        ],
        subtotal: menuItems[3].price + menuItems[12].price,
        deliveryFee: 0,
        totalAmount: menuItems[3].price + menuItems[12].price,
        status: 'preparing',
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        deliveryType: 'pickup',
        notes: '',
        statusHistory: [
          { status: 'pending', timestamp: new Date(Date.now() - 600000) },
          { status: 'confirmed', timestamp: new Date(Date.now() - 480000) },
          { status: 'preparing', timestamp: new Date(Date.now() - 300000) }
        ],
        createdAt: new Date(Date.now() - 600000),
        estimatedDelivery: new Date(Date.now() + 600000)
      },
      {
        orderNumber: `ORD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-0003`,
        customer: customer._id,
        items: [
          {
            menuItem: menuItems[1]._id,
            quantity: 1,
            price: menuItems[1].price,
            subtotal: menuItems[1].price
          }
        ],
        subtotal: menuItems[1].price,
        deliveryFee: 30,
        totalAmount: menuItems[1].price + 30,
        status: 'pending',
        paymentMethod: 'card',
        paymentStatus: 'pending',
        deliveryType: 'delivery',
        deliveryAddress: {
          street: 'просп. Перемоги, 50',
          city: 'Київ',
          postalCode: '03056'
        },
        statusHistory: [
          { status: 'pending', timestamp: new Date() }
        ],
        createdAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 2700000)
      }
    ];

    const createdOrders = await Order.insertMany(orders);
    console.log(`✅ Created ${createdOrders.length} orders`);
  } catch (error) {
    console.error('❌ Error creating orders:', error);
  }
};

// Головна функція
const seed = async () => {
  console.log('🌱 Starting database seeding...\n');
  
  await connectDB();
  await clearDatabase();
  
  console.log('\n📝 Creating data...\n');
  
  const users = await createUsers();
  const menuItems = await createMenu();
  await createOrders(users, menuItems);
  
  console.log('\n✅ Seeding completed successfully!');
  console.log('\n👤 Test Users:');
  console.log('   Admin: admin@coffee.com / admin123');
  console.log('   Customer: customer@coffee.com / customer123');
  console.log('\n🎉 You can now login and test the application!\n');
  
  await mongoose.disconnect();
  console.log('🔌 Database disconnected');
  process.exit(0);
};

// Запуск скрипту
seed().catch(error => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});