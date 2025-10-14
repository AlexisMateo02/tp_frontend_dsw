import React, { useEffect, useState } from 'react'; //Importa libreria React
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; //Importa Bootstrap JS para funcionalidades interactivas
import { Link } from 'react-router-dom';

function Nav() {
  //Componente Nav
  // Este componente representa la barra de navegación principal de la aplicación.
  // Contiene enlaces a diferentes secciones y funcionalidades de la aplicación.
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const updateCounts = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
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

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    const onStorageChange = (e) => {
      if (e.key === 'cart' || e.key === 'wishlist') {
        updateCounts();
      }
    };
    window.addEventListener('storage', onStorageChange);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('storage', onStorageChange);
    };
  }, []);

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

          {/* Mobile Logo */}
          <Link
            to="/"
            className="navbar-brand mx-auto order-0 d-lg-none d-flex"
          >
            <h2 className="m-0 fw-bold" style={{ letterSpacing: '2px' }}>
              {' '}
              KAYAKS BROKERS
            </h2>
          </Link>

          {/* Mobile Icons */}
          <ul className="d-lg-none d-flex align-items-center gap-3">
            <li className="nav-item">
              <a href="#">
                <i className="bi bi-search fs-5 text-dark"></i>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" data-bs-toggle="modal" data-bs-target="#SignUpModal">
                <i className="bi bi-person fs-5 text-dark"></i>
              </a>
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

          {/* Main Nav */}
          <div
            className="collapse navbar-collapse justify-content-between"
            id="navbarNav"
          >
            {/* Left Nav */}
            <ul className="navbar-nav nav-menu align-items-center gap-4">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link">
                  Quienes Somos?
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/shop" className="nav-link">
                  Vender productos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/articles" className="nav-link">
                  Productos
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
                <Link to="/articles" className="nav-link">
                  <i className="bi bi-search fs-5 text-dark"></i>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#SignUpModal"
                >
                  <i className="bi bi-person fs-5 text-dark"></i>
                </Link>
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

      {/*Sign Up Modal*/}
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
                  <a href="#" className="text-success text-decoration-none">
                    Términos
                  </a>
                  &nbsp;y&nbsp;
                  <a href="#" className="text-success text-decoration-none">
                    Política de Privacidad
                  </a>
                  .
                </p>

                <button type="button" className="btn btn-dark w-100">
                  Ingresar
                </button>
              </form>
              <div className="text-center mt-3">
                <p>
                  Ya tiene una cuenta?
                  <a href="#" className="text-success fw-bold">
                    {' '}
                    Registrarse
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Nav;
