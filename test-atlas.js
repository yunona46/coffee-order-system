// test-atlas.js
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://coffee-app:Dnne8CMs1tS9DkZK@coffee-order-cluster.t0ruws8.mongodb.net/?retryWrites=true&w=majority&appName=coffee-order-cluster";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function testConnection() {
  try {
    console.log("🔄 Підключаємось до MongoDB Atlas...");
    await client.connect();
    
    console.log("📡 Відправляємо ping...");
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Ping успішний! Підключення працює.");
    
    // Перевірка доступних баз даних
    console.log("\n📦 Перелік баз даних:");
    const databases = await client.db().admin().listDatabases();
    databases.databases.forEach(db => {
      console.log(`   - ${db.name}`);
    });
    
    console.log("\n🎉 Успіх! MongoDB Atlas налаштовано правильно.");
    
  } catch (error) {
    console.error("❌ Помилка:", error.message);
    
    // Специфічні поради для поширених помилок
    if (error.message.includes("authentication")) {
      console.log("\n💡 Спроба:");
      console.log("1. Перевірте правильність пароля");
      console.log("2. Перевірте, чи користувач coffee-app активний");
      console.log("3. У Database Access перевірте привілеї користувача");
    } else if (error.message.includes("network")) {
      console.log("\n💡 Спроба:");
      console.log("1. Перейдіть в Security > Network Access");
      console.log("2. Натисніть 'Add IP Address'");
      console.log("3. Вибери 'Allow Access from Anywhere' (0.0.0.0/0)");
    }
  } finally {
    await client.close();
    console.log("\n🔌 З'єднання закрито.");
  }
}

testConnection();