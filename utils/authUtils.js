const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthUtils = {
    // Хешування пароля
    hashPassword: async (password) => {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    },

    // Перевірка пароля
    verifyPassword: async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword);
    },

    // Створення payload для JWT
    createTokenPayload: (user) => {
        return {
            userId: user.id,
            email: user.email,
            role: user.role
        };
    },

    // Генерація JWT токена
    generateToken: (payload) => {
        return jwt.sign(
            payload, 
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );
    },

    // Перевірка JWT токена
    verifyToken: (token) => {
        return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    }
};

module.exports = AuthUtils;
