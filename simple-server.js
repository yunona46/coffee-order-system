const http = require("http");
const PORT = 3001;

console.log("🔄 Запуск сервера...");

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Додамо CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (req.url === "/api/v1" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            success: true,
            message: "Сервер працює! 🎉",
            version: "1.0.0",
            timestamp: new Date().toISOString()
        }));
        return;
    }
    
    if (req.url === "/api/v1/auth/register" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });
        
        req.on("end", () => {
            console.log("📧 Отримано дані реєстрації:", body);
            
            try {
                const userData = JSON.parse(body);
                
                // Проста валідація
                if (!userData.email || !userData.password) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({
                        success: false,
                        message: "Email та пароль обов'язкові"
                    }));
                    return;
                }
                
                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    success: true,
                    message: "Користувач успішно зареєстрований",
                    data: {
                        user: {
                            id: "user-" + Date.now(),
                            firstName: userData.firstName,
                            lastName: userData.lastName,
                            email: userData.email,
                            role: "customer"
                        },
                        accessToken: "token-" + Date.now()
                    }
                }));
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    success: false,
                    message: "Невірний JSON формат"
                }));
            }
        });
        return;
    }
    
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
        success: false,
        message: "Маршрут не знайдено"
    }));
});

server.listen(PORT, () => {
    console.log("🚀 Сервер запущено!");
    console.log("📍 Адреса: http://localhost:" + PORT);
    console.log("📚 API: http://localhost:" + PORT + "/api/v1");
    console.log("⏰ Час: " + new Date().toISOString());
});

console.log("🔧 Сервер ініціалізовано, очікуємо запити...");
