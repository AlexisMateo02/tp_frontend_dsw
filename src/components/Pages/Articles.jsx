import React from "react";

const buttons = [
  {
    label: "Artículos",
    img: "src/assets/Articulos.webp",
  },
  {
    label: "Embarcaciones",
    img: "src/assets/Embarcaciones.png",
  },
  {
    label: "SUP",
    img: "src/assets/SUP.webp",
  },
  {
    label: "Kayaks",
    img: "src/assets/Kayaks.webp",
  },
];

function Articles() {
  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Categorías</h2>
      <div className="row justify-content-center">
        {buttons.map((btn) => (
          <div
            className="col-md-3 d-flex justify-content-center mb-3"
            key={btn.label}
          >
            <button
              className="btn btn-outline-primary d-flex flex-column justify-content-end align-items-center"
              style={{
                width: "340px",
                height: "300px",
                backgroundImage: `url(${btn.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                fontSize: "1.25rem",
                position: "relative",
                padding: 0,
                border: "2px solid #0d6efd",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  background: "rgba(0,0,0,0.5)",
                  width: "100%",
                  padding: "12px 0",
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  fontWeight: "bold",
                }}
              >
                {btn.label}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Articles;
