/* Se utiliza para gestionar el proceso de pago o finalización de la compra. 
En esta página, los usuarios suelen ingresar sus datos de envío, seleccionar métodos de pago 
y confirmar la compra de los productos que tienen en el carrito.*/
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import mpLogo from './../../assets/mercadopago-logo.webp';

function Checkout() {
  const [deliveryOption, setDeliveryOption] = useState('ship');
  const [cartItems, setCartItems] = useState([]);
  // Campos del formulario (controlados)
  const [contactValue, setContactValue] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('branch1');

  const branches = {
    branch1: {
      name: 'Sucursal 1 - Zona Norte',
      address: 'Vera Mujica 1222, S2000 Rosario, Santa Fe, Argentina',
      hours: 'Lun-Vie 9:00 - 18:00',
      phone: '+232124343',
      notes: 'Retiro en 24-48 horas hábiles',
    },
    branch2: {
      name: 'Sucursal 2 - Zona Centro',
      address: 'Zeballos 1341, S2000 Rosario, Santa Fe, Argentina',
      hours: 'Lun-Sab 10:00 - 19:00',
      phone: '+231219974',
      notes: 'Retiro en 24-48 horas hábiles',
    },
  };

  // Campos de pago
  // Campos de pago (inputs de tarjeta eliminados)
  // const [cardNumber, setCardNumber] = useState('');
  // const [cardExpiry, setCardExpiry] = useState('');
  // const [cardCvc, setCardCvc] = useState('');
  // const [nameOnCard, setNameOnCard] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const cu = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (cu) {
        const key = `cart-${cu.id || cu.email}`;
        const userCart = JSON.parse(localStorage.getItem(key) || '[]');
        setCartItems(userCart.length ? userCart : savedCart);
      } else {
        setCartItems(savedCart);
      }
      // prefill contact if previously saved
      const savedContact = localStorage.getItem('checkout_contact') || '';
      if (savedContact) setContactValue(savedContact);
    } catch (e) {
      console.error(e);
      setCartItems([]);
    }
  }, []);

  // handlePlaceOrder removed; use handleMercadoPago for payment flow

  // Utilidades: funciones de validación
  const isEmail = (s) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());
  };
  const isPhone = (s) => {
    // simple phone check: digits, allow spaces, +, parentheses, dashes
    return /^[+()\d\s-]{7,20}$/.test(String(s).trim());
  };

  // Algoritmo de Luhn para validar números de tarjeta (el código de validación de tarjeta
  // se eliminó porque los inputs de tarjeta fueron removidos del formulario)

  // La validación de expiración fue eliminada porque los campos de tarjeta fueron removidos

  const handleMercadoPago = () => {
    if (!validateOrder()) return;
    setIsSubmitting(true);
    toast.info('Redirigiendo a Mercado Pago...');
    // Abrir Mercado Pago en nueva pestaña (marcador/placeholder). En una integración real
    // aquí harías una llamada a tu backend para crear la preferencia y luego redirigir al checkout.
    window.open('https://www.mercadopago.com.ar/', '_blank');
    // No limpiamos el carrito hasta confirmar pago en un flujo real
    setIsSubmitting(false);
  };

  const validateOrder = () => {
    const errors = [];
    if (!cartItems || cartItems.length === 0)
      errors.push('El carrito está vacío');
    if (!contactValue || (!isEmail(contactValue) && !isPhone(contactValue))) {
      errors.push('Ingrese un email o teléfono válido');
    }
    if (deliveryOption === 'ship') {
      if (!address.trim())
        errors.push('La dirección es obligatoria para envío a domicilio');
      if (!city.trim())
        errors.push('La ciudad es obligatoria para envío a domicilio');
    }
    // Payment by card removed; using 'Pagar al recibir' or similar.

    if (errors.length) {
      // mostrar errores combinados
      toast.error(errors.join(' · '), { autoClose: 5000 });
      return false;
    }
    return true;
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
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
              />
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
                      placeholder="Nombre"
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Apellido"
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

                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="branch"
                        id="branch1"
                        checked={selectedBranch === 'branch1'}
                        onChange={() => setSelectedBranch('branch1')}
                      />
                      <label className="form-check-label" htmlFor="branch1">
                        {branches.branch1.name}
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="branch"
                        id="branch2"
                        checked={selectedBranch === 'branch2'}
                        onChange={() => setSelectedBranch('branch2')}
                      />
                      <label className="form-check-label" htmlFor="branch2">
                        {branches.branch2.name}
                      </label>
                    </div>
                  </div>

                  <div className="card p-3 rounded-3">
                    <h6 className="mb-1">{branches[selectedBranch].name}</h6>
                    <p className="mb-1">
                      <strong>Dirección:</strong>{' '}
                      {branches[selectedBranch].address}
                    </p>
                    <p className="mb-1">
                      <strong>Horario:</strong> {branches[selectedBranch].hours}
                    </p>
                    <p className="mb-1">
                      <strong>Teléfono:</strong>{' '}
                      {branches[selectedBranch].phone}
                    </p>
                    <small className="text-muted">
                      {branches[selectedBranch].notes}
                    </small>
                  </div>
                </div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Dirección"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Código Postal (opcional)"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
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
              <div className="p-3 mb-3 text-center">
                <h6 className="fw-semibold">Forma de pago</h6>
                <img
                  src={mpLogo}
                  alt="Mercado Pago"
                  style={{ maxWidth: 120, marginBottom: 12 }}
                />
              </div>
              <button
                className="btn w-100 mt-4 py-2 fw-semibold"
                onClick={handleMercadoPago}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Procesando...' : 'Pagar con Mercado Pago'}
              </button>

              <div className="mt-5 border-top pt-3">
                <a
                  href="/terms"
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
              <button className="btn w-100 mt-3" onClick={handleMercadoPago}>
                <i className="ri-secure-payment-line me-2"></i> Pagar con
                Mercado Pago
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
