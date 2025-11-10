/* Carrito */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import normalizeImagePath from "../../lib/utils/normalizeImagePath";
// Data

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // load current user and user-specific cart
    try {
      const cu = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (!cu) {
        setCartItems([]);
        setShowLoginModal(true);
      } else {
        const key = `cart-${cu.id || cu.email}`;
        const savedCart = JSON.parse(localStorage.getItem(key) || "[]");

        // Actualizar precios del carrito según src/data/Product.json (por id)
        if (Array.isArray(savedCart) && savedCart.length > 0) {
          const marketplaceProducts = JSON.parse(
            localStorage.getItem("marketplaceProducts") || "[]"
          );
          // Static Product.json removed; use marketplace products (approved)
          const combined = [...marketplaceProducts.filter((p) => p.approved)];
          const prodMap = Object.fromEntries(
            combined.map((p) => [String(p.id), p])
          );
          const updated = savedCart.map((item) => {
            const p = prodMap[String(item.id)];
            if (p && p.price) {
              return { ...item, price: p.price };
            }
            return item;
          });
          setCartItems(updated);
          localStorage.setItem(key, JSON.stringify(updated));
        } else {
          setCartItems(savedCart);
        }
      }
    } catch (e) {
      console.error(e);
      setCartItems([]);
    }

    // sincronizar cuando otro componente actualiza el carrito del usuario
    const onCartUpdated = () => {
      try {
        const cu = JSON.parse(localStorage.getItem("currentUser") || "null");
        if (!cu) return setCartItems([]);
        const key = `cart-${cu.id || cu.email}`;
        const next = JSON.parse(localStorage.getItem(key) || "[]");
        setCartItems(next);
      } catch {
        setCartItems([]);
      }
    };
    window.addEventListener("cartUpdated", onCartUpdated);
    return () => window.removeEventListener("cartUpdated", onCartUpdated);
  }, []);

  const updateQuantity = (id, type) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const q = Number(item.quantity ?? 1);
        if (type === "increase") return { ...item, quantity: q + 1 };
        if (type === "decrease" && q > 1) return { ...item, quantity: q - 1 };
      }
      return item;
    });

    setCartItems(updated);
    try {
      const cu = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (cu) {
        const key = `cart-${cu.id || cu.email}`;
        localStorage.setItem(key, JSON.stringify(updated));
      } else {
        localStorage.setItem("cart", JSON.stringify(updated));
      }
    } catch {
      localStorage.setItem("cart", JSON.stringify(updated));
    }
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    try {
      const cu = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (cu) {
        const key = `cart-${cu.id || cu.email}`;
        localStorage.setItem(key, JSON.stringify(updated));
      } else {
        localStorage.setItem("cart", JSON.stringify(updated));
      }
    } catch {
      localStorage.setItem("cart", JSON.stringify(updated));
    }
    window.dispatchEvent(new Event("cartUpdated"));
    toast.error("Item removido del carrito!");
  };

  // Para que entienda "$52.000" o "$1.556,00", igualemente cambiamos todos los precios a $1 para usar una api
  const parsePrice = (p) => {
    const clean = String(p)
      .replace(/[^\d,.-]/g, "") // saca "$" y texto
      .replace(/\.(?=\d{3}(?:\D|$))/g, "") // quita puntos de miles
      .replace(",", "."); // coma a punto
    const num = Number(clean);
    return Number.isFinite(num) ? num : 0;
  };

  const totalQty = cartItems.reduce((acc, it) => acc + (it.quantity ?? 1), 0);
  const totalPrice = cartItems.reduce(
    (acc, it) => acc + parsePrice(it.price) * (it.quantity ?? 1),
    0
  );

  return (
    <>
      <ol className="section-banner py-3 position-relative">
        <li className="position-relative">
          <Link to="/">Inicio</Link>
        </li>
        <li className="position-relative active">
          <a href="#" className="ps-5">
            Carrito
          </a>
        </li>
      </ol>

      <div className="container my-5">
        <div className="text-center mb-4 fw-bold">Tu Carrito</div>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="lead">Tu carrito está vacío</p>
            <Link to="/articles" className="btn mt-3">
              Buscar Productos
            </Link>
          </div>
        ) : (
          <div className="row g4">
            <div className="col-lg-8">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="card shadow-sm border-0 rounded-4 mb-3 p-3"
                >
                  <div className="row align-items-center">
                    <div className="col-3">
                      <img
                        src={normalizeImagePath(item.image)}
                        alt={item.Productname || item.name || ""}
                        className="img-fluid rounded-3"
                      />
                    </div>

                    <div className="col-9 d-flex flex-column flex-md-row justify-content-between align-items-center">
                      <div className="text-start w-100">
                        <h5 className="mb-2">{item.Productname}</h5>
                        <p className="text-muted mb-1">Precio {item.price}</p>
                        <p className="text-muted mb-0">
                          Total $
                          {(
                            parsePrice(item.price) * (item.quantity ?? 1)
                          ).toFixed(2)}
                        </p>
                      </div>

                      <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
                        <button
                          className="btn btn-sm"
                          onClick={() => updateQuantity(item.id, "decrease")}
                        >
                          -
                        </button>
                        <span>{item.quantity ?? 1}</span>
                        <button
                          className="btn btn-sm"
                          onClick={() => updateQuantity(item.id, "increase")}
                        >
                          +
                        </button>
                        <button
                          className="btn btn-sm"
                          onClick={() => removeItem(item.id)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h4 className="fw-bold">Total en Carrito</h4>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Cantidad total Artículos</span>
                  <span>{totalQty}</span> {/* ← suma real */}
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Precio Total</span>
                  <span className="fw-bold">${totalPrice.toFixed(2)}</span>
                </div>
                <Link to="/checkout" className="btn w-100">
                  Seguir con la compra
                </Link>
              </div>
            </div>
          </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        {showLoginModal && (
          <div
            className="modal-backdrop"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1050,
            }}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="card p-4"
              style={{ maxWidth: 420, width: "90%", textAlign: "center" }}
            >
              <h5 className="mb-3">Inicia sesión para continuar</h5>
              <p className="mb-3">
                Debes iniciar sesión para usar un carrito personal.
              </p>
              <div className="d-flex justify-content-center gap-2">
                <Link to="/login" className="btn btn-primary">
                  Ir a iniciar sesión
                </Link>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowLoginModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
