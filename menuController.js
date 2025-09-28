const menuService = require('../services/menuService');
const { asyncHandler } = require('../utils/helpers');

class MenuController {
  getAllItems = asyncHandler(async (req, res) => {
    const result = await menuService.getAllMenuItems(req.query);

    res.json({
      success: true,
      data: result
    });
  });

  getItemById = asyncHandler(async (req, res) => {
    const item = await menuService.getMenuItemById(req.params.id);

    res.json({
      success: true,
      data: { item }
    });
  });

  getPopularItems = asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const items = await menuService.getPopularItems(parseInt(limit) || 10);

    res.json({
      success: true,
      data: { items }
    });
  });

  getFeaturedItems = asyncHandler(async (req, res) => {
    const items = await menuService.getFeaturedItems();

    res.json({
      success: true,
      data: { items }
    });
  });

  getCategories = asyncHandler(async (req, res) => {
    const categories = await menuService.getMenuCategories();

    res.json({
      success: true,
      data: { categories }
    });
  });

  searchItems = asyncHandler(async (req, res) => {
    const { q: searchTerm } = req.query;
    const items = await menuService.searchMenuItems(searchTerm);

    res.json({
      success: true,
      data: { items }
    });
  });

  // Адміністративні методи
  createItem = asyncHandler(async (req, res) => {
    const item = await menuService.createMenuItem(req.body);

    res.status(201).json({
      success: true,
      message: 'Позицію меню створено',
      data: { item }
    });
  });

  updateItem = asyncHandler(async (req, res) => {
    const item = await menuService.updateMenuItem(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Позицію меню оновлено',
      data: { item }
    });
  });

  deleteItem = asyncHandler(async (req, res) => {
    const result = await menuService.deleteMenuItem(req.params.id);

    res.json({
      success: true,
      message: result.message
    });
  });
}

module.exports = new MenuController();