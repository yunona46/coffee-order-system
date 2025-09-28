import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config();

// Models
import User from "../models/User.js";
import MenuItem from "../models/MenuItem.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  console.log("🌱 Seeding users...");

  const users = [
    {
      firstName: "Адміністратор",
      lastName: "Системи",
      email: "admin@coffeeorder.com",
      password: await bcrypt.hash("admin123", 12),
      role: "admin",
      phone: "+380501234567",
      isEmailVerified: true,
      addresses: [{
        name: "Офіс",
        street: "вул. Хрещатик",
        building: "1",
        apartment: "101",
        isDefault: true
      }]
    },
    {
      firstName: "Анна",
      lastName: "Іванова",
      email: "anna@example.com",
      password: await bcrypt.hash("password123", 12),
      role: "customer",
      phone: "+380501234568",
      isEmailVerified: true,
      addresses: [{
        name: "Дім",
        street: "вул. Велика Васильківська",
        building: "15",
        apartment: "25",
        isDefault: true
      }],
      statistics: {
        totalOrders: 5,
        totalSpent: 350
      }
    },
    {
      firstName: "Петро",
      lastName: "Петренко",
      email: "petro@example.com",
      password: await bcrypt.hash("password123", 12),
      role: "customer",
      phone: "+380501234569",
      isEmailVerified: true
    }
  ];

  await User.deleteMany({});
  await User.insertMany(users);
  console.log("✅ Users seeded successfully");
};

const seedMenuItems = async () => {
  console.log("🌱 Seeding menu items...");

  const menuItems = [
    {
      name: "Класичний Еспресо",
      description: "Міцний та ароматний еспресо з італійських зерен преміум класу",
      category: "espresso",
      price: 35,
      sizes: [
        { name: "Одинарний", volume: "30ml", price: 35 },
        { name: "Подвійний", volume: "60ml", price: 50 }
      ],
      ingredients: ["еспресо"],
      allergens: [],
      nutritionalInfo: { calories: 5, protein: 0, fat: 0, carbs: 1, sugar: 0 },
      available: true,
      preparationTime: 2,
      popularity: 90,
      featured: true,
      customizations: [
        {
          name: "Цукор",
          options: [
            { name: "Без цукру", price: 0 },
            { name: "1 ложечка", price: 0 },
            { name: "2 ложечки", price: 0 }
          ]
        }
      ]
    },
    {
      name: "Американо",
      description: "Еспресо з гарячою водою для м'якшого смаку",
      category: "americano",
      price: 30,
      sizes: [
        { name: "Маленький", volume: "240ml", price: 30 },
        { name: "Середній", volume: "350ml", price: 40 },
        { name: "Великий", volume: "470ml", price: 50 }
      ],
      ingredients: ["еспресо", "гаряча вода"],
      allergens: [],
      nutritionalInfo: { calories: 10, protein: 0, fat: 0, carbs: 2, sugar: 0 },
      available: true,
      preparationTime: 2,
      popularity: 75
    }
  ];

  await MenuItem.deleteMany({});
  await MenuItem.insertMany(menuItems);
  console.log("✅ Menu items seeded successfully");
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log("🗑️ Clearing existing data...");
    
    await seedUsers();
    await seedMenuItems();
    
    console.log("🎉 Database seeded successfully!");
    
    // Показати створених користувачів
    const users = await User.find({}).select("email role");
    console.log("\n👥 Created users:");
    users.forEach(user => {
      console.log(`   ${user.email} (${user.role})`);
    });
    
    // Показати створені товари
    const menuCount = await MenuItem.countDocuments();
    console.log(`\n☕ Created ${menuCount} menu items`);
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
};

// Запуск seed скрипту
if (process.argv[1] === new URL(import.meta.url).pathname) {
  seedDatabase();
}

export default seedDatabase;
