/* representa la "Home" o la vista inicial cuando se navega a esa ruta específica. */
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import normalizeImagePath from "../../lib/utils/normalizeImagePath";

import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/effect-fade";
// Product.json removed — static products are no longer imported
import subBanner1 from "./../../assets/banner-1.webp";
import subBanner2 from "./../../assets/banner-2.webp";
import femalebanner from "./../../assets/banner-female.webp";
import discover1 from "./../../assets/discover-1.webp";
import discover2 from "./../../assets/discover-2.webp";
import socialImage1 from "./../../assets/link-1.webp";
import socialImage2 from "./../../assets/link-2.webp";
import socialImage3 from "./../../assets/link-3.webp";
import socialImage4 from "./../../assets/link-4.webp";
import socialImage5 from "./../../assets/link-5.webp";
import socialImage6 from "./../../assets/link-6.webp";

function Index() {
  // Componente Index
  // Este componente representa la página de inicio de la aplicación.
  // Aquí se pueden incluir elementos como banners, promociones o información destacada.
  // const [filterSortOption, setFilterSortOption] = useState('all');
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [combinedProducts, setCombinedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  React.useEffect(() => {
    try {
      const cu = JSON.parse(localStorage.getItem("currentUser") || "null");
      setCurrentUser(cu);
    } catch {
      setCurrentUser(null);
    }
    const onAuth = () => {
      try {
        const cu = JSON.parse(localStorage.getItem("currentUser") || "null");
        setCurrentUser(cu);
      } catch {
        setCurrentUser(null);
      }
    };
    window.addEventListener("authChanged", onAuth);
    window.addEventListener("storage", onAuth);
    return () => {
      window.removeEventListener("authChanged", onAuth);
      window.removeEventListener("storage", onAuth);
    };
  }, []);

  // CARGAR PRODUCTOS DESDE MÚLTIPLES FUENTES
  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        setLoadingProducts(true);

        // 1. Cargar productos de la API (base de datos)
        let apiProducts = [];
        try {
          const response = await fetch("http://localhost:3000/api/products");
          if (response.ok) {
            const result = await response.json();
            apiProducts = result.data || [];
            console.log(
              "✅ Productos cargados desde API en Index:",
              apiProducts.length
            );

            // Filtrar solo productos aprobados y agregar seller info por defecto
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
          console.warn("❌ Error cargando productos de API en Index:", error);
        }

        // 2. Cargar productos del marketplace (localStorage)
        const marketplaceProducts = JSON.parse(
          localStorage.getItem("marketplaceProducts") || "[]"
        );
        const approvedMarketplace = marketplaceProducts.filter(
          (p) => p.approved
        );

        // 3. Productos del JSON estático (removido)
        const jsonProducts = [];

        // 4. COMBINAR TODAS LAS FUENTES
        const combined = [
          ...jsonProducts,
          ...approvedMarketplace,
          ...apiProducts,
        ];

        console.log("📊 Total productos combinados en Index:", combined.length);
        console.log("🗂️  Fuentes en Index:", {
          json: jsonProducts.length,
          marketplace: approvedMarketplace.length,
          api: apiProducts.length,
        });

        setCombinedProducts(combined);
      } catch (error) {
        console.error("Error loading products in Index:", error);
        // Fallback: no static JSON products available
        setCombinedProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadAllProducts();
  }, []);

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

  const addToCart = (product) => {
    try {
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

  if (loadingProducts) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/*Hero*/}
      <div className="hero">
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          modules={[Autoplay, EffectFade]}
          effect="fade"
          loop={true}
          autoplay={{
            delay: 3000,
          }}
        >
          <SwiperSlide>
            <div className="hero-wrap hero-wrap1">
              <div className="hero-content">
                <h5>-Productos escenciales-</h5>
                <h1>
                  Chaleco Salvavidas <br />
                  Aquafloat
                </h1>
                <p className="my-3">Todos los talles disponibles </p>
                <a href="product/3" className="btn hero-btn mt-3">
                  Comprar Ahora
                </a>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="hero-wrap hero-wrap2">
              <div className="hero-content">
                <h5>-Productos escenciales-</h5>
                <h1>
                  Palas de fibra
                  <br />
                  Weir
                </h1>
                <p className="my-3">Diferentes colores disponibles </p>
                <a href="product/27" className="btn hero-btn mt-3">
                  Comprar Ahora
                </a>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="hero-wrap hero-wrap3">
              <div className="hero-content">
                <h5>-Productos escenciales-</h5>
                <h1>
                  Silvato primeros auxilios
                  <br />
                  Aquafloat
                </h1>
                <p className="my-3">Variedad en colores</p>
                <a href="/product/43" className="btn hero-btn mt-3">
                  Comprar Ahora
                </a>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/*Productos*/}
      <div className="product-container py-5 my-5">
        <div className="container position-relative">
          <div className="row">
            <div className="secction-title mb-5 product-title text-center">
              <h2 className="fw-semibold fs-1 ">
                Nuestros productos seleccionados
              </h2>
              <p className="text-muted">Equipate para disfrutar del rio </p>
            </div>
          </div>
          <Swiper
            slidesPerView={4}
            spaceBetween={20}
            modules={[Navigation]}
            navigation={{
              nextEl: ".product-swiper-next",
              prevEl: ".product-swiper-prev",
            }}
            breakpoints={{
              1399: { slidesPerView: 4 },
              1199: { slidesPerView: 3 },
              991: { slidesPerView: 2 },
              767: { slidesPerView: 1.5 },
              0: { slidesPerView: 1 },
            }}
            className="mt-4 swiper position-relative"
          >
            {combinedProducts
              .filter((product) => product.id >= 1 && product.id <= 7)
              .map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="product-item text-center position-relative">
                    <div className="product-image w-60 h-40 object-fit-contain position-relative overflow-hidden">
                      <img
                        src={normalizeImagePath(product.image)}
                        alt=""
                        className="img-fluid w-60 h-40 object-fit-cover"
                      />
                      <img
                        src={normalizeImagePath(product.secondImage)}
                        alt=""
                        className="img-fluid w-60 h-40 object-fit-cover "
                      />
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
                          product.tag === "Nuevo" ? "bg-danger" : "bg-success"
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
                        <span className="price text-decoration-none">
                          {product.price}
                        </span>
                        <h3 className="title pt-1">{product.Productname}</h3>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>

      {/*Banner*/}
      <div className="banners py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 banner-card overflow-hidden position-relative">
              <img
                className="img-fluid rounded banner-img"
                src={subBanner1}
                alt=""
              />
              <div
                className="banner-content position-absolute color-white
                background-opacity-1 p-3 rounded "
              >
                <h1>
                  ¿Queres vender <br /> tus productos?
                </h1>
                <h3>
                  Hacelo ahora desde <br />
                  nuestro FORO
                </h3>
                <h1>
                  <button
                    className="btn btn-primary mt-3"
                    onClick={() => navigate("/foro/crear")}
                  >
                    Publicar
                  </button>
                </h1>
              </div>
            </div>
            <div className="col-lg-6 banner-card overflow-hidden position-relative banner-mt">
              <img
                className="img-fluid rounded banner-img"
                src={subBanner2}
                alt=""
              />
              <div className="banner-content banner-content2 position-absolute">
                <h1>25% off en Efectivo </h1>
                <p>
                  Aprovecha los descuentos por el mes de <br />
                  Noviembre
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="favourite-beauty py-5 my-5">
        <div className="container">
          <div className="row">
            <div className="section-title mb-5 favourite-beauty-title text-center ">
              <h3 className="fw-semibold fs-1"> EXPLORA</h3>
              <h6 className="fw-semibold fs-1">
                Nuestros productos más populares y esenciales{" "}
              </h6>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-5">
              <div className="favourite-beauty-banner mb-lg-0 mb-5 position-relative ">
                <img src={femalebanner} className="img-fluid" alt="" />
                <div className="favourite-beauty-banner-title">
                  <Link
                    to="/articles"
                    className="btn btn-default mt-2 position-center text-decoration-none"
                  >
                    ¡¡ Suma experiencias <br />
                    Con nuestros productos !!
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="row">
                {combinedProducts
                  .filter((product) => product.id >= 1 && product.id <= 6)
                  .map((product) => (
                    <div className="col-md-4 mb-0" key={product.id}>
                      <div>
                        <div className="product-item mb-5 text-center position-relative">
                          <div className="product-image w-100 position-relative overflow-hidden">
                            <img
                              src={normalizeImagePath(product.image)}
                              alt="product"
                              className="img-fluid"
                            />
                            <img
                              src={normalizeImagePath(product.secondImage)}
                              alt="product"
                              className="img-fluid"
                            />
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
                                product.tag === "Nuevo"
                                  ? "bg-danger"
                                  : "bg-success"
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
                              <span className="price ">{product.price}</span>
                              <h3 className="title pt-1">
                                {product.Productname}
                              </h3>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*Discover Section*/}
      <div className="discover container py-5">
        <div className="section-title mb-5 favourite-beauty-title text-center ">
          <h2 className="fw-semibold fs-1">Proximamente en Kayak Brokers</h2>
        </div>
        <div className="row g-5">
          <div className="col-md-6 discover-card text-center">
            <div className="discover-img section-image rounded">
              <img
                src={discover1}
                alt="Coleccion de verano"
                className="img-fluid rounded"
              />
            </div>
          </div>
          <div className="col-md-6 discover-card text-center">
            <div className="discover-img section-image rounded">
              <img
                src={discover2}
                alt="Sobre nosotros"
                className="img-fluid rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/*Social Image*/}
      <div className="social-image-container py-5 px-5 mx-auto mt-5">
        <h2 className="text-center">
          ¡Seguinos en Instagram!
          <br />
          <button className="btn btn-default mt-2 w-80 h-80 position-center">
            <a
              style={{ textDecoration: "none", color: "inherit" }}
              href="https://www.instagram.com/kayakbrokers?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2>@kayakbrokers</h2>
            </a>
          </button>
        </h2>

        <div className="row g-4">
          <div className="col-lg-2 col-md-4">
            <a
              href="https://www.instagram.com/p/DNDl5HMM7X0/?img_index=1"
              target="_blank"
              rel="noopener noreferrer"
              className="social-wrapper position-relative overflow-hidden d-block"
            >
              <img src={socialImage1} alt="" className="img-fluid" />
              <i className="bi bi-instagram"></i>
            </a>
          </div>
          <div className="col-lg-2 col-md-4">
            <a
              href="https://www.instagram.com/p/DM-FwGPMhJa/?img_index=1"
              target="_blank"
              rel="noopener noreferrer"
              className="social-wrapper position-relative overflow-hidden d-block"
            >
              <img src={socialImage2} alt="" className="img-fluid" />
              <i className="bi bi-instagram"></i>
            </a>
          </div>
          <div className="col-lg-2 col-md-4">
            <a
              href="https://www.instagram.com/p/DMve76EvIXU/?img_index=1"
              target="_blank"
              rel="noopener noreferrer"
              className="social-wrapper position-relative overflow-hidden d-block"
            >
              <img src={socialImage3} alt="" className="img-fluid" />
              <i className="bi bi-instagram"></i>
            </a>
          </div>
          <div className="col-lg-2 col-md-4">
            <a
              href="https://www.instagram.com/p/DMgjcegsnfb/?img_index=1"
              target="_blank"
              rel="noopener noreferrer"
              className="social-wrapper position-relative overflow-hidden d-block"
            >
              <img src={socialImage4} alt="" className="img-fluid" />
              <i className="bi bi-instagram"></i>
            </a>
          </div>
          <div className="col-lg-2 col-md-4">
            <a
              href="https://www.instagram.com/p/DLPvrtxx9FE/?img_index=1"
              target="_blank"
              rel="noopener noreferrer"
              className="social-wrapper position-relative overflow-hidden d-block"
            >
              <img src={socialImage5} alt="" className="img-fluid" />
              <i className="bi bi-instagram"></i>
            </a>
          </div>
          <div className="col-lg-2 col-md-4">
            <a
              href="https://www.instagram.com/p/DMgOoGYy8K4/?img_index=1"
              target="_blank"
              rel="noopener noreferrer"
              className="social-wrapper position-relative overflow-hidden d-block"
            >
              <img src={socialImage6} alt="" className="img-fluid" />
              <i className="bi bi-instagram"></i>
            </a>
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
              Debes iniciar sesión para agregar productos a favoritos.
            </p>
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
    </>
  );
}

export default Index;
