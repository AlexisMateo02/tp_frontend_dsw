import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Products from '../../data/Product.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const buttons = [
  { label: 'Artículos', img: 'src/assets/Articulos.webp' },
  { label: 'Embarcaciones', img: 'src/assets/Embarcaciones.png' },
  { label: 'SUP', img: 'src/assets/SUP.webp' },
  { label: 'Kayaks', img: 'src/assets/Kayaks.webp' },
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
  const navigate = useNavigate();

  const categories = useMemo(() => {
    return [
      ...new Set(
        Products.map((p) =>
          p.category ? String(p.category).trim().toLowerCase() : null
        ).filter(Boolean)
      ),
    ];
  }, []);

  const toggleCategory = (label) => {
    const lower = label.toLowerCase();
    const newActive = activeCategory === label ? null : label;
    setActiveCategory(newActive);
    setCategoryFilter(newActive ? lower : 'all');
    setTimeout(() => {
      const el = document.querySelector('.category-panel');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const filteredProducts = useMemo(() => {
    const keyCat =
      categoryFilter === 'all' ? null : categoryFilter.toLowerCase();
    const q = search.trim().toLowerCase();

    let items = Products.filter((p) => {
      if (keyCat && (!p.category || p.category.toLowerCase() !== keyCat))
        return false;

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

      if (q) {
        const name = p.Productname ? p.Productname.toLowerCase() : '';
        const tag = p.tag ? p.tag.toLowerCase() : '';
        return name.includes(q) || tag.includes(q);
      }
      return true;
    });

    if (sortOption === 'price-asc')
      items.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (sortOption === 'price-desc')
      items.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));

    return items;
  }, [categoryFilter, filterSortOption, search, sortOption]);

  const addToCart = (product, qty = 1) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const idx = cart.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        cart[idx].quantity = (cart[idx].quantity || 1) + qty;
        toast.info(`${product.Productname} actualizado en el carrito`);
      } else {
        cart.push({ ...product, quantity: qty });
        toast.success(`${product.Productname} agregado al carrito`);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (e) {
      console.error(e);
      toast.error('Error al agregar al carrito');
    }
  };

  const addToWishlist = (product) => {
    try {
      const w = JSON.parse(localStorage.getItem('wishlist')) || [];
      if (!w.find((p) => p.id === product.id)) {
        w.push(product);
        localStorage.setItem('wishlist', JSON.stringify(w));
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

  const displayedProducts = filteredProducts; // nombre solicitado en tu ejemplo

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Categorías</h2>

      <div className="row justify-content-center mb-4">
        {buttons.map((btn) => (
          <div
            className="col-6 col-sm-4 col-md-3 d-flex justify-content-center mb-3"
            key={btn.label}
          >
            <button
              onClick={() => toggleCategory(btn.label)}
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

      {/* filtros estilo Shop */}
      <div className="row mb-3 align-items-center g-2">
        <div className="col-md-4">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categories.map((c) => (
              <option value={c} key={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
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

      {/* grid como en tu ejemplo */}
      <div className="row">
        {displayedProducts.length === 0 ? (
          <div className="col-12">
            No hay productos para los filtros seleccionados.
          </div>
        ) : (
          displayedProducts.map((product) => (
            <div
              className="col-md-3 mb-4"
              key={product.id ?? JSON.stringify(product)}
            >
              <div>
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
                  </div>

                  <Link
                    to={`/product/${product.id}`}
                    className="text-decoration-none text-black "
                  >
                    <div className="product-content pt-3">
                      {product.oldPrice ? (
                        <div className="price">
                          <span className="text-muted text-decoration-line-through me-2">
                            {product.oldPrice}
                          </span>
                          <span className="fw-bold text-muted ">
                            {product.price}
                          </span>
                        </div>
                      ) : (
                        <span className="price">{product.price}</span>
                      )}
                      <h3 className="title pt-1">{product.Productname}</h3>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Toast container (si ya lo tienes global en App.jsx, elimina esta instancia) */}
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
    </div>
  );
}
