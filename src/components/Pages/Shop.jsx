import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Products from "../../data/Product.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Productname: "",
    price: "",
    oldPrice: "",
    tag: "",
    category: "",
    image: "",
    secondImage: "",
    description: "",
    owner: "",
    includes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const nextId = () => {
    const local = JSON.parse(localStorage.getItem("userProducts") || "[]");
    const maxJson = Math.max(0, ...Products.map((p) => Number(p.id) || 0));
    const maxLocal = Math.max(0, ...local.map((p) => Number(p.id) || 0));
    return Math.max(maxJson, maxLocal) + 1;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.Productname.trim() ||
      !form.price.trim() ||
      !form.category.trim()
    ) {
      toast.error("Completa nombre, precio y categoría");
      return;
    }

    const newProduct = {
      id: nextId(),
      Productname: form.Productname.trim(),
      price: form.price.trim(),
      oldPrice: form.oldPrice.trim() || undefined,
      tag: form.tag.trim() || undefined,
      category: form.category.trim(),
      image: form.image.trim() || "/assets/placeholder.webp",
      secondImage: form.secondImage.trim() || undefined,
      description: form.description.trim() || undefined,
      owner: form.owner.trim() || undefined,
      includes: form.includes.trim() || undefined,
    };

    try {
      const userProducts = JSON.parse(
        localStorage.getItem("userProducts") || "[]"
      );
      userProducts.push(newProduct);
      localStorage.setItem("userProducts", JSON.stringify(userProducts));
      // emitir evento para actualizar listados que escuchen
      window.dispatchEvent(new Event("productsUpdated"));
      toast.success("Producto creado correctamente");
      // redirigir a Shop o Articles
      navigate("/shop");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo guardar el producto");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Alta de producto</h2>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nombre *</label>
            <input
              name="Productname"
              className="form-control"
              value={form.Productname}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Precio *</label>
            <input
              name="price"
              className="form-control"
              value={form.price}
              onChange={handleChange}
              placeholder="$0"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Precio anterior</label>
            <input
              name="oldPrice"
              className="form-control"
              value={form.oldPrice}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Categoría *</label>
            <input
              name="category"
              className="form-control"
              value={form.category}
              onChange={handleChange}
              placeholder="kayaks / sup / articulos"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Tag</label>
            <input
              name="tag"
              className="form-control"
              value={form.tag}
              onChange={handleChange}
              placeholder="Nuevo / Oferta"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Owner</label>
            <input
              name="owner"
              className="form-control"
              value={form.owner}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Imagen principal (URL)</label>
            <input
              name="image"
              className="form-control"
              value={form.image}
              onChange={handleChange}
              placeholder="/assets/imagen.webp"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Imagen secundaria (URL)</label>
            <input
              name="secondImage"
              className="form-control"
              value={form.secondImage}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Descripción</label>
            <textarea
              name="description"
              className="form-control"
              rows="4"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Incluye (opcional)</label>
            <input
              name="includes"
              className="form-control"
              value={form.includes}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              Guardar producto
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
            <div className="ms-auto">
              <small className="text-muted">
                Los productos creados quedan en localStorage (userProducts).
              </small>
            </div>
          </div>
        </div>
      </form>

      <hr className="my-4" />

      <h5>Previsualización</h5>
      <div className="card p-3" style={{ maxWidth: 420 }}>
        <img
          src={form.image || "/assets/placeholder.webp"}
          alt="preview"
          className="img-fluid mb-2"
          style={{ height: 180, objectFit: "cover", width: "100%" }}
        />
        <div>
          <strong>{form.Productname || "Nombre del producto"}</strong>
          <div>{form.price || "Precio"}</div>
          <div className="text-muted">{form.category}</div>
        </div>
      </div>
    </div>
  );
}
