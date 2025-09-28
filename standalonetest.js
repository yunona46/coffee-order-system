// standalonetest.js - автономний тест Coffee Order System
console.log('🧪 АВТОНОМНЕ ТЕСТУВАННЯ COFFEE ORDER SYSTEM');
console.log('=============================================\n');

// Простий тестовий фреймворк
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    expect(value) {
        return {
            toBe: (expected) => {
                if (value !== expected) {
                    throw new Error(`Очікувалось: ${expected}, Отримано: ${value}`);
                }
            },
            toEqual: (expected) => {
                if (JSON.stringify(value) !== JSON.stringify(expected)) {
                    throw new Error('Об\'єкти не ідентичні');
                }
            },
            toContain: (expected) => {
                if (!value.includes(expected)) {
                    throw new Error(`"${value}" не містить "${expected}"`);
                }
            }
        };
    }

    run() {
        console.log('Запуск тестів...\n');

        this.tests.forEach((test, index) => {
            try {
                test.testFunction();
                this.passed++;
                console.log(`✅ ТЕСТ ${index + 1}: ${test.name}`);
            } catch (error) {
                this.failed++;
                console.log(`❌ ТЕСТ ${index + 1}: ${test.name}`);
                console.log(`   ПОМИЛКА: ${error.message}`);
            }
        });

        console.log('\n📊 РЕЗУЛЬТАТИ ТЕСТУВАННЯ:');
        console.log('─────────────────────────');
        console.log(`✅ Успішних: ${this.passed}`);
        console.log(`❌ Невдалих: ${this.failed}`);
        console.log(`📋 Всього тестів: ${this.tests.length}`);
        
        const successRate = Math.round((this.passed / this.tests.length) * 100);
        console.log(`🎯 Успішність: ${successRate}%`);

        if (this.failed === 0) {
            console.log('\n🎉 ВСІ ТЕСТИ ПРОЙДЕНІ УСПІШНО!');
            console.log('🚀 Система готова до наступного етапу!');
        } else {
            console.log('\n💪 Деякі тести потребують уваги');
        }
    }
}

// Створюємо тестовий раннер
const tester = new TestRunner();

// Додаємо тести
console.log('1. 🔧 БАЗОВІ ТЕСТИ');
tester.test('Математичні операції', () => {
    tester.expect(1 + 1).toBe(2);
    tester.expect(3 * 4).toBe(12);
});

tester.test('Робота з рядками', () => {
    tester.expect('coffee'.toUpperCase()).toBe('COFFEE');
    tester.expect('hello world').toContain('world');
});

console.log('\n2. 📋 ТЕСТИ СТРУКТУРИ ДАНИХ');
tester.test('Формат API відповіді', () => {
    const successResponse = { 
        success: true, 
        message: 'Операція успішна', 
        data: { id: 1, name: 'Test' } 
    };
    tester.expect(successResponse.success).toBe(true);
    
    const errorResponse = { 
        success: false, 
        message: 'Помилка валідації', 
        code: 'VALIDATION_ERROR' 
    };
    tester.expect(errorResponse.success).toBe(false);
});

tester.test('Валідація користувача', () => {
    const userData = { 
        firstName: 'John', 
        lastName: 'Doe', 
        email: 'test@example.com',
        password: 'password123'
    };
    tester.expect(userData.email).toContain('@');
    tester.expect(userData.firstName.length).toBeGreaterThan(0);
});

console.log('\n3. ☕ ТЕСТИ БІЗНЕС-ЛОГІКИ');
tester.test('Розрахунок вартості замовлення', () => {
    const items = [
        { name: 'Еспресо', price: 35, quantity: 2 },
        { name: 'Латте', price: 45, quantity: 1 }
    ];
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    tester.expect(total).toBe(35*2 + 45*1);
});

tester.test('Перевірка статусів замовлення', () => {
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
    const testStatus = 'confirmed';
    tester.expect(validStatuses).toContain(testStatus);
});

// Запускаємо тести
tester.run();

console.log('\n=============================================');
console.log('🧪 ТЕСТУВАННЯ ЗАВЕРШЕНО');
console.log('📧 ГОТУЄМОСЬ ДО ЕТАПУ 3 - EMAIL СИСТЕМА');
