import React, { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function Publicaciones() {
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editImages, setEditImages] = useState([]);
  const fileRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  const load = () => {
    const all = JSON.parse(localStorage.getItem("userPosts") || "[]");
    // filter posts belonging to current user
    const mine = all.filter((p) => isOwnedByUser(p, currentUser));
    // sort desc
    mine.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
    setPosts(mine);
  };

  useEffect(() => {
    load();
    const onUpdated = () => load();
    window.addEventListener("postsUpdated", onUpdated);
    return () => window.removeEventListener("postsUpdated", onUpdated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOwnedByUser = (post, user) => {
    if (!user) return false;
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    return (
      (post.ownerEmail && user.email && post.ownerEmail === user.email) ||
      (post.contact && user.email && post.contact === user.email) ||
      (post.owner && fullName && post.owner === fullName) ||
      (post.owner && user.firstName && post.owner === user.firstName) ||
      (post.owner && user.email && post.owner === user.email)
    );
  };

  const remove = (id) => {
    if (
      !window.confirm(
        "¿Eliminar publicación? Esta acción no se puede deshacer."
      )
    )
      return;
    const all = JSON.parse(localStorage.getItem("userPosts") || "[]");
    const next = all.filter((p) => String(p.id) !== String(id));
    localStorage.setItem("userPosts", JSON.stringify(next));
    window.dispatchEvent(new Event("postsUpdated"));
    toast.success("Publicación eliminada");
    load();
  };

  const startEdit = (post) => {
    setEditingId(post.id);
    setEditForm({
      title: post.title || "",
      price: post.price || "",
      description: post.description || "",
      contact: post.contact || "",
    });
    setEditImages(post.images || []);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
    setEditImages([]);
    try {
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      console.warn("Could not reset edit file input", e);
    }
  };

  // compress image file to a dataURL; maxWidth 1200px, quality 0.75
  const compressImage = (file, maxWidth = 1200, quality = 0.75) =>
    new Promise((resolve, reject) => {
      try {
        const img = new Image();
        const url = URL.createObjectURL(file);
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
          } finally {
            URL.revokeObjectURL(url);
          }
        };
        img.onerror = (e) => {
          URL.revokeObjectURL(url);
          reject(e || new Error("Image load error"));
        };
        img.src = url;
      } catch (e) {
        reject(e);
      }
    });

  const handleEditFiles = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (files.length === 0) return;
    try {
      const dataUrls = await Promise.all(
        files.map((f) => compressImage(f, 1200, 0.75))
      );
      setEditImages(dataUrls);
    } catch (err) {
      console.error(err);
      toast.error("No se pudieron procesar las imágenes");
    }
  };

  const saveEdit = (id) => {
    // validate
    if (
      !editForm.title.trim() ||
      !editForm.price.trim() ||
      !editForm.description.trim() ||
      !editForm.contact.trim()
    ) {
      toast.error("Completa los campos obligatorios");
      return;
    }
    if (!editImages || editImages.length === 0) {
      toast.error("Debes incluir al menos 1 imagen");
      return;
    }
    const all = JSON.parse(localStorage.getItem("userPosts") || "[]");
    const next = all.map((p) => {
      if (String(p.id) === String(id)) {
        return {
          ...p,
          title: editForm.title.trim(),
          price: editForm.price.trim(),
          description: editForm.description.trim(),
          contact: editForm.contact.trim(),
          images: editImages.slice(0, 5),
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });
    localStorage.setItem("userPosts", JSON.stringify(next));
    window.dispatchEvent(new Event("postsUpdated"));
    toast.success("Publicación actualizada");
    cancelEdit();
    load();
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Mis Publicaciones</h2>
      {!currentUser ? (
        <div className="alert alert-warning">
          Debes iniciar sesión para ver tus publicaciones.
        </div>
      ) : posts.length === 0 ? (
        <div className="alert alert-secondary">
          No tienes publicaciones aún.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {posts.map((post) => (
            <div className="col" key={post.id}>
              <div className="card h-100 shadow-sm border-0">
                <div
                  style={{
                    height: 220,
                    overflow: "hidden",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <img
                    src={
                      (post.images && post.images[0]) ||
                      "/assets/placeholder.webp"
                    }
                    alt=""
                    className="img-fluid w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  {editingId === post.id ? (
                    <>
                      <input
                        className="form-control mb-2"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm((s) => ({ ...s, title: e.target.value }))
                        }
                      />
                      <input
                        className="form-control mb-2"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm((s) => ({ ...s, price: e.target.value }))
                        }
                      />
                      <textarea
                        className="form-control mb-2"
                        rows={3}
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((s) => ({
                            ...s,
                            description: e.target.value,
                          }))
                        }
                      />
                      <input
                        className="form-control mb-2"
                        value={editForm.contact}
                        onChange={(e) =>
                          setEditForm((s) => ({
                            ...s,
                            contact: e.target.value,
                          }))
                        }
                      />
                      <div className="mb-2">
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleEditFiles}
                          className="form-control"
                        />
                        <small className="text-muted">
                          Sube hasta 5 imágenes para reemplazar las actuales.
                        </small>
                      </div>
                      <div className="d-flex gap-2 mt-auto">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => saveEdit(post.id)}
                        >
                          Guardar
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={cancelEdit}
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h5 className="card-title">{post.title}</h5>
                      <p className="text-muted small mb-1">
                        Precio: {post.price}
                      </p>
                      <p className="card-text text-truncate mb-2">
                        {post.description}
                      </p>
                      <div className="mt-auto d-flex gap-2">
                        <Link
                          to={`/foro/publicacion/${post.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Ver
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => startEdit(post)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => remove(post.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
