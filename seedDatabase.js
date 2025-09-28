const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');

const connectDB = async () => {
  try {
    // Додамо параметри для кращої сумісності
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coffee-order-system', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Таймаут 5 секунд
      socketTimeoutMS: 45000,
    });

    console.log('✅ Connected to MongoDB');
    return conn;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    // Пропонуємо рішення
    console.log('\n💡 РІШЕННЯ:');
    console.log('1. Переконайтесь, що MongoDB запущено');
    console.log('2. Або використайте MongoDB Atlas:');
    console.log('   - Зареєструйтесь на https://cloud.mongodb.com');
    console.log('   - Створіть безкоштовний кластер');
    console.log('   - Оновіть MONGODB_URI в .env файлі');
    console.log('3. Для локального запуску: mongod --dbpath "C:\\data\\db"');
    
    process.exit(1);
  }
};

const seedUsers = async () => {
  console.log('🌱 Seeding users...');

  const users = [
    {
      firstName: 'Адміністратор',
      lastName: 'Системи',
      email: 'admin@coffeeorder.com',
      password: await bcrypt.hash('admin123', 12),
      role: 'admin',
      phone: '+380501234567',
      isEmailVerified: true,
      addresses: [{
        name: 'Офіс',
        street: 'вул. Хрещатик',
        building: '1',
        apartment: '101',
        isDefault: true
      }]
    },
    {
      firstName: 'Анна',
      lastName: 'Іванова',
      email: 'anna@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'customer',
      phone: '+380501234568',
      isEmailVerified: true,
      addresses: [{
        name: 'Дім',
        street: 'вул. Велика Васильківська',
        building: '15',
        apartment: '25',
        isDefault: true
      }],
      statistics: {
        totalOrders: 5,
        totalSpent: 350
      }
    },
    {
      firstName: 'Петро',
      lastName: 'Петренко',
      email: 'petro@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'customer',
      phone: '+380501234569',
      isEmailVerified: true
    }
  ];

  await User.deleteMany({});
  await User.insertMany(users);
  console.log('✅ Users seeded successfully');
};

const seedMenuItems = async () => {
  console.log('🌱 Seeding menu items...');

  const menuItems = [
    {
      name: 'Класичний Еспресо',
      description: 'Міцний та ароматний еспресо з італійських зерен преміум класу',
      category: 'espresso',
      price: 35,
      sizes: [
        { name: 'Одинарний', volume: '30ml', price: 35 },
        { name: 'Подвійний', volume: '60ml', price: 50 }
      ],
      ingredients: ['еспресо'],
      allergens: [],
      nutritionalInfo: { calories: 5, protein: 0, fat: 0, carbs: 1, sugar: 0 },
      available: true,
      preparationTime: 2,
      popularity: 90,
      featured: true,
      customizations: [
        {
          name: 'Цукор',
          options: [
            { name: 'Без цукру', price: 0 },
            { name: '1 ложечка', price: 0 },
            { name: '2 ложечки', price: 0 }
          ]
        }
      ]
    },
    {
      name: 'Американо',
      description: 'Еспресо з гарячою водою для м\'якшого смаку',
      category: 'americano',
      price: 30,
      sizes: [
        { name: 'Маленький', volume: '240ml', price: 30 },
        { name: 'Середній', volume: '350ml', price: 40 },
        { name: 'Великий', volume: '470ml', price: 50 }
      ],
      ingredients: ['еспресо', 'гаряча вода'],
      allergens: [],
      nutritionalInfo: { calories: 10, protein: 0, fat: 0, carbs: 2, sugar: 0 },
      available: true,
      preparationTime: 2,
      popularity: 75
    },
    {
      name: 'Класичний Латте',
      description: 'Ніжний напій з еспресо та молочною пінкою',
      category: 'latte',
      price: 45,
      sizes: [
        { name: 'Маленький', volume: '250ml', price: 45 },
        { name: 'Середній', volume: '350ml', price: 55 },
        { name: 'Великий', volume: '450ml', price: 65 }
      ],
      ingredients: ['еспресо', 'молоко', 'молочна пінка'],
      allergens: ['молоко'],
      nutritionalInfo: { calories: 150, protein: 8, fat: 6, carbs: 12, sugar: 10 },
      available: true,
      preparationTime: 3,
      popularity: 85,
      featured: true,
      customizations: [
        {
          name: 'Тип молока',
          options: [
            { name: 'Звичайне молоко', price: 0 },
            { name: 'Овсяне молоко', price: 10 },
            { name: 'Мигдальне молоко', price: 12 },
            { name: 'Кокосове молоко', price: 10 }
          ]
        },
        {
          name: 'Додатково',
          options: [
            { name: 'Додаткова порція еспресо', price: 15 },
            { name: 'Ваніль', price: 5 },
            { name: 'Карамель', price: 8 }
          ]
        }
      ]
    },
    {
      name: 'Капучино',
      description: 'Ідеальний баланс еспресо, молока та пінки',
      category: 'cappuccino',
      price: 40,
      sizes: [
        { name: 'Маленький', volume: '180ml', price: 40 },
        { name: 'Середній', volume: '240ml', price: 50 }
      ],
      ingredients: ['еспресо', 'молоко', 'молочна пінка'],
      allergens: ['молоко'],
      nutritionalInfo: { calories: 120, protein: 6, fat: 4, carbs: 10, sugar: 8 },
      available: true,
      preparationTime: 3,
      popularity: 88,
      featured: true
    },
    {
      name: 'Карамельний Фрапучино',
      description: 'Освіжаючий холодний напій з льодом, карамеллю та збитими вершками',
      category: 'frappuccino',
      price: 65,
      sizes: [
        { name: 'Середній', volume: '400ml', price: 65 },
        { name: 'Великий', volume: '500ml', price: 75 }
      ],
      ingredients: ['еспресо', 'молоко', 'лід', 'карамельний сироп', 'збиті вершки'],
      allergens: ['молоко'],
      nutritionalInfo: { calories: 320, protein: 6, fat: 15, carbs: 45, sugar: 38 },
      available: true,
      preparationTime: 4,
      popularity: 70
    },
    {
      name: 'Ванільний Латте',
      description: 'Класичний латте з ароматом натуральної ванілі',
      category: 'latte',
      price: 50,
      sizes: [
        { name: 'Маленький', volume: '250ml', price: 50 },
        { name: 'Середній', volume: '350ml', price: 60 },
        { name: 'Великий', volume: '450ml', price: 70 }
      ],
      ingredients: ['еспресо', 'молоко', 'ванільний сироп', 'молочна пінка'],
      allergens: ['молоко'],
      nutritionalInfo: { calories: 180, protein: 8, fat: 6, carbs: 20, sugar: 18 },
      available: true,
      preparationTime: 3,
      popularity: 78
    }
  ];

  await MenuItem.deleteMany({});
  await MenuItem.insertMany(menuItems);
  console.log('✅ Menu items seeded successfully');
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🗑️  Clearing existing data...');
    
    await seedUsers();
    await seedMenuItems();
    
    console.log('🎉 Database seeded successfully!');
    
    // Показати створених користувачів
    const users = await User.find({}).select('email role');
    console.log('\n👥 Created users:');
    users.forEach(user => {
      console.log(`   ${user.email} (${user.role})`);
    });
    
    // Показати створені товари
    const menuCount = await MenuItem.countDocuments();
    console.log(`\n☕ Created ${menuCount} menu items`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Запуск seed скрипту
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;