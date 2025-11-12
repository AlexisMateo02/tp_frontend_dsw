// OrderServices es para manejar todas las interacciones relacionadas con las órdenes de compra
//Lo podriamos eliminar ya que duplica lo que ya tenemos en api.js
const API_BASE_URL = 'http://localhost:3000/api';

export const orderService = {
  // Crear una nueva orden
  async createOrder(orderData) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear la orden');
    }

    return await response.json();
  },

  // Obtener una orden por ID
  async getOrderById(orderId) {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    if (!response.ok) throw new Error('Error al obtener la orden');
    return await response.json();
  },

  // Obtener órdenes de un usuario específico
  async getUserOrders(userId) {
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
    if (!response.ok) throw new Error('Error al obtener las órdenes');
    return await response.json();
  }
};