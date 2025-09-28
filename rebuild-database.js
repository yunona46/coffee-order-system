const databaseService = require("./services/databaseService");

console.log("🔄 Перебудова бази даних...");

// Очищаємо базу даних
const emptyDb = {
    users: [],
    menuItems: [],
    carts: [],
    orders: [],
    nextId: 1
};

// Записуємо чистую базу
const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname, "data", "database.json");

fs.writeFileSync(dbPath, JSON.stringify(emptyDb, null, 2), "utf8");
console.log("✅ Базу даних очищено");

// Додаємо тестове меню
const sampleMenu = [
    {
        name: "Еспресо",
        description: "Класичний міцний кавовий напій",
        category: "espresso",
        price: 35,
        ingredients: ["кавові зерна"],
        calories: 5,
        preparationTime: 2,
        available: true
    },
    {
        name: "Американо", 
        description: "Еспресо з гарячою водою",
        category: "americano",
        price: 40,
        ingredients: ["кавові зерна", "вода"],
        calories: 10,
        preparationTime: 3,
        available: true
    },
    {
        name: "Капучиino",
        description: "Еспресо з молочною пінкою",
        category: "cappuccino", 
        price: 45,
        ingredients: ["кавові зерна", "молоко", "молочна пінка"],
        allergens: ["молоко"],
        calories: 120,
        preparationTime: 4,
        available: true
    },
    {
        name: "Латте",
        description: "Ніжний напій з еспресо та молоком",
        category: "latte",
        price: 50,
        ingredients: ["кавові зерна", "молоко"],
        allergens: ["молоко"],
        calories: 150,
        preparationTime: 4,
        available: true
    }
];

sampleMenu.forEach(item => {
    databaseService.addMenuItem(item);
});

console.log("✅ Тестове меню додано");
console.log("🎉 База даних перебудована успішно!");
