import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Publicar() {
  const navigate = useNavigate();
  // prefills owner when there's a logged user
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const defaultOwner = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim()
    : "";

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    owner: defaultOwner,
    contact: currentUser?.email || "",
  });
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.title.trim()) return "Nombre es obligatorio";
    if (!form.price.trim()) return "Precio es obligatorio";
    if (!form.description.trim()) return "Descripción es obligatoria";
    if (!form.owner.trim()) return "Nombre del vendedor es obligatorio";
    if (!form.contact.trim()) return "Contacto es obligatorio";
    if (!images || images.length === 0) return "Debes subir al menos 1 imagen";
    if (images.length > 5) return "Máximo 5 imágenes permitidas";
    return null;
  };

  const nextId = () => {
    const local = safeGetPosts();
    const maxLocal = Math.max(0, ...local.map((p) => Number(p.id) || 0));
    return Date.now() + maxLocal + 1;
  };

  const safeGetPosts = () => {
    try {
      const raw = localStorage.getItem("userPosts");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn("userPosts is invalid JSON, resetting to []", e);
      try {
        localStorage.setItem("userPosts", JSON.stringify([]));
      } catch (err) {
        console.warn("Could not reset userPosts", err);
      }
      return [];
    }
  };

  const safeSetPosts = (arr) => {
    try {
      localStorage.setItem("userPosts", JSON.stringify(arr));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    const newPost = {
      id: nextId(),
      title: form.title.trim(),
      price: form.price.trim(),
      description: form.description.trim(),
      owner: form.owner.trim(),
      ownerEmail: currentUser?.email || undefined,
      contact: form.contact.trim(),
      images: images.slice(0, 5),
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = safeGetPosts();
      existing.unshift(newPost);
      const res = safeSetPosts(existing);
      if (!res.ok) {
        console.error("Failed to save userPosts", res.error);
        const e = res.error;
        const isQuota =
          e &&
          (e.name === "QuotaExceededError" ||
            e.code === 22 ||
            /quota/i.test(e.message || ""));
        if (isQuota) {
          toast.error(
            "Espacio de almacenamiento insuficiente en el navegador. Intenta reducir el tamaño de las imágenes o eliminar publicaciones antiguas."
          );
        } else {
          toast.error("No se pudo guardar la publicación");
        }
        return;
      }
      window.dispatchEvent(new Event("postsUpdated"));
      toast.success("Publicación creada correctamente");
      // small delay to let toast show
      setTimeout(() => navigate("/foro"), 700);
    } catch (err) {
      console.error(err);
      toast.error("No se pudo guardar la publicación");
    }
  };

  // helpers to read files as data URLs
  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (files.length === 0) return;
    try {
      const dataUrls = await Promise.all(
        files.map((f) => readFileAsDataURL(f))
      );
      setImages(dataUrls);
    } catch (err) {
      console.error("Error leyendo imágenes", err);
      toast.error("No se pudieron procesar las imágenes");
    }
  };

  const removeImage = (idx) => {
    const next = [...images];
    next.splice(idx, 1);
    setImages(next);
    try {
      if (fileInputRef.current) fileInputRef.current.value = ""; // reset input
    } catch (e) {
      console.warn("Could not reset file input", e);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Crear Publicación</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-12">
          <label className="form-label">Nombre</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Precio</label>
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            className="form-control"
            placeholder="$0"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Nombre del vendedor</label>
          <input
            name="owner"
            value={form.owner}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-12">
          <label className="form-label">Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="form-control"
            rows={4}
          />
        </div>

        <div className="col-12">
          <label className="form-label">Contacto</label>
          <input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            className="form-control"
            placeholder="Email o teléfono"
          />
        </div>

        <div className="col-12">
          <label className="form-label">Imágenes (1 a 5)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="form-control"
            onChange={handleFiles}
          />
          <small className="text-muted">
            Sube entre 1 y 5 imágenes. Se guardarán localmente.
          </small>
        </div>

        {images && images.length > 0 ? (
          <div className="col-12">
            <div className="d-flex flex-wrap gap-2">
              {images.map((src, idx) => (
                <div key={idx} style={{ width: 100, position: "relative" }}>
                  <img
                    src={src}
                    alt={`img-${idx}`}
                    style={{
                      width: "100%",
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    style={{ position: "absolute", top: 6, right: 6 }}
                    onClick={() => removeImage(idx)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="col-12 d-flex gap-2">
          <button className="btn btn-primary">Publicar</button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/foro")}
          >
            Cancelar
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
