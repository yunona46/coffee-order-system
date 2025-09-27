// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  MENU: {
    GET_ALL: '/menu',
    GET_BY_ID: (id) => `/menu/${id}`,
    GET_BY_CATEGORY: (category) => `/menu?category=${category}`,
  },
  ORDERS: {
    CREATE: '/orders',
    GET_USER_ORDERS: '/orders/my',
    GET_BY_ID: (id) => `/orders/${id}`,
    CANCEL: (id) => `/orders/${id}`,
  },
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/add',
    UPDATE_ITEM: '/cart/update',
    REMOVE_ITEM: '/cart/remove',
    CLEAR: '/cart/clear',
  }
};

// Статуси замовлень
export const ORDER_STATUSES = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Категорії товарів
export const PRODUCT_CATEGORIES = {
  COFFEE: 'coffee',
  TEA: 'tea',
  DESSERT: 'dessert',
  SNACK: 'snack',
};

// Повідомлення для користувача
export const MESSAGES = {
  SUCCESS: {
    ORDER_CREATED: 'Замовлення успішно створено!',
    LOGIN: 'Ви успішно увійшли в систему',
    REGISTER: 'Реєстрація пройшла успішно',
    ITEM_ADDED: 'Товар додано до кошика',
  },
  ERROR: {
    NETWORK: 'Помилка з\'єднання. Перевірте інтернет.',
    UNAUTHORIZED: 'Вам потрібно увійти в систему',
    SERVER: 'Помилка сервера. Спробуйте пізніше.',
    VALIDATION: 'Перевірте правильність введених даних',
  }
};