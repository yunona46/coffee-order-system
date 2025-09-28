const { v4: uuidv4 } = require('uuid');

class PaymentService {
    constructor() {
        this.paymentMethods = {
            'card': 'Банківська карта',
            'cash': 'Готівка',
            'online': 'Онлайн оплата'
        };
    }

    // Симуляція платіжного шлюзу
    async processPayment(paymentData) {
        const { orderId, amount, method, cardDetails } = paymentData;
        
        // Симулюємо затримку мережевого запиту
        await this.simulateNetworkDelay();
        
        // Валідація даних
        if (!this.validatePaymentData(paymentData)) {
            return this.createPaymentResponse(false, 'Некоректні дані оплати');
        }
        
        // Симуляція різних сценаріїв оплати
        const successRate = this.getSuccessRate(method);
        const isSuccess = Math.random() < successRate;
        
        if (isSuccess) {
            return this.createPaymentResponse(true, 'Оплата успішна', {
                paymentId: uuidv4(),
                transactionId: 'TXN_' + Date.now(),
                amount: amount,
                method: method,
                status: 'completed',
                timestamp: new Date().toISOString()
            });
        } else {
            return this.createPaymentResponse(false, 'Помилка оплати. Спробуйте ще раз');
        }
    }

    // Симуляція оплати готівкою
    async processCashPayment(orderData) {
        return this.createPaymentResponse(true, 'Очікується оплата готівкою', {
            paymentId: uuidv4(),
            method: 'cash',
            status: 'pending',
            instructions: 'Підготуйте готівку для кур\'єра',
            timestamp: new Date().toISOString()
        });
    }

    // Валідація платіжних даних
    validatePaymentData(paymentData) {
        const { amount, method, cardDetails } = paymentData;
        
        if (!amount || amount <= 0) {
            return false;
        }
        
        if (!this.paymentMethods[method]) {
            return false;
        }
        
        if (method === 'card' && cardDetails) {
            return this.validateCardDetails(cardDetails);
        }
        
        return true;
    }

    // Валідація даних картки (спрощена)
    validateCardDetails(cardDetails) {
        const { number, expiry, cvv, holder } = cardDetails;
        
        if (!number || number.replace(/\s/g, '').length !== 16) {
            return false;
        }
        
        if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
            return false;
        }
        
        if (!cvv || !/^\d{3}$/.test(cvv)) {
            return false;
        }
        
        if (!holder || holder.trim().length < 2) {
            return false;
        }
        
        return true;
    }

    // Ставка успішності для різних методів
    getSuccessRate(method) {
        const rates = {
            'card': 0.85,    // 85% успішних оплат
            'online': 0.90,  // 90% успішних оплат
            'cash': 1.0      // 100% для готівки
        };
        return rates[method] || 0.8;
    }

    // Симуляція мережевої затримки
    simulateNetworkDelay() {
        return new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    }

    // Форматування відповіді
    createPaymentResponse(success, message, data = null) {
        return {
            success: success,
            message: message,
            data: data,
            timestamp: new Date().toISOString()
        };
    }

    // Отримання доступних методів оплати
    getAvailablePaymentMethods() {
        return Object.keys(this.paymentMethods).map(key => ({
            id: key,
            name: this.paymentMethods[key],
            description: this.getMethodDescription(key)
        }));
    }

    getMethodDescription(method) {
        const descriptions = {
            'card': 'Оплата банківською карткою',
            'cash': 'Оплата готівкою при отриманні',
            'online': 'Онлайн оплата через платіжну систему'
        };
        return descriptions[method] || 'Метод оплати';
    }
}

module.exports = new PaymentService();
