const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB підключено: ${conn.connection.host}`);

    // Обробка подій підключення
    mongoose.connection.on('error', (error) => {
      console.error('❌ Помилка підключення до MongoDB:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB відключено');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB підключення закрито через завершення програми');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Не вдалося підключитися до MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;