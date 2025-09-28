const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Забагато запитів з цієї IP адреси',
        code: 'TOO_MANY_REQUESTS'
    },
    headers: true
});

const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Забагато спроб авторизації. Спробуйте через 1 хвилину',
        code: 'AUTH_RATE_LIMIT'
    }
});

const orderLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Забагато замовлень. Спробуйте через 1 хвилину',
        code: 'ORDER_RATE_LIMIT'
    }
});

module.exports = { generalLimiter, authLimiter, orderLimiter };
