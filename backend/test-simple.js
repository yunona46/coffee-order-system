const mongoose = require('mongoose');

async function testConnection() {
    console.log('Testing MongoDB Atlas connection...');
    
    const uri = 'mongodb+srv://coffee-admin:UVYzg2rB8WSjGWwB@coffee-order-cluster.t0ruws8.mongodb.net/coffee-order-system?retryWrites=true&w=majority';
    
    console.log('Connection string:', uri.replace(/:[^:]*@/, ':********@'));
    
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        
        console.log('✅ MongoDB Atlas connected successfully!');
        console.log('Database:', mongoose.connection.name);
        console.log('Host:', mongoose.connection.host);
        
        await mongoose.connection.close();
    } catch (error) {
        console.log('❌ Connection failed:');
        console.log('Error:', error.message);
        
        if (error.errorResponse) {
            console.log('Details:', error.errorResponse.errmsg);
        }
    }
}

testConnection();
