import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Foro() {
  const [posts, setPosts] = useState([]);

  const loadPosts = () => {
    // Combine posts saved under different keys (forum posts and user-created products)
    const forum = JSON.parse(localStorage.getItem("userPosts") || "[]");
    const userProducts = JSON.parse(
      localStorage.getItem("userProducts") || "[]"
    );
    // normalize and merge
    const merged = [...forum, ...userProducts].map((p) => ({ ...p }));
    // sort by id desc when possible
    merged.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
    setPosts(merged);
  };

  useEffect(() => {
    loadPosts();
    const onPostsUpdated = () => loadPosts();
    const onProductsUpdated = () => loadPosts();
    window.addEventListener("postsUpdated", onPostsUpdated);
    window.addEventListener("productsUpdated", onProductsUpdated);
    return () => {
      window.removeEventListener("postsUpdated", onPostsUpdated);
      window.removeEventListener("productsUpdated", onProductsUpdated);
    };
  }, []);

  return (
    <div className="container my-5">
      <div className="section-title text-center mb-4">
        <h2 className="fw-semibold">Foro para Ventas</h2>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-md-8">
          <div className="d-grid gap-3">
            <Link to="/foro/crear" className="btn btn-primary btn-lg py-3">
              <i className="bi bi-plus-circle me-2"></i> Crear Publicación
            </Link>

            <Link
              to="/foro/mis"
              className="btn btn-outline-primary btn-lg py-3"
            >
              <i className="bi bi-files me-2"></i> Mis Publicaciones
            </Link>

            <Link
              to="/foro/buscar"
              className="btn btn-light btn-lg border py-3"
            >
              <i className="bi bi-search me-2"></i> Buscar Publicaciones
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-12">
            <h4 className="mb-3">Publicaciones de usuarios</h4>
            {posts.length === 0 ? (
              <div className="alert alert-secondary">
                No hay publicaciones todavía.
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                {posts.map((post) => {
                  const title =
                    post.title ||
                    post.Productname ||
                    post.ProductName ||
                    "Sin título";
                  const img =
                    post.image ||
                    post.secondImage ||
                    "/assets/placeholder.webp";
                  const owner = post.owner || post.user || "Anónimo";
                  const desc = post.description || post.body || "";
                  return (
                    <div className="col" key={post.id || Math.random()}>
                      <div className="card h-100 shadow-sm border-0">
                        <div
                          style={{
                            height: 200,
                            overflow: "hidden",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          <img
                            src={img}
                            alt=""
                            className="img-fluid w-100 h-100 object-fit-cover"
                          />
                        </div>
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{title}</h5>
                          <p className="text-muted small mb-2">Por: {owner}</p>
                          <p className="card-text text-truncate">{desc}</p>
                          <div className="mt-auto d-flex gap-2">
                            <Link
                              to={`/foro/post/${post.id}`}
                              className="btn btn-sm btn-outline-primary w-100"
                            >
                              Ver
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
