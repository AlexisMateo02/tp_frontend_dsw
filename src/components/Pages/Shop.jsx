import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Products from '../../data/Product.json';
import KayakTypes from '../../data/KayakTypes.json';
import SUPTypes from '../../data/SUPTypes.json';
import BoatTypes from '../../data/BoatTypes.json';
import ArticleTypes from '../../data/ArticleTypes.json';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddProduct() {
  const navigate = useNavigate();
  // TODO: reemplazar con el email de destino real
  const RECIPIENT_EMAIL = 'rafi2do@gmail.com';
  const [form, setForm] = useState({
    Productname: '',
    price: '',
    oldPrice: '',
    tag: '',
    category: '',
    image: '',
    secondImage: '',
    thirdImage: '',
    fourthImage: '',
    description: '',
    owner: '',
    includes: '',
    kayakTypeId: '',
    supTypeId: '',
    boatTypeId: '',
    articleTypeId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === 'category') {
      setForm(f => ({
        ...f,
        kayakTypeId: '',
        supTypeId: '',
        boatTypeId: '',
        articleTypeId: ''
      }));
    }
  };

  // Ayudante: leer un File y devolver un Data URL
  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 4);
    if (files.length === 0) return;
    try {
      const dataUrls = await Promise.all(
        files.map((f) => readFileAsDataURL(f))
      );
      // mapear a los campos image, secondImage, thirdImage, fourthImage
      const updated = { ...form };
      if (dataUrls[0]) updated.image = dataUrls[0];
      if (dataUrls[1]) updated.secondImage = dataUrls[1];
      if (dataUrls[2]) updated.thirdImage = dataUrls[2];
      if (dataUrls[3]) updated.fourthImage = dataUrls[3];
      setForm(updated);
    } catch {
      console.error('Error leyendo archivos');
      toast.error('No se pudieron procesar las imágenes');
    }
  };

  const fileInputRef = useRef(null);

  const removeImage = (idx) => {
    const imgs = [
      form.image || '',
      form.secondImage || '',
      form.thirdImage || '',
      form.fourthImage || '',
    ];
    // eliminar la imagen en la posición idx
    imgs.splice(idx, 1);
    // mantener hasta 4 elementos, rellenar con strings vacíos si hace falta
    while (imgs.length < 4) imgs.push('');
    const updated = {
      ...form,
      image: imgs[0],
      secondImage: imgs[1],
      thirdImage: imgs[2],
      fourthImage: imgs[3],
    };
    setForm(updated);
    // limpiar la selección del input file para evitar reutilizar el FileList anterior
    try {
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      // ignorar errores al limpiar
    }
  };

  const nextId = () => {
    const local = JSON.parse(localStorage.getItem('userProducts') || '[]');
    const maxJson = Math.max(0, ...Products.map((p) => Number(p.id) || 0));
    const maxLocal = Math.max(0, ...local.map((p) => Number(p.id) || 0));
    return Math.max(maxJson, maxLocal) + 1;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validaciones de campos obligatorios
    if (!form.Productname.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }
    if (!form.price.trim()) {
      toast.error('El precio es obligatorio');
      return;
    }
    if (!form.category.trim()) {
      toast.error('La categoría es obligatoria');
      return;
    }
    if (!form.description.trim()) {
      toast.error('La descripción es obligatoria');
      return;
    }
    // Validar que se haya seleccionado el tipo específico según categoría
    if (form.category === 'kayak' && !form.kayakTypeId) {
      toast.error('Selecciona un tipo de kayak');
      return;
    }
    if (form.category === 'sup' && !form.supTypeId) {
      toast.error('Selecciona un tipo de SUP');
      return;
    }
    if (form.category === 'embarcacion' && !form.boatTypeId) {
      toast.error('Selecciona un tipo de embarcación');
      return;
    }
    if (form.category === 'articulo' && !form.articleTypeId) {
      toast.error('Selecciona un tipo de artículo');
      return;
    }
    const imagenes = [
      form.image,
      form.secondImage,
      form.thirdImage,
      form.fourthImage,
    ].filter(Boolean);
    if (imagenes.length === 0) {
      toast.error('Debes subir al menos una imagen');
      return;
    }

    const newProduct = {
      id: nextId(),
      Productname: form.Productname.trim(),
      category: form.category,
      price: form.price.trim(),
      oldPrice: form.oldPrice.trim() || undefined,
      tag: form.tag.trim() || undefined,
      image: form.image || '/assets/placeholder.webp',
      secondImage: form.secondImage || undefined,
      thirdImage: form.thirdImage || undefined,
      fourthImage: form.fourthImage || undefined,
      description: form.description.trim() || undefined,
      owner: form.owner.trim() || undefined,
      includes: form.includes.trim() || undefined,
      kayakTypeId: form.kayakTypeId ? Number(form.kayakTypeId) : undefined,
      supTypeId: form.supTypeId ? Number(form.supTypeId) : undefined,
      boatTypeId: form.boatTypeId ? Number(form.boatTypeId) : undefined,
      articleTypeId: form.articleTypeId ? Number(form.articleTypeId) : undefined,
    };

    try {
      const userProducts = JSON.parse(
        localStorage.getItem('userProducts') || '[]'
      );
      userProducts.push(newProduct);
      localStorage.setItem('userProducts', JSON.stringify(userProducts));
      // emitir evento para actualizar listados que escuchen
      window.dispatchEvent(new Event('productsUpdated'));
      toast.success('Producto creado correctamente');
      // Abrir cliente de correo con los datos del producto (mailto)
      try {
        const subject = encodeURIComponent(
          `Nuevo producto: ${newProduct.Productname}`
        );
        const bodyLines = [
          `Nombre: ${newProduct.Productname}`,
          `Precio: ${newProduct.price}`,
          `Categoría: ${newProduct.category}`,
          `Tag: ${newProduct.tag || ''}`,
          `Owner: ${newProduct.owner || ''}`,
          `Descripción: ${newProduct.description || ''}`,
          `Incluye: ${newProduct.includes || ''}`,
          '',
          'Nota: las imágenes se guardaron en localStorage en userProducts. Para adjuntarlas al correo, usa un backend o servicio de correo que permita attachments.',
        ];
        const body = encodeURIComponent(bodyLines.join('\n'));
        const mailto = `mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;
        // abrir el cliente de correo
        window.location.href = mailto;
      } catch {
        // no bloquear si falla abrir el mailto
      }
      // redirigir a Shop o Articles
      navigate('/articles');
    } catch (err) {
      console.error(err);
      toast.error('No se pudo guardar el producto');
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

          <div className="col-md-6">
            <label className="form-label">Categoría *</label>
            <select
              name="category"
              className="form-select"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              <option value="kayak">Kayak</option>
              <option value="sup">SUP</option>
              <option value="embarcacion">Embarcación</option>
              <option value="articulo">Artículo</option>
            </select>
          </div>

          {/* Selector de tipo específico según categoría */}
          {form.category === 'kayak' && (
            <div className="col-md-6">
              <label className="form-label">Tipo de Kayak *</label>
              <select
                name="kayakTypeId"
                className="form-select"
                value={form.kayakTypeId}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un tipo</option>
                {KayakTypes.map(k => (
                  <option key={k.id} value={k.id}>
                    {k.brand} {k.model} - {k.paddlersQuantity} pers.
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.category === 'sup' && (
            <div className="col-md-6">
              <label className="form-label">Tipo de SUP *</label>
              <select
                name="supTypeId"
                className="form-select"
                value={form.supTypeId}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un tipo</option>
                {SUPTypes.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.brand} {s.model} - {s.boardType}
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.category === 'embarcacion' && (
            <div className="col-md-6">
              <label className="form-label">Tipo de Embarcación *</label>
              <select
                name="boatTypeId"
                className="form-select"
                value={form.boatTypeId}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un tipo</option>
                {BoatTypes.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.brand} {b.model} - {b.boatCategory}
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.category === 'articulo' && (
            <div className="col-md-6">
              <label className="form-label">Tipo de Artículo *</label>
              <select
                name="articleTypeId"
                className="form-select"
                value={form.articleTypeId}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un tipo</option>
                {ArticleTypes.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} - {a.mainUse}
                  </option>
                ))}
              </select>
            </div>
          )}

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
            <label className="form-label">Tag</label>
            <select
              name="tag"
              className="form-select"
              value={form.tag}
              onChange={handleChange}
            >
              <option value="">Sin tag</option>
              <option value="Nuevo">Nuevo</option>
              <option value="Oferta">Oferta</option>
              <option value="Destacado">Destacado</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Dueño</label>
            <input
              name="owner"
              className="form-control"
              value={form.owner}
              onChange={handleChange}
              placeholder="KBR"
            />
          </div>
          <div className="col-12">
            <label className="form-label">Subir imágenes (hasta 4)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="form-control"
            />
            <small className="text-muted">
              Se usan las imágenes subidas para la previsualización y guardado.
            </small>
            {/* Previsualización colocada justo debajo del input de subida */}
            <div className="mt-3">
              <h5 className="mb-2">Previsualización</h5>
              <div className="card p-3" style={{ maxWidth: 420 }}>
                <div
                  style={{
                    width: '100%',
                    height: 220,
                    overflow: 'hidden',
                    borderRadius: 6,
                  }}
                >
                  <img
                    src={
                      form.image ||
                      form.secondImage ||
                      form.thirdImage ||
                      form.fourthImage ||
                      '/assets/placeholder.webp'
                    }
                    alt="preview-main"
                    className="img-fluid mb-2"
                    style={{
                      height: '100%',
                      objectFit: 'cover',
                      width: '100%',
                    }}
                  />
                </div>
                <div className="d-flex gap-2 my-2">
                  {[
                    form.image,
                    form.secondImage,
                    form.thirdImage,
                    form.fourthImage,
                  ].map((src, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: 80,
                        height: 60,
                        overflow: 'hidden',
                        borderRadius: 4,
                        border: '1px solid #eee',
                        position: 'relative',
                      }}
                    >
                      <img
                        src={src || '/assets/placeholder.webp'}
                        alt={`thumb-${idx}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      {src ? (
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          title="Eliminar imagen"
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            background: 'rgba(0,0,0,0.6)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: 22,
                            height: 22,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          ×
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
                <div>
                  <strong>{form.Productname || 'Nombre del producto'}</strong>
                  <div>{form.price || 'Precio'}</div>
                  <div>{form.price || 'Precio'}</div>
                  <div className="text-muted">
                    {
                      form.category === 'kayak' ? 'Kayak' :
                      form.category === 'sup' ? 'SUP' :
                      form.category === 'embarcacion' ? 'Embarcación' :
                      form.category === 'articulo' ? 'Artículo' : 'Sin categoría'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <label className="form-label">Descripción *</label>
            <textarea
              name="description"
              className="form-control"
              rows="4"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">Incluye (opcional)</label>
            <input
              name="includes"
              className="form-control"
              value={form.includes}
              onChange={handleChange}
              placeholder="Ej: Remo, chaleco, bomba de inflado"
            />
          </div>

          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              Solicitar venta
            </button>

            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/articles')}
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
    </div>
  );
}
