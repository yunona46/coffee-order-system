const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Назва товару обов\'язкова'],
    trim: true,
    maxlength: [100, 'Назва не може бути довшою за 100 символів']
  },
  description: {
    type: String,
    required: [true, 'Опис товару обов\'язковий'],
    maxlength: [500, 'Опис не може бути довшим за 500 символів']
  },
  price: {
    type: Number,
    required: [true, 'Ціна обов\'язкова'],
    min: [0, 'Ціна не може бути від\'ємною']
  },
  category: {
    type: String,
    required: [true, 'Категорія обов\'язкова'],
    enum: {
      values: ['coffee', 'tea', 'dessert', 'snack', 'other'],
      message: 'Недійсна категорія'
    }
  },
  image: {
    type: String,
    default: '☕'
  },
  available: {
    type: Boolean,
    default: true
  },
  ingredients: [{
    type: String
  }],
  allergens: [{
    type: String
  }]
}, {
  timestamps: true
});

// Індекс для швидкого пошуку доступних товарів
menuItemSchema.index({ available: 1, category: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);