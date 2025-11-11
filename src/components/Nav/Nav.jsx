// Este componente representa la barra de navegación principal de la aplicación.
// Contiene enlaces a diferentes secciones y funcionalidades de la aplicación.

import React, { useEffect, useState } from 'react'; //Importa libreria React
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; //Importa Bootstrap JS para funcionalidades interactivas
import { Link } from 'react-router-dom';

// Definimos Componente Nav
function Nav() {
  // Estados para contar items en carrito, lista de deseos y para el usuario actual
  const [cartCount, setCartCount] = useState(0); // Inicializa el estado del contador de carrito en 0
  const [wishlistCount, setWishlistCount] = useState(0); // Inicializa el estado del contador de lista de deseos en 0
  const [currentUser, setCurrentUser] = useState(null); // Inicializa el estado del usuario actual en null

  // Función para actualizar los contadores de carrito y lista de deseos
  const updateCounts = () => {
    let cart = []; // Inicializa el carrito como un array vacío
    let wishlist = []; // Inicializa la lista de deseos como un array vacío
    try {
      const cu = JSON.parse(localStorage.getItem('currentUser') || 'null'); // Obtiene el usuario actual del localStorage
      if (cu) {
        // Si hay un usuario actual. actualiza carrito y lista de desesos correspondientes a ese usuario
        const cartKey = `cart-${cu.id || cu.email}`;
        const wishKey = `wishlist-${cu.id || cu.email}`;
        cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        wishlist = JSON.parse(localStorage.getItem(wishKey)) || [];
        // Si no encontro el usuario ingresado deja los arrays vacios
      } else {
        cart = [];
        wishlist = [];
      }
      //si ocurre algun error en el try pasa al catch y deja los arrays vacios
    } catch {
      cart = [];
      wishlist = [];
    }
    // Calcula el total de items en el carrito sumando las cantidades
    const totalCartItems = cart.reduce(
      (acc, item) => acc + (item.quantity || 1),
      0
    );
    // Actualiza los estados con los nuevos contadores
    setCartCount(totalCartItems);
    setWishlistCount(wishlist.length);
  }; // Termina funcion que se dedica a actualizar los contadores

  // useEffect para inicializar y escuchar cambios en carrito, lista de deseos y autenticación
  useEffect(() => {
    updateCounts(); // Llama a funcion definida antes para actualizar contadores

    //Define handlers/manejadores que sirven que para cuando pasa algo en el carrito o wishlist
    // y se vuelvan a actualizar los contadores, por ejemplo cuando se agrega un item se vuelven a refrescar
    const handleCartUpdate = () => updateCounts();
    const handleWishlistUpdate = () => updateCounts();
    const handleWishlistUpdatesAlt = () => updateCounts();

    // Agrega event listeners para detectar cambios en carrito y lista de deseos
    window.addEventListener('cartUpdated', handleCartUpdate); //si se escucha que se actualizo el carrito (cartUpdated) llama a la funcion handler para actualizar contadores
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    window.addEventListener('wishlistUpdates', handleWishlistUpdatesAlt);

    // sirve para mantener contadores sincronizados cuando el carrito/wishlist cambian en otra pestaña
    //es decir que si yo tengo dos pestañas abiertas y en una agrego un item al carrito, en la otra pestaña se actualiza el contador automaticamente
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

    // Intento de leer al usuario actual desde localStorage y guardarlo en estado
    try {
      const u = JSON.parse(localStorage.getItem('currentUser') || 'null'); // Obtiene el usuario actual del localStorage y se guarda en u, por ejemplo el JSON puede recibir un {"id":1,"name":"Rafi"}
      setCurrentUser(u); // Actualiza el estado del usuario actual con u, como actual usuario
    } catch {
      //esto es por si oucrre algun error en el try, se actualiza como null
      setCurrentUser(null);
    }

    // Escucha cambios en la autenticación (login/logout)
    const onAuth = () => {
      try {
        const u = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (u) {
          //si u existe, es decir si hay un usuario logueado
          // va a intentar migrar carrito y wishlist globales a los específicos del usuario si es necesario
          // (igual no se puede poner cosas en favorito o carrito sin estar logueado)
          try {
            const cartKey = `cart-${u.id || u.email}`;
            const wishKey = `wishlist-${u.id || u.email}`;
            const globalCart = JSON.parse(localStorage.getItem('cart') || '[]'); // carrito global, lo podriamos sacar
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
            // no hacer nada si hay error
          }
        }
        setCurrentUser(u);
        // actualiza contadores despues de cambio de auth / posible migracion
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

  // Función para cerrar sesión del usuario
  const logout = () => {
    localStorage.removeItem('currentUser'); // Elimina el usuario actual del localStorage
    setCurrentUser(null); // Actualiza el estado del usuario actual a null
    window.dispatchEvent(new Event('authChanged')); // Notifica a otros componentes que la autenticación ha cambiado
    window.location.href = '/'; // vuelve a la página de inicio
  };

  // El diseño de los elementos de la barra de navegacion se realiza todo aca, y es lo que nos estaria mostrando en pantalla la funcion Nav
  return (
    <>
      {/* Navbar principal */}
      <div className="nav w-100 fixed-top bd-white shadow-sm mb-10">
        <nav className="navbar navbar-expand-lg py-3 fixed-top justify-content-between align-items-center w-100 nav-wrapper">
          {/* Boton que aparece en pantallas pequeñas para desplegar el menu */}
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

          {/* iconos que aparecen en pantallas pequeñas: persona, corazon y bolsa*/}
          <ul className="d-lg-none d-flex align-items-center gap-3">
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
            {/* Logo central Kayaks Brokers*/}
            <Link to="/" className="navbar-brand order-@ d-none d-lg-flex">
              <h2 className="m-@ fw-bold" style={{ letterSpacing: '2px' }}>
                KAYAKS BROKERS
              </h2>
            </Link>

            {/* Iconos o parte del navegador de la derecha -> los mismos que estaban para pantallas pequeñas */}
            <ul className="navbar-nav d-none d-lg-flex align-items-center gap-4">
              <li className="nav-item">
                {currentUser ? (
                  <div className="d-flex align-items-center gap-2">
                    <span className="nav-link">
                      Hola, {currentUser.firstName || currentUser.email}{' '}
                      {/*para cuando inicias sesion te muestre un mensaje de bienvenida*/}
                    </span>
                    <button
                      className="btn" //saque nav-link para que no se vea raro el boton con ese efecto
                      onClick={
                        logout
                      } /*boton que al hacer click llama a la funcion logout para cerrar sesion*/
                      style={{
                        padding: '6px 8px',
                        backgroundColor: '#ffffff',
                        borderRadius: '6px',
                        border: '1px solid rgba(0, 0, 0, 1)',
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
    </>
  );
}

export default Nav;
