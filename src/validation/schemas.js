const Joi = require('joi');

const registerSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required().messages({
        'string.min': 'Ім\'я повинно містити мінімум 2 символи',
        'string.max': 'Ім\'я повинно містити максимум 50 символів',
        'any.required': 'Ім\'я є обов\'язковим полем'
    }),
    lastName: Joi.string().min(2).max(50).required().messages({
        'string.min': 'Прізвище повинно містити мінімум 2 символи',
        'string.max': 'Прізвище повинно містити максимум 50 символів',
        'any.required': 'Прізвище є обов\'язковим полем'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Введіть коректний email',
        'any.required': 'Email є обов\'язковим полем'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Пароль повинен містити мінімум 6 символів',
        'any.required': 'Пароль є обов\'язковим полем'
    }),
    phone: Joi.string().pattern(/^\+380\d{9}$/).optional().messages({
        'string.pattern.base': 'Телефон повинен бути у форматі +380XXXXXXXXX'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const menuItemSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).required(),
    category: Joi.string().valid('espresso', 'americano', 'latte', 'cappuccino', 'frappuccino').required(),
    price: Joi.number().min(0).required(),
    available: Joi.boolean().default(true)
});

const orderSchema = Joi.object({
    deliveryType: Joi.string().valid('pickup', 'delivery').required(),
    paymentMethod: Joi.string().valid('cash', 'card', 'online').required(),
    contactPhone: Joi.string().required()
});

module.exports = {
    registerSchema,
    loginSchema,
    menuItemSchema,
    orderSchema
};
