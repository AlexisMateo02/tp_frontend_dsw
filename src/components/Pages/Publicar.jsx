import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../services/api";

export default function Publicar() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    contact: currentUser?.email || "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!currentUser) {
      toast.info("Debes iniciar sesión para crear una publicación");
      navigate("/login", { state: { returnTo: "/foro/crear" } });
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.title.trim()) return "Título es obligatorio";
    if (!form.description.trim()) return "Descripción es obligatoria";
    if (!form.contact.trim()) return "Contacto es obligatorio";
    if (!images || images.length === 0) return "Debes subir al menos 1 imagen";
    if (images.length > 5) return "Máximo 5 imágenes permitidas";
    return null;
  };

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

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (files.length === 0) return;
    
    try {
      toast.info("Procesando imágenes...");
      const dataUrls = await Promise.all(
        files.map((f) => compressImage(f, 1200, 0.75))
      );
      setImages(dataUrls);
      toast.success("Imágenes procesadas correctamente");
    } catch (err) {
      console.error("Error procesando imágenes", err);
      toast.error("No se pudieron procesar las imágenes");
    }
  };

  const removeImage = (idx) => {
    const next = [...images];
    next.splice(idx, 1);
    setImages(next);
    try {
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) {
      console.warn("Could not reset file input", e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para el backend
      const postData = {
        title: form.title.trim(),
        content: form.description.trim(),
        contactInfo: form.contact.trim(),
        authorId: currentUser.id,
        images: images.slice(0, 5),
        price: form.price.trim() ? parseFloat(form.price.trim()) : undefined,
      };

      if (api.hasApi()) {
        try {
          // Crear en el backend
          await api.createForumPost(postData);
          toast.success("Publicación creada correctamente");
          window.dispatchEvent(new Event("postsUpdated"));
          setTimeout(() => navigate("/foro"), 700);
          return;
        } catch (error) {
          console.warn('Error en backend, guardando localmente:', error);
          toast.warn('No se pudo guardar en el servidor, guardando localmente');
        }
      }

      // Fallback a localStorage
      const localPost = {
        id: Date.now(),
        ...postData,
        owner: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
        ownerEmail: currentUser.email,
        contact: postData.contactInfo,
        description: postData.content,
        createdAt: new Date().toISOString(),
      };

      const existing = JSON.parse(localStorage.getItem("userPosts") || "[]");
      existing.unshift(localPost);
      localStorage.setItem("userPosts", JSON.stringify(existing));
      
      window.dispatchEvent(new Event("postsUpdated"));
      toast.success("Publicación creada localmente");
      setTimeout(() => navigate("/foro"), 700);
      
    } catch (err) {
      console.error('Error creating post:', err);
      toast.error(err.message || "No se pudo crear la publicación");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h2 className="mb-4">Crear Publicación</h2>
      
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-12">
          <label className="form-label">Título *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="form-control"
            required
            maxLength={200}
          />
          <small className="text-muted">Máximo 200 caracteres</small>
        </div>

        <div className="col-md-6">
          <label className="form-label">Precio (opcional)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={handleChange}
            className="form-control"
            placeholder="0.00"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Contacto *</label>
          <input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            className="form-control"
            placeholder="Email o teléfono"
            required
            maxLength={500}
          />
        </div>

        <div className="col-12">
          <label className="form-label">Descripción *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="form-control"
            rows={4}
            required
            minLength={10}
            maxLength={5000}
          />
          <small className="text-muted">Mínimo 10 caracteres, máximo 5000</small>
        </div>

        <div className="col-12">
          <label className="form-label">Imágenes (1 a 5) *</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="form-control"
            onChange={handleFiles}
            required={images.length === 0}
          />
          <small className="text-muted">
            Sube entre 1 y 5 imágenes. Se comprimirán automáticamente.
          </small>
        </div>

        {images && images.length > 0 && (
          <div className="col-12">
            <label className="form-label">Vista previa ({images.length}/5)</label>
            <div className="d-flex flex-wrap gap-2">
              {images.map((src, idx) => (
                <div key={idx} style={{ width: 100, position: "relative" }}>
                  <img
                    src={src}
                    alt={`Preview ${idx + 1}`}
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
                    style={{ position: "absolute", top: 4, right: 4 }}
                    onClick={() => removeImage(idx)}
                    title="Eliminar imagen"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="col-12 d-flex gap-2">
          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Publicando...' : 'Publicar'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/foro")}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}