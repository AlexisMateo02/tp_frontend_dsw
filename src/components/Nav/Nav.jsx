import React, { useEffect, useState } from 'react'; //Importa libreria React
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; //Importa Bootstrap JS para funcionalidades interactivas
import { Link } from 'react-router-dom';

function Nav() {
  //Componente Nav
  // Este componente representa la barra de navegación principal de la aplicación.
  // Contiene enlaces a diferentes secciones y funcionalidades de la aplicación.
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  const updateCounts = () => {
    // compute cart and wishlist per current user if available
    let cart = [];
    let wishlist = [];
    try {
      const cu = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (cu) {
        const cartKey = `cart-${cu.id || cu.email}`;
        const wishKey = `wishlist-${cu.id || cu.email}`;
        cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        wishlist = JSON.parse(localStorage.getItem(wishKey)) || [];
      } else {
        cart = [];
        wishlist = [];
      }
    } catch {
      cart = [];
      wishlist = [];
    }
    const totalCartItems = cart.reduce(
      (acc, item) => acc + (item.quantity || 1),
      0
    );
    setCartCount(totalCartItems);
    setWishlistCount(wishlist.length);
  };
  useEffect(() => {
    updateCounts();

    const handleCartUpdate = () => updateCounts();
    const handleWishlistUpdate = () => updateCounts();
    const handleWishlistUpdatesAlt = () => updateCounts();

    window.addEventListener('cartUpdated', handleCartUpdate);
    // listen for both event names (some components dispatch 'wishlistUpdated' and others 'wishlistUpdates')
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    window.addEventListener('wishlistUpdates', handleWishlistUpdatesAlt);

    const onStorageChange = (e) => {
      const k = e.key || '';
      if (
        k === 'cart' ||
        k === 'wishlist' ||
        k.startsWith('cart-') ||
        k.startsWith('wishlist-')
      ) {
        updateCounts();
      }
    };
    window.addEventListener('storage', onStorageChange);

    // load currentUser and listen for auth changes
    try {
      const u = JSON.parse(localStorage.getItem('currentUser') || 'null');
      setCurrentUser(u);
    } catch {
      setCurrentUser(null);
    }
    const onAuth = () => {
      try {
        const u = JSON.parse(localStorage.getItem('currentUser') || 'null');
        // If user just logged in, migrate any global cart/wishlist into per-user keys
        if (u) {
          try {
            const cartKey = `cart-${u.id || u.email}`;
            const wishKey = `wishlist-${u.id || u.email}`;
            const globalCart = JSON.parse(localStorage.getItem('cart') || '[]');
            const userCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
            if (globalCart.length && (!userCart || userCart.length === 0)) {
              localStorage.setItem(cartKey, JSON.stringify(globalCart));
              window.dispatchEvent(new Event('cartUpdated'));
            }

            const globalWish = JSON.parse(
              localStorage.getItem('wishlist') || '[]'
            );
            const userWish = JSON.parse(localStorage.getItem(wishKey) || '[]');
            if (globalWish.length && (!userWish || userWish.length === 0)) {
              localStorage.setItem(wishKey, JSON.stringify(globalWish));
              window.dispatchEvent(new Event('wishlistUpdated'));
            }
          } catch {
            // swallow migration errors
          }
        }
        setCurrentUser(u);
        // update counts after auth change / possible migration
        updateCounts();
      } catch {
        setCurrentUser(null);
        updateCounts();
      }
    };
    window.addEventListener('authChanged', onAuth);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('wishlistUpdates', handleWishlistUpdatesAlt);
      window.removeEventListener('storage', onStorageChange);
      window.removeEventListener('authChanged', onAuth);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    window.dispatchEvent(new Event('authChanged'));
    // navigate to home
    window.location.href = '/';
  };

  return (
    <>
      {/* Navbar principal */}
      <div className="nav w-100 fixed-top bd-white shadow-sm mb-10">
        <nav className="navbar navbar-expand-lg py-3 fixed-top justify-content-between align-items-center w-100 nav-wrapper">
          {/* Toggle button */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Mobile Icons */}
          <ul className="d-lg-none d-flex align-items-center gap-3">
            <li className="nav-item">
              <a href="#">
                <i className="bi bi-search fs-5 text-dark"></i>
              </a>
            </li>
            <li className="nav-item">
              <Link to="/login">
                <i className="bi bi-person fs-5 text-dark"></i>
              </Link>
            </li>
            <li className="nav-item position-relative">
              <a href="#">
                <i className="bi bi-heart fs-5 text-dark"></i>
                <span className="position-absolute top-0 start-100 translate-middle cart-qount rounded-pill">
                  {wishlistCount}
                </span>
              </a>
            </li>
            <li className="nav-item position-relative">
              <a href="#">
                <i className="bi bi-bag fs-5 text-dark"></i>
                <span className="position-absolute top-0 start-100 translate-middle cart-qount rounded-pill">
                  {cartCount}
                </span>
              </a>
            </li>
          </ul>

          {/* Navegador principal */}
          <div
            className="collapse navbar-collapse justify-content-between"
            id="navbarNav"
          >
            {/* Navegador de la izquierda */}
            <ul className="navbar-nav nav-menu align-items-center gap-4">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link">
                  Quienes somos?
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/foro" className="nav-link">
                  Foro Ventas
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/articles" className="nav-link">
                  Nuestros Productos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link">
                  Contactos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/stores" className="nav-link">
                  Tiendas
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  Mi perfil
                </Link>
              </li>
            </ul>
            {/* Center Logo */}
            <Link to="/" className="navbar-brand order-@ d-none d-lg-flex">
              <h2 className="m-@ fw-bold" style={{ letterSpacing: '2px' }}>
                KAYAKS BROKERS
              </h2>
            </Link>

            {/* Right Icons */}
            <ul className="navbar-nav d-none d-lg-flex align-items-center gap-4">
              <li className="nav-item">
                {currentUser ? (
                  <div className="d-flex align-items-center gap-2">
                    <span className="nav-link">
                      Hola, {currentUser.firstName || currentUser.email}
                    </span>
                    <button
                      className="btn nav-link"
                      onClick={logout}
                      style={{
                        padding: '6px 8px',
                        backgroundColor: '#ffffff',
                        borderRadius: '6px',
                        border: '1px solid rgba(0,0,0,0.06)',
                        color: 'inherit',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      aria-label="Cerrar sesión"
                    >
                      <i
                        className="bi bi-box-arrow-right fs-5 "
                        aria-hidden="true"
                      ></i>
                      <span className="visually-hidden">Cerrar sesión</span>
                    </button>
                  </div>
                ) : (
                  <Link to="/login">
                    <i className="bi bi-person fs-5 text-dark"></i>
                  </Link>
                )}
              </li>
              <li className="nav-item position-relative">
                <Link to="/wishlist">
                  <i className="bi bi-heart fs-5 text-dark"></i>
                  <span className="position-absolute top-0 start-100 translate-middle cart-qount rounded-pill">
                    {wishlistCount}
                  </span>
                </Link>
              </li>
              <li className="nav-item position-relative">
                <Link to="/cart">
                  <i className="bi bi-bag fs-5 text-dark"></i>
                  <span className="position-absolute top-0 start-100 translate-middle cart-qount rounded-pill">
                    {cartCount}
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/*
        Sign Up Modal (deshabilitado):
        <div
          className="modal fade"
          id="SignUpModal"
          tabIndex="-1"
          aria-labelledby="SignUpModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold" id="SignUpModalLabel">
                  Ingresa con su cuenta
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ingresa tu nombre"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Ingresa correo electronico"
                      required
                    />
                    <label className="form-label">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Ingresa contraseña"
                      required
                    />
                  </div>
                  <p className="text-muted">
                    Al ingresar, aceptas nuestros&nbsp;
                    <a href="/terms" className="text-success text-decoration-none">
                      Términos
                    </a>
                    &nbsp;y&nbsp;
                    <a href="/terms" className="text-success text-decoration-none">
                      Política de Privacidad
                    </a>
                    .
                  </p>

                  <button type="button" className="btn btn-dark w-100">Ingresar</button>
                </form>
                <div className="text-center mt-3">
                  <p>
                    Ya tiene una cuenta?
                    <a href="/register" className="text-success fw-bold"> Registrarse</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      */}
      {/* antes con esto podiamos iniciar sesion en el mismo navegador 
      pero para hacerlo mas facil el tema de registar e inciar sesion lo hacemos ahora por 
      separado */}
    </>
  );
}

export default Nav;
