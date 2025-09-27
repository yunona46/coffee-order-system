import api from '../utils/api';

const menuService = {
  // Отримати все меню
  async getMenu() {
    try {
      const response = await api.get('/menu');
      return response.data;
    } catch (error) {
      throw new Error('Помилка завантаження меню');
    }
  },

  // Отримати товар за ID
  async getMenuItem(id) {
    try {
      const response = await api.get(`/menu/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Товар не знайдено');
    }
  },

  // Отримати меню за категорією
  async getMenuByCategory(category) {
    try {
      const response = await api.get(`/menu?category=${category}`);
      return response.data;
    } catch (error) {
      throw new Error('Помилка завантаження категорії');
    }
  }
};

export default menuService;