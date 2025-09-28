// Форматування ціни
export const formatPrice = (price) => {
  return `${price} ₴`;
};

// Форматування дати
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Форматування часу
export const formatTime = (timeString) => {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Генерація часів для вибору
export const generatePickupTimes = (intervalMinutes = 15, count = 8) => {
  const times = [];
  const now = new Date();
  
  for (let i = 1; i <= count; i++) {
    const time = new Date(now.getTime() + i * intervalMinutes * 60000);
    const timeString = time.toLocaleTimeString('uk-UA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    times.push(timeString);
  }
  
  return times;
};

// Валідація email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Валідація пароля
export const isValidPassword = (password) => {
  return password.length >= 6;
};

// Підрахунок загальної вартості кошика
export const calculateCartTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Підрахунок кількості товарів в кошику
export const calculateCartItemsCount = (items) => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

// Debounce функція для пошуку
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};