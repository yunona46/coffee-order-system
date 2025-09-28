const MenuItem = require('../models/MenuItem');
const { AppError } = require('../utils/helpers');

class MenuService {
  async getAllMenuItems(filters = {}) {
    const {
      category,
      available,
      minPrice,
      maxPrice,
      sortBy,
      page = 1,
      limit = 20,
      search
    } = filters;

    // Базовий query
    let query = {};

    // Фільтрація
    if (category && category !== 'all') {
      query.category = category;
    }

    if (available !== undefined) {
      query.available = available === 'true';
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ingredients: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Сортування
    let sortOptions = {};
    switch (sortBy) {
      case 'price_asc':
        sortOptions = { price: 1 };
        break;
      case 'price_desc':
        sortOptions = { price: -1 };
        break;
      case 'name_asc':
        sortOptions = { name: 1 };
        break;
      case 'popularity':
        sortOptions = { popularity: -1, orderCount: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Пагінація
    const skip = (page - 1) * limit;

    // Виконання запиту
    const [items, totalItems] = await Promise.all([
      MenuItem.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      MenuItem.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  async getMenuItemById(id) {
    const item = await MenuItem.findById(id);
    
    if (!item) {
      throw new AppError('Позицію меню не знайдено', 404);
    }

    return item;
  }

  async getPopularItems(limit = 10) {
    const items = await MenuItem.findPopular(limit);
    return items;
  }

  async getFeaturedItems() {
    const items = await MenuItem.find({ featured: true, available: true })
      .sort({ popularity: -1 })
      .limit(6);
    
    return items;
  }

  async getMenuCategories() {
    const categories = await MenuItem.distinct('category');
    
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await MenuItem.countDocuments({ 
          category, 
          available: true 
        });
        return { category, count };
      })
    );

    return categoriesWithCount;
  }

  async createMenuItem(itemData) {
    const item = new MenuItem(itemData);
    await item.save();
    return item;
  }

  async updateMenuItem(id, updateData) {
    const item = await MenuItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!item) {
      throw new AppError('Позицію меню не знайдено', 404);
    }

    return item;
  }

  async deleteMenuItem(id) {
    const item = await MenuItem.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!item) {
      throw new AppError('Позицію меню не знайдено', 404);
    }

    return { message: 'Позицію меню деактивовано' };
  }

  async searchMenuItems(searchTerm) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new AppError('Пошуковий запит має містити мінімум 2 символи', 400);
    }

    const items = await MenuItem.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { ingredients: { $in: [new RegExp(searchTerm, 'i')] } }
      ],
      available: true
    }).limit(20);

    return items;
  }
}

module.exports = new MenuService();