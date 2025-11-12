/* Se utiliza para gestionar el proceso de pago o finalización de la compra. 
En esta página, los usuarios suelen ingresar sus datos de envío, seleccionar métodos de pago 
y confirmar la compra de los productos que tienen en el carrito.*/
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

function Checkout() {
  const [deliveryOption, setDeliveryOption] = useState('ship');
  const [cartItems, setCartItems] = useState([]);
  const [stores, setStores] = useState([]);
  // Campos del formulario (controlados)
  const [contactValue, setContactValue] = useState('');
  const [address, setAddress] = useState('');
  const [selectedPickup, setSelectedPickup] = useState('branch1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  //Tiendas precargadas en Stores, deberian aparecer las creadas por el admin
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

  // Función para crear orden en el backend
  const createOrderInBackend = async (orderData) => {
    try {
      console.log('Enviando orden al backend:', orderData);

      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      console.log(
        'Respuesta del servidor:',
        response.status,
        response.statusText
      );

      if (!response.ok) {
        let errorMessage = 'Error del servidor';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error detallado en createOrderInBackend:', error);

      if (
        error.name === 'TypeError' &&
        error.message.includes('Failed to fetch')
      ) {
        throw new Error(
          'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3000'
        );
      }

      throw error;
    }
  };

  // Cargar carrito y datos iniciales
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

      const savedContact = localStorage.getItem('checkout_contact') || '';
      if (savedContact) setContactValue(savedContact);

      const s = JSON.parse(localStorage.getItem('stores') || '[]');
      if (Array.isArray(s) && s.length > 0) {
        setStores(s);
        setSelectedPickup(`store-${s[0].id}`);
      }
    } catch {
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    const onStoresUpdated = () => {
      try {
        const s = JSON.parse(localStorage.getItem('stores') || '[]'); // deberia ser del backend, trae las tiendas creadas por el admin pero las toma del localstorage
        if (Array.isArray(s) && s.length > 0) {
          setStores(s);
          if (!String(selectedPickup).startsWith('store-')) {
            setSelectedPickup(`store-${s[0].id}`);
          }
        } else {
          setStores([]);
        }
      } catch {
        setStores([]);
      }
    };

    window.addEventListener('storesUpdated', onStoresUpdated);
    return () => window.removeEventListener('storesUpdated', onStoresUpdated);
  }, [selectedPickup]);

  // validar mail
  const isEmail = (s) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());
  };

  //o validar telefono
  const isPhone = (s) => {
    return /^[+()\d\s-]{7,20}$/.test(String(s).trim());
  };

  const handlePlaceOrder = async () => {
    if (!validateOrder()) return;
    setIsSubmitting(true);

    try {
      // Obtener usuario actual
      const cu = JSON.parse(localStorage.getItem('currentUser') || 'null');

      // Preparar datos para el backend
      const orderData = {
        totalAmount: totalPrice,
        buyerContact: contactValue,
        notes: `Método de entrega: ${
          deliveryOption === 'ship' ? 'Envío a domicilio' : 'Retiro en tienda'
        }`,
        userId: cu ? cu.id : undefined,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity || 1,
          priceAtPurchase: item.price,
        })),
      };

      // Depende que elegis Envio a domicilio o Retiro en tienda (PickUpPoint)
      if (deliveryOption === 'ship') {
        // Envío a domicilio → usar shippingAddress
        orderData.shippingAddress = address;
        console.log('✅ Orden con envío a domicilio');
      } else {
        // Retiro en tienda
        if (
          typeof selectedPickup === 'string' &&
          selectedPickup.startsWith('store-')
        ) {
          // Es una tienda creada por el admin
          orderData.pickUpPointId = parseInt(
            selectedPickup.replace('store-', ''),
            10
          );
          console.log(
            '✅ Orden con retiro en tienda (ID:',
            orderData.pickUpPointId,
            ')'
          );
        } else {
          // Para branches predefinidas, mapear a IDs reales
          // IMPORTANTE: Estas branches deben existir como PickUpPoint en tu BD
          const branchMapping = {
            branch1: 1, // ID del PickUpPoint para Sucursal 1
            branch2: 2, // ID del PickUpPoint para Sucursal 2
          };
          orderData.pickUpPointId = branchMapping[selectedPickup];
          console.log('✅ Orden con retiro en branch predefinida');
        }
      }

      console.log('📦 Enviando orden al backend:', orderData);

      // Crear orden en el backend
      const orderResponse = await createOrderInBackend(orderData);

      console.log('🎉 Orden creada exitosamente:', orderResponse);

      // Limpiar carrito después de orden exitosa
      try {
        if (cu) {
          const key = `cart-${cu.id || cu.email}`;
          localStorage.removeItem(key);
        }
        localStorage.removeItem('cart');
        setCartItems([]);

        toast.success(
          '¡Orden creada exitosamente! Número de orden: ' +
            orderResponse.data.orderNumber
        );

        // Redirigir a página de confirmación
        setTimeout(() => {
          if (orderResponse.data && orderResponse.data.id) {
            navigate(`/order-confirmation/${orderResponse.data.id}`);
          } else {
            navigate('/order-confirmation/success');
          }
        }, 2000);
      } catch (cleanupError) {
        console.error('Error limpiando carrito:', cleanupError);
      }
    } catch (error) {
      console.error('❌ Error en handlePlaceOrder:', error);

      // Manejo específico de errores y sus respectivas notificaciones
      // el error recibido lo determinamos en base al mensaje que nos devuelve el backend
      if (error.message.includes('Stock insuficiente')) {
        toast.error(
          'Algunos productos no tienen stock suficiente. Por favor, actualiza tu carrito.'
        );
        window.dispatchEvent(new Event('cartUpdated'));
      } else if (error.message.includes('Producto no encontrado')) {
        toast.error('Algunos productos ya no están disponibles.');
      } else if (error.message.includes('No se pudo conectar')) {
        toast.error('Error de conexión: ' + error.message);
      } else if (
        error.message.includes('dirección de envío y punto de retiro')
      ) {
        toast.error('Error en los datos de envío: ' + error.message);
      } else {
        toast.error(
          error.message ||
            'Error al crear la orden. Por favor, intenta nuevamente.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Validar datos del formulario antes de enviar, cosas que pueden faltan completar y 
  ese estilo, lo de stock no porque el error de stock nos lo tira el backend que 
  lo hicimos en el paso anterior con todos los if y else. */
  const validateOrder = () => {
    const errors = []; //si el array tiene algo, hay errores

    if (!cartItems || cartItems.length === 0) {
      errors.push('El carrito está vacío');
    }

    if (!contactValue || (!isEmail(contactValue) && !isPhone(contactValue))) {
      errors.push('Ingrese un email o teléfono válido');
    }

    if (deliveryOption === 'ship') {
      if (!address.trim()) {
        errors.push('La dirección es obligatoria para envío a domicilio');
      } else if (address.length < 10) {
        errors.push('La dirección debe tener al menos 10 caracteres');
      }
    }

    if (deliveryOption === 'pickup') {
      let selectedData = null;
      if (selectedPickup && String(selectedPickup).startsWith('store-')) {
        const id = Number(String(selectedPickup).replace('store-', ''));
        selectedData = stores.find((x) => Number(x.id) === id) || null;
      } else if (selectedPickup) {
        selectedData = branches[selectedPickup] || null;
      }
      if (!selectedData) {
        errors.push('Selecciona una tienda para retirar tu pedido');
      }
    }

    if (errors.length) {
      toast.error(errors.join(' · '), { autoClose: 5000 });
      return false;
    }
    return true;
  };

  // Calcular precio total
  const parsePriceString = (priceStr) => {
    if (!priceStr && priceStr !== 0) return 0;
    const s = priceStr.toString().replace(/\$/g, '').trim();
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

  //Diseño del componente Checkout
  return (
    <>
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
                required
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

              {deliveryOption === 'pickup' && (
                <div className="container my-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-semibold mb-0">Ubicación de la tienda</h6>
                  </div>

                  <div className="mb-3">
                    {stores && stores.length > 0
                      ? stores.map((s) => (
                          <div className="form-check" key={`store-${s.id}`}>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="branch"
                              id={`store-${s.id}`}
                              checked={selectedPickup === `store-${s.id}`}
                              onChange={() =>
                                setSelectedPickup(`store-${s.id}`)
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`store-${s.id}`}
                            >
                              {s.name}
                            </label>
                          </div>
                        ))
                      : Object.keys(branches).map((k) => (
                          <div className="form-check" key={k}>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="branch"
                              id={k}
                              checked={selectedPickup === k}
                              onChange={() => setSelectedPickup(k)}
                            />
                            <label className="form-check-label" htmlFor={k}>
                              {branches[k].name}
                            </label>
                          </div>
                        ))}
                  </div>

                  <div className="card p-3 rounded-3">
                    {(() => {
                      if (
                        selectedPickup &&
                        String(selectedPickup).startsWith('store-')
                      ) {
                        const id = Number(
                          String(selectedPickup).replace('store-', '')
                        );
                        const s = stores.find((x) => Number(x.id) === id);
                        if (s) {
                          return (
                            <>
                              <h6 className="mb-1">{s.name}</h6>
                              <p className="mb-1">
                                <strong>Dirección:</strong> {s.address}
                              </p>
                              <p className="mb-1">
                                <strong>Horario:</strong> {s.hours || '—'}
                              </p>
                              <p className="mb-1">
                                <strong>Teléfono:</strong> {s.phone || '—'}
                              </p>
                            </>
                          );
                        }
                      }
                      const b = branches[selectedPickup] || branches.branch1;
                      return (
                        <>
                          <h6 className="mb-1">{b.name}</h6>
                          <p className="mb-1">
                            <strong>Dirección:</strong> {b.address}
                          </p>
                          <p className="mb-1">
                            <strong>Horario:</strong> {b.hours}
                          </p>
                          <p className="mb-1">
                            <strong>Teléfono:</strong> {b.phone}
                          </p>
                          <small className="text-muted">{b.notes}</small>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

            {deliveryOption === 'ship' && (
              <>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Dirección completa"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  <small className="text-muted">Mínimo 10 caracteres</small>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Depto, piso, entre calles, etc. (opcional)"
                  />
                </div>
              </>
            )}

            <h6>Método de envío</h6>
            <div
              className="rounded-3 p-3 d-flex justify-content-between align-items-center mb-4"
              style={{
                border: '1px solid darkblue',
                backgroundColor: '#f0f5ff',
              }}
            >
              <span>Estándar</span>
              <span className="text-success">Gratis</span>
            </div>

            <div className="container my-5">
              <h4 className="fw-semibold">Pago</h4>
              <p className="text-muted mb-3">
                Todas las transacciones son seguras y están encriptadas.
              </p>
              <div className="p-3 mb-3 text-center">
                <h6 className="fw-semibold">Forma de pago</h6>
                <p className="text-muted">
                  Selecciona 'Finalizar pedido' para completar la compra. El
                  pago se coordinará posteriormente.
                </p>
              </div>

              <button
                className="btn w-100 mt-4 py-2 fw-semibold"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || cartItems.length === 0}
                style={{
                  backgroundColor: isSubmitting ? '#6c757d' : '#0d6efd',
                  borderColor: isSubmitting ? '#6c757d' : '#0d6efd',
                }}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Procesando...
                  </>
                ) : (
                  'Finalizar pedido'
                )}
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
                        alt={item.Productname}
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
                <span className="text-success">Gratis</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="fw-bold">Total</span>
                <span className="fw-bold fs-5">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              <button
                className="btn w-100 mt-3"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || cartItems.length === 0}
              >
                <i className="ri-secure-payment-line me-2"></i> Finalizar pedido
              </button>

              <Link
                to="/cart"
                className="btn btn-outline-secondary mt-2 text-decoration-none w-100"
              >
                <i className="ri-arrow-left-line me-1"></i> Volver al carrito
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
