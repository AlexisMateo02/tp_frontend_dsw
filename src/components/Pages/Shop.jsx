import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import KayakTypes from '../../data/KayakTypes.json';
import SUPTypes from '../../data/SUPTypes.json';
import BoatTypes from '../../data/BoatTypes.json';
import ArticleTypes from '../../data/ArticleTypes.json';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Shop() {
  const navigate = useNavigate();
  const [currentSeller, setCurrentSeller] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    rating: 0,
  });

  // Form para nuevo producto
  const [form, setForm] = useState({
    Productname: '',
    price: '',
    oldPrice: '',
    tag: '',
    category: '',
    stock: '1',
    image: '',
    secondImage: '',
    thirdImage: '',
    fourthImage: '',
    description: '',
    includes: '',
    kayakTypeId: '',
    supTypeId: '',
    boatTypeId: '',
    articleTypeId: '',
  });

  const fileInputRef = useRef(null);

  const loadMyProducts = useCallback((sellerId) => {
    const allProducts =
      JSON.parse(localStorage.getItem('marketplaceProducts')) || [];
    const mine = allProducts.filter((p) => p.sellerId === sellerId);
    setMyProducts(mine);
  }, []);

  const calculateStats = useCallback((sellerId, sellerRating = 0) => {
    const allProducts =
      JSON.parse(localStorage.getItem('marketplaceProducts')) || [];
    const mine = allProducts.filter((p) => p.sellerId === sellerId);

    setStats({
      totalProducts: mine.length,
      totalSales: mine.reduce((sum, p) => sum + (p.soldCount || 0), 0),
      rating: sellerRating || 0,
    });
  }, []);

  useEffect(() => {
    // Verificar si hay un vendedor logueado
    const seller = JSON.parse(localStorage.getItem('currentSeller'));
    if (!seller) {
      toast.error('Debes registrarte como vendedor primero');
      navigate('/register');
      return;
    }
    setCurrentSeller(seller);
    loadMyProducts(seller.id);
    calculateStats(seller.id, seller.rating);
  }, [navigate, loadMyProducts, calculateStats]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    if (name === 'category') {
      setForm((f) => ({
        ...f,
        kayakTypeId: '',
        supTypeId: '',
        boatTypeId: '',
        articleTypeId: '',
      }));
    }
  };

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
      const updated = { ...form };
      if (dataUrls[0]) updated.image = dataUrls[0];
      if (dataUrls[1]) updated.secondImage = dataUrls[1];
      if (dataUrls[2]) updated.thirdImage = dataUrls[2];
      if (dataUrls[3]) updated.fourthImage = dataUrls[3];
      setForm(updated);
    } catch {
      toast.error('Error al procesar las imágenes');
    }
  };

  const removeImage = (idx) => {
    const imgs = [
      form.image || '',
      form.secondImage || '',
      form.thirdImage || '',
      form.fourthImage || '',
    ];
    imgs.splice(idx, 1);
    while (imgs.length < 4) imgs.push('');

    setForm({
      ...form,
      image: imgs[0],
      secondImage: imgs[1],
      thirdImage: imgs[2],
      fourthImage: imgs[3],
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const nextId = () => {
    const allProducts =
      JSON.parse(localStorage.getItem('marketplaceProducts')) || [];
    const maxId = Math.max(0, ...allProducts.map((p) => Number(p.id) || 0));
    return maxId + 1;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.Productname.trim() ||
      !form.price.trim() ||
      !form.category.trim() ||
      !form.description.trim()
    ) {
      toast.error('Completa todos los campos obligatorios');
      return;
    }

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
      stock: Number(form.stock) || 1,
      image: form.image || '/assets/placeholder.webp',
      secondImage: form.secondImage || undefined,
      thirdImage: form.thirdImage || undefined,
      fourthImage: form.fourthImage || undefined,
      description: form.description.trim() || undefined,
      includes: form.includes.trim() || undefined,
      kayakTypeId: form.kayakTypeId ? Number(form.kayakTypeId) : undefined,
      supTypeId: form.supTypeId ? Number(form.supTypeId) : undefined,
      boatTypeId: form.boatTypeId ? Number(form.boatTypeId) : undefined,
      articleTypeId: form.articleTypeId
        ? Number(form.articleTypeId)
        : undefined,
      sellerId: currentSeller.id,
      sellerName: currentSeller.businessName,
      approved: false, // Requiere aprobación de admin
      soldCount: 0,
      createdAt: new Date().toISOString(),
    };

    try {
      const allProducts =
        JSON.parse(localStorage.getItem('marketplaceProducts')) || [];
      allProducts.push(newProduct);
      localStorage.setItem('marketplaceProducts', JSON.stringify(allProducts));

      toast.success('Producto creado. Pendiente de aprobación.');
      setShowAddProduct(false);
      loadMyProducts(currentSeller.id);
      calculateStats(currentSeller.id, currentSeller?.rating);

      // Resetear formulario
      setForm({
        Productname: '',
        price: '',
        oldPrice: '',
        tag: '',
        category: '',
        stock: '1',
        image: '',
        secondImage: '',
        thirdImage: '',
        fourthImage: '',
        description: '',
        includes: '',
        kayakTypeId: '',
        supTypeId: '',
        boatTypeId: '',
        articleTypeId: '',
      });
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar el producto');
    }
  };

  const deleteProduct = (productId) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    const allProducts =
      JSON.parse(localStorage.getItem('marketplaceProducts')) || [];
    const filtered = allProducts.filter((p) => p.id !== productId);
    localStorage.setItem('marketplaceProducts', JSON.stringify(filtered));

    toast.success('Producto eliminado');
    loadMyProducts(currentSeller.id);
    calculateStats(currentSeller.id, currentSeller?.rating);
  };

  if (!currentSeller) {
    return <div className="container py-5">Cargando...</div>;
  }

  return (
    <div className="container py-5">
      <ToastContainer />

      {/* Header con info del vendedor */}
      <div className="row mb-5">
        <div className="col-md-8">
          <h1>Panel de Vendedor</h1>
          <h4 className="text-muted">{currentSeller.businessName}</h4>
        </div>
        <div className="col-md-4 text-end">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddProduct(!showAddProduct)}
          >
            {showAddProduct ? 'Cancelar' : '+ Agregar Producto'}
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row mb-5">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h3>{stats.totalProducts}</h3>
              <p className="text-muted mb-0">Productos Publicados</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h3>{stats.totalSales}</h3>
              <p className="text-muted mb-0">Ventas Realizadas</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h3>{'⭐'.repeat(Math.round(stats.rating))}</h3>
              <p className="text-muted mb-0">Calificación</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario para agregar producto */}
      {showAddProduct && (
        <div className="card mb-5">
          <div className="card-body">
            <h3 className="mb-4">Nuevo Producto</h3>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre del Producto *</label>
                  <input
                    name="Productname"
                    className="form-control"
                    value={form.Productname}
                    onChange={handleChange}
                    required
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

                {/* Selector de tipo específico */}
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
                      {KayakTypes.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.brand} {k.model}
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
                      {SUPTypes.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.brand} {s.model}
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
                      {BoatTypes.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.brand} {b.model}
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
                      {ArticleTypes.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="col-md-4">
                  <label className="form-label">Precio *</label>
                  <input
                    name="price"
                    className="form-control"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="$0"
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Precio Anterior</label>
                  <input
                    name="oldPrice"
                    className="form-control"
                    value={form.oldPrice}
                    onChange={handleChange}
                    placeholder="Opcional"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Stock *</label>
                  <input
                    name="stock"
                    type="number"
                    min="1"
                    className="form-control"
                    value={form.stock}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Etiqueta</label>
                  <select
                    name="tag"
                    className="form-select"
                    value={form.tag}
                    onChange={handleChange}
                  >
                    <option value="">Sin etiqueta</option>
                    <option value="Nuevo">Nuevo</option>
                    <option value="Oferta">Oferta</option>
                    <option value="Destacado">Destacado</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">Imágenes (hasta 4) *</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFiles}
                    className="form-control"
                  />

                  <div className="mt-3 d-flex gap-2">
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
                          height: 80,
                          position: 'relative',
                          border: '1px solid #ddd',
                          borderRadius: 4,
                        }}
                      >
                        <img
                          src={src || '/assets/placeholder.webp'}
                          alt={`preview-${idx}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        {src && (
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            style={{
                              position: 'absolute',
                              top: 2,
                              right: 2,
                              background: 'rgba(0,0,0,0.7)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '50%',
                              width: 20,
                              height: 20,
                              cursor: 'pointer',
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
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
                    placeholder="Ej: Remo, chaleco, bomba"
                  />
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-primary me-2">
                    Publicar Producto
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddProduct(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de productos del vendedor */}
      <h3 className="mb-4">Mis Productos ({myProducts.length})</h3>
      {myProducts.length === 0 ? (
        <div className="alert alert-info">
          Aún no has publicado ningún producto. ¡Comienza agregando tu primer
          producto!
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Ventas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {myProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.image}
                      alt={product.Productname}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: 'cover',
                        borderRadius: 4,
                      }}
                    />
                  </td>
                  <td>{product.Productname}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    {product.approved ? (
                      <span className="badge bg-success">Aprobado</span>
                    ) : (
                      <span className="badge bg-warning">Pendiente</span>
                    )}
                  </td>
                  <td>{product.soldCount || 0}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
