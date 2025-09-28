class OrderService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async createOrder(orderData) {
    try {
      return await this.makeRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
    } catch (error) {
      // Fallback до локального створення
      const order = {
        id: Date.now(),
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        estimatedTime: this.calculateEstimatedTime(orderData.items)
      };
      
      // Збереження в localStorage як backup
      const orders = JSON.parse(localStorage.getItem('local_orders') || '[]');
      orders.unshift(order);
      localStorage.setItem('local_orders', JSON.stringify(orders));
      
      return order;
    }
  }

  async getOrders() {
    try {
      return await this.makeRequest('/orders');
    } catch (error) {
      // Fallback до localStorage
      return JSON.parse(localStorage.getItem('local_orders') || '[]');
    }
  }

  async cancelOrder(orderId) {
    try {
      return await this.makeRequest(`/orders/${orderId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      // Fallback до локального видалення
      const orders = JSON.parse(localStorage.getItem('local_orders') || '[]');
      const updatedOrders = orders.filter(order => order.id !== orderId);
      localStorage.setItem('local_orders', JSON.stringify(updatedOrders));
      return { success: true };
    }
  }

  calculateEstimatedTime(items) {
    const baseTime = 5; // мінімум 5 хвилин
    const itemTime = items.reduce((time, item) => {
      let multiplier = 1;
      
      switch (item.category) {
        case 'coffee':
          multiplier = 2;
          break;
        case 'dessert':
          multiplier = 3;
          break;
        case 'tea':
          multiplier = 1;
          break;
        default:
          multiplier = 1;
      }
      
      return time + (item.quantity * multiplier);
    }, 0);
    
    return Math.max(baseTime, itemTime);
  }
}

export const orderService = new OrderService();