import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importar datos de tipos
const KayakTypes = [
  { id: 1, brand: "Matrix", model: "Mantra Matrix" },
  { id: 2, brand: "Ocean Kayak", model: "Aloha" },
  { id: 3, brand: "Wenonah", model: "Kronos V" },
  { id: 4, brand: "INTEX", model: "Challenger K2" },
  { id: 5, brand: "Aquaglide", model: "Deschutes 130" },
];

const SUPTypes = [
  { id: 1, brand: "Red Paddle Co", model: "Allround 10'6" },
  { id: 2, brand: "Starboard", model: "Touring 11'" },
  { id: 3, brand: "Naish", model: "Race 12'6" },
  { id: 4, brand: "BIC Sport", model: "Surf 9'6" },
];

const BoatTypes = [
  { id: 1, brand: "Amarinta", model: "Amarinta 620 Cuddy" },
  { id: 2, brand: "Real Powerboats", model: "Real Powerboats-415" },
  { id: 3, brand: "Prestige", model: "Prestige F5.7" },
];

const ArticleTypes = [
  { id: 1, name: "Chaleco Salvavidas" },
  { id: 2, name: "Remo" },
  { id: 3, name: "Salvavidas Torpedo" },
  { id: 4, name: "Funda Impermeable" },
  { id: 5, name: "Bengala" },
];

