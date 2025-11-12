//Componente para que el usuario vea sus ordenes de compra

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    //Obtener el usuario actual desde localStorage para luego buscar sus ordenes y ver si esta logueado
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);

    if (user && user.id) {
      fetchUserOrders(user.id);
    } else {
      setLoading(false);
      toast.error('Debes iniciar sesión para ver tus órdenes');
    }
  }, []);

  // Función para obtener las órdenes del usuario desde el backend
  const fetchUserOrders = async (userId) => {
    try {
      console.log('🔄 Buscando órdenes para usuario ID:', userId);

      const response = await fetch(
        `http://localhost:3000/api/orders/user/${userId}`
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Órdenes recibidas:', result);

      if (result.data) {
        setOrders(result.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      toast.error('Error al cargar tus órdenes');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Función para traducir estados
  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      shipped: 'Enviada',
      delivered: 'Entregada',
      cancelled: 'Cancelada',
    };
    return statusMap[status] || status;
  };

  // Función para obtener clase CSS del estado, por los distintos colores
  const getStatusClass = (status) => {
    const statusClassMap = {
      pending: 'bg-warning text-dark',
      confirmed: 'bg-info',
      shipped: 'bg-primary',
      delivered: 'bg-success',
      cancelled: 'bg-danger',
    };
    return statusClassMap[status] || 'bg-secondary';
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando tus órdenes...</p>
        </div>
      </div>
    );
  }

  //si no hay usuario logueado, mostramos mensaje de acceso requerido
  //igual lo podriamos sacar porque no hay manera de entrar a esta pagina sin estar logueado
  //ya que primero vamos a mi perfil q ahi directamente te dice que te loguees si no lo estas
  if (!currentUser) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h4>Acceso requerido</h4>
          <p>Debes iniciar sesión para ver tus órdenes.</p>
          <Link to="/login" className="btn btn-primary">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  //Diseño de la vista de las ordenes del usuario e invocamos a las funciones antes definidas
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mis Órdenes</h2>
        <Link to="/articles" className="btn btn-outline-primary">
          <i className="bi bi-bag me-2"></i>
          Seguir Comprando
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <h4 className="mt-3">No tienes órdenes</h4>
          <p className="text-muted">Todavía no has realizado ninguna compra.</p>
          <Link to="/articles" className="btn btn-primary">
            Comenzar a Comprar
          </Link>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-12 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Orden: {order.orderNumber}</strong>
                    <span
                      className={`badge ${getStatusClass(order.status)} ms-2`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <small className="text-muted">
                    {formatDate(order.orderDate)}
                  </small>
                </div>

                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="fw-bold">Información de Entrega</h6>
                      <p className="mb-1">
                        <strong>Contacto:</strong> {order.buyerContact}
                      </p>
                      {order.shippingAddress && (
                        <p className="mb-1">
                          <strong>Envío a:</strong> {order.shippingAddress}
                        </p>
                      )}
                      {order.pickUpPoint && (
                        <p className="mb-1">
                          <strong>Retiro en:</strong>{' '}
                          {order.pickUpPoint.storeName} -{' '}
                          {order.pickUpPoint.address}
                        </p>
                      )}
                    </div>

                    <div className="col-md-6">
                      <h6 className="fw-bold">Resumen</h6>
                      <p className="mb-1">
                        <strong>Total:</strong>{' '}
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <p className="mb-1">
                        <strong>Productos:</strong> {order.items?.length || 0}
                      </p>
                      {order.notes && (
                        <p className="mb-1">
                          <strong>Notas:</strong> {order.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Items de la orden */}
                  {order.items && order.items.length > 0 && (
                    <div className="mt-3">
                      <h6 className="fw-bold">Productos</h6>
                      <div className="table-responsive">
                        <table className="table table-sm table-borderless">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th className="text-center">Cantidad</th>
                              <th className="text-end">Precio</th>
                              <th className="text-end">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, index) => (
                              <tr key={index}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    {item.productImage && (
                                      <img
                                        src={item.productImage}
                                        alt={item.productName}
                                        className="rounded me-2"
                                        style={{
                                          width: '40px',
                                          height: '40px',
                                          objectFit: 'cover',
                                        }}
                                      />
                                    )}
                                    <span>{item.productName}</span>
                                  </div>
                                </td>
                                <td className="text-center">{item.quantity}</td>
                                <td className="text-end">
                                  {formatCurrency(
                                    parseFloat(item.priceAtPurchase)
                                  )}
                                </td>
                                <td className="text-end fw-bold">
                                  {formatCurrency(item.subtotal)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="text-end mt-3">
                    <Link
                      to={`/order-confirmation/${order.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      <i className="bi bi-eye me-1"></i>
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default UserOrders;
