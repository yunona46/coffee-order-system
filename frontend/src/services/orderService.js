import api from '../utils/api';

const orderService = {
  // Створити замовлення
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw new Error('Помилка створення замовлення');
    }
  },

  // Отримати замовлення користувача
  async getUserOrders() {
    try {
      const response = await api.get('/orders/my');
      return response.data;
    } catch (error) {
      throw new Error('Помилка завантаження замовлень');
    }
  },

  // Отримати замовлення за ID
  async getOrder(id) {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Замовлення не знайдено');
    }
  },

  // Скасувати замовлення
  async cancelOrder(id) {
    try {
      const response = await api.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Помилка скасування замовлення');
    }
  }
};

export default orderService;