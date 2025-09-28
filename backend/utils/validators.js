const Joi = require('joi');

const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Ім\'я має містити мінімум 2 символи',
    'string.max': 'Ім\'я не може бути довшим за 50 символів',
    'any.required': 'Ім\'я обов\'язкове'
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Прізвище має містити мінімум 2 символи',
    'string.max': 'Прізвище не може бути довшим за 50 символів',
    'any.required': 'Прізвище обов\'язкове'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Введіть коректний email',
    'any.required': 'Email обов\'язковий'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Пароль має містити мінімум 6 символів',
    'any.required': 'Пароль обов\'язковий'
  }),
  phone: Joi.string().pattern(/^\+380\d{9}$/).messages({
    'string.pattern.base': 'Номер телефону має бути у форматі +380XXXXXXXXX'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const orderSchema = Joi.object({
  deliveryType: Joi.string().valid('pickup', 'delivery').required(),
  paymentMethod: Joi.string().valid('cash', 'card', 'online').required(),
  deliveryAddress: Joi.when('deliveryType', {
    is: 'delivery',
    then: Joi.object({
      street: Joi.string().required(),
      building: Joi.string().required(),
      apartment: Joi.string(),
      floor: Joi.number().min(0),
      entrance: Joi.string(),
      intercom: Joi.string(),
      notes: Joi.string()
    }).required(),
    otherwise: Joi.optional()
  }),
  contactPhone: Joi.string().pattern(/^\+380\d{9}$/).required(),
  preferredDeliveryTime: Joi.date().min('now'),
  orderNotes: Joi.string().max(500)
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(422).json({
        success: false,
        message: 'Помилка валідації',
        errors
      });
    }
    next();
  };
};

module.exports = {
  registerSchema,
  loginSchema,
  orderSchema,
  validate
};