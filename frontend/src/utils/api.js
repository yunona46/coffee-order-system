export class ApiError extends Error {
  constructor(message, status, details = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export const createApiClient = (baseURL) => {
  return {
    async request(endpoint, options = {}) {
      const url = `${baseURL}${endpoint}`;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      };

      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(
            errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            errorData
          );
        }

        const data = await response.json();
        return data;
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        
        throw new ApiError(
          'Помилка мережі або сервера недоступний',
          0,
          { originalError: error.message }
        );
      }
    },

    get(endpoint, options = {}) {
      return this.request(endpoint, { method: 'GET', ...options });
    },

    post(endpoint, data, options = {}) {
      return this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        ...options
      });
    },

    put(endpoint, data, options = {}) {
      return this.request(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
        ...options
      });
    },

    delete(endpoint, options = {}) {
      return this.request(endpoint, { method: 'DELETE', ...options });
    }
  };
};