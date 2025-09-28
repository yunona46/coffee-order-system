import { AppError } from "../utils/helpers.js";

const handleCastErrorDB = (err) => {
  const message = `Невірний ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Дублікат значення поля: ${value}. Використайте інше значення`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Невірні вхідні дані. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Невірний токен. Увійдіть знову.", 401);

const handleJWTExpiredError = () =>
  new AppError("Термін дії токену закінчився. Увійдіть знову.", 401);

const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, req, res) => {
  // Операційна помилка: надіслати повідомлення клієнту
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code
    });
  }

  // Помилка програмування: не розкривати деталі клієнту
  console.error("ERROR 💥", err);
  return res.status(500).json({
    success: false,
    message: "Щось пішло не так!",
    code: "INTERNAL_SERVER_ERROR"
  });
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError") error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

export default globalErrorHandler;
