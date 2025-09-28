import Joi from "joi";

// User validation schemas
export const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    "string.min": "Ім'я має містити мінімум 2 символи",
    "string.max": "Ім'я не може бути довшим за 50 символів",
    "any.required": "Ім'я обов'язкове"
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    "string.min": "Прізвище має містити мінімум 2 символи",
    "string.max": "Прізвище не може бути довшим за 50 символів",
    "any.required": "Прізвище обов'язкове"
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Введіть коректний email",
    "any.required": "Email обов'язковий"
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Пароль має містити мінімум 6 символів",
    "any.required": "Пароль обов'язковий"
  }),
  phone: Joi.string().pattern(/^\+380\d{9}$/).messages({
    "string.pattern.base": "Номер телефону має бути у форматі +380XXXXXXXXX"
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Введіть коректний email",
    "any.required": "Email обов'язковий"
  }),
  password: Joi.string().required().messages({
    "any.required": "Пароль обов'язковий"
  })
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "any.required": "Поточний пароль обов'язковий"
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "Новий пароль має містити мінімум 6 символів",
    "any.required": "Новий пароль обов'язковий"
  })
});

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).messages({
    "string.min": "Ім'я має містити мінімум 2 символи",
    "string.max": "Ім'я не може бути довшим за 50 символів"
  }),
  lastName: Joi.string().min(2).max(50).messages({
    "string.min": "Прізвище має містити мінімум 2 символи",
    "string.max": "Прізвище не може бути довшим за 50 символів"
  }),
  phone: Joi.string().pattern(/^\+380\d{9}$/).messages({
    "string.pattern.base": "Номер телефону має бути у форматі +380XXXXXXXXX"
  })
});

// Menu item validation schemas
export const menuItemSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    "string.min": "Назва має містити мінімум 1 символ",
    "string.max": "Назва не може бути довшою за 100 символів",
    "any.required": "Назва обов'язкова"
  }),
  description: Joi.string().min(10).max(500).required().messages({
    "string.min": "Опис має містити мінімум 10 символів",
    "string.max": "Опис не може бути довшим за 500 символів",
    "any.required": "Опис обов'язковий"
  }),
  category: Joi.string().valid("espresso", "americano", "latte", "cappuccino", "frappuccino").required().messages({
    "any.only": "Категорія має бути однією з: espresso, americano, latte, cappuccino, frappuccino",
    "any.required": "Категорія обов'язкова"
  }),
  price: Joi.number().min(0).max(10000).required().messages({
    "number.min": "Ціна не може бути від'ємною",
    "number.max": "Ціна не може бути більшою за 10000",
    "any.required": "Ціна обов'язкова"
  }),
  preparationTime: Joi.number().min(1).max(60).required().messages({
    "number.min": "Час приготування має бути мінімум 1 хвилина",
    "number.max": "Час приготування не може перевищувати 60 хвилин",
    "any.required": "Час приготування обов'язковий"
  }),
  available: Joi.boolean().default(true),
  featured: Joi.boolean().default(false)
});

// Cart validation schemas
export const cartItemSchema = Joi.object({
  menuItemId: Joi.string().hex().length(24).required().messages({
    "string.hex": "Невірний ID товару",
    "string.length": "ID товару має містити 24 символи",
    "any.required": "ID товару обов'язковий"
  }),
  quantity: Joi.number().integer().min(1).max(10).required().messages({
    "number.min": "Кількість має бути мінімум 1",
    "number.max": "Максимальна кількість - 10",
    "any.required": "Кількість обов'язкова"
  }),
  size: Joi.string().optional(),
  customizations: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    price: Joi.number().min(0).default(0)
  })).optional(),
  specialInstructions: Joi.string().max(200).optional().messages({
    "string.max": "Інструкції не можуть бути довшими за 200 символів"
  })
});

// Order validation schemas
export const orderSchema = Joi.object({
  deliveryType: Joi.string().valid("pickup", "delivery").required().messages({
    "any.only": "Тип доставки має бути pickup або delivery",
    "any.required": "Тип доставки обов'язковий"
  }),
  paymentMethod: Joi.string().valid("cash", "card", "online").required().messages({
    "any.only": "Метод оплати має бути cash, card або online",
    "any.required": "Метод оплати обов'язковий"
  }),
  deliveryAddress: Joi.when("deliveryType", {
    is: "delivery",
    then: Joi.object({
      street: Joi.string().required().messages({
        "any.required": "Вулиця обов'язкова для доставки"
      }),
      building: Joi.string().required().messages({
        "any.required": "Номер будинку обов'язковий для доставки"
      }),
      apartment: Joi.string().optional(),
      floor: Joi.number().integer().min(0).optional(),
      entrance: Joi.string().optional(),
      intercom: Joi.string().optional(),
      notes: Joi.string().max(200).optional()
    }).required(),
    otherwise: Joi.optional()
  }),
  contactPhone: Joi.string().pattern(/^\+380\d{9}$/).required().messages({
    "string.pattern.base": "Номер телефону має бути у форматі +380XXXXXXXXX",
    "any.required": "Контактний телефон обов'язковий"
  }),
  preferredDeliveryTime: Joi.date().min("now").optional(),
  orderNotes: Joi.string().max(500).optional().messages({
    "string.max": "Коментарі не можуть бути довшими за 500 символів"
  })
});

// Address validation schemas
export const addressSchema = Joi.object({
  name: Joi.string().min(1).max(50).required().messages({
    "string.min": "Назва адреси обов'язкова",
    "string.max": "Назва адреси не може бути довшою за 50 символів",
    "any.required": "Назва адреси обов'язкова"
  }),
  street: Joi.string().min(1).max(100).required().messages({
    "string.min": "Назва вулиці обов'язкова",
    "string.max": "Назва вулиці не може бути довшою за 100 символів",
    "any.required": "Вулиця обов'язкова"
  }),
  building: Joi.string().min(1).max(10).required().messages({
    "string.min": "Номер будинку обов'язковий",
    "string.max": "Номер будинку не може бути довшим за 10 символів",
    "any.required": "Номер будинку обов'язковий"
  }),
  apartment: Joi.string().max(10).optional(),
  floor: Joi.number().integer().min(0).max(100).optional(),
  entrance: Joi.string().max(10).optional(),
  intercom: Joi.string().max(20).optional(),
  notes: Joi.string().max(200).optional(),
  isDefault: Joi.boolean().default(false)
});

// Query parameters validation
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().min(2).max(50).optional()
});

export const menuFilterSchema = paginationSchema.keys({
  category: Joi.string().valid("espresso", "americano", "latte", "cappuccino", "frappuccino", "all").default("all"),
  available: Joi.boolean().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  sortBy: Joi.string().valid("price_asc", "price_desc", "name_asc", "popularity", "newest").default("newest")
});

// Validation middleware
export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { 
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join("."),
        message: detail.message,
        type: detail.type
      }));
      
      return res.status(422).json({
        success: false,
        message: "Помилка валідації даних",
        errors
      });
    }
    
    next();
  };
};

// ObjectId validation
export const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Невірний формат ID",
      code: "INVALID_OBJECT_ID"
    });
  }
  
  next();
};

export default {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  updateProfileSchema,
  menuItemSchema,
  cartItemSchema,
  orderSchema,
  addressSchema,
  paginationSchema,
  menuFilterSchema,
  validate,
  validateObjectId
};
