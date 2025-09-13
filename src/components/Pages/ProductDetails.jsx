/*se utiliza para mostrar la información detallada de un producto específico. 
En esta página, los usuarios pueden ver detalles como el nombre, descripción, imágenes, 
precio, características y, en muchos casos, opciones */
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
//Data
import Products from "../../data/Product.json";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

function ProductDetails() {
  const { id } = useParams();
  const product = Products.find((p) => p.id === Number(id));
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
  const [mainImage, setMainImage] = useState("");
  const [images, setImages] = useState([]);
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    if (product) {
      setMainImage(product.image);
      setImages([product.image, product.secondImage].filter(Boolean));
      setQuantity(1);
    }
  }, [product]);
  const colors = ["#000000", "#02007bff", "#bbc89bff"];

  return (
    <>
      <ol className="section-banner py-3 position-relative">
        <li className="position-relative">
          <Link to="/">Inicio</Link>
        </li>
        <li className="position-relative active">
          <Link to="/kayaks" className="ps-5">
            Kayaks
          </Link>
        </li>
        <li className="position-relative active">
          <a href="#" className="ps-5">
            {product.Productname}
          </a>
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
                      mainImage === img ? "border-dark" : ""
                    }`}
                    style={{
                      width: 60,
                      height: 80,
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
              <img src={mainImage} className="img-fluid" alt="main" />
            </div>
          </div>
          <div className="col-xl-6">
            <h5 className="fw-bold">{product.price}</h5>
            <h2 className="mb-4 fw-semibold">{product.Productname}</h2>
            <p className="mb-1 fw-semibold">Color: Black</p>
            <div className="d-flex  gap-2 mb-4">
              {colors.map((color, idx) => (
                <div
                  key={idx}
                  className="color-option"
                  style={{
                    backgroundColor: color,
                    width: 25,
                    height: 25,
                    borderRadius: "50%",
                    cursor: "pointer",
                    border: "1px solid #ccc",
                  }}
                />
              ))}
            </div>
            <p className="fw-semibold mb-1">Cantidad</p>
            <div className="d-flex align-items-center gap-3 mb-4 quantity">
              <div
                className="d-flex align-items-center  Quantity-box"
                style={{ maxWidth: "200px" }}
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
                  onClick={() => setQuantity((q) => Math.max(1, q + 1))}
                >
                  +
                </button>
              </div>
              <button className="btn-custome w-100">Agregar al carrito</button>
            </div>
            <button className="btn-custome2 w-100 border-0">
              Compar ahora
            </button>
            <hr />
            <p>
              <strong>Dueño:</strong>KBR
            </p>
            <p>
              <strong>Descripcion:</strong>Eslora manga cockpit
            </p>
            <p>
              <strong>Agregados:</strong>Chaleco y Pala
            </p>
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
              id="description-tab"
              data-bs-toggle="tab"
              data-bs-target="#description"
              type="button"
            >
              Descripcion
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
              Envio y Devoluciones
            </button>
          </li>
        </ul>
        <div className="tab-content" id="productTabContent">
          <div
            className="tab-pane fade show active"
            id="description"
            role="tabpanel"
          >
            <p>
              <strong>Para remadas ligeras en aguas movidas</strong>
            </p>
            <p>
              Ideal para los amantes de los desafios y experiencias intensas
            </p>
            <h5 className="mt-4">Beneficios</h5>
            <ul className="Benefits-list p-0">
              <li className="position-relative">
                Gran estabilidad y maniobrabilidad
              </li>
              <li className="position-relative">Diseño robusto y duradero</li>
              <li className="position-relative">Cómodo y espacioso</li>
              <li className="position-relative">
                Fácil de transportar y almacenar
              </li>
            </ul>
          </div>
          <div className="tab-pane fade" id="shipping" role="tabpanel">
            <p>
              Ofrecemos envío gratuito en pedidos superiores a $200.000. Las
              devoluciones son aceptadas dentro de los 30 días posteriores a la
              compra.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
