const http = require("http");
const PORT = 3001;
const databaseService = require("./services/databaseService");
const AuthUtils = require("./utils/authUtils");
const { authenticateToken, requireRole, sendErrorResponse } = require("./middleware/authMiddleware");

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
                name: "Капучино",
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
    } else if (pathname === "/api/v1/health" && req.method === "GET") {
        handleHealthCheck(req, res);
    } else if (pathname === "/api/v1/auth/register" && req.method === "POST") {
        handleRegister(req, res);
    } else if (pathname === "/api/v1/auth/login" && req.method === "POST") {
        handleLogin(req, res);
    } else if (pathname === "/api/v1/auth/me" && req.method === "GET") {
        handleGetCurrentUser(req, res);
    } else if (pathname === "/api/v1/auth/logout" && req.method === "POST") {
        handleLogout(req, res);
    } else if (pathname === "/api/v1/menu" && req.method === "GET") {
        handleGetMenu(req, res, url);
    } else if (pathname === "/api/v1/cart" && req.method === "GET") {
        handleGetCart(req, res);
    } else if (pathname === "/api/v1/cart/items" && req.method === "POST") {
        handleAddToCart(req, res);
    } else if (pathname === "/api/v1/cart" && req.method === "DELETE") {
        handleClearCart(req, res);
    } else if (pathname === "/api/v1/orders" && req.method === "POST") {
        handleCreateOrder(req, res);
    } else if (pathname === "/api/v1/orders" && req.method === "GET") {
        handleGetOrders(req, res);
    } else if (pathname.startsWith("/api/v1/orders/") && req.method === "GET") {
        const orderId = pathname.split("/").pop();
        handleGetOrderDetails(req, res, orderId);
    } else {
        handleNotFound(req, res);
    }
});

function handleApiInfo(req, res) {
    res.writeHead(200);
    res.end(JSON.stringify({
        success: true,
        message: "Coffee Order System API v1.0.0",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: ["POST /auth/register", "POST /auth/login", "GET /auth/me", "POST /auth/logout"],
            menu: ["GET /menu", "GET /menu/:id"],
            cart: ["GET /cart", "POST /cart/items", "DELETE /cart"],
            orders: ["POST /orders", "GET /orders", "GET /orders/:id"]
        }
    }, null, 2));
}

function handleHealthCheck(req, res) {
    const healthData = {
        success: true,
        message: "Сервер працює! 🚀",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        database: "Підключено",
        endpoints: {
            auth: ["POST /auth/register", "POST /auth/login"],
            menu: ["GET /menu"],
            cart: ["GET /cart", "POST /cart/items"],
            orders: ["POST /orders", "GET /orders"]
        }
    };

    const responseData = JSON.stringify(healthData, null, 2);
    
    res.writeHead(200);
    res.end(responseData);
    
    console.log("✅ Health check пройдено");
}

function handleRegister(req, res) {
    let body = "";
    req.on("data", chunk => body += chunk.toString());

    req.on("end", async () => {
        try {
            const userData = JSON.parse(body);

            if (!userData.email || !userData.password) {
                return sendErrorResponse(res, 400, "Email та пароль обов'язкові", "VALIDATION_ERROR");
            }

            const existingUser = databaseService.findUserByEmail(userData.email);
            if (existingUser) {
                return sendErrorResponse(res, 422, "Користувач з таким email вже існує", "EMAIL_EXISTS");
            }

            const hashedPassword = await AuthUtils.hashPassword(userData.password);
            const user = databaseService.addUser({
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                email: userData.email,
                password: hashedPassword,
                phone: userData.phone || null,
                role: "customer"
            });

            const tokenPayload = AuthUtils.createTokenPayload(user);
            const token = AuthUtils.generateToken(tokenPayload);

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
                    },
                    accessToken: token
                }
            }, null, 2);

            res.writeHead(201);
            res.end(responseData);

        } catch (error) {
            console.error("Помилка при реєстрації:", error);
            sendErrorResponse(res, 400, "Невірний JSON формат", "VALIDATION_ERROR");
        }
    });
}

function handleLogin(req, res) {
    let body = "";
    req.on("data", chunk => body += chunk.toString());

    req.on("end", async () => {
        try {
            const { email, password } = JSON.parse(body);

            if (!email || !password) {
                return sendErrorResponse(res, 400, "Email та пароль обов'язкові", "VALIDATION_ERROR");
            }

            const user = databaseService.findUserByEmail(email);
            if (!user) {
                return sendErrorResponse(res, 401, "Невірний email або пароль", "INVALID_CREDENTIALS");
            }

            const isPasswordValid = await AuthUtils.verifyPassword(password, user.password);
            if (!isPasswordValid) {
                return sendErrorResponse(res, 401, "Невірний email або пароль", "INVALID_CREDENTIALS");
            }

            user.lastLoginAt = new Date().toISOString();
            const tokenPayload = AuthUtils.createTokenPayload(user);
            const token = AuthUtils.generateToken(tokenPayload);

            const responseData = JSON.stringify({
                success: true,
                message: "Успішний вхід в систему",
                data: {
                    user: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: user.role
                    },
                    accessToken: token
                }
            }, null, 2);

            res.writeHead(200);
            res.end(responseData);

        } catch (error) {
            console.error("Помилка при логіні:", error);
            sendErrorResponse(res, 400, "Невірний JSON формат", "VALIDATION_ERROR");
        }
    });
}

