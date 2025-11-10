import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Si no hay orderId, redirigir al home
  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        console.log('🔄 Buscando orden con ID:', orderId);
        
        const response = await fetch(`http://localhost:3000/api/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('✅ Datos de la orden recibidos:', result);
        
        if (result.data) {
          setOrder(result.data);
        } else {
          throw new Error('No se encontraron datos de la orden');
        }
        
      } catch (err) {
        console.error('❌ Error fetching order:', err);
        setError('No se pudo cargar la información de la orden');
        toast.error('Error al cargar los detalles de la orden');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

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
      minute: '2-digit'
    });
  };

  // Función para traducir estados
  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'shipped': 'Enviada',
      'delivered': 'Entregada',
      'cancelled': 'Cancelada'
    };
    return statusMap[status] || status;
  };

  // Función para obtener clase CSS del estado
  const getStatusClass = (status) => {
    const statusClassMap = {
      'pending': 'bg-warning',
      'confirmed': 'bg-info',
      'shipped': 'bg-primary',
      'delivered': 'bg-success',
      'cancelled': 'bg-danger'
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
          <p className="mt-3">Cargando información de tu orden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h4>Error</h4>
          <p>{error}</p>
          <div className="mt-3">
            <Link to="/" className="btn btn-primary me-2">Volver al Inicio</Link>
            <Link to="/articles" className="btn btn-outline-secondary">Seguir Comprando</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h4>Orden no encontrada</h4>
          <p>La orden solicitada no existe o no se pudo cargar.</p>
          <Link to="/" className="btn btn-primary">Volver al Inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 rounded-4 p-4">
        <div className="text-center mb-4">
          <i className="bi bi-check-circle-fill text-success fs-1"></i>
          <h2 className="mt-3">¡Orden Confirmada!</h2>
          <p className="text-muted">Tu orden ha sido procesada exitosamente</p>
        </div>

        {/* Datos reales de la orden */}
        <div className="row">
          <div className="col-md-6">
            <h5 className="fw-bold mb-3">📦 Detalles de la Orden</h5>
            <div className="mb-2">
              <strong>Número de Orden:</strong> 
              <span className="ms-2 font-monospace">{order.orderNumber}</span>
            </div>
            <div className="mb-2">
              <strong>Fecha:</strong> 
              <span className="ms-2">{formatDate(order.orderDate)}</span>
            </div>
            <div className="mb-2">
              <strong>Total:</strong> 
              <span className="ms-2 fw-bold fs-5 text-success">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
            <div className="mb-2">
              <strong>Estado:</strong> 
              <span className={`badge ${getStatusClass(order.status)} ms-2`}>
                {getStatusText(order.status)}
              </span>
            </div>
          </div>

          <div className="col-md-6">
            <h5 className="fw-bold mb-3">👤 Información de Contacto</h5>
            <div className="mb-2">
              <strong>Contacto:</strong> 
              <span className="ms-2">{order.buyerContact}</span>
            </div>
            
            {order.shippingAddress && (
              <div className="mb-2">
                <strong>🚚 Dirección de envío:</strong> 
                <p className="ms-2 mb-0 text-muted">{order.shippingAddress}</p>
              </div>
            )}

            {order.pickUpPoint && (
              <div className="mb-2">
                <strong>🏪 Retiro en:</strong> 
                <p className="ms-2 mb-0 text-muted">
                  {order.pickUpPoint.storeName || 'Punto de retiro'} - {order.pickUpPoint.address}
                </p>
              </div>
            )}

            {order.notes && (
              <div className="mb-2">
                <strong>📝 Notas:</strong> 
                <p className="ms-2 mb-0 text-muted">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Items de la orden */}
        {order.items && order.items.length > 0 && (
          <div className="mt-4">
            <h5 className="fw-bold mb-3">🛒 Productos</h5>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
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
                              className="rounded me-3"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          )}
                          <span>{item.productName}</span>
                        </div>
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">{formatCurrency(parseFloat(item.priceAtPurchase))}</td>
                      <td className="text-end fw-bold">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end fw-bold">Total:</td>
                    <td className="text-end fw-bold fs-5 text-success">
                      {formatCurrency(order.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        <div className="text-center mt-5">
          <Link to="/articles" className="btn btn-primary me-3">
            <i className="bi bi-bag me-2"></i>
            Seguir Comprando
          </Link>
          <Link to="/user/orders" className="btn btn-outline-primary me-3">
            <i className="bi bi-list-ul me-2"></i>
            Ver Mis Órdenes
            </Link>
          <Link to="/" className="btn btn-outline-secondary">
            <i className="bi bi-house me-2"></i>
            Volver al Inicio
          </Link>
        </div>
      </div>

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

export default OrderConfirmation;