import authService from "../services/authService.js";
import { AppError } from "../utils/helpers.js";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Токен доступу відсутній",
        code: "AUTH_TOKEN_MISSING",
      });
    }

    const token = authHeader.substring(7); // Видаляємо 'Bearer '
    
    const user = await authService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
      code: error.code || "AUTH_ERROR",
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const user = await authService.verifyToken(token);
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Ігноруємо помилки для optional auth
    next();
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Необхідна авторизація",
        code: "AUTH_REQUIRED",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Недостатньо прав доступу",
        code: "ACCESS_DENIED",
      });
    }

    next();
  };
};

export { authenticate, optionalAuth, authorize };
