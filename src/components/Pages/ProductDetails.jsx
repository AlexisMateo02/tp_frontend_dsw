import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
//Data
import Products from '../../data/Product.json';
import KayakTypes from '../../data/KayakTypes.json';
import SUPTypes from '../../data/SUPTypes.json';
import BoatTypes from '../../data/BoatTypes.json';
import ArticleTypes from '../../data/ArticleTypes.json';

import { ToastContainer, toast } from 'react-toastify';

function ProductDetails() {
  const { id } = useParams();

  const [mainImage, setMainImage] = useState('/assets/placeholder.webp');
  const [images, setImages] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const product = Products.find((p) => Number(p.id) === Number(id));
  const navigate = useNavigate();

  const getProductSpecs = () => {
    if (!product) return null;

    if (product.category === 'kayak' && product.kayakTypeId) {
      return KayakTypes.find(k => k.id === product.kayakTypeId);
    }
    if (product.category === 'sup' && product.supTypeId) {
      return SUPTypes.find(s => s.id === product.supTypeId);
    }
    if (product.category === 'embarcacion' && product.boatTypeId) {
      return BoatTypes.find(b => b.id === product.boatTypeId);
    }
    if (product.category === 'articulo' && product.articleTypeId) {
      return ArticleTypes.find(a => a.id === product.articleTypeId);
    }
    return null;
  };

  const specs = getProductSpecs();

  useEffect(() => {
    if (product) {
      setMainImage(
        product.image ||
          product.secondImage ||
          product.thirdImage ||
          product.fourthImage ||
          '/assets/placeholder.webp'
      );
      setImages(
        [
          product.image,
          product.secondImage,
          product.thirdImage, /*Agregue esto para poder mostrar una tercera imagen*/
          product.fourthImage, /*Agregue esto para poder mostrar una cuarta imagen*/
          /*En el swipe de las imagenes igual aparecen solo dos*/
        ].filter(Boolean)
      );
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      const key = `reviews-${product.id}`;
      const existing = JSON.parse(localStorage.getItem(key)) || [];
      setReviews(existing);
    }
  }, [product]);

  const addReview = (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) {
      toast.info('Completa nombre y reseña');
      return;
    }
    const key = `reviews-${product.id}`;
    const newReview = {
      id: Date.now(),
      name: reviewName.trim(),
      text: reviewText.trim(),
      rating: reviewRating,
      date: new Date().toISOString(),
    };
    const updated = [newReview, ...reviews];
    localStorage.setItem(key, JSON.stringify(updated));
    setReviews(updated);
    setReviewName('');
    setReviewText('');
    setReviewRating(5);
    toast.success('Reseña agregada');
  };

  const addToCart = (product) => {
    const existing = JSON.parse(localStorage.getItem('cart')) || [];
    const alreadyInCart = existing.find((p) => p.id === product.id);
    if (!alreadyInCart) {
      const updatedProduct = { ...product, quantity: 1 };
      const updatedCart = [...existing, updatedProduct];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(`${product.Productname} agregado al carrito`);
    } else {
      toast.info(`${product.Productname} ya está en el carrito`);
    }
  };
  
  const addToWishlist = (product) => {
    const existing = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (!existing.some((p) => p.id === product.id)) {
      const updated = [...existing, product];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      window.dispatchEvent(new Event('wishlistUpdates'));
      toast.success(`${product.Productname} agregado a la lista de deseos`);
    } else {
      toast.info(`${product.Productname} ya está en la lista de deseos`);
    }
  };

  if (!product) {
    return (
      <div className="container text-center py-5">
        <h2>Producto no encontrado</h2>
        <p>El producto que buscas no existe o fue removido.</p>
        <Link to="/" className="btn btn-primary">
          Volver al Inicio
        </Link>
      </div>
    );
  }

  return (
    <>
      <ol className="section-banner py-3 position-relative">
        <li className="position-relative">
          <Link to="/">Inicio</Link>
        </li>
        <li className="position-relative active">
          <Link to="/articles" className="ps-5">
            {
              product.category === 'kayak' ? 'Kayaks' :
              product.category === 'sup' ? 'SUP' :
              product.category === 'embarcacion' ? 'Embarcaciones' :
              'Artículos'
            }
          </Link>
        </li>
        <li className="position-relative active">
          <span className="ps-5">{product.Productname}</span>
        </li>
      </ol>

      <div className="container py-5">
        <div className="row">
          <div className="col-xl-6">
            <div className="d-flex flex-column-reverse flex-md-row mb-4">
              <div className="d-flex flex-column me-3 thumbnail-images">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumb${idx}`}
                    onClick={() => setMainImage(img)}
                    className={`img-thumbnail ${
                      mainImage === img ? 'border-dark' : ''
                    }`}
                    style={{
                      width: '90px',
                      height: '100px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
              <img
                src={mainImage}
                className="img-fluid"
                alt="main"
                style={{
                  width: '100%',
                  maxWidth: 450,
                  height: 300,
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>

          <div className="col-xl-6">
            <span
              className="badge mb-2"
              style={{
                backgroundColor: 
                  product.category === 'kayak' ? '#007bff' :
                  product.category === 'sup' ? '#28a745' :
                  product.category === 'embarcacion' ? '#dc3545' :
                  '#ffc107',
                color: '#fff'
              }}
            >
              {
                product.category === 'kayak' ? 'Kayak' :
                product.category === 'sup' ? 'SUP' :
                product.category === 'embarcacion' ? 'Embarcación' :
                'Artículo'}
            </span>
            <h5 className="fw-bold">{product.price}</h5>
            <h2 className="mb-4 fw-semibold">{product.Productname}</h2>

            <p className="fw-semibold mb-1">Cantidad</p>
            <div className="d-flex align-items-center gap-3 mb-4 quantity">
              <div
                className="d-flex align-items-center Quantity-box"
                style={{ maxWidth: '180px' }}
              >
                <button
                  className="btn-count border-0"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control text-center mx-2"
                  value={quantity}
                  readOnly
                />
                <button
                  className="btn-count border-0"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>
              <button
                className="btn-custome w-50"
                onClick={() => addToCart(product)}
              >
                Agregar al carrito
              </button>
              <button
                className="btn-custome w-50"
                onClick={() => addToWishlist(product)}
              >
                Agregar a la lista de deseos
              </button>
            </div>

            <button
              className="btn-custome2 w-100 border-0"
              onClick={() => {
                addToCart(product);
                navigate('/cart');
              }}
            >
              Comprar ahora
            </button>
            <hr />
            <p>
              <strong>Dueño:</strong> {product.owner || 'KBR'}
            </p>
            <p>
              <strong>Descripción:</strong>{' '}
              {product.description || 'Sin descripción'}
            </p>
            <p>
              <strong>Incluye:</strong> {product.includes || '—'}
            </p>
                        {/* Mostrar especificaciones técnicas según el tipo de producto */}
            {specs && (
              <>
                <hr />
                <h5 className="fw-bold mb-3">Especificaciones Técnicas</h5>
                
                {product.category === 'kayak' && (
                  <div className="row">
                    <div className="col-6 mb-2">
                      <small className="text-muted">Marca:</small>
                      <p className="mb-0 fw-semibold">{specs.brand}</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Modelo:</small>
                      <p className="mb-0 fw-semibold">{specs.model}</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Material:</small>
                      <p className="mb-0 fw-semibold">{specs.material}</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Remadores:</small>
                      <p className="mb-0 fw-semibold">{specs.paddlersQuantity}</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Capacidad máx:</small>
                      <p className="mb-0 fw-semibold">{specs.maxWeightCapacity} kg</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Construcción:</small>
                      <p className="mb-0 fw-semibold">{specs.constructionType}</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Largo:</small>
                      <p className="mb-0 fw-semibold">{specs.length} m</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Manga:</small>
                      <p className="mb-0 fw-semibold">{specs.beam} m</p>
                    </div>
                  </div>
                )}
                
                {product.category === 'sup' && (
                  <div className="row">
                    <div className="col-6 mb-2">
                      <small className="text-muted">Marca:</small>
                      <p className="mb-0 fw-semibold">{specs.brand}</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Modelo:</small>
                      <p className="mb-0 fw-semibold">{specs.model}</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Material:</small>
                      <p className="mb-0 fw-semibold">{specs.material}</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Tipo de tabla:</small>
                      <p className="mb-0 fw-semibold">{specs.boardType}</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Construcción:</small>
                      <p className="mb-0 fw-semibold">{specs.constructionType}</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Capacidad máx:</small>
                      <p className="mb-0 fw-semibold">{specs.maxWeightCapacity} kg</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Largo:</small>
                      <p className="mb-0 fw-semibold">{specs.length} m</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Ancho:</small>
                      <p className="mb-0 fw-semibold">{specs.width} m</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Grosor:</small>
                      <p className="mb-0 fw-semibold">{specs.thickness} m</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Quillas:</small>
                      <p className="mb-0 fw-semibold">{specs.finConfiguration || 'N/A'}</p>
                    </div>
                  </div>
                )}
                
                {product.category === 'embarcacion' && (
                  <div className="row">
                    <div className="col-6 mb-2">
                      <small className="text-muted">Marca:</small>
                      <p className="mb-0 fw-semibold">{specs.brand}</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Modelo:</small>
                      <p className="mb-0 fw-semibold">{specs.model}</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Categoría:</small>
                      <p className="mb-0 fw-semibold">{specs.boatCategory}</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Material:</small>
                      <p className="mb-0 fw-semibold">{specs.material}</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Capacidad:</small>
                      <p className="mb-0 fw-semibold">{specs.passengerCapacity} personas</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Peso máximo:</small>
                      <p className="mb-0 fw-semibold">{specs.maxWeightCapacity} kg</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Largo:</small>
                      <p className="mb-0 fw-semibold">{specs.length} m</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Manga:</small>
                      <p className="mb-0 fw-semibold">{specs.beam} m</p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Tipo de casco:</small>
                      <p className="mb-0 fw-semibold">{specs.hullType}</p>
                    </div>
                    {specs.motorType && (
                      <div className="col-6 mb-2">
                        <small className="text-muted">Motor:</small>
                        <p className="mb-0 fw-semibold">{specs.motorType}</p>
                      </div>
                    )}
                    {specs.maxHorsePower && (
                      <div className="col-6 mb-2">
                        <small className="text-muted">HP máximo:</small>
                        <p className="mb-0 fw-semibold">{specs.maxHorsePower} HP</p>
                      </div>
                    )}
                  </div>
                )}
                
                {product.category === 'articulo' && (
                  <div className="row">
                    <div className="col-12 mb-2">
                      <small className="text-muted">Tipo de artículo:</small>
                      <p className="mb-0 fw-semibold">{specs.name}</p>
                    </div>
                    <div className="col-12 mb-2">
                      <small className="text-muted">Uso principal:</small>
                      <p className="mb-0 fw-semibold">{specs.mainUse}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container my-5">
        <ul
          className="nav nav-tabs border-0 justify-content-center mb-4"
          id="productTab"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <button
              className="nav-link tab active border-0 fw-bold fs-4 text-capitalize"
              id="reviews-tab"
              data-bs-toggle="tab"
              data-bs-target="#reviews"
              type="button"
            >
              Reseñas
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link tab border-0 fw-bold fs-4 text-capitalize"
              id="shipping-tab"
              data-bs-toggle="tab"
              data-bs-target="#shipping"
              type="button"
            >
              Envío y Devoluciones
            </button>
          </li>
        </ul>

        <div className="tab-content" id="productTabContent">
          <div
            className="tab-pane fade show active"
            id="reviews"
            role="tabpanel"
          >
            <div className="mb-4">
              <h5 className="mb-3">Dejar una reseña</h5>
              <form onSubmit={addReview}>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tu nombre"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Tu reseña"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                </div>
                <div className="mb-3 d-flex align-items-center gap-2">
                  <label className="mb-0">Puntaje:</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="form-select w-auto"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r}    {'⭐'.repeat(r)}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="btn btn-primary" type="submit">
                  Enviar reseña
                </button>
              </form>
            </div>

            <div>
              <h5 className="mb-3">Reseñas</h5>
              {reviews.length === 0 ? (
                <p>Aún no hay reseñas para este producto.</p>
              ) : (
                <ul className="list-unstyled">
                  {reviews.map((r) => (
                    <li key={r.id} className="mb-3 border-bottom pb-2">
                      <div className="d-flex justify-content-between">
                        <strong>{r.name}</strong>
                        <small>{new Date(r.date).toLocaleString()}</small>
                      </div>
                      <div className="text-warning">{'⭐'.repeat(r.rating)}</div>
                      <p className="mb-0">{r.text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="tab-pane fade" id="shipping" role="tabpanel">
            <p>
              Ofrecemos envío gratuito en pedidos superiores a $200.000. Las
              devoluciones se aceptan dentro de los 30 días posteriores a la
              compra.
            </p>
          </div>
        </div>
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
    </>
  );
}

export default ProductDetails;
