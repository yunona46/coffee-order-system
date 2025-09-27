import api from '../utils/api';

const authService = {
  // Реєстрація
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Помилка реєстрації');
    }
  },

  // Логін
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Помилка входу');
    }
  },

  // Логаут
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Отримати поточного користувача
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Перевірити чи користувач авторизований
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

export default authService;