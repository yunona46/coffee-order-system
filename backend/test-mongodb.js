const mongoose = require('mongoose');

const testCases = [
    {
        name: 'Варіант 1 - з назвою бази даних',
        uri: 'mongodb+srv://coffee-admin:UVYzg2rB8WSjGWwB@coffee-order-cluster.t0ruws8.mongodb.net/coffee-order-system?retryWrites=true&w=majority'
    },
    {
        name: 'Варіант 2 - без назви бази даних', 
        uri: 'mongodb+srv://coffee-admin:UVYzg2rB8WSjGWwB@coffee-order-cluster.t0ruws8.mongodb.net/?retryWrites=true&w=majority'
    },
    {
        name: 'Варіант 3 - з опціями підключення',
        uri: 'mongodb+srv://coffee-admin:UVYzg2rB8WSjGWwB@coffee-order-cluster.t0ruws8.mongodb.net/coffee-order-system?retryWrites=true&w=majority&appName=coffee-order-cluster'
    }
];

async function testConnection() {
    for (const testCase of testCases) {
        console.log(\\\n=== \ ===\);
        console.log('URI:', testCase.uri.replace(/:[^:]*@/, ':********@'));
        
        try {
            await mongoose.connect(testCase.uri, {
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
            });
            
            console.log('✅ Успішно підключено!');
            console.log('База даних:', mongoose.connection.name);
            console.log('Хост:', mongoose.connection.host);
            
            await mongoose.connection.close();
        } catch (error) {
            console.log('❌ Помилка:', error.message);
            if (error.errorResponse) {
                console.log('Деталі:', error.errorResponse.errmsg);
            }
        }
    }
}

testConnection();
