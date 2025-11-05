import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SellerProfile() {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const loadSeller = useCallback(() => {
    setLoading(true);

    // Cargar datos del vendedor
    const sellers = JSON.parse(localStorage.getItem('sellers')) || [];
    const found = sellers.find((s) => s.id === Number(sellerId));

    if (!found) {
      toast.error('Vendedor no encontrado');
      setSeller(null);
      setLoading(false);
      return;
    }

    setSeller(found);

    // Cargar productos del vendedor (solo aprobados)
    const allProducts =
      JSON.parse(localStorage.getItem('marketplaceProducts')) || [];
    const products = allProducts.filter(
      (p) => p.sellerId === Number(sellerId) && p.approved
    );
    setSellerProducts(products);

    setLoading(false);
  }, [sellerId]);

  useEffect(() => {
    loadSeller();
  }, [loadSeller]);

  const addToCart = (product) => {
    try {
      const cu = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (!cu) {
        setShowLoginModal(true);
        return;
      }
      const key = `cart-${cu.id || cu.email}`;
      const cart = JSON.parse(localStorage.getItem(key)) || [];
      const existing = cart.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem(key, JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(`${product.Productname} agregado al carrito`);
    } catch (e) {
      console.error(e);
      toast.error('Error al agregar al carrito');
    }
  };

  const addToWishlist = (product) => {
    try {
      const cu = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (!cu) {
        setShowLoginModal(true);
        return;
      }
      const key = `wishlist-${cu.id || cu.email}`;
      const wishlist = JSON.parse(localStorage.getItem(key)) || [];
      if (!wishlist.find((p) => p.id === product.id)) {
        wishlist.push(product);
        localStorage.setItem(key, JSON.stringify(wishlist));
        window.dispatchEvent(new Event('wishlistUpdated'));
        toast.success(`${product.Productname} agregado a favoritos`);
      } else {
        toast.info(`${product.Productname} ya está en favoritos`);
      }
    } catch (e) {
      console.error(e);
      toast.error('Error al agregar a favoritos');
    }
  };

  if (loading) {
    return (
      <div className="container py-5" style={{ marginTop: '100px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="container py-5" style={{ marginTop: '100px' }}>
        <div className="text-center">
          <h2>Vendedor no encontrado</h2>
          <p className="text-muted">
            El vendedor que buscas no existe o fue eliminado
          </p>
          <Link to="/articles" className="btn btn-primary">
            Ver todos los productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ marginTop: '100px' }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header del vendedor */}
      <div className="card shadow-sm mb-5">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-3 text-center">
              <img
                src={seller.logo || '/assets/placeholder-seller.png'}
                alt={seller.businessName}
                className="img-fluid rounded-circle"
                style={{
                  width: 200,
                  height: 200,
                  objectFit: 'cover',
                  border: '4px solid #ddd',
                }}
              />
            </div>

            <div className="col-md-9">
              <div className="d-flex align-items-center mb-2">
                <h1 className="mb-0">{seller.businessName}</h1>
                {seller.verified && (
                  <span className="badge bg-success ms-3">
                    <i className="bi bi-check-circle"></i> Verificado
                  </span>
                )}
              </div>

              <div className="mb-3">
                <span className="text-warning fs-5">
                  {'⭐'.repeat(Math.round(seller.rating || 5))}
                </span>
                <span className="text-muted ms-2">
                  {seller.rating?.toFixed(1) || '5.0'} (
                  {seller.totalReviews || 0} reseñas)
                </span>
              </div>

              <p className="text-muted mb-3">{seller.description}</p>

              <div className="row text-muted">
                <div className="col-md-6">
                  <p className="mb-2">
                    <i className="bi bi-geo-alt"></i> {seller.address}
                  </p>
                  <p className="mb-2">
                    <i className="bi bi-telephone"></i> {seller.phone}
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-2">
                    <i className="bi bi-envelope"></i> {seller.email}
                  </p>
                  <p className="mb-2">
                    <i className="bi bi-calendar"></i> Miembro desde{' '}
                    {new Date(seller.joinedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <button className="btn btn-outline-primary me-2">
                  <i className="bi bi-chat"></i> Contactar
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="bi bi-share"></i> Compartir tienda
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="row mb-5">
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-primary">{sellerProducts.length}</h3>
              <p className="text-muted mb-0">Productos en venta</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-success">
                {sellerProducts.reduce((sum, p) => sum + (p.soldCount || 0), 0)}
              </h3>
              <p className="text-muted mb-0">Productos vendidos</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-warning">
                {seller.rating?.toFixed(1) || '5.0'} ⭐
              </h3>
              <p className="text-muted mb-0">Calificación promedio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Productos del vendedor */}
      <h3 className="mb-4">Productos de {seller.businessName}</h3>

      {sellerProducts.length === 0 ? (
        <div className="alert alert-info">
          Este vendedor aún no tiene productos publicados.
        </div>
      ) : (
        <div className="row">
          {sellerProducts.map((product) => (
            <div className="col-md-3 mb-4" key={product.id}>
              <div className="card h-100 shadow-sm">
                <div
                  className="position-relative"
                  style={{ height: 220, overflow: 'hidden' }}
                >
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.Productname}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  {product.tag && (
                    <span
                      className={`badge position-absolute top-0 end-0 m-2 ${
                        product.tag === 'Nuevo' ? 'bg-danger' : 'bg-success'
                      }`}
                    >
                      {product.tag}
                    </span>
                  )}
                  <div
                    className="position-absolute bottom-0 start-0 end-0 p-2 d-flex justify-content-center gap-2"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                  >
                    <button
                      className="btn btn-sm btn-light"
                      onClick={() => addToWishlist(product)}
                      title="Agregar a favoritos"
                    >
                      <i className="bi bi-heart"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-light"
                      onClick={() => addToCart(product)}
                      title="Agregar al carrito"
                    >
                      <i className="bi bi-cart-plus"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <span className="badge bg-info mb-2">{product.category}</span>
                  <h6 className="card-title">{product.Productname}</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    {product.oldPrice ? (
                      <div>
                        <span className="text-muted text-decoration-line-through me-2">
                          {product.oldPrice}
                        </span>
                        <span className="fw-bold text-primary">
                          {product.price}
                        </span>
                      </div>
                    ) : (
                      <span className="fw-bold">{product.price}</span>
                    )}
                  </div>
                  <div className="mt-2">
                    <small className="text-muted">Stock: {product.stock}</small>
                  </div>
                  <Link
                    to={`/product/${product.id}`}
                    className="btn btn-sm btn-primary w-100 mt-2"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showLoginModal && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="card p-4"
            style={{ maxWidth: 420, width: '90%', textAlign: 'center' }}
          >
            <h5 className="mb-3">Inicia sesión para continuar</h5>
            <p className="mb-3">
              Debes iniciar sesión para agregar productos a favoritos.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('/login');
                }}
              >
                Ir a iniciar sesión
              </button>
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
  );
}
