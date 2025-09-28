const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('🔗 Тестування підключення до MongoDB Atlas...');
        
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Успішно підключено до MongoDB Atlas!');
        console.log('📊 База даних:', mongoose.connection.db.databaseName);
        console.log('🏠 Хост:', mongoose.connection.host);
        
        await mongoose.connection.close();
        console.log('🔌 Підключення закрито');
        
    } catch (error) {
        console.error('❌ Помилка підключення:', error.message);
        console.log('\n💡 Перевірте:');
        console.log('1. Чи правильний пароль в MONGODB_URI');
        console.log('2. Чи додана ваша IP в IP Access List в Atlas');
        console.log('3. Чи активований кластер в Atlas');
    }
}

testConnection();