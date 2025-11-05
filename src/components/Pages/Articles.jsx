import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Products from '../../data/Product.json';
import KayakTypes from '../../data/KayakTypes.json';
import SUPTypes from '../../data/SUPTypes.json';
import BoatTypes from '../../data/BoatTypes.json';
import ArticleTypes from '../../data/ArticleTypes.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const buttons = [
  { label: 'Kayaks', img: 'src/assets/Kayaks.webp', category: 'kayak' },
  {
    label: 'Embarcaciones',
    img: 'src/assets/Embarcaciones.png',
    category: 'embarcacion',
  },
  { label: 'SUP', img: 'src/assets/SUP.webp', category: 'sup' },
  {
    label: 'Artículos',
    img: 'src/assets/Articulos.webp',
    category: 'articulo',
  },
];

function parsePrice(s) {
  if (!s) return 0;
  const digits = String(s).replace(/[^\d]/g, '');
  return Number(digits) || 0;
}

export default function Articles() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filterSortOption, setFilterSortOption] = useState('all');
  const [sortOption, setSortOption] = useState('none');
  const [search, setSearch] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onAuth = () => {};
    window.addEventListener('authChanged', onAuth);
    return () => window.removeEventListener('authChanged', onAuth);
  }, []);

  // Nuevos filtros específicos
  const [brandFilter, setBrandFilter] = useState('all');
  const [materialFilter, setMaterialFilter] = useState('all');
  const [paddlersFilter, setPaddlersFilter] = useState('all');
  const [allProducts, setAllProducts] = useState([]);

  //const navigate = useNavigate();

  useEffect(() => {
    // Combinar productos del JSON con productos del marketplace
    const marketplaceProducts =
      JSON.parse(localStorage.getItem('marketplaceProducts')) || [];
    const approvedMarketplace = marketplaceProducts.filter((p) => p.approved);

    // Agregar sellerId por defecto a productos del JSON
    const jsonProducts = Products.map((p) => ({
      ...p,
      sellerId: p.sellerId || 0,
      sellerName: p.sellerName || 'KBR',
      approved: true,
    }));

    const combined = [...jsonProducts, ...approvedMarketplace];
    setAllProducts(combined);
  }, []);

  const toggleCategory = (label, category) => {
    const newActive = activeCategory === label ? null : label;
    setActiveCategory(newActive);
    setCategoryFilter(newActive ? category : 'all');

    // Resetear filtros específicos al cambiar categoría
    setBrandFilter('all');
    setMaterialFilter('all');
    setPaddlersFilter('all');

    setTimeout(() => {
      const el = document.querySelector('.products-grid');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Obtener opciones de filtros dinámicamente según la categoría
  const filterOptions = useMemo(() => {
    let brands = new Set();
    let materials = new Set();
    let paddlers = new Set();

    if (categoryFilter === 'kayak') {
      KayakTypes.forEach((k) => {
        brands.add(k.brand);
        materials.add(k.material);
        paddlers.add(k.paddlersQuantity);
      });
    } else if (categoryFilter === 'sup') {
      SUPTypes.forEach((s) => {
        brands.add(s.brand);
        materials.add(s.material);
        paddlers.add(s.paddlersQuantity);
      });
    } else if (categoryFilter === 'embarcacion') {
      BoatTypes.forEach((b) => {
        brands.add(b.brand);
        materials.add(b.material);
        paddlers.add(b.passengerCapacity);
      });
    }

    return {
      brands: Array.from(brands).sort(),
      materials: Array.from(materials).sort(),
      paddlers: Array.from(paddlers).sort((a, b) => a - b),
    };
  }, [categoryFilter]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    let items = allProducts.filter((p) => {
      // Filtro por categoría
      if (categoryFilter !== 'all' && p.category !== categoryFilter)
        return false;

      // Filtro por tag (nuevo/oferta)
      if (filterSortOption === 'new') {
        if (!p.tag) return false;
        const t = String(p.tag).toLowerCase();
        if (t !== 'nuevo' && t !== 'new') return false;
      }
      if (filterSortOption === 'sale') {
        if (!p.tag) return false;
        const t = String(p.tag).toLowerCase();
        if (t !== 'oferta' && t !== 'sale') return false;
      }

      // Filtros específicos por tipo de producto
      if (categoryFilter === 'kayak' && p.kayakTypeId) {
        const kayakType = KayakTypes.find((k) => k.id === p.kayakTypeId);
        if (kayakType) {
          if (brandFilter !== 'all' && kayakType.brand !== brandFilter)
            return false;
          if (materialFilter !== 'all' && kayakType.material !== materialFilter)
            return false;
          if (
            paddlersFilter !== 'all' &&
            kayakType.paddlersQuantity !== Number(paddlersFilter)
          )
            return false;
        }
      }

      if (categoryFilter === 'sup' && p.supTypeId) {
        const supType = SUPTypes.find((s) => s.id === p.supTypeId);
        if (supType) {
          if (brandFilter !== 'all' && supType.brand !== brandFilter)
            return false;
          if (materialFilter !== 'all' && supType.material !== materialFilter)
            return false;
          if (
            paddlersFilter !== 'all' &&
            supType.paddlersQuantity !== Number(paddlersFilter)
          )
            return false;
        }
      }

      if (categoryFilter === 'embarcacion' && p.boatTypeId) {
        const boatType = BoatTypes.find((b) => b.id === p.boatTypeId);
        if (boatType) {
          if (brandFilter !== 'all' && boatType.brand !== brandFilter)
            return false;
          if (materialFilter !== 'all' && boatType.material !== materialFilter)
            return false;
          if (
            paddlersFilter !== 'all' &&
            boatType.passengerCapacity !== Number(paddlersFilter)
          )
            return false;
        }
      }

      // Búsqueda por texto
      if (q) {
        const name = p.Productname ? p.Productname.toLowerCase() : '';
        const tag = p.tag ? p.tag.toLowerCase() : '';
        const desc = p.description ? p.description.toLowerCase() : '';
        return name.includes(q) || tag.includes(q) || desc.includes(q);
      }

      return true;
    });

    // Ordenamiento
    if (sortOption === 'price-asc')
      items.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (sortOption === 'price-desc')
      items.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));

    return items;
  }, [
    allProducts,
    categoryFilter,
    filterSortOption,
    search,
    sortOption,
    brandFilter,
    materialFilter,
    paddlersFilter,
  ]);

  const addToCart = (product, qty = 1) => {
    try {
      const cu = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (!cu) {
        setShowLoginModal(true);
        return;
      }
      const key = `cart-${cu.id || cu.email}`;
      const cart = JSON.parse(localStorage.getItem(key)) || [];
      const idx = cart.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        cart[idx].quantity = (cart[idx].quantity || 1) + qty;
        toast.info(`${product.Productname} actualizado en el carrito`);
      } else {
        cart.push({ ...product, quantity: qty });
        toast.success(`${product.Productname} agregado al carrito`);
      }
      localStorage.setItem(key, JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (e) {
      console.error(e);
      toast.error('Error al agregar al carrito');
    }
  };

  const addToWishlist = (product) => {
    try {
      const cu = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (!cu) {
        // show login prompt modal
        setShowLoginModal(true);
        return;
      }
      const key = `wishlist-${cu.id || cu.email}`;
      const w = JSON.parse(localStorage.getItem(key)) || [];
      if (!w.find((p) => p.id === product.id)) {
        w.push(product);
        localStorage.setItem(key, JSON.stringify(w));
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

  // Modal for login prompt when trying to add to wishlist
  const LoginPromptModal = () => (
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
  );

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Categorías</h2>

      {/* Botones de categorías con imágenes */}
      <div className="row justify-content-center mb-4">
        {buttons.map((btn) => (
          <div
            className="col-6 col-sm-4 col-md-3 d-flex justify-content-center mb-3"
            key={btn.label}
          >
            <button
              onClick={() => toggleCategory(btn.label, btn.category)}
              className={`btn position-relative text-white p-0 w-100`}
              style={{
                height: 220,
                backgroundImage: `url(${btn.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border:
                  activeCategory === btn.label
                    ? '3px solid #0d6efd'
                    : '2px solid #0d6efd',
                overflow: 'hidden',
              }}
            >
              <span
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  width: '100%',
                  padding: '10px 0',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                {btn.label}
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Filtros principales */}
      <div className="row mb-3 align-items-center g-2">
        <div className="col-md-3">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setBrandFilter('all');
              setMaterialFilter('all');
              setPaddlersFilter('all');
            }}
          >
            <option value="all">Todas las categorías</option>
            <option value="kayak">Kayaks</option>
            <option value="sup">SUP</option>
            <option value="embarcacion">Embarcaciones</option>
            <option value="articulo">Artículos</option>
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={filterSortOption}
            onChange={(e) => setFilterSortOption(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="new">Nuevos</option>
            <option value="sale">En oferta</option>
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="none">Orden predeterminado</option>
            <option value="price-asc">Precio: bajo a alto</option>
            <option value="price-desc">Precio: alto a bajo</option>
          </select>
        </div>
      </div>

      {/* Filtros específicos según categoría */}
      {categoryFilter !== 'all' && categoryFilter !== 'articulo' && (
        <div className="row mb-3 align-items-center g-2">
          <div className="col-md-4">
            <select
              className="form-select"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
            >
              <option value="all">Todas las marcas</option>
              {filterOptions.brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
            >
              <option value="all">Todos los materiales</option>
              {filterOptions.materials.map((material) => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={paddlersFilter}
              onChange={(e) => setPaddlersFilter(e.target.value)}
            >
              <option value="all">
                {categoryFilter === 'embarcacion'
                  ? 'Todas las capacidades'
                  : 'Todos los remadores'}
              </option>
              {filterOptions.paddlers.map((num) => (
                <option key={num} value={num}>
                  {num}{' '}
                  {categoryFilter === 'embarcacion'
                    ? 'personas'
                    : 'remador(es)'}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Contador de resultados */}
      <div className="mb-3">
        <small className="text-muted">
          {filteredProducts.length} producto
          {filteredProducts.length !== 1 ? 's' : ''} encontrado
          {filteredProducts.length !== 1 ? 's' : ''}
        </small>
      </div>

      {/* Grid de productos */}
      <div className="row products-grid">
        {filteredProducts.length === 0 ? (
          <div className="col-12 text-center py-5">
            <p className="text-muted">
              No hay productos para los filtros seleccionados.
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              className="col-md-3 mb-4"
              key={product.id ?? JSON.stringify(product)}
            >
              <div className="product-item mb-5 text-center position-relative">
                <div className="product-image w-100 position-relative overflow-hidden">
                  <img
                    src={product.image || '/assets/placeholder.webp'}
                    alt="product"
                    className="img-fluid"
                  />
                  {product.secondImage && (
                    <img
                      src={product.secondImage}
                      alt="product"
                      className="img-fluid"
                    />
                  )}
                  <div className="product-icons gap-3">
                    <div
                      className="product-icon"
                      title="Agregar a favoritos"
                      onClick={() => addToWishlist(product)}
                    >
                      <i className="bi bi-heart fs-5"></i>
                    </div>
                    <div
                      className="product-icon"
                      title="Agregar al carrito"
                      onClick={() => addToCart(product)}
                    >
                      <i className="bi bi-cart3 fs-5"></i>
                    </div>
                  </div>
                  <span
                    className={`tag badge text-white ${
                      product.tag === 'Nuevo' ? 'bg-danger' : 'bg-success'
                    }`}
                  >
                    {product.tag}
                  </span>

                  {/* Badge de categoría */}
                  <span
                    className="position-absolute top-0 start-0 m-2 badge"
                    style={{
                      backgroundColor:
                        product.category === 'kayak'
                          ? '#007bff'
                          : product.category === 'sup'
                          ? '#28a745'
                          : product.category === 'embarcacion'
                          ? '#dc3545'
                          : '#ffc107',
                      color: '#fff',
                    }}
                  >
                    {product.category === 'kayak'
                      ? 'Kayak'
                      : product.category === 'sup'
                      ? 'SUP'
                      : product.category === 'embarcacion'
                      ? 'Embarcación'
                      : 'Artículo'}
                  </span>
                </div>

                <Link
                  to={`/product/${product.id}`}
                  className="text-decoration-none text-black"
                >
                  <div className="product-content pt-3">
                    {product.oldPrice ? (
                      <div className="price">
                        <span className="text-muted text-decoration-line-through me-2">
                          {product.oldPrice}
                        </span>
                        <span className="fw-bold text-muted">
                          {product.price}
                        </span>
                      </div>
                    ) : (
                      <span className="price">{product.price}</span>
                    )}
                    <h3 className="title pt-1">{product.Productname}</h3>
                    <div className="mt-2 text-muted small">
                      <i className="bi bi-shop"></i>
                      <Link
                        to={`/seller/${product.sellerId}`}
                        className="text-decoration-none text-muted ms-1"
                      >
                        {product.sellerName || 'KBR'}
                      </Link>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {showLoginModal && <LoginPromptModal />}
    </div>
  );
}
