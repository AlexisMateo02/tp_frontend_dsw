import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Products from "../../data/Product.json";

const buttons = [
  { label: "Artículos", img: "src/assets/Articulos.webp" },
  { label: "Embarcaciones", img: "src/assets/Embarcaciones.png" },
  { label: "SUP", img: "src/assets/SUP.webp" },
  { label: "Kayaks", img: "src/assets/Kayaks.webp" },
];

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState(
    product.image || "/assets/placeholder.webp"
  );
  const [qty, setQty] = useState(1);

  const thumbnails = [product.image, product.secondImage].filter(Boolean);

  return (
    <div className="card h-100">
      <div className="d-flex flex-column">
        <img
          src={mainImage}
          alt={product.Productname}
          style={{ objectFit: "cover", height: 220, width: "100%" }}
        />
        <div className="d-flex gap-2 p-2">
          {thumbnails.map((t, i) => (
            <img
              key={i}
              src={t}
              alt={`thumb-${i}`}
              onClick={() => setMainImage(t)}
              style={{
                width: 60,
                height: 60,
                objectFit: "cover",
                cursor: "pointer",
                border:
                  mainImage === t ? "2px solid #0d6efd" : "1px solid #ddd",
              }}
            />
          ))}
        </div>
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.Productname || "Sin título"}</h5>
        <p className="text-muted mb-2">{product.price || ""}</p>

        <div className="d-flex align-items-center gap-2 mb-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            -
          </button>
          <input
            className="form-control text-center"
            style={{ width: 60 }}
            value={qty}
            readOnly
          />
          <button
            className="btn btn-outline-secondary"
            onClick={() => setQty((q) => q + 1)}
          >
            +
          </button>
        </div>

        <div className="mt-auto d-flex gap-2">
          <button
            className="btn btn-primary w-100"
            onClick={() => {
              // Aquí iría la lógica real de addToCart (context/dispatch)
              // Ejemplo temporal:
              console.log("Agregar al carrito:", product.id, "cantidad:", qty);
            }}
          >
            Agregar al carrito
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            Ver detalle
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Articles() {
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleCategory = (label) => {
    setActiveCategory((prev) => (prev === label ? null : label));
    // opcional: hacer scroll hasta la sección
    setTimeout(() => {
      const el = document.querySelector(".category-panel");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const productsFor = (label) => {
    if (!label) return [];
    const key = label.toLowerCase();
    return Products.filter(
      (p) =>
        (p.tag && p.tag.toLowerCase().includes(key)) ||
        (p.Productname && p.Productname.toLowerCase().includes(key)) ||
        (p.category && p.category.toLowerCase() === key)
    );
  };

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
                backgroundSize: "cover",
                backgroundPosition: "center",
                border:
                  activeCategory === btn.label
                    ? "3px solid #0d6efd"
                    : "2px solid #0d6efd",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  background: "rgba(0,0,0,0.5)",
                  width: "100%",
                  padding: "10px 0",
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {btn.label}
              </span>
            </button>
          </div>
        ))}
      </div>

      {activeCategory && (
        <section className="category-panel mb-5">
          <h3 className="mb-3">Mostrando: {activeCategory}</h3>

          <div className="row">
            {productsFor(activeCategory).length === 0 ? (
              <div className="col-12">
                No hay productos para esta categoría.
              </div>
            ) : (
              productsFor(activeCategory).map((p) => (
                <div className="col-12 col-md-6 col-lg-4 mb-4" key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}