export default function SellerDashboard() {
  const [currentSeller, setCurrentSeller] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products'); // products, sales, profile
  const [stats, setStats] = useState({ 
    totalProducts: 0, 
    approvedProducts: 0,
    pendingProducts: 0,
    totalSales: 0, 
    revenue: 0,
    rating: 0 
  });
  const [orders, setOrders] = useState([]);

  // Form para producto
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
    articleTypeId: ''
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    // Verificar si hay un vendedor logueado
    const seller = JSON.parse(localStorage.getItem('currentSeller'));
    if (!seller) {
      toast.error('Debes registrarte como vendedor primero');
      window.location.href = '/seller-register';
      return;
    }
    setCurrentSeller(seller);
    loadMyProducts(seller.id);
    loadMyOrders(seller.id);
    calculateStats(seller.id);
  }, []);

  const loadMyProducts = (sellerId) => {
    const allProducts = JSON.parse(localStorage.getItem('marketplaceProducts')) || [];
    const mine = allProducts.filter(p => p.sellerId === sellerId);
    setMyProducts(mine);
  };

  const loadMyOrders = (sellerId) => {
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const myOrders = allOrders.filter(order => 
      order.items?.some(item => item.sellerId === sellerId)
    );
    setOrders(myOrders);
  };

  const calculateStats = (sellerId) => {
    const allProducts = JSON.parse(localStorage.getItem('marketplaceProducts')) || [];
    const mine = allProducts.filter(p => p.sellerId === sellerId);
    
    const approved = mine.filter(p => p.approved).length;
    const pending = mine.filter(p => !p.approved).length;
    
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    let totalSales = 0;
    let revenue = 0;
    
    allOrders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          if (item.sellerId === sellerId) {
            totalSales += item.quantity;
            revenue += item.subtotal;
          }
        });
      }
    });

    const sellers = JSON.parse(localStorage.getItem('sellers')) || [];
    const seller = sellers.find(s => s.id === sellerId);
    
    setStats({
      totalProducts: mine.length,
      approvedProducts: approved,
      pendingProducts: pending,
      totalSales,
      revenue,
      rating: seller?.rating || 0
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    
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
      const dataUrls = await Promise.all(files.map(f => readFileAsDataURL(f)));
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
    const imgs = [form.image || '', form.secondImage || '', form.thirdImage || '', form.fourthImage || ''];
    imgs.splice(idx, 1);
    while (imgs.length < 4) imgs.push('');
    
    setForm({
      ...form,
      image: imgs[0],
      secondImage: imgs[1],
      thirdImage: imgs[2],
      fourthImage: imgs[3]
    });
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const nextId = () => {
    const allProducts = JSON.parse(localStorage.getItem('marketplaceProducts')) || [];
    const maxId = Math.max(0, ...allProducts.map(p => Number(p.id) || 0));
    return maxId + 1;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.Productname.trim() || !form.price.trim() || !form.category.trim() || !form.description.trim()) {
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

    const imagenes = [form.image, form.secondImage, form.thirdImage, form.fourthImage].filter(Boolean);
    if (imagenes.length === 0) {
      toast.error('Debes subir al menos una imagen');
      return;
    }

    const allProducts = JSON.parse(localStorage.getItem('marketplaceProducts')) || [];

    if (editingProduct) {
      // Actualizar producto existente
      const updated = allProducts.map(p => 
        p.id === editingProduct.id 
          ? {
              ...p,
              ...form,
              stock: Number(form.stock) || 1,
              kayakTypeId: form.kayakTypeId ? Number(form.kayakTypeId) : undefined,
              supTypeId: form.supTypeId ? Number(form.supTypeId) : undefined,
              boatTypeId: form.boatTypeId ? Number(form.boatTypeId) : undefined,
              articleTypeId: form.articleTypeId ? Number(form.articleTypeId) : undefined,
              updatedAt: new Date().toISOString()
            }
          : p
      );
      localStorage.setItem('marketplaceProducts', JSON.stringify(updated));
      toast.success('Producto actualizado correctamente');
      setEditingProduct(null);
    } else {
      // Crear nuevo producto
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
        articleTypeId: form.articleTypeId ? Number(form.articleTypeId) : undefined,
        sellerId: currentSeller.id,
        sellerName: currentSeller.businessName,
        approved: false,
        soldCount: 0,
        createdAt: new Date().toISOString()
      };

      allProducts.push(newProduct);
      localStorage.setItem('marketplaceProducts', JSON.stringify(allProducts));
      toast.success('Producto creado. Pendiente de aprobación.');
    }

    setShowAddProduct(false);
    loadMyProducts(currentSeller.id);
    calculateStats(currentSeller.id);
    resetForm();
  };

  const resetForm = () => {
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
      articleTypeId: ''
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const editProduct = (product) => {
    setForm({
      Productname: product.Productname || '',
      price: product.price || '',
      oldPrice: product.oldPrice || '',
      tag: product.tag || '',
      category: product.category || '',
      stock: String(product.stock || 1),
      image: product.image || '',
      secondImage: product.secondImage || '',
      thirdImage: product.thirdImage || '',
      fourthImage: product.fourthImage || '',
      description: product.description || '',
      includes: product.includes || '',
      kayakTypeId: String(product.kayakTypeId || ''),
      supTypeId: String(product.supTypeId || ''),
      boatTypeId: String(product.boatTypeId || ''),
      articleTypeId: String(product.articleTypeId || '')
    });
    setEditingProduct(product);
    setShowAddProduct(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = (productId) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    const allProducts = JSON.parse(localStorage.getItem('marketplaceProducts')) || [];
    const filtered = allProducts.filter(p => p.id !== productId);
    localStorage.setItem('marketplaceProducts', JSON.stringify(filtered));
    
    toast.success('Producto eliminado');
    loadMyProducts(currentSeller.id);
    calculateStats(currentSeller.id);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const updated = allOrders.map(o => 
      o.id === orderId ? {...o, status: newStatus} : o
    );
    localStorage.setItem('orders', JSON.stringify(updated));
    loadMyOrders(currentSeller.id);
    toast.success('Estado actualizado');
  };

  if (!currentSeller) {
    return <div className="container py-5">Cargando...</div>;
  }

  return (
    <div className="container py-5" style={{ marginTop: '100px' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="mb-2">Panel de Vendedor</h1>
          <h4 className="text-muted">{currentSeller.businessName}</h4>
          {currentSeller.verified && (
            <span className="badge bg-success">
              <i className="bi bi-check-circle"></i> Verificado
            </span>
          )}
        </div>
        <div className="col-md-4 text-end">
          {!showAddProduct && (
            <button 
              className="btn btn-primary"
              onClick={() => {
                setShowAddProduct(true);
                setEditingProduct(null);
                resetForm();
              }}
            >
              + Agregar Producto
            </button>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row mb-5">
        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-primary">{stats.totalProducts}</h3>
              <p className="text-muted mb-0">Total Productos</p>
              <small className="text-success">{stats.approvedProducts} aprobados</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-warning">{stats.pendingProducts}</h3>
              <p className="text-muted mb-0">Pendientes</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-success">{stats.totalSales}</h3>
              <p className="text-muted mb-0">Ventas</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="text-info">${stats.revenue.toFixed(0)}</h3>
              <p className="text-muted mb-0">Ingresos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Mis Productos
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => setActiveTab('sales')}
          >
            Ventas
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Mi Perfil
          </button>
        </li>
      </ul>

      {/* Formulario para agregar/editar producto */}
      {showAddProduct && activeTab === 'products' && (
        <div className="card mb-5 shadow">
          <div className="card-body">
            <h3 className="mb-4">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
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
                      {SUPTypes.map(s => (
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
                      {BoatTypes.map(b => (
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
                      {ArticleTypes.map(a => (
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
                    min="0"
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
                  
                  <div className="mt-3 d-flex gap-2 flex-wrap">
                    {[form.image, form.secondImage, form.thirdImage, form.fourthImage].map((src, idx) => (
                      <div key={idx} style={{ width: 100, height: 100, position: 'relative', border: '2px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
                        <img
                          src={src || '/assets/placeholder.webp'}
                          alt={`preview-${idx}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {src && (
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            style={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              background: 'rgba(220, 53, 69, 0.9)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '50%',
                              width: 24,
                              height: 24,
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: 'bold'
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
                    {editingProduct ? 'Actualizar' : 'Publicar'} Producto
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowAddProduct(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Productos */}
      {activeTab === 'products' && !showAddProduct && (
        <div>
          <h3 className="mb-4">Mis Productos ({myProducts.length})</h3>
          {myProducts.length === 0 ? (
            <div className="alert alert-info">
              Aún no has publicado ningún producto. ¡Comienza agregando tu primer producto!
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Ventas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {myProducts.map(product => (
                    <tr key={product.id}>
                      <td>
                        <img 
                          src={product.image} 
                          alt={product.Productname}
                          style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                        />
                      </td>
                      <td>
                        <strong>{product.Productname}</strong>
                        {product.tag && (
                          <span className="badge bg-secondary ms-2">{product.tag}</span>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-info">{product.category}</span>
                      </td>
                      <td><strong>{product.price}</strong></td>
                      <td>{product.stock}</td>
                      <td>
                        {product.approved ? (
                          <span className="badge bg-success">✓ Aprobado</span>
                        ) : (
                          <span className="badge bg-warning">⏳ Pendiente</span>
                        )}
                      </td>
                      <td>{product.soldCount || 0}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => editProduct(product)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteProduct(product.id)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Ventas */}
      {activeTab === 'sales' && (
        <div>
          <h3 className="mb-4">Mis Ventas ({orders.length})</h3>
          {orders.length === 0 ? (
            <div className="alert alert-info">
              Aún no tienes ventas registradas.
            </div>
          ) : (
            <div className="row">
              {orders.map(order => (
                <div key={order.id} className="col-12 mb-3">
                  <div className="card shadow-sm">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Pedido #{order.orderNumber}</strong>
                        <span className="ms-3 text-muted">{new Date(order.orderDate).toLocaleDateString()}</span>
                      </div>
                      <select 
                        className="form-select w-auto"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                    <div className="card-body">
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <small className="text-muted">Cliente</small>
                          <p className="mb-0"><strong>{order.buyerName}</strong></p>
                          <p className="mb-0 text-muted">{order.buyerEmail}</p>
                        </div>
                        <div className="col-md-6">
                          <small className="text-muted">Dirección de envío</small>
                          <p className="mb-0">{order.shippingAddress}</p>
                          <p className="mb-0 text-muted">{order.shippingCity}</p>
                        </div>
                      </div>
                      
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items?.filter(item => item.sellerId === currentSeller.id).map((item, idx) => (
                            <tr key={idx}>
                              <td>{item.productName}</td>
                              <td>{item.quantity}</td>
                              <td>${item.priceAtPurchase}</td>
                              <td><strong>${item.subtotal}</strong></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Perfil */}
      {activeTab === 'profile' && (
        <div>
          <h3 className="mb-4">Mi Perfil de Vendedor</h3>
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 text-center">
                  <img 
                    src={currentSeller.logo || '/assets/placeholder-seller.png'} 
                    alt={currentSeller.businessName}
                    className="img-fluid rounded-circle mb-3"
                    style={{ width: 150, height: 150, objectFit: 'cover', border: '3px solid #ddd' }}
                  />
                  {currentSeller.verified && (
                    <div className="badge bg-success mb-2">
                      <i className="bi bi-check-circle"></i> Verificado
                    </div>
                  )}
                  <div className="text-warning">
                    {'⭐'.repeat(Math.round(currentSeller.rating || 0))}
                    <div className="text-muted small">
                      {currentSeller.totalReviews || 0} reseñas
                    </div>
                  </div>
                </div>
                
                <div className="col-md-9">
                  <h4 className="mb-3">{currentSeller.businessName}</h4>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p className="mb-2">
                        <i className="bi bi-envelope text-muted"></i>
                        <strong className="ms-2">Email:</strong> {currentSeller.email}
                      </p>
                      <p className="mb-2">
                        <i className="bi bi-telephone text-muted"></i>
                        <strong className="ms-2">Teléfono:</strong> {currentSeller.phone}
                      </p>
                      <p className="mb-2">
                        <i className="bi bi-geo-alt text-muted"></i>
                        <strong className="ms-2">Dirección:</strong> {currentSeller.address}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-2">
                        <i className="bi bi-calendar text-muted"></i>
                        <strong className="ms-2">Miembro desde:</strong> {new Date(currentSeller.joinedDate).toLocaleDateString()}
                      </p>
                      <p className="mb-2">
                        <i className="bi bi-box-seam text-muted"></i>
                        <strong className="ms-2">Total productos:</strong> {stats.totalProducts}
                      </p>
                      <p className="mb-2">
                        <i className="bi bi-cart-check text-muted"></i>
                        <strong className="ms-2">Total ventas:</strong> {stats.totalSales}
                      </p>
                    </div>
                  </div>

                  {currentSeller.description && (
                    <div className="mt-3">
                      <h6>Sobre mi negocio</h6>
                      <p className="text-muted">{currentSeller.description}</p>
                    </div>
                  )}

                  <div className="mt-4">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => {
                        // Aquí podrías implementar edición de perfil
                        toast.info('Función de edición de perfil próximamente');
                      }}
                    >
                      <i className="bi bi-pencil"></i> Editar Perfil
                    </button>
                    <button 
                      className="btn btn-outline-danger ms-2"
                      onClick={() => {
                        if (confirm('¿Estás seguro de cerrar sesión?')) {
                          localStorage.removeItem('currentSeller');
                          window.location.href = '/';
                        }
                      }}
                    >
                      <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas adicionales */}
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h5 className="mb-0">Rendimiento</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Productos Aprobados</span>
                      <span>{stats.approvedProducts} / {stats.totalProducts}</span>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar bg-success" 
                        style={{ width: `${stats.totalProducts > 0 ? (stats.approvedProducts / stats.totalProducts * 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Tasa de conversión</span>
                      <span>--%</span>
                    </div>
                    <small className="text-muted">Próximamente disponible</small>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between mb-1">
                      <span>Satisfacción del cliente</span>
                      <span>{'⭐'.repeat(Math.round(currentSeller.rating || 5))}</span>
                    </div>
                    <small className="text-muted">{currentSeller.totalReviews || 0} reseñas</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h5 className="mb-0">Productos Destacados</h5>
                </div>
                <div className="card-body">
                  {myProducts.slice(0, 3).map(product => (
                    <div key={product.id} className="d-flex align-items-center mb-3">
                      <img 
                        src={product.image} 
                        alt={product.Productname}
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                        className="me-3"
                      />
                      <div className="flex-grow-1">
                        <div className="fw-bold">{product.Productname}</div>
                        <small className="text-muted">{product.soldCount || 0} ventas</small>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold">{product.price}</div>
                      </div>
                    </div>
                  ))}
                  {myProducts.length === 0 && (
                    <p className="text-muted text-center">No tienes productos aún</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}