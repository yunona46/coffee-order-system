const http = require('http');

const PORT = 3001;
const HOST = '127.0.0.1';

const server = http.createServer((req, res) => {
    console.log('Запит:', req.method, req.url);
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    
    // OPTIONS для CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Health check
    if (req.url === '/api/v1/health' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            message: '✅ Сервер працює на порту 3001!',
            timestamp: new Date().toISOString()
        }));
        return;
    }
    
    // Меню
    if (req.url === '/api/v1/menu' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: {
                items: [
                    {
                        id: "1",
                        name: "Еспресо",
                        description: "Класичний міцний еспресо",
                        price: 35,
                        available: true
                    },
                    {
                        id: "2",
                        name: "Латте", 
                        description: "Ніжний напій з еспресо та молоком",
                        price: 45,
                        available: true
                    },
                    {
                        id: "3",
                        name: "Капучино",
                        description: "Ідеальний баланс еспресо та пінки",
                        price: 50,
                        available: true
                    }
                ]
            }
        }));
        return;
    }
    
    // Створення замовлення
    if (req.url === '/api/v1/orders' && req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const orderData = JSON.parse(body);
                console.log('Отримано замовлення:', orderData.customerName);
                
                // Валідація
                if (!orderData.items || !orderData.customerName || !orderData.customerEmail) {
                    res.writeHead(400);
                    res.end(JSON.stringify({
                        success: false,
                        message: 'Заповніть обов\'язкові поля'
                    }));
                    return;
                }
                
                // Розрахунок суми
                const totalAmount = orderData.items.reduce((sum, item) => {
                    return sum + (item.price * (item.quantity || 1));
                }, 0);
                
                // Створення замовлення
                const order = {
                    orderNumber: 'COFFEE-' + Date.now(),
                    customerName: orderData.customerName,
                    customerEmail: orderData.customerEmail,
                    customerPhone: orderData.customerPhone || '',
                    items: orderData.items,
                    totalAmount: totalAmount,
                    orderType: orderData.orderType || 'pickup',
                    status: 'pending',
                    notes: orderData.notes || '',
                    createdAt: new Date()
                };
                
                res.writeHead(201);
                res.end(JSON.stringify({
                    success: true,
                    message: 'Замовлення створено успішно!',
                    data: { order }
                }));
                
            } catch (error) {
                console.error('Помилка:', error);
                res.writeHead(500);
                res.end(JSON.stringify({
                    success: false,
                    message: 'Помилка сервера'
                }));
            }
        });
        
        return;
    }
    
    // 404
    res.writeHead(404);
    res.end(JSON.stringify({
        success: false,
        message: 'Маршрут не знайдено'
    }));
});

// Запуск сервера
server.listen(PORT, HOST, () => {
    console.log(`🎯 СЕРВЕР ПРАЦЮЄ НА http://${HOST}:${PORT}`);
    console.log('');
    console.log('📋 ДОСТУПНІ МАРШРУТИ:');
    console.log('   • GET  http://127.0.0.1:3001/api/v1/health');
    console.log('   • GET  http://127.0.0.1:3001/api/v1/menu');
    console.log('   • POST http://127.0.0.1:3001/api/v1/orders');
    console.log('');
    console.log('✅ ВІДКРИЙ БРАУЗЕР І ТЕСТУЙ!');
});