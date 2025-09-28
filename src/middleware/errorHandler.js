const errorHandler = (err, req, res, next) => {
    console.error('Помилка:', err);

    // JWT помилки
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Невірний токен авторизації',
            code: 'AUTH_TOKEN_INVALID'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Термін дії токена закінчився',
            code: 'AUTH_TOKEN_EXPIRED'
        });
    }

    // MongoDB помилки
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Невірний формат ID',
            code: 'INVALID_ID_FORMAT'
        });
    }

    if (err.code === 11000) {
        return res.status(422).json({
            success: false,
            message: 'Користувач з таким email вже існує',
            code: 'DUPLICATE_EMAIL'
        });
    }

    // За замовчуванням
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Внутрішня помилка сервера',
        code: err.code || 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString(),
        path: req.path
    });
};

module.exports = errorHandler;
