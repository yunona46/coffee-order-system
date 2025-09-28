const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Назва напою обов\'язкова'],
    trim: true,
    maxlength: [100, 'Назва не може бути довшою за 100 символів']
  },
  description: {
    type: String,
    required: [true, 'Опис напою обов\'язковий'],
    trim: true,
    maxlength: [500, 'Опис не може бути довшим за 500 символів']
  },
  category: {
    type: String,
    required: [true, 'Категорія обов\'язкова'],
    enum: ['espresso', 'americano', 'latte', 'cappuccino', 'frappuccino']
  },
  price: {
    type: Number,
    required: [true, 'Ціна обов\'язкова'],
    min: [0, 'Ціна не може бути від\'ємною'],
    max: [10000, 'Ціна не може бути більшою за 10000']
  },
  available: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    required: [true, 'Час приготування обов\'язковий'],
    min: [1, 'Час приготування має бути мінімум 1 хвилина'],
    max: [60, 'Час приготування не може перевищувати 60 хвилин']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
