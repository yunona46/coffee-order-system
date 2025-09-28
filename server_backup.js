const http = require("http");
const PORT = 3001;
const databaseService = require("./services/databaseService");

console.log("🔄 Запуск сервера...");

// Ініціалізуємо тестові дані
function initializeSampleData() {
    const menuItems = databaseService.getAllMenuItems();
    if (menuItems.length === 0) {
        console.log("📝 Ініціалізація тестового меню...");
        
        const sampleMenu = [
            {
                name: "Еспресо",
                description: "Класичний міцний кавовий напій",
                category: "espresso",
                price: 35,
                ingredients: ["кавові зерна"],
                calories: 5,
                preparationTime: 2
            },
            {
                name: "Американо",
                description: "Еспресо з гарячою водою",
                category: "americano", 
                price: 40,
                ingredients: ["кавові зерна", "вода"],
                calories: 10,
                preparationTime: 3
            },
            {
                name: "Капучино",
                description: "Еспресо з молочною пінкою",
                category: "cappuccino",
                price: 45,
                ingredients: ["кавові зерна", "молоко", "молочна пінка"],
                allergens: ["молоко"],
                calories: 120,
                preparationTime: 4
            },
            {
                name: "Латте",
                description: "Ніжний напій з еспресо та молоком",
                category: "latte",
                price: 50,
                ingredients: ["кавові зерна", "молоко"],
                allergens: ["молоко"],
                calories: 150,
                preparationTime: 4
            }
        ];

        sampleMenu.forEach(item => databaseService.addMenuItem(item));
        console.log("✅ Тестове меню створено");
    }
}

initializeSampleData();

const server = http.createServer((req, res) => {
    const timestamp = new Date().toISOString();
    console.log(timestamp + " - " + req.method + " " + req.url);
    
    // Додамо правильні заголовки для української мови
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    
    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Обробка маршрутів
    const baseUrl = "http://" + req.headers.host;
    const url = new URL(req.url, baseUrl);
    const pathname = url.pathname;
    
    if (pathname === "/api/v1" && req.method === "GET") {
        handleApiInfo(req, res);
    } else if (pathname === "/api/v1/auth/register" && req.method === "POST") {
        handleRegister(req, res);
    } else if (pathname === "/api/v1/menu" && req.method === "GET") {
        handleGetMenu(req, res, url);
    } else {
        handleNotFound(req, res);
    }
});

function handleApiInfo(req, res) {
    const responseData = JSON.stringify({
        success: true,
        message: "Coffee Order System API v1.0.0",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: ["POST /auth/register", "POST /auth/login"],
            menu: ["GET /menu", "GET /menu/:id"],
            cart: ["GET /cart", "POST /cart/items", "PUT /cart/items/:id", "DELETE /cart/items/:id"],
            orders: ["POST /orders", "GET /orders", "GET /orders/:id"]
        }
    }, null, 2);
    
    res.writeHead(200);
    res.end(responseData);
}

function handleRegister(req, res) {
    let body = "";
    req.on("data", chunk => body += chunk.toString());
    
    req.on("end", () => {
        try {
            console.log("📧 Отримано тіло запиту:", body);
            
            const userData = JSON.parse(body);
            console.log("📋 Розпарсені дані:", userData);
            
            if (!userData.email || !userData.password) {
                const responseData = JSON.stringify({
                    success: false,
                    message: "Email та пароль обов'\''язкові"
                }, null, 2);
                res.writeHead(400);
                res.end(responseData);
                return;
            }
            
            // Перевірка чи існує користувач
            const existingUser = databaseService.findUserByEmail(userData.email);
            if (existingUser) {
                const responseData = JSON.stringify({
                    success: false,
                    message: "Користувач з таким email вже існує",
                    code: "EMAIL_EXISTS"
                }, null, 2);
                res.writeHead(422);
                res.end(responseData);
                return;
            }
            
            // Створення користувача
            const user = databaseService.addUser({
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                email: userData.email,
                password: userData.password,
                phone: userData.phone || null,
                role: "customer"
            });
            
            console.log("✅ Створено користувача:", user);
            
            const responseData = JSON.stringify({
                success: true,
                message: "Користувач успішно зареєстрований",
                data: {
                    user: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: user.role
                    }
                }
            }, null, 2);
            
            res.writeHead(201);
            res.end(responseData);
            
        } catch (error) {
            console.error("❌ Помилка при реєстрації:", error);
            const responseData = JSON.stringify({
                success: false,
                message: "Невірний JSON формат"
            }, null, 2);
            res.writeHead(400);
            res.end(responseData);
        }
    });
}, null, 2);
                res.writeHead(400);
                res.end(responseData);
                return;
            }
            
            // Перевірка чи існує користувач
            const existingUser = databaseService.findUserByEmail(userData.email);
            if (existingUser) {
                const responseData = JSON.stringify({
                    success: false,
                    message: "Користувач з таким email вже існує",
                    code: "EMAIL_EXISTS"
                }, null, 2);
                res.writeHead(422);
                res.end(responseData);
                return;
            }
            
            // Створення користувача
            const user = databaseService.addUser({
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                email: userData.email,
                password: userData.password,
                phone: userData.phone || null,
                role: "customer"
            });
            
            const responseData = JSON.stringify({
                success: true,
                message: "Користувач успішно зареєстрований",
                data: {
                    user: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: user.role
                    }
                }
            }, null, 2);
            
            res.writeHead(201);
            res.end(responseData);
            
        } catch (error) {
            const responseData = JSON.stringify({
                success: false,
                message: "Невірний JSON формат"
            }, null, 2);
            res.writeHead(400);
            res.end(responseData);
        }
    });
}

function handleGetMenu(req, res, url) {
    const menuItems = databaseService.getAllMenuItems();
    
    // Фільтрація за категорією
    const category = url.searchParams.get("category");
    const available = url.searchParams.get("available");
    
    let filteredItems = menuItems;
    
    if (category) {
        filteredItems = filteredItems.filter(item => item.category === category);
    }
    
    if (available === "true") {
        filteredItems = filteredItems.filter(item => item.available === true);
    }
    
    const responseData = JSON.stringify({
        success: true,
        data: {
            items: filteredItems,
            total: filteredItems.length
        }
    }, null, 2);
    
    res.writeHead(200);
    res.end(responseData);
}

function handleNotFound(req, res) {
    const responseData = JSON.stringify({
        success: false,
        message: "Маршрут не знайдено",
        code: "ROUTE_NOT_FOUND"
    }, null, 2);
    
    res.writeHead(404);
    res.end(responseData);
}

server.listen(PORT, () => {
    console.log("🚀 Сервер запущено!");
    console.log("📍 Адреса: http://localhost:" + PORT);
    console.log("📚 API: http://localhost:" + PORT + "/api/v1");
    console.log("⏰ Час: " + new Date().toISOString());
});