function handleGetCurrentUser(req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return sendErrorResponse(res, 401, "Необхідна автентифікація", "AUTH_REQUIRED");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const user = databaseService.findUserById(decoded.userId);
        
        if (!user) {
            return sendErrorResponse(res, 401, "Користувач не знайдений", "USER_NOT_FOUND");
        }

function handleLogout(req, res) {
    const responseData = JSON.stringify({
        success: true,
        message: "Успішний вихід з системи"
    }, null, 2);

    res.writeHead(200);
    res.end(responseData);
}

function handleGetMenu(req, res, url) {
    const menuItems = databaseService.getAllMenuItems();

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

function handleGetCart(req, res) {
    const cart = {
        items: [
            {
                id: "1",
                name: "Латте",
                quantity: 2,
                price: 50,
                total: 100
            }
        ],
        totalItems: 2,
        subtotal: 100,
        taxes: 10,
        deliveryFee: 25,
        totalAmount: 135
    };

    const responseData = JSON.stringify({
        success: true,
        data: { cart }
    }, null, 2);

    res.writeHead(200);
    res.end(responseData);
}

function handleAddToCart(req, res) {
    let body = "";
    req.on("data", chunk => body += chunk.toString());

    req.on("end", () => {
        try {
            const cartItem = JSON.parse(body);

            const responseData = JSON.stringify({
                success: true,
                message: "Товар додано до кошика",
                data: {
                    cartItem: {
                        id: "item_" + Date.now(),
                        ...cartItem,
                        total: cartItem.quantity * cartItem.price
                    }
                }
            }, null, 2);

            res.writeHead(201);
            res.end(responseData);

        } catch (error) {
            sendErrorResponse(res, 400, "Невірний JSON формат", "VALIDATION_ERROR");
        }
    });
}

function handleClearCart(req, res) {
    const responseData = JSON.stringify({
        success: true,
        message: "Кошик очищено"
    }, null, 2);

    res.writeHead(200);
    res.end(responseData);
}

function handleCreateOrder(req, res) {
    let body = "";
    req.on("data", chunk => body += chunk.toString());

    req.on("end", () => {
        try {
            const orderData = JSON.parse(body);

            const order = {
                id: "order_" + Date.now(),
                orderNumber: "COF-" + Date.now(),
                status: "confirmed",
                ...orderData,
                totalAmount: 145,
                createdAt: new Date().toISOString()
            };

            const responseData = JSON.stringify({
                success: true,
                message: "Замовлення створено успішно",
                data: { order }
            }, null, 2);

            res.writeHead(201);
            res.end(responseData);

        } catch (error) {
            sendErrorResponse(res, 400, "Невірний JSON формат", "VALIDATION_ERROR");
        }
    });
}

function handleGetOrders(req, res) {
    const orders = [
        {
            id: "1",
            orderNumber: "COF-2024001",
            status: "delivered",
            totalAmount: 145,
            itemsCount: 2,
            createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: "2",
            orderNumber: "COF-2024002",
            status: "preparing",
            totalAmount: 75,
            itemsCount: 1,
            createdAt: new Date().toISOString()
        }
    ];

    const responseData = JSON.stringify({
        success: true,
        data: { orders }
    }, null, 2);

    res.writeHead(200);
    res.end(responseData);
}

function handleGetOrderDetails(req, res, orderId) {
    const order = {
        id: orderId,
        orderNumber: "COF-2024001",
        status: "delivered",
        items: [
            {
                name: "Латте",
                quantity: 2,
                price: 50,
                total: 100
            },
            {
                name: "Капучино",
                quantity: 1,
                price: 45,
                total: 45
            }
        ],
        totalAmount: 145,
        deliveryAddress: {
            street: "вул. Хрещатик",
            building: "1",
            apartment: "15"
        },
        contactPhone: "+380501234567",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        deliveredAt: new Date(Date.now() - 43200000).toISOString()
    };

    const responseData = JSON.stringify({
        success: true,
        data: { order }
    }, null, 2);

    res.writeHead(200);
    res.end(responseData);
}

function handleNotFound(req, res) {
    sendErrorResponse(res, 404, "Маршрут не знайдено", "ROUTE_NOT_FOUND");
}

server.listen(PORT, () => {
    console.log("🚀 Сервер запущено!");
    console.log("📍 Адреса: http://localhost:" + PORT);
    console.log("📚 API: http://localhost:" + PORT + "/api/v1");
    console.log("⏰ Час: " + new Date().toISOString());
});