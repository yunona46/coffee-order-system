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
    enum: {
      values: ['espresso', 'americano', 'latte', 'cappuccino', 'frappuccino'],
      message: 'Категорія має бути однією з: espresso, americano, latte, cappuccino, frappuccino'
    }
  },
  price: {
    type: Number,
    required: [true, 'Ціна обов\'язкова'],
    min: [0, 'Ціна не може бути від\'ємною'],
    max: [10000, 'Ціна не може бути більшою за 10000']
  },
  sizes: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    volume: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Ціна розміру не може бути від\'ємною']
    }
  }],
  ingredients: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    trim: true
  }],
  nutritionalInfo: {
    calories: {
      type: Number,
      min: [0, 'Калорії не можуть бути від\'ємними']
    },
    protein: Number,
    fat: Number,
    carbs: Number,
    sugar: Number
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
  },
  popularity: {
    type: Number,
    default: 0,
    min: [0, 'Популярність не може бути від\'ємною'],
    max: [100, 'Популярність не може перевищувати 100']
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  customizations: [{
    name: {
      type: String,
      required: true
    },
    options: [{
      name: String,
      price: {
        type: Number,
        default: 0
      }
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  orderCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Віртуальні поля
menuItemSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0] ? this.images[0].url : null);
});

menuItemSchema.virtual('priceRange').get(function() {
  if (this.sizes.length <= 1) return null;
  
  const prices = this.sizes.map(size => size.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  
  return { min, max };
});

// Індекси
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ available: 1 });
menuItemSchema.index({ price: 1 });
menuItemSchema.index({ popularity: -1 });
menuItemSchema.index({ name: 'text', description: 'text' });
menuItemSchema.index({ createdAt: -1 });

// Middleware
menuItemSchema.pre(/^find/, function(next) {
  this.find({ isActive: { $ne: false } });
  next();
});

// Статичні методи
menuItemSchema.statics.findByCategory = function(category) {
  return this.find({ category, available: true });
};

menuItemSchema.statics.findPopular = function(limit = 10) {
  return this.find({ available: true })
    .sort({ popularity: -1, orderCount: -1 })
    .limit(limit);
};

menuItemSchema.statics.searchByName = function(searchTerm) {
  return this.find({
    $text: { $search: searchTerm },
    available: true
  });
};

module.exports = mongoose.model('MenuItem', menuItemSchema);