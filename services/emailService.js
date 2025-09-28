import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

config();

class EmailService {
    constructor() {
        this.transporter = null;
        this.init();
    }

    init() {
        try {
            this.transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.EMAIL_PORT) || 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            // Перевіряємо підключення
            this.verifyConnection();
        } catch (error) {
            console.warn('⚠️ Email сервіс не налаштовано. Використовується демо-режим.');
            console.warn('💡 Для повної функціональності налаштуйте SMTP в .env файлі');
        }
    }

    async verifyConnection() {
        if (!this.transporter) return false;

        try {
            await this.transporter.verify();
            console.log('✅ Email сервіс підключено успішно');
            return true;
        } catch (error) {
            console.warn('⚠️ Помилка підключення до email сервісу:', error.message);
            return false;
        }
    }

    // Основний метод відправки email
    async sendEmail(to, subject, html, text = '') {
        // Якщо email не налаштовано, логуємо демо-повідомлення
        if (!this.transporter || !process.env.EMAIL_USER) {
            console.log('📧 ДЕМО-РЕЖИМ Email:');
            console.log(`   To: ${to}`);
            console.log(`   Subject: ${subject}`);
            console.log(`   HTML: ${html.substring(0, 100)}...`);
            return { success: true, demo: true, message: 'Email відправлено в демо-режимі' };
        }

        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM || 'Coffee Order System <noreply@coffeeorder.com>',
                to,
                subject,
                text,
                html
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email відправлено до: ${to}`);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('❌ Помилка відправки email:', error.message);
            return { 
                success: false, 
                error: error.message,
                demo: false 
            };
        }
    }

    // Метод для верифікації email
    async sendVerificationEmail(user, verificationToken) {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        
        const subject = 'Підтвердження email адреси - Coffee Order System';
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #8B4513, #D2691E); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; background: #8B4513; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>☕ Coffee Order System</h1>
                    </div>
                    <div class="content">
                        <h2>Вітаємо, ${user.firstName}!</h2>
                        <p>Дякуємо за реєстрацію в нашій системі замовлення кави.</p>
                        <p>Для завершення реєстрації будь ласка підтвердьте вашу email адресу:</p>
                        
                        <div style="text-align: center;">
                            <a href="${verificationUrl}" class="button">Підтвердити Email</a>
                        </div>

                        <p>Якщо кнопка не працює, скопіюйте це посилання у браузер:</p>
                        <p><a href="${verificationUrl}">${verificationUrl}</a></p>

                        <p>Це посилання дійсне протягом 24 годин.</p>
                    </div>
                    <div class="footer">
                        <p>Якщо ви не реєструвались в нашій системі, просто проігноруйте цей лист.</p>
                        <p>© 2024 Coffee Order System. Всі права захищено.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const text = `Вітаємо, ${user.firstName}! Підтвердьте вашу email адресу: ${verificationUrl}`;

        return await this.sendEmail(user.email, subject, html, text);
    }

    // Метод для скидання пароля
    async sendPasswordResetEmail(user, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        
        const subject = 'Скидання пароля - Coffee Order System';
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #8B4513, #D2691E); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; background: #8B4513; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
                    .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>☕ Coffee Order System</h1>
                    </div>
                    <div class="content">
                        <h2>Скидання пароля</h2>
                        <p>Вітаємо, ${user.firstName}!</p>
                        <p>Ми отримали запит на скидання пароля для вашого акаунта.</p>
                        
                        <div class="warning">
                            <strong>Якщо ви не запитували скидання пароля, проігноруйте цей лист.</strong>
                        </div>

                        <div style="text-align: center;">
                            <a href="${resetUrl}" class="button">Встановити новий пароль</a>
                        </div>

                        <p>Посилання дійсне протягом 1 години.</p>
                        <p>Якщо кнопка не працює, скопіюйте це посилання у браузер:</p>
                        <p><a href="${resetUrl}">${resetUrl}</a></p>
                    </div>
                    <div class="footer">
                        <p>© 2024 Coffee Order System. Всі права захищено.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const text = `Скидання пароля для акаунта ${user.email}. Посилання: ${resetUrl}`;

        return await this.sendEmail(user.email, subject, html, text);
    }

    // Метод для сповіщення про замовлення
    async sendOrderConfirmationEmail(user, order) {
        const subject = `Підтвердження замовлення #${order.orderNumber} - Coffee Order System`;
        
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #8B4513, #D2691E); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
                    .item { display: flex; justify-content: space-between; margin: 10px 0; }
                    .total { border-top: 2px solid #8B4513; padding-top: 10px; margin-top: 20px; font-weight: bold; }
                    .status { display: inline-block; background: #28a745; color: white; padding: 5px 15px; border-radius: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>☕ Coffee Order System</h1>
                    </div>
                    <div class="content">
                        <h2>Замовлення підтверджено!</h2>
                        <p>Вітаємо, ${user.firstName}! Ваше замовлення успішно прийнято.</p>
                        
                        <div class="order-details">
                            <h3>Деталі замовлення #${order.orderNumber}</h3>
                            <p><strong>Статус:</strong> <span class="status">${order.status}</span></p>
                            <p><strong>Час замовлення:</strong> ${new Date(order.createdAt).toLocaleString('uk-UA')}</p>
                            
                            <h4>Товари:</h4>
                            ${order.items.map(item => `
                                <div class="item">
                                    <span>${item.name} x${item.quantity}</span>
                                    <span>${item.totalPrice} грн</span>
                                </div>
                            `).join('')}
                            
                            <div class="total">
                                <span>Загальна сума:</span>
                                <span>${order.pricing.totalAmount} грн</span>
                            </div>
                        </div>

                        <p>Дякуємо, що обираєте наш сервіс! ☕</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const text = `Ваше замовлення #${order.orderNumber} підтверджено. Сума: ${order.pricing.totalAmount} грн.`;

        return await this.sendEmail(user.email, subject, html, text);
    }
}

export default new EmailService();
