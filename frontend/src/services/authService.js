class AuthService {
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

  async login(credentials) {
    try {
      const response = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      return response;
    } catch (error) {
      // Fallback для демо режиму
      if (credentials.email === 'demo@example.com') {
        return {
          user: {
            id: 1,
            name: 'Демо Користувач',
            email: 'demo@example.com'
          },
          token: 'demo_token_' + Date.now()
        };
      }
      throw error;
    }
  }

  async register(userData) {
    try {
      return await this.makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    } catch (error) {
      // Fallback для демо режиму
      return {
        user: {
          id: Date.now(),
          name: userData.name,
          email: userData.email
        },
        token: 'demo_token_' + Date.now()
      };
    }
  }

  async verifyToken(token) {
    try {
      return await this.makeRequest('/auth/verify');
    } catch (error) {
      // Fallback для демо режиму
      if (token.startsWith('demo_token_')) {
        return {
          id: 1,
          name: 'Демо Користувач',
          email: 'demo@example.com'
        };
      }
      throw error;
    }
  }

  logout() {
    // Очищення локальних даних
    localStorage.removeItem('auth_token');
  }
}

export const authService = new AuthService();