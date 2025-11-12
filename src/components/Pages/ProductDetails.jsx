// Componente para ver los detalles de un producto individual
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import normalizeImagePath from "../../lib/utils/normalizeImagePath";

function ProductDetails() {
  const { id } = useParams();

  const [mainImage, setMainImage] = useState("/assets/placeholder.webp");
  const [images, setImages] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [combinedProducts, setCombinedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const navigate = useNavigate();

  // Vamos a cargar todos los productos desde las 3 fuentes: JSON, localStorage y API
  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        setLoadingProducts(true);

        // caragmos los productos desde las API, es decir desde el backend
        let apiProducts = [];
        try {
          const response = await fetch("http://localhost:3000/api/products");
          if (response.ok) {
            const result = await response.json();
            apiProducts = result.data || [];
            console.log(
              "✅ Productos cargados desde API en ProductDetails:",
              apiProducts.length
            );

            // Obvio solo vamos a cargar los productos aprobados por el admin
            apiProducts = apiProducts
              .filter((p) => p.approved)
              .map((p) => ({
                ...p,
                sellerId: p.sellerId || 0,
                sellerName: p.sellerName || "KBR",
                approved: true,
              }));
          }
        } catch (error) {
          console.warn(
            "❌ Error cargando productos de API en ProductDetails:",
            error
          );
        }

        // Cargamos productos desde el localstorage
        const marketplaceProducts = JSON.parse(
          localStorage.getItem("marketplaceProducts") || "[]"
        );
        const approvedMarketplace = marketplaceProducts.filter(
          (p) => p.approved
        );

        // 3. Productos del JSON estático, que igual lo sacamos
        const jsonProducts = [];

        // 4. COMBINAR TODAS LAS FUENTES
        const combined = [
          ...jsonProducts, //eliminamos en realidad todos los json (era para pruebas del frontend)
          ...approvedMarketplace,
          ...apiProducts,
        ];

        console.log(
          "📊 Total productos combinados en ProductDetails:",
          combined.length
        );

        setCombinedProducts(combined); // Guardamos todos los productos juntos (backend, localStorage, JSON)
      } catch (error) {
        console.error("Error loading products in ProductDetails:", error);
        // Fallback: no static JSON products available
        setCombinedProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadAllProducts();
  }, []);

  // Buscar el producto actual por ID en el array combinado
  const product = combinedProducts.find((p) => Number(p.id) === Number(id));

  // Función para obtener las especificaciones técnicas según el tipo de producto
  // Nota: eliminamos las dependencias a archivos JSON estáticos y usamos los objetos
  // embebidos en el producto (`product.kayakType`, `product.supType`, ...)
  const getProductSpecs = () => {
    if (!product) return null;
    if (product.kayakType) return product.kayakType;
    if (product.supType) return product.supType;
    if (product.boatType) return product.boatType;
    if (product.articleType) return product.articleType;
    return null;
  };

  const specs = getProductSpecs();

  // Efecto para cargar las imágenes del producto cuando cambia el producto
  useEffect(() => {
    if (product) {
      try {
        const candidates = [];
        [
          product.image,
          product.secondImage,
          product.thirdImage,
          product.fourthImage,
        ].forEach((field) => {
          if (!field) return;
          if (Array.isArray(field)) {
            field.forEach((f) => f && candidates.push(f));
            return;
          }
          candidates.push(field);
        });

        const MAX_LEN = 2_000_000; //
        const safeStrings = candidates
          .map((i) => {
            return normalizeImagePath(i);
          })
          .filter(Boolean)
          .filter((s) => typeof s === "string" && s.length < MAX_LEN)
          .slice(0, 4);

        const chosen = safeStrings[0] || "/assets/placeholder.webp";
        setMainImage(chosen);
        setImages(safeStrings);
      } catch (error) {
        console.error("Error loading products in ProductDetails:", error);
        setImages([]);
        setMainImage("/assets/placeholder.webp");
      }
    }
  }, [product]);

  // Efecto para cargar las reseñas del producto y el usuario actual, en esta nos basamos en el localStorage, ya que no hay backend para las reviews
  // tenemos en la bdd review pero no lo usamos aun, no se cargan ahi, y lo vamos a dejar para la AD
  useEffect(() => {
    if (product) {
      const key = `reviews-${product.id}`;
      const existing = JSON.parse(localStorage.getItem(key)) || [];
      setReviews(existing);
    }
    //caragar usuario actual y recordar que un usuario no logueado no puede hacer reseñas
    const loadCurrent = () => {
      try {
        const cu = JSON.parse(localStorage.getItem("currentUser") || "null");
        setCurrentUser(cu);
        if (cu) {
          setReviewName(
            cu.email ||
              cu.username ||
              (
                (cu.firstName || "") + (cu.lastName ? ` ${cu.lastName}` : "")
              ).trim() ||
              "Usuario"
          );
        }
      } catch {
        setCurrentUser(null);
      }
    };
    loadCurrent();
    window.addEventListener("authChanged", loadCurrent);
    window.addEventListener("storage", loadCurrent);
    return () => {
      window.removeEventListener("authChanged", loadCurrent);
      window.removeEventListener("storage", loadCurrent);
    };
  }, [product]);

  // Función para agregar una reseña
  const addReview = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setShowLoginModal(true); // pedir login si no está logueado
      return;
    }
    if (!reviewText.trim()) {
      toast.info("Completa nombre y reseña");
      return;
    }
    const key = `reviews-${product.id}`;
    const authorName = // usar el mail del usuario logueado para la reseña y que no se pueda cambiar
      (currentUser && (currentUser.email || currentUser.username)) || "Usuario";
    const newReview = {
      id: Date.now(),
      name: authorName, //no se puede editar el nombre, va el email del usuario logueado
      userId: currentUser.id || null,
      text: reviewText.trim(),
      rating: reviewRating,
      date: new Date().toISOString(),
    };
    const updated = [newReview, ...reviews];
    localStorage.setItem(key, JSON.stringify(updated));
    setReviews(updated);
    setReviewText("");
    setReviewRating(5); //resetear puntaje, de 1 a 5 estrellas
    toast.success("Reseña agregada");
  };

  // Función para agregar el producto al carrito (versión que valida stock)
  const addToCart = (product) => {
    try {
      const stock = Number(product?.stock || 0);
      if (stock <= 0) {
        toast.error("No hay stock disponible para este producto");
        return;
      }

      const cu = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (!cu) {
        setShowLoginModal(true);
        return;
      }
      const key = `cart-${cu.id || cu.email}`;
      const existing = JSON.parse(localStorage.getItem(key)) || [];
      const alreadyInCart = existing.find((p) => p.id === product.id);
      if (!alreadyInCart) {
        const updatedProduct = { ...product, quantity: 1 };
        const updatedCart = [...existing, updatedProduct];
        localStorage.setItem(key, JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success(`${product.Productname} agregado al carrito`);
      } else {
        toast.info(`${product.Productname} ya está en el carrito`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Error al agregar al carrito");
    }
  };

  // Función para agregar el producto a la wishlist
  const addToWishlist = (product) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    const key = `wishlist-${currentUser.id || currentUser.email}`;
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    if (!existing.some((p) => p.id === product.id)) {
      const updated = [...existing, product];
      localStorage.setItem(key, JSON.stringify(updated));
      window.dispatchEvent(new Event("wishlistUpdated"));
      toast.success(`${product.Productname} agregado a la lista de deseos`);
    } else {
      toast.info(`${product.Productname} ya está en la lista de deseos`);
    }
  };

  if (loadingProducts) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando producto...</span>
        </div>
        <p className="mt-3">Cargando producto...</p>
      </div>
    );
  }

  // esto puede llegar a pasar porejemplo si es el product.json que eliminamos pero el usuario tiene un link guardado o aparece un link a el
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

  //Diseñamos la vista de detalles del producto
  return (
    <>
      <ol className="section-banner py-3 position-relative">
        <li className="position-relative">
          <Link to="/">Inicio</Link>
        </li>
        <li className="position-relative active">
          <Link to="/articles" className="ps-5">
            {product.category === "kayak"
              ? "Kayaks"
              : product.category === "sup"
              ? "SUP"
              : product.category === "embarcacion"
              ? "Embarcaciones"
              : "Artículos"}
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
              {/* Miniaturas de las Imagenes*/}
              {images.length > 1 && (
                <div className="d-flex flex-md-column me-md-3 gap-2 thumbnail-images">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMainImage(img)}
                      className={`p-0 border-0 bg-transparent ${
                        mainImage === img ? "shadow" : ""
                      }`}
                      style={{ lineHeight: 0, cursor: "pointer" }}
                    >
                      <img
                        src={img}
                        alt={`Miniatura ${idx + 1}`}
                        loading="lazy"
                        className={`img-thumbnail ${
                          mainImage === img ? "border border-2 border-dark" : ""
                        }`}
                        style={{
                          width: 90,
                          height: 100,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Imagen principal */}
              <img
                src={mainImage}
                className="img-fluid"
                alt="Imagen principal de la publicación"
                style={{
                  width: "100%",
                  maxWidth: 450,
                  height: 300,
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          <div className="col-xl-6">
            <span
              className="badge mb-2"
              style={{
                backgroundColor:
                  product.category === "kayak"
                    ? "#007bff"
                    : product.category === "sup"
                    ? "#28a745"
                    : product.category === "embarcacion"
                    ? "#dc3545"
                    : "#ffc107",
                color: "#fff",
              }}
            >
              {product.category === "kayak"
                ? "Kayak"
                : product.category === "sup"
                ? "SUP"
                : product.category === "embarcacion"
                ? "Embarcación"
                : "Artículo"}
            </span>
            <h5 className="fw-bold">{product.price}</h5>
            <h2 className="mb-4 fw-semibold">{product.Productname}</h2>

            <p className="fw-semibold mb-1">Cantidad</p>
            <div className="d-flex align-items-center gap-3 mb-4 quantity">
              <div
                className="d-flex align-items-center Quantity-box"
                style={{ maxWidth: "180px" }}
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
              {Number(product.stock) > 0 ? (
                <button
                  className="btn-custome bi bi-cart w-50"
                  onClick={() => addToCart(product)}
                >
                  Agregar al carrito
                </button>
              ) : (
                <button
                  className="btn-custome bi bi-cart w-50 disabled"
                  disabled
                >
                  Sin Stock
                </button>
              )}
              <button
                className="btn-custome bi bi-heart w-50"
                onClick={() => addToWishlist(product)}
              >
                Agregar a la lista de deseos
              </button>
            </div>

            {Number(product.stock) > 0 ? (
              <button
                className="btn-custome2 w-100 border-0"
                onClick={() => {
                  addToCart(product);
                  navigate("/cart");
                }}
              >
                Comprar ahora
              </button>
            ) : (
              <button className="btn-custome2 w-100 border-0 disabled" disabled>
                Sin Stock
              </button>
            )}
            <hr />
            <p>
              <strong>Dueño:</strong> {product.owner || "KBR"}
            </p>
            <p>
              <strong>Descripción:</strong>{" "}
              {product.description || "Sin descripción"}
            </p>
            <p>
              <strong>Incluye:</strong> {product.includes || "—"}
            </p>

            {product.sellerId && product.sellerId !== 0 && (
              <>
                <hr />
                <h5 className="fw-bold mb-3">Vendedor</h5>
                <div className="d-flex align-items-center gap-3">
                  <div className="flex-grow-1">
                    <h6 className="mb-1">
                      {product.sellerName || "Vendedor KBR"}
                    </h6>
                    <small className="text-muted">
                      <i className="bi bi-star-fill text-warning"></i>
                      5.0 · Vendedor verificado
                    </small>
                  </div>
                </div>
              </>
            )}
            {/* Mostrar especificaciones técnicas según el tipo de producto */}
            {specs && (
              <>
                <hr />
                <h5 className="fw-bold mb-3">Especificaciones Técnicas</h5>

                {product.category === "kayak" && (
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
                      <p className="mb-0 fw-semibold">
                        {specs.paddlersQuantity}
                      </p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Capacidad máx:</small>
                      <p className="mb-0 fw-semibold">
                        {specs.maxWeightCapacity} kg
                      </p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Construcción:</small>
                      <p className="mb-0 fw-semibold">
                        {specs.constructionType}
                      </p>
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

                {product.category === "sup" && (
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
                      <p className="mb-0 fw-semibold">
                        {specs.constructionType}
                      </p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Capacidad máx:</small>
                      <p className="mb-0 fw-semibold">
                        {specs.maxWeightCapacity} kg
                      </p>
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
                      <p className="mb-0 fw-semibold">
                        {specs.finConfiguration || "N/A"}
                      </p>
                    </div>
                  </div>
                )}

                {product.category === "embarcacion" && (
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
                      <p className="mb-0 fw-semibold">
                        {specs.passengerCapacity} personas
                      </p>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted">Peso máximo:</small>
                      <p className="mb-0 fw-semibold">
                        {specs.maxWeightCapacity} kg
                      </p>
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
                        <p className="mb-0 fw-semibold">
                          {specs.maxHorsePower} HP
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {product.category === "articulo" && (
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
                {" "}
                {/* Formulario para agregar reseña definido antes, se guarda en el localStorage */}
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tu email"
                    value={currentUser ? currentUser.email : reviewName}
                    disabled={!!currentUser} // el usuario logueado no puede cambiar el nombre
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
                    {/* Opciones de puntaje, las estrellitas*/}
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} {"⭐".repeat(r)}
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
                      <div className="text-warning">
                        {"⭐".repeat(r.rating)}
                      </div>
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
            <p className="mb-3">Debes iniciar sesión para dejar una reseña.</p>
            <div className="d-flex justify-content-center gap-2">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowLoginModal(false);
                  navigate("/login");
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
