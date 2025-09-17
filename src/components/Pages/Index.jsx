/* representa la "Home" o la vista inicial cuando se navega a esa ruta específica. */
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
//Data
import Products from "../../data/Product.json";
import subBanner1 from "./../../assets/banner-1.webp";
import subBanner2 from "./../../assets/banner-2.webp";
import serviceImg1 from "./../../assets/service-icon-1.svg";
import serviceImg2 from "./../../assets/service-icon-2.svg";
import serviceImg3 from "./../../assets/service-icon-3.svg";
import serviceImg4 from "./../../assets/service-icon-4.svg";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Index() {
  // Componente Index
  // Este componente representa la página de inicio de la aplicación.
  // Aquí se pueden incluir elementos como banners, promociones o información destacada.
  const [filterSortOption, setFilterSortOption] = useState("all");
  const navigate = useNavigate();

  const addToWishlist = (product) => {
    const existing = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!existing.some((p) => p.id === product.id)) {
      const updated = [...existing, product];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      window.dispatchEvent(new Event("wishlistUpdates"));
      toast.success(`${product.Productname} agregado a la lista de deseos`);
    } else {
      toast.info(`${product.Productname} ya está en la lista de deseos`);
    }
  };
  const addToCart = (product) => {
    const existing = JSON.parse(localStorage.getItem("cart")) || [];
    const alreadyInCart = existing.find((p) => p.id === product.id);

    if (!alreadyInCart) {
      const updatedProduct = { ...product, quantity: 1 };
      const updatedCart = [...existing, updatedProduct];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`${product.Productname} agregado al carrito`);
    } else {
      toast.info(`${product.Productname} ya está en el carrito`);
    }
  };

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
                <a href="#" className="btn hero-btn mt-3">
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
                <a href="#" className="btn hero-btn mt-3">
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
                <a href="#" className="btn hero-btn mt-3">
                  Comprar Ahora
                </a>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      {/*Products*/}
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
            {Products.filter(
              (product) => product.id >= 2 && product.id <= 8
            ).map((product) => (
              <SwiperSlide key={product.id}>
                <div className="product-item text-center position-relative">
                  <div className="product-image w-100 position-relative overflow-hidden">
                    <img src={product.image} alt="" className="img-fluid" />
                    <img
                      src={product.secondImage}
                      alt=""
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
              <div className="banner-content position-absolute">
                <h3>Nueva colección</h3>
                <h1>
                  Mantra <br />
                  by Matrix <br />
                </h1>
                <button className="btn banner-btn mt-2">Explorar más </button>
              </div>
            </div>
            <div className="col-lg-6 banner-card overflow-hidden position-relative banner-mt">
              <img
                className="img-fluid rounded banner-img"
                src={subBanner2}
                alt=""
              />
              <div className="banner-content banner-content2 position-absolute">
                <h1>25% off en Toda la colección</h1>
                <p>
                  Aprovecha los descuentos por el mes de <br />
                  Noviembre
                </p>
                <button className="btn banner-btn mt-2">COMPRAR AHORA</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*Service*/}
      <div className="container py-5 my-5">
        <div className="row text-center">
          <div className="col-lg-3 col-sm-6 mb-4">
            <img src={serviceImg1} className="img-fluid" alt="" />
            <h4 className="mt-3 mb-1">Envio gratis</h4>
            <p className="text-muted fs-6 fw-semibold">
              Envio gratis para ordenes mayores a $150.000
            </p>
          </div>
          <div className="col-lg-3 col-sm-6 mb-4">
            <img src={serviceImg2} className="img-fluid" alt="" />
            <h4 className="mt-3 mb-1">Reembolsos</h4>
            <p className="text-muted fs-6 fw-semibold">
              Reembolso gratis dentro de los primeros 30 dias{" "}
            </p>
          </div>
          <div className="col-lg-3 col-sm-6 mb-4">
            <img src={serviceImg3} className="img-fluid" alt="" />
            <h4 className="mt-3 mb-1">Soporte en linea </h4>
            <p className="text-muted fs-6 fw-semibold">Las 24 horas del día </p>
          </div>
          <div className="col-lg-3 col-sm-6 mb-4">
            <img src={serviceImg4} className="img-fluid" alt="" />
            <h4 className="mt-3 mb-1">Pagos FLEXIBLES</h4>
            <p className="text-muted fs-6 fw-semibold">
              Todo tipo de Tarjetas de todos los Bancos{" "}
            </p>
          </div>
        </div>
      </div>

      {/*Seen in */}
      <div className="text-center my-5 seen-in">
        <div className="container"></div>
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

export default Index;
