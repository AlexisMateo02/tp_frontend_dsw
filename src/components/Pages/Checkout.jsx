/* Se utiliza para gestionar el proceso de pago o finalización de la compra. 
En esta página, los usuarios suelen ingresar sus datos de envío, seleccionar métodos de pago 
y confirmar la compra de los productos que tienen en el carrito.*/
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

function Checkout() {
  const [deliveryOption, setDeliveryOption] = useState('ship');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  const handlePlaceOrder = () => {
    toast.success('Pedido realizado con éxito');
  };

  // Calcular precio total (soporta cantidad opcional y ausencia de precio)
  // Normaliza strings de precio como "$900.000" o "$900,000.00" a number
  const parsePriceString = (priceStr) => {
    if (!priceStr && priceStr !== 0) return 0;
    const s = priceStr.toString().replace(/\$/g, '').trim();
    // Remover puntos (miles) y cambiar coma decimal por punto si existe
    const cleaned = s.replace(/\./g, '').replace(/,/g, '.');
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    const price = parsePriceString(item?.price || '0');
    const qty = Number(item?.quantity || 1);
    return acc + price * qty;
  }, 0);

  const estimatedTax = +(totalPrice * 0.1).toFixed(2);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container my-5 pt-1">
        <div className="row g-4 mt-5">
          <div className="col-lg-7">
            <h5>Contacto</h5>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Email o número de teléfono"
              />
            </div>

            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="newsCheck"
              />
              <label className="form-check-label" htmlFor="newsCheck">
                Deseo recibir noticias y ofertas por email
              </label>
            </div>
            <h5>Envío</h5>
            <div>
              <div className="mb-3">
                <div className="btn-group btn-from w-100" role="group">
                  <input
                    type="radio"
                    className="btn-check"
                    name="deliveryOption"
                    id="ship"
                    checked={deliveryOption === 'ship'}
                    onChange={() => setDeliveryOption('ship')}
                  />
                  <label className="btn ship-btn" htmlFor="ship">
                    Envío a domicilio
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="deliveryOption"
                    id="pickup"
                    checked={deliveryOption === 'pickup'}
                    onChange={() => setDeliveryOption('pickup')}
                  />
                  <label className="btn pickup-btn" htmlFor="pickup">
                    Retirar en tienda
                  </label>
                </div>
              </div>
              {deliveryOption === 'ship' && (
                <div className="row mb-3">
                  <div className="mb-3">
                    <select className="form-select">
                      <option>Rosario</option>
                      <option>Buenos Aires</option>
                      <option>Córdoba</option>
                    </select>
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre (opcional)"
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Apellido (opcional)"
                    />
                  </div>
                </div>
              )}
              {deliveryOption === 'pickup' && (
                <div className="container my-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-semibold mb-0">Ubicación de la tienda</h6>
                    <a href="#" className="text-decoration-none small">
                      Cambiar dirección
                    </a>
                  </div>
                  <div
                    className="alert alert-danger d-flex flex-column rounded-3"
                    role="alert"
                    style={{
                      color: '#7b1c1c',
                      backgroundColor: '#fef6f6',
                      border: '1px solid rgba(145, 137, 137, 0.59)',
                    }}
                  >
                    <div className="d-flex align-items-center mb-1">
                      <i className="bi bi-exclamation-circle-fill me-2"></i>
                      <strong>
                        No hay tiendas disponibles con tus artículos
                      </strong>
                    </div>
                    <div>
                      <a
                        href="#"
                        className="text-decoration-underline"
                        style={{ color: '#7b1c1c' }}
                      >
                        Enviar a dirección
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Dirección"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Depto, Entre calles, etc (opcional)"
              />
            </div>
            <div className="row mb-3">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ciudad"
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Código Postal (opcional)"
                />
              </div>
            </div>
            <div className="form-check mb-4">
              <input
                type="checkbox"
                className="form-check-input"
                id="saveInfo"
              />
              <label htmlFor="saveInfo" className="form-check-label">
                Guardar esta información para la próxima vez
              </label>
            </div>

            <h6>Método de envío</h6>
            <div
              className="rounded-3 p-3 d-flex justify-content-between align-items-center mb-4"
              style={{
                border: '1px solid darkblue',
                backgroundColor: '#f0f5ff',
              }}
            >
              <span> Estándar </span>
              <span className="text-success"> Gratis </span>
            </div>
            <div className="container my-5">
              <h4 className="fw-semibold">Pago</h4>
              <p className="text-muted mb-3">
                Todas las transacciones son seguras y están encriptadas.
              </p>
              <div className="border rounded">
                <div className="bg-light border-bottom d-flex justify-content-between align-items-center p-3">
                  <span className="fw-semibold">Tarjeta de crédito</span>
                  <div
                    className="bg-warning text-white rounded px-2 fw-bold"
                    style={{ fontSize: '0.9rem' }}
                  >
                    B
                  </div>
                </div>
                <div className="p-3 bg-light">
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Número de tarjeta"
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Fecha de vencimiento (MM / AA)"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Código de seguridad"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre en la tarjeta"
                    />
                  </div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="billingCheck"
                      defaultChecked
                    />
                    <label className="form-check-label" htmlFor="billingCheck">
                      Usar la misma dirección para facturación
                    </label>
                  </div>
                </div>
              </div>
              <button className="btn w-100 mt-4 py-2 fw-semibold">
                Pagar ahora
              </button>

              <div className="mt-5 border-top pt-3">
                <a
                  href="#"
                  className="text-decoration-none small text-decoration-underline"
                >
                  Política de privacidad
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold mb-3">
                <i className="ri-shopping-cart-2-line me-2 text-info"></i>{' '}
                Pedido
              </h5>
              {cartItems.length === 0 ? (
                <p className="text-muted">¡Tu carrito está vacío!</p>
              ) : (
                cartItems.map((item) => {
                  const unit = parsePriceString(item.price || '0');
                  const lineTotal = unit * Number(item.quantity || 1);
                  return (
                    <div
                      key={item.id}
                      className="d-flex align-items-center mb-3 border-bottom pb-2"
                    >
                      <img
                        src={item.image}
                        className="rounded"
                        width="60"
                        height="60"
                        style={{ objectFit: 'cover', marginRight: '10px' }}
                        alt=""
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{item.Productname}</h6>
                        <small className="text-muted">
                          Cantidad: {item.quantity}
                        </small>
                      </div>
                      <div className="fw-semibold">
                        {formatCurrency(lineTotal)}
                      </div>
                    </div>
                  );
                })
              )}
              <hr />
              <div className="d-flex justify-content-between small mb-1">
                <span>Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="d-flex justify-content-between small mb-1">
                <span>Envío</span>
                <span>Ingresa la dirección</span>
              </div>
              <div className="d-flex justify-content-between small mb-1">
                <span>Total</span>
                <span>{formatCurrency(totalPrice + estimatedTax)}</span>
              </div>
              <button className="btn w-100 mt-3" onClick={handlePlaceOrder}>
                <i className="ri-secure-payment-line me-2"></i> Realizar pedido
              </button>

              <Link to="/cart" className="btn mt-2 text-decoration-none">
                <i className="ri-arrow-left-line me-1"></i> Volver al carrito
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Checkout;
