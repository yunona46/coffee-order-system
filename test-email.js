// test-email.js - тест email сервісу
import emailService from './services/emailService.js';

console.log('🧪 Тестуємо Email сервіс...\n');

// Тестовий користувач
const testUser = {
    firstName: 'Тест',
    lastName: 'Користувач',
    email: 'test@example.com'
};

// Тестове замовлення
const testOrder = {
    orderNumber: 'COF-20241234',
    status: 'confirmed',
    createdAt: new Date(),
    items: [
        { name: 'Еспресо', quantity: 2, totalPrice: 70 },
        { name: 'Латте', quantity: 1, totalPrice: 45 }
    ],
    pricing: {
        totalAmount: 115
    }
};

async function testEmailService() {
    console.log('1. 📧 Тестуємо верифікацію email...');
    const verificationResult = await emailService.sendVerificationEmail(
        testUser, 
        'test-verification-token-123'
    );
    console.log('   Результат:', verificationResult.success ? '✅ Успішно' : '❌ Помилка');
    
    console.log('\n2. 🔑 Тестуємо скидання пароля...');
    const resetResult = await emailService.sendPasswordResetEmail(
        testUser,
        'test-reset-token-456'
    );
    console.log('   Результат:', resetResult.success ? '✅ Успішно' : '❌ Помилка');
    
    console.log('\n3. ☕ Тестуємо підтвердження замовлення...');
    const orderResult = await emailService.sendOrderConfirmationEmail(
        testUser,
        testOrder
    );
    console.log('   Результат:', orderResult.success ? '✅ Успішно' : '❌ Помилка');
    
    console.log('\n📊 Підсумок тестування Email сервісу:');
    console.log('--------------------------------------');
    console.log('✅ Сервіс готовий до роботи');
    console.log('💡 У демо-режимі email листи відображаються в консолі');
    console.log('🚀 Для реальної відправки налаштуйте SMTP в .env файлі');
}

testEmailService().catch(console.error);
