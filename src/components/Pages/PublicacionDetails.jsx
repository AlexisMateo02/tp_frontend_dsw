import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PublicacionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mainImage, setMainImage] = useState("/assets/placeholder.webp");
  const [images, setImages] = useState([]);

  const posts = JSON.parse(localStorage.getItem("userPosts") || "[]");
  const post = posts.find((p) => String(p.id) === String(id));

  useEffect(() => {
    if (post) {
      setMainImage(
        (post.images && post.images[0]) || "/assets/placeholder.webp"
      );
      setImages((post.images || []).filter(Boolean));
    }
  }, [post]);

  if (!post) {
    return (
      <div className="container text-center py-5">
        <h2>Publicación no encontrada</h2>
        <p>La publicación que buscas no existe o fue removida.</p>
        <Link to="/foro" className="btn btn-primary">
          Volver al Foro
        </Link>
      </div>
    );
  }

  const contactHref = (c) => {
    if (!c) return "#";
    if (/@/.test(c)) return `mailto:${c}`;
    // simple phone detection
    const digits = c.replace(/\D/g, "");
    if (digits.length >= 6) return `tel:${digits}`;
    return `mailto:${c}`;
  };

  return (
    <>
      <ol className="section-banner py-3 position-relative">
        <li className="position-relative">
          <Link to="/">Inicio</Link>
        </li>
        <li className="position-relative active">
          <Link to="/foro" className="ps-5">
            Foro
          </Link>
        </li>
        <li className="position-relative active">
          <span className="ps-5">{post.title}</span>
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
                      width: "90px",
                      height: "100px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
              <img
                src={mainImage}
                className="img-fluid"
                alt="main"
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
            <h2 className="mb-3">{post.title}</h2>
            <h4 className="mb-3 text-muted">{post.price || "—"}</h4>

            <div className="mb-3">
              <button
                className="btn btn-outline-primary me-2"
                onClick={() =>
                  navigator.clipboard?.writeText(window.location.href)
                }
              >
                Copiar enlace
              </button>
              <a className="btn btn-success" href={contactHref(post.contact)}>
                Contactar vendedor
              </a>
            </div>

            <hr />
            <p>
              <strong>Dueño:</strong> {post.owner || "Anónimo"}
            </p>
            <p>
              <strong>Contacto:</strong>{" "}
              {post.contact ? (
                <a href={contactHref(post.contact)}>{post.contact}</a>
              ) : (
                "—"
              )}
            </p>
            <p>
              <strong>Descripción:</strong>{" "}
              {post.description || "Sin descripción"}
            </p>

            <div className="mt-4">
              <button
                className="btn btn-secondary me-2"
                onClick={() => navigate("/foro")}
              >
                Volver al foro
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
