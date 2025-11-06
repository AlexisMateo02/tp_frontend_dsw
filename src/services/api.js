// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  // Verificar si la API está configurada y disponible
  hasApi() {
    return !!this.baseURL && this.baseURL !== '';
  }

  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Si la respuesta no es OK, intentar leer el error
      if (!response.ok) {
        let errorMessage = 'Error en la petición';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      // Si es un error de red (backend no disponible)
      if (error.message === 'Failed to fetch') {
        console.error('No se pudo conectar con el servidor. ¿Está el backend corriendo?');
        throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.');
      }
      console.error('API Error:', error);
      throw error;
    }
  }

  // AUTH
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
    }
    
    return data;
  }

  async register(userData) {
    return await this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return await this.request('/auth/profile');
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('authChanged'));
  }

  // USERS
  async updateUser(userId, userData) {
    return await this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(userId, passwordData) {
    return await this.request(`/users/${userId}/password`, {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
    });
  }

  async uploadAvatar(userId, dataUrl) {
    // Convertir data URL a blob
    const blob = await fetch(dataUrl).then(r => r.blob());
    
    const formData = new FormData();
    formData.append('avatar', blob, 'avatar.jpg');

    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}/avatar`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir avatar');
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }

  // PRODUCTS
  async getProducts(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await this.request(`/products${params ? `?${params}` : ''}`);
  }

  async getProduct(id) {
    return await this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    return await this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return await this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return await this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // ORDERS
  async getOrders() {
    return await this.request('/orders');
  }

  async createOrder(orderData) {
    return await this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // REVIEWS
  async createReview(reviewData) {
    return await this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // FORUM
  async getForumPosts(status = null) {
    const endpoint = status ? `/forum-publishments/status/${status}` : '/forum-publishments';
    return await this.request(endpoint);
  }

  async getActiveForumPosts() {
    return await this.request('/forum-publishments/active');
  }

  async getForumPost(id) {
    return await this.request(`/forum-publishments/${id}`);
  }

  async createForumPost(postData) {
    return await this.request('/forum-publishments', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updateForumPost(id, postData) {
    return await this.request(`/forum-publishments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deleteForumPost(id) {
    return await this.request(`/forum-publishments/${id}`, {
      method: 'DELETE',
    });
  }

  async uploadForumImage(imageDataUrl) {
    // Convertir data URL a blob
    const blob = await fetch(imageDataUrl).then(r => r.blob());
    
    const formData = new FormData();
    formData.append('image', blob, 'forum-image.jpg');

    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch(`${this.baseURL}/forum-publishments/upload-image`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir imagen');
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error uploading forum image:', error);
      throw error;
    }
  }
}

export default new ApiService();