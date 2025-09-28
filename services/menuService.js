import MenuItem from "../models/MenuItem.js";
import { AppError } from "../utils/helpers.js";

class MenuService {
  async getAllMenuItems(filters = {}) {
    const {
      category,
      available = true,
      page = 1,
      limit = 20,
    } = filters;

    // Базовий query
    let query = { available };

    // Фільтрація
    if (category && category !== "all") {
      query.category = category;
    }

    // Пагінація
    const skip = (page - 1) * limit;

    // Виконання запиту
    const [items, totalItems] = await Promise.all([
      MenuItem.find(query)
        .sort({ createdAt: -1 })
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
      throw new AppError("Позицію меню не знайдено", 404);
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
    const categories = await MenuItem.distinct("category");
    
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
}

export default new MenuService();
