/* Se utiliza para mostrar la lista de deseos del usuario. */
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import normalizeImagePath from "../../lib/utils/normalizeImagePath";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const cu = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (cu) {
        const cartKey = `cart-${cu.id || cu.email}`;
        const userCart = JSON.parse(localStorage.getItem(cartKey) || "[]");
        const wishKey = `wishlist-${cu.id || cu.email}`;
        const storedWishlist = JSON.parse(
          localStorage.getItem(wishKey) || "[]"
        );
        setCart(userCart.length ? userCart : storedCart);
        setCurrentUser(cu);
        setWishlist(storedWishlist);
      } else {
        setCart(storedCart);
        setCurrentUser(null);
        setWishlist([]);
      }
    } catch {
      setCart([]);
      setCurrentUser(null);
      setWishlist([]);
    }
  }, []);

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== productId);
    setWishlist(updatedWishlist);
    try {
      const cu = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (cu) {
        const key = `wishlist-${cu.id || cu.email}`;
        localStorage.setItem(key, JSON.stringify(updatedWishlist));
      } else {
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      }
    } catch {
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    }
    window.dispatchEvent(new Event("wishlistUpdated"));
    toast.error("Producto eliminado de la lista de deseos");
  };

  const addToCart = (product) => {
    try {
      const cu = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (!cu) {
        setShowLoginModal(true);
        return;
      }
      const key = `cart-${cu.id || cu.email}`;
      const existingProduct = cart.find((item) => item.id === product.id);
      let updatedCart;
      if (existingProduct) {
        updatedCart = cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...cart, { ...product, quantity: 1 }];
      }
      setCart(updatedCart);
      localStorage.setItem(key, JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
      const productLabel =
        product.Productname ||
        product.ProductName ||
        product.name ||
        "Producto";
      toast.success(`${productLabel} agregado al carrito`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (e) {
      console.error(e);
      toast.error("Error al agregar al carrito");
    }
  };

  // render login modal if needed
  const LoginModal = () => (
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
          Debes iniciar sesión para agregar productos al carrito.
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
  );

  return (
    <>
      <ol className="section-banner py-3 position-relative">
        <li className="position-relative">
          <Link to="/">Inicio</Link>
        </li>
        <li className="position-relative active">
          <Link to="#" className="ps-5">
            Favoritos {/*antes habia escrito Kayaks*/}
          </Link>
        </li>
      </ol>

      <div className="contain my-5">
        <h2 className="text-center fw-bold mb-4">Lista de Deseos ❤️</h2>

        {!currentUser ? (
          <div className="text-center">
            <p className="lead text-muted">
              Debes iniciar sesión para ver y gestionar tus favoritos.
            </p>
            <Link to="/login" className="btn btn-primary">
              Iniciar sesión
            </Link>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center">
            <p className="lead text-muted">Tu lista de deseos está vacía.</p>
            <Link to="/articles" className="btn">
              <i className="ri-shopping-bag-line me-2"></i> Buscar productos
            </Link>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
            {wishlist.map((product) => (
              <div className="col" key={product.id}>
                <div className="card h-100 shadow-sm border-0">
                  <div
                    className="position-relative overflow-hidden"
                    style={{ height: "250px", backgroundColor: "#f8f9fa" }}
                  >
                    <img
                      src={normalizeImagePath(product.image)}
                      className="card-img-top h-100 object-fit-cover"
                      alt=""
                    />
                    {product.tag && (
                      <span
                        className={`badge position-absolute top-0 end-0 m-2 ${
                          product.tag === "New" ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {product.tag}
                      </span>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column text-center">
                    <p className="card-text fs-5 fw-semibold text-dark">
                      {product.price}
                    </p>
                    <h5 className="card-title">{product.Productname}</h5>
                    <div className="md-auto d-flex justify-content-between gap-2">
                      <button
                        className="btn w-100"
                        onClick={() => addToCart(product)}
                      >
                        <i className="ri-shopping-cart-2-line me-1">
                          Agregar al carrito
                        </i>
                      </button>
                      <button
                        className="btn w-100"
                        onClick={() => removeFromWishlist(product.id)}
                      >
                        <i className="ri-shopping-cart-2-line me-1">
                          Eliminar de favoritos
                        </i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showLoginModal && <LoginModal />}
      <ToastContainer />
    </>
  );
}

export default Wishlist;
