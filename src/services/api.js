// Servicio que maneja todas las interacciones con la API backend


// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  // Verificar si la API está configurada y disponible
  hasApi() {
    return !!this.baseURL && this.baseURL !== "";
  }

  getAuthHeaders() {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
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
        let errorMessage = "Error en la petición";
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
      if (error.message === "Failed to fetch") {
        console.error(
          "No se pudo conectar con el servidor. ¿Está el backend corriendo?"
        );
        throw new Error(
          "No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose."
        );
      }
      console.error("API Error:", error);
      throw error;
    }
  }

  // Autenticacion de usuarios
  async login(email, password) {
    const data = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
    }

    return data;
  }

  // Registro de usuarios
  async register(userData) {
    return await this.request("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // Obtener perfil del usuario autenticado
  async getProfile() {
    return await this.request("/auth/profile");
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new Event("authChanged"));
  }

  // Actualizar datos del usuario
  async updateUser(userId, userData) {
    return await this.request(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  // Cambiar contraseña
  async changePassword(userId, passwordData) {
    return await this.request(`/users/${userId}/password`, {
      method: "PATCH",
      body: JSON.stringify(passwordData),
    });
  }

  // Subir avatar de usuario (nos falta y no es algo escencial podes subir una foto
  // lo podemos dejar para el ad y que mas que subir fotos sea una eleccion de avatar predefinida por nosotros o ambas) 
  async uploadAvatar(userId, dataUrl) {
    // Convertir data URL a blob
    const blob = await fetch(dataUrl).then((r) => r.blob());

    const formData = new FormData();
    formData.append("avatar", blob, "avatar.jpg");

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${this.baseURL}/users/${userId}/avatar`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al subir avatar");
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  }

  // PRODUCTS

  // Obtener productos con filtros opcionales
  async getProducts(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await this.request(`/products${params ? `?${params}` : ""}`);
  }

  // Obtener un producto por ID
  async getProduct(id) {
    return await this.request(`/products/${id}`);
  }

  // crear producto
  async createProduct(productData) {
    return await this.request("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  // Actualizar producto
  async updateProduct(id, productData) {
    return await this.request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }

  // Eliminar producto
  async deleteProduct(id) {
    return await this.request(`/products/${id}`, {
      method: "DELETE",
    });
  }

  // ORDENES/ORDERS

  // Obtener órdenes del usuario autenticado
  async getOrders() {
    return await this.request("/orders");
  }

  // Crear una nueva orden
  async createOrder(orderData) {
    return await this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  // REVIEWS (vamos a profundizar en AD ya que las review por ahora solo se guardan en el localstorage)


  //crear una review
  async createReview(reviewData) {
    return await this.request("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  }

  // FORO

  // Obtener publicaciones del foro, con filtro opcional por estado
  async getForumPosts(status = null) {
    const endpoint = status
      ? `/forum-publishments/status/${status}`
      : "/forum-publishments";
    return await this.request(endpoint);
  }

  // Obtener publicaciones activas del foro
  async getActiveForumPosts() {
    return await this.request("/forum-publishments/active");
  }

  // Obtener una publicación del foro por ID
  async getForumPost(id) {
    return await this.request(`/forum-publishments/${id}`);
  }

  // PICK UP POINTS (Tiendas / Puntos de retiro)
  async getPickUpPoints() {
    return await this.request("/pickUpPoints");
  }

  async createForumPost(postData) {
    return await this.request("/forum-publishments", {
      method: "POST",
      body: JSON.stringify(postData),
    });
  }

  // Actualizar una publicación del foro
  async updateForumPost(id, postData) {
    return await this.request(`/forum-publishments/${id}`, {
      method: "PUT",
      body: JSON.stringify(postData),
    });
  }

  // Eliminar una publicación del foro
  async deleteForumPost(id) {
    return await this.request(`/forum-publishments/${id}`, {
      method: "DELETE",
    });
  }

  // Subir imagen para una publicación del foro y su respectivo manejo
  async uploadForumImage(imageDataUrl) {
    // Convertir data URL a blob
    const blob = await fetch(imageDataUrl).then((r) => r.blob());

    const formData = new FormData();
    formData.append("image", blob, "forum-image.jpg");

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `${this.baseURL}/forum-publishments/upload-image`,
        {
          method: "POST",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al subir imagen");
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error("Error uploading forum image:", error);
      throw error;
    }
  }
}

export default new ApiService();
