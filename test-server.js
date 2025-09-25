// Максимально простий тестовий сервер
const http = require('http');

const PORT = 5000;

const server = http.createServer((req, res) => {
  console.log('📨 Received request:', req.url);
  
  // Встановлюємо CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/api/v1/health' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      message: '✅ Test server is working!',
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  if (req.url === '/api/v1/menu' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: {
        items: [
          { id: 1, name: "Test Coffee", price: 35 },
          { id: 2, name: "Test Latte", price: 45 }
        ]
      }
    }));
    return;
  }
  
  // 404 для інших маршрутів
  res.writeHead(404);
  res.end(JSON.stringify({
    success: false,
    message: 'Route not found'
  }));
});

// Запускаємо на localhost
server.listen(PORT, 'localhost', () => {
  console.log(`🎯 TEST SERVER running on http://localhost:${PORT}`);
  console.log('📋 Test these URLs in your browser:');
  console.log(`   • http://localhost:${PORT}/api/v1/health`);
  console.log(`   • http://localhost:${PORT}/api/v1/menu`);
  console.log('');
  console.log('✨ Open your browser and try the links above!');
});

server.on('error', (error) => {
  console.log('❌ Server error:', error.message);
  if (error.code === 'EADDRINUSE') {
    console.log(`💡 Port ${PORT} is busy. Try these ports: 3000, 5000, 8080, 8000`);
  }
});