import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SeedPosts from "../../data/Publicaciones.json";

export default function Foro() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const loadPosts = () => {
    // Combine posts saved under different keys (forum posts and user-created products)
    const forum = JSON.parse(localStorage.getItem("userPosts") || "[]");
    const userProducts = JSON.parse(
      localStorage.getItem("userProducts") || "[]"
    );
    // normalize and merge (include seed data)
    const merged = [...forum, ...userProducts, ...SeedPosts].map((p) => ({
      ...p,
    }));
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

  // One-time migration: compress existing data-URL images in userPosts to reduce size
  useEffect(() => {
    const migratedFlag = "userPosts_migrated_v1";
    if (localStorage.getItem(migratedFlag)) return;

    const compressImageFromSrc = (src, maxWidth = 1200, quality = 0.75) =>
      new Promise((resolve, reject) => {
        try {
          const img = new Image();
          // try to avoid CORS taint for external images
          img.crossOrigin = "Anonymous";
          img.onload = () => {
            try {
              const scale = Math.min(1, maxWidth / img.width);
              const w = Math.round(img.width * scale);
              const h = Math.round(img.height * scale);
              const canvas = document.createElement("canvas");
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0, w, h);
              canvas.toBlob(
                (blob) => {
                  if (!blob) return reject(new Error("Canvas is empty"));
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result);
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                },
                "image/jpeg",
                quality
              );
            } catch (err) {
              reject(err);
            }
          };
          img.onerror = (e) => reject(e || new Error("Image load error"));
          img.src = src;
        } catch (e) {
          reject(e);
        }
      });

    const runMigration = async () => {
      try {
        const raw = localStorage.getItem("userPosts") || "[]";
        const posts = JSON.parse(raw);
        if (!Array.isArray(posts) || posts.length === 0) {
          localStorage.setItem(migratedFlag, "1");
          return;
        }

        let changed = false;
        const newPosts = [];
        for (const p of posts) {
          const copy = { ...p };
          if (Array.isArray(copy.images) && copy.images.length > 0) {
            const nextImgs = [];
            for (const img of copy.images) {
              if (
                typeof img === "string" &&
                (img.startsWith("data:") || img.startsWith("blob:"))
              ) {
                try {
                  const compressed = await compressImageFromSrc(
                    img,
                    1200,
                    0.75
                  );
                  nextImgs.push(compressed);
                  if (compressed !== img) changed = true;
                } catch (e) {
                  // if a single image fails, keep original
                  console.warn("Failed to compress image during migration", e);
                  nextImgs.push(img);
                }
              } else {
                // skip external or local asset paths
                nextImgs.push(img);
              }
            }
            copy.images = nextImgs;
          }
          newPosts.push(copy);
        }

        if (changed) {
          try {
            localStorage.setItem("userPosts", JSON.stringify(newPosts));
            toast.success("Migración de imágenes completada (userPosts)");
          } catch (e) {
            console.error("Failed to write migrated posts", e);
            toast.error(
              "No se pudo completar la migración: espacio insuficiente o error"
            );
          }
        }
        localStorage.setItem(migratedFlag, "1");
        // reload posts into state
        loadPosts();
      } catch (e) {
        console.error("Migration failed", e);
        // mark as migrated to avoid retry loops
        localStorage.setItem("userPosts_migrated_v1", "1");
      }
    };

    // run migration in background
    setTimeout(() => {
      runMigration();
    }, 500);
  }, []);

  // debounce the searchTerm to avoid rapid re-filtering while typing
  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // compute filtered + sorted posts for display according to debouncedTerm
  const q = (debouncedTerm || "").toLowerCase();
  let filteredPosts = posts.slice();
  if (q) {
    filteredPosts = posts.filter((p) => {
      const fields = [
        p.title,
        p.description,
        p.owner,
        p.contact,
        p.Productname,
        p.ProductName,
        p.body,
      ];
      return fields.some((f) => f && String(f).toLowerCase().includes(q));
    });
  }
  // sort by createdAt (newest first) falling back to numeric id
  filteredPosts.sort((a, b) => {
    const aTime = a.createdAt ? Date.parse(a.createdAt) : Number(a.id) || 0;
    const bTime = b.createdAt ? Date.parse(b.createdAt) : Number(b.id) || 0;
    return bTime - aTime;
  });

  // prepare content to render for the posts area (keeps JSX simpler)
  const listContent =
    posts.length === 0 ? (
      <div className="alert alert-secondary">No hay publicaciones todavía.</div>
    ) : (
      <>
        {searchTerm ? (
          <div className="mb-3">
            <small className="text-muted">
              Resultados para "{searchTerm}" ({filteredPosts.length})
            </small>
          </div>
        ) : null}

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {filteredPosts.map((post) => {
            const title =
              post.title ||
              post.Productname ||
              post.ProductName ||
              "Sin título";
            const img =
              (post.images && post.images[0]) ||
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
                        to={`/foro/publicacion/${post.id}`}
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
      </>
    );

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

            {/* Inline search input replacing previous "Buscar Publicaciones" button */}
            <form
              className="d-flex align-items-center gap-2"
              onSubmit={(e) => e.preventDefault()}
              role="search"
            >
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Buscar publicaciones (título, descripción, vendedor, contacto)"
                  aria-label="Buscar publicaciones"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm ? (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchTerm("")}
                    title="Limpiar"
                  >
                    ✕
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-12">
            <h4 className="mb-3">Comunidad KBR</h4>
            {listContent}
          </div>
        </div>
      </div>
    </div>
  );
}
