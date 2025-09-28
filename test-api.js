const http = require("http");

function testEndpoint(name, options) {
    return new Promise((resolve) => {
        console.log("\n🔹 " + name);
        
        const req = http.request(options, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                console.log("   ✅ Статус: " + res.statusCode);
                const response = JSON.parse(data);
                console.log("   💬 Відповідь: " + response.message);
                resolve(true);
            });
        });
        
        req.on("error", (error) => {
            console.log("   ❌ Помилка: " + error.message);
            resolve(false);
        });
        
        if (options.body) {
            req.write(JSON.stringify(options.body));
        }
        req.end();
    });
}

async function runTests() {
    console.log("☕ Запуск тестів API...");
    
    // Тест статусу API
    await testEndpoint("Статус API", {
        hostname: "localhost",
        port: 3001,
        path: "/api/v1",
        method: "GET"
    });
    
    // Тест реєстрації
    await testEndpoint("Реєстрація користувача", {
        hostname: "localhost",
        port: 3001,
        path: "/api/v1/auth/register",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            firstName: "Марія",
            lastName: "Коваль",
            email: "maria.koval@example.com",
            password: "securepassword123",
            phone: "+380501234567"
        }
    });
    
    // Тест помилки валідації
    await testEndpoint("Тест валідації (без пароля)", {
        hostname: "localhost",
        port: 3001,
        path: "/api/v1/auth/register",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            firstName: "Тест",
            lastName: "БезПароля",
            email: "test.nopassword@example.com"
        }
    });
    
    console.log("\n🎉 Тестування завершено!");
}

// Запускаємо тести тільки якщо файл викликаний безпосередньо
if (require.main === module) {
    runTests();
}

module.exports = { testEndpoint, runTests };
