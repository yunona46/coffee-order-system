const mongoose = require('mongoose');
require('dotenv').config();

async function testDifferentConnections() {
  const connectionStrings = [
    // Варіант 1: З вашим паролем
    'mongodb+srv://coffee-admin:UVYzg2rB8WSjGWwB@coffee-order-cluster.t0ruws8.mongodb.net/coffee-order-system?retryWrites=true&w=majority',
    
    // Варіант 2: Без указання бази даних
    'mongodb+srv://coffee-admin:UVYzg2rB8WSjGWwB@coffee-order-cluster.t0ruws8.mongodb.net/?retryWrites=true&w=majority',
    
    // Варіант 3: З іншим ім'ям користувача
    'mongodb+srv://coffee-user:UVYzg2rB8WSjGWwB@coffee-order-cluster.t0ruws8.mongodb.net/coffee-order-system?retryWrites=true&w=majority'
  ];

  for (let i = 0; i < connectionStrings.length; i++) {
    console.log(\\\n=== Тест варіанту \ ===\);
    console.log('Connection string:', connectionStrings[i].replace(/:[^:]*@/, ':********@'));
    
    try {
      await mongoose.connect(connectionStrings[i], {
        serverSelectionTimeoutMS: 5000
      });
      console.log('✅ Успішно підключено!');
      await mongoose.connection.close();
    } catch (error) {
      console.log('❌ Помилка:', error.message);
    }
  }
}

testDifferentConnections();
