import express from "express";
import { body } from "express-validator";
import authController from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { validate, registerSchema, loginSchema, changePasswordSchema, validateObjectId } from "../utils/validators.js";

const router = express.Router();

// Express-validator rules (для backwards compatibility)
const registerValidation = [
  body("firstName").trim().isLength({ min: 2, max: 50 }).withMessage("Ім'я має містити від 2 до 50 символів"),
  body("lastName").trim().isLength({ min: 2, max: 50 }).withMessage("Прізвище має містити від 2 до 50 символів"),
  body("email").isEmail().normalizeEmail().withMessage("Введіть коректний email"),
  body("password").isLength({ min: 6 }).withMessage("Пароль має містити мінімум 6 символів"),
  body("phone").optional().matches(/^\+380\d{9}$/).withMessage("Номер телефону має бути у форматі +380XXXXXXXXX")
];

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Введіть коректний email"),
  body("password").notEmpty().withMessage("Пароль обов'язковий")
];

// Routes з Joi валідацією
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/forgot-password", [
  body("email").isEmail().normalizeEmail().withMessage("Введіть коректний email")
], authController.forgotPassword);

// Protected routes
router.use(authenticate);
router.get("/me", authController.getMe);
router.post("/change-password", validate(changePasswordSchema), authController.changePassword);

export default router;
