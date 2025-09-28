const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Testing MongoDB Atlas connection...');
    
    // Додаємо опції для кращої сумісності
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('✅ MongoDB Atlas connected successfully!');
    
    // Перевіряємо базу даних
    const dbs = await mongoose.connection.db.admin().listDatabases();
    console.log('Available databases:', dbs.databases.map(db => db.name));
    
    await mongoose.connection.close();
    console.log('Connection closed.');
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.name === 'MongoServerError') {
      console.error('Error code:', error.code);
      console.error('Error details:', error.errorResponse);
    }
  }
}

testConnection();
