const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'coffee-system-secret-key-2024';

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Токен авторизації відсутній',
            code: 'AUTH_TOKEN_MISSING'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Термін дії токена закінчився',
                code: 'AUTH_TOKEN_EXPIRED'
            });
        }
        
        return res.status(403).json({
            success: false,
            message: 'Невірний токен авторизації',
            code: 'AUTH_TOKEN_INVALID'
        });
    }
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({
                success: false,
                message: 'Недостатньо прав доступу',
                code: 'ACCESS_DENIED'
            });
        }
        next();
    };
};

module.exports = { authenticateToken, requireRole, JWT_SECRET };
