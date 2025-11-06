import React, { useEffect, useState } from 'react';
import CrearTiendas from './crearTiendas.jsx';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Admin() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('product');

  // Basic product fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('articulo');

  // Images (up to 4) stored as data URLs
  const [images, setImages] = useState([]);

  const [sellerName, setSellerName] = useState('Administrador');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');

  // KayakType fields
  const [kt_model, setKt_model] = useState('');
  const [kt_brand, setKt_brand] = useState('');
  const [kt_material, setKt_material] = useState('');
  const [kt_paddlersQuantity, setKt_paddlersQuantity] = useState('');
  const [kt_maxWeightCapacity, setKt_maxWeightCapacity] = useState('');
  const [kt_length, setKt_length] = useState('');
  const [kt_beam, setKt_beam] = useState('');
  const [kt_constructionType, setKt_constructionType] = useState('');

  // Embarcacion (boat) fields
  const [bt_model, setBt_model] = useState('');
  const [bt_brand, setBt_brand] = useState('');
  const [bt_material, setBt_material] = useState('');
  const [bt_capacity, setBt_capacity] = useState('');
  const [bt_maxWeight, setBt_maxWeight] = useState('');
  const [bt_length, setBt_length] = useState('');
  const [bt_beam, setBt_beam] = useState('');
  const [bt_hullType, setBt_hullType] = useState('');
  const [bt_engineType, setBt_engineType] = useState('');
  const [bt_maxHP, setBt_maxHP] = useState('0');

  // Artículo (article) fields
  const [art_type, setArt_type] = useState('');
  const [art_usage, setArt_usage] = useState('');

  // SUP fields
  const [sup_brand, setSup_brand] = useState('');
  const [sup_model, setSup_model] = useState('');
  const [sup_material, setSup_material] = useState('');
  const [sup_boardType, setSup_boardType] = useState('');
  const [sup_construction, setSup_construction] = useState('');
  const [sup_maxWeightCapacity, setSup_maxWeightCapacity] = useState('');
  const [sup_length, setSup_length] = useState('');
  const [sup_width, setSup_width] = useState('');
  const [sup_thickness, setSup_thickness] = useState('');
  const [sup_fins, setSup_fins] = useState('');

  const [marketplace, setMarketplace] = useState([]);

  useEffect(() => {
    // auth check: only admin can access
    try {
      const cu = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (!cu || (cu.email !== 'admin@gmail.com' && cu.role !== 'admin')) {
        navigate('/');
        return;
      }
    } catch {
      navigate('/');
      return;
    }

    const onStorage = () => {
      const mp = JSON.parse(
        localStorage.getItem('marketplaceProducts') || '[]'
      );
      setMarketplace(mp);
    };

    onStorage();
    window.addEventListener('storage', onStorage);
    window.addEventListener('marketplaceUpdated', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('marketplaceUpdated', onStorage);
    };
  }, [navigate]);

  const resetForm = () => {
    setTitle('');
    setPrice('');
    setCategory('articulo');
    setImages([]);
    setSellerName('Administrador');
    setKt_model('');
    setKt_brand('');
    setKt_material('');
    setKt_paddlersQuantity('');
    setKt_maxWeightCapacity('');
    setKt_length('');
    setKt_beam('');
    setKt_constructionType('');
    // reset embarcacion fields
    setBt_model('');
    setBt_brand('');
    setBt_material('');
    setBt_capacity('');
    setBt_maxWeight('');
    setBt_length('');
    setBt_beam('');
    setBt_hullType('');
    setBt_engineType('');
    setBt_maxHP('0');
    // reset article fields
    setArt_type('');
    setArt_usage('');
    // reset SUP fields
    setSup_brand('');
    setSup_model('');
    setSup_material('');
    setSup_boardType('');
    setSup_construction('');
    setSup_maxWeightCapacity('');
    setSup_length('');
    setSup_width('');
    setSup_thickness('');
    setSup_fins('');
    setDescription('');
    setTag('');
  };

  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('read error'));
      reader.readAsDataURL(file);
    });

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).slice(0, 4); // limit to 4
    try {
      const dataUrls = await Promise.all(
        files.map((f) => readFileAsDataURL(f))
      );
      setImages(dataUrls);
    } catch (e) {
      console.error(e);
      toast.error('Error al leer las imágenes');
    }
  };

  const loadSupTemplate = () => {
    setSup_brand('Red Paddle Co');
    setSup_model("Allround 10'6");
    setSup_material('MSL Fusion');
    setSup_boardType('allround');
    setSup_construction('inflable');
    setSup_maxWeightCapacity('100');
    setSup_length('3.2');
    setSup_width('0.81');
    setSup_thickness('0.127');
    setSup_fins('2+1');
    toast.info('Plantilla SUP cargada');
  };

  const validateKayakSpecs = () => {
    // validate kayak
    if (category === 'kayak') {
      if (!kt_brand || !kt_model || !kt_material) return false;
      const paddlers = Number(kt_paddlersQuantity);
      const cap = Number(kt_maxWeightCapacity);
      if (!Number.isFinite(paddlers) || paddlers < 1) return false;
      if (!Number.isFinite(cap) || cap <= 0) return false;
      if (!kt_constructionType) return false;
      return true;
    }

    // validate embarcacion
    if (category === 'embarcacion') {
      if (!bt_brand || !bt_model || !bt_material) return false;
      const capPersons = Number(bt_capacity);
      const maxW = Number(bt_maxWeight);
      if (!Number.isFinite(capPersons) || capPersons < 1) return false;
      if (!Number.isFinite(maxW) || maxW <= 0) return false;
      if (!bt_hullType) return false;
      if (!bt_engineType) return false;
      return true;
    }

    // other categories: no extra validation
    return true;
  };

  // validate SUP specs
  const validateSupSpecs = () => {
    if (category !== 'sup') return true;
    if (!sup_brand || !sup_model || !sup_material) return false;
    if (!sup_boardType || !sup_construction) return false;
    const maxW = Number(sup_maxWeightCapacity);
    const len = Number(sup_length);
    const wid = Number(sup_width);
    const th = Number(sup_thickness);
    if (!Number.isFinite(maxW) || maxW <= 0) return false;
    if (!Number.isFinite(len) || len <= 0) return false;
    if (!Number.isFinite(wid) || wid <= 0) return false;
    if (!Number.isFinite(th) || th <= 0) return false;
    return true;
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title || !price) {
      toast.error('Completa nombre y precio');
      return;
    }

    if (!validateKayakSpecs()) {
      toast.error('Completa las Especificaciones Técnicas correctamente');
      return;
    }

    if (!validateSupSpecs()) {
      toast.error(
        'Completa las Especificaciones Técnicas del SUP correctamente'
      );
      return;
    }

    const marketplaceProducts = JSON.parse(
      localStorage.getItem('marketplaceProducts') || '[]'
    );
    const nextId = Date.now();

    const newProduct = {
      id: nextId,
      Productname: title,
      price: price,
      category: category,
      image: images[0] || '/assets/placeholder.webp',
      secondImage: images[1] || undefined,
      thirdImage: images[2] || undefined,
      fourthImage: images[3] || undefined,
      description: description,
      tag: tag,
      sellerName: sellerName || 'Administrador',
      sellerId: sellerName ? String(sellerName).trim() : 'admin',
      ...(category === 'kayak'
        ? {
            kayakType: {
              id: `kt-${nextId}`,
              model: kt_model,
              brand: kt_brand,
              material: kt_material,
              paddlersQuantity: Number(kt_paddlersQuantity) || 1,
              maxWeightCapacity: Number(kt_maxWeightCapacity) || 0,
              constructionType: kt_constructionType || undefined,
              length: Number(kt_length) || 0,
              beam: Number(kt_beam) || 0,
            },
          }
        : {}),
      ...(category === 'embarcacion'
        ? {
            boatType: {
              id: `bt-${nextId}`,
              model: bt_model,
              brand: bt_brand,
              material: bt_material,
              capacityPersons: Number(bt_capacity) || 0,
              maxWeight: Number(bt_maxWeight) || 0,
              length: Number(bt_length) || 0,
              beam: Number(bt_beam) || 0,
              hullType: bt_hullType,
              engineType: bt_engineType,
              maxHP: Number(bt_maxHP) || 0,
            },
          }
        : {}),
      ...(category === 'articulo'
        ? {
            articleSpecs: {
              type: art_type,
              usage: art_usage,
            },
          }
        : {}),
      ...(category === 'sup'
        ? {
            supType: {
              id: `sup-${nextId}`,
              brand: sup_brand,
              model: sup_model,
              material: sup_material,
              boardType: sup_boardType,
              construction: sup_construction,
              maxWeightCapacity: Number(sup_maxWeightCapacity) || 0,
              length: Number(sup_length) || 0,
              width: Number(sup_width) || 0,
              thickness: Number(sup_thickness) || 0,
              fins: sup_fins,
            },
          }
        : {}),
      approved: true,
    };

    const updated = [newProduct, ...marketplaceProducts];
    localStorage.setItem('marketplaceProducts', JSON.stringify(updated));
    window.dispatchEvent(new Event('marketplaceUpdated'));
    toast.success('Producto creado');
    resetForm();
    setMarketplace(updated);
  };

  const removeProduct = (id) => {
    const mp = JSON.parse(localStorage.getItem('marketplaceProducts') || '[]');
    const next = mp.filter((p) => p.id !== id);
    localStorage.setItem('marketplaceProducts', JSON.stringify(next));
    window.dispatchEvent(new Event('marketplaceUpdated'));
    setMarketplace(next);
    toast.info('Producto removido');
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('authChanged'));
    navigate('/');
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Panel de Administrador</h2>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </div>
      <div className="mb-3 d-flex gap-2">
        <button
          type="button"
          className={
            'btn ' +
            (selectedTab === 'product' ? 'btn-primary' : 'btn-outline-primary')
          }
          onClick={() => setSelectedTab('product')}
        >
          Alta Producto
        </button>
        <button
          type="button"
          className={
            'btn ' +
            (selectedTab === 'store' ? 'btn-primary' : 'btn-outline-primary')
          }
          onClick={() => setSelectedTab('store')}
        >
          Alta Tienda
        </button>
      </div>

      {selectedTab === 'product' && (
        <>
          <div className="card p-4 mb-4">
            <h5 className="mb-3">Crear nuevo producto</h5>
            <form onSubmit={handleCreate}>
              <div className="row g-2">
                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Nombre del producto"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    className="form-control"
                    placeholder="Precio ($)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="articulo">Artículo</option>
                    <option value="kayak">Kayak</option>
                    <option value="sup">SUP</option>
                    <option value="embarcacion">Embarcación</option>
                  </select>
                </div>

                <div className="col-md-6 col-12 mt-2">
                  <input
                    className="form-control"
                    placeholder="Nombre del vendedor"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                  />
                </div>

                <div className="col-md-6 col-12 mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) handleFiles(files);
                    }}
                  />
                </div>

                {images.length > 0 && (
                  <div className="col-12 mt-2">
                    <div className="mb-2">Vista previa:</div>
                    {images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`preview-${index}`}
                        style={{ maxWidth: 240, marginRight: 10 }}
                      />
                    ))}
                  </div>
                )}

                <div className="col-12 mt-2">
                  <input
                    className="form-control"
                    placeholder="Tag (Nuevo / Oferta)"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                  />
                </div>

                <div className="col-12 mt-2">
                  <textarea
                    className="form-control"
                    placeholder="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {category === 'kayak' && (
                  <>
                    <div className="col-12 mt-3">
                      <h6 className="mb-2">Especificaciones Técnicas</h6>
                    </div>
                    <div className="col-md-6 mt-2">
                      <input
                        className="form-control"
                        placeholder="Modelo"
                        value={kt_model}
                        onChange={(e) => setKt_model(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mt-2">
                      <input
                        className="form-control"
                        placeholder="Marca"
                        value={kt_brand}
                        onChange={(e) => setKt_brand(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mt-2">
                      <input
                        className="form-control"
                        placeholder="Material"
                        value={kt_material}
                        onChange={(e) => setKt_material(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mt-2">
                      <input
                        className="form-control"
                        placeholder="Remadores"
                        type="number"
                        min="1"
                        value={kt_paddlersQuantity}
                        onChange={(e) => setKt_paddlersQuantity(e.target.value)}
                        required
                      />
                      <div className="form-text text-muted">
                        Cantidad de remadores (personas)
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <input
                        className="form-control"
                        placeholder="Capacidad máx (kg)"
                        type="number"
                        step="any"
                        value={kt_maxWeightCapacity}
                        onChange={(e) =>
                          setKt_maxWeightCapacity(e.target.value)
                        }
                        required
                      />
                      <div className="form-text text-muted">
                        Capacidad máxima en kilogramos (kg)
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <input
                        className="form-control"
                        placeholder="Largo (m)"
                        type="number"
                        step="any"
                        value={kt_length}
                        onChange={(e) => setKt_length(e.target.value)}
                        required
                      />
                      <div className="form-text text-muted">
                        Largo en metros (m)
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <input
                        className="form-control"
                        placeholder="Manga (m)"
                        type="number"
                        step="any"
                        value={kt_beam}
                        onChange={(e) => setKt_beam(e.target.value)}
                        required
                      />
                      <div className="form-text text-muted">
                        Manga (ancho) en metros (m)
                      </div>
                    </div>
                    <div className="col-md-12 mt-2">
                      <input
                        className="form-control"
                        placeholder="Construcción"
                        value={kt_constructionType}
                        onChange={(e) => setKt_constructionType(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                {category === 'embarcacion' && (
                  <>
                    <div className="col-12 mt-3">
                      <h6 className="mb-2">
                        Especificaciones Técnicas (Embarcación)
                      </h6>
                    </div>

                    <div className="col-md-6 mt-2">
                      <input
                        className="form-control"
                        placeholder="Marca"
                        value={bt_brand}
                        onChange={(e) => setBt_brand(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mt-2">
                      <input
                        className="form-control"
                        placeholder="Modelo"
                        value={bt_model}
                        onChange={(e) => setBt_model(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6 mt-2">
                      <input
                        className="form-control"
                        placeholder="Material"
                        value={bt_material}
                        onChange={(e) => setBt_material(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-4 mt-2">
                      <input
                        className="form-control"
                        placeholder="Capacidad (personas)"
                        type="number"
                        min="1"
                        value={bt_capacity}
                        onChange={(e) => setBt_capacity(e.target.value)}
                        required
                      />
                      <div className="form-text text-muted">
                        Capacidad en número de personas
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <input
                        className="form-control"
                        placeholder="Peso máximo (kg)"
                        type="number"
                        step="any"
                        value={bt_maxWeight}
                        onChange={(e) => setBt_maxWeight(e.target.value)}
                        required
                      />
                      <div className="form-text text-muted">
                        Peso máximo en kilogramos (kg)
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <input
                        className="form-control"
                        placeholder="Largo (m)"
                        type="number"
                        step="any"
                        value={bt_length}
                        onChange={(e) => setBt_length(e.target.value)}
                        required
                      />
                      <div className="form-text text-muted">
                        Largo en metros (m)
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <input
                        className="form-control"
                        placeholder="Manga (m)"
                        type="number"
                        step="any"
                        value={bt_beam}
                        onChange={(e) => setBt_beam(e.target.value)}
                        required
                      />
                      <div className="form-text text-muted">
                        Manga (ancho) en metros (m)
                      </div>
                    </div>

                    <div className="col-md-4 mt-2">
                      <input
                        className="form-control"
                        placeholder="Tipo de casco"
                        value={bt_hullType}
                        onChange={(e) => setBt_hullType(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4 mt-2">
                      <input
                        className="form-control"
                        placeholder="Motor "
                        value={bt_engineType}
                        onChange={(e) => setBt_engineType(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4 mt-2">
                      <input
                        className="form-control"
                        placeholder="HP máximo"
                        type="number"
                        step="any"
                        value={bt_maxHP}
                        onChange={(e) => setBt_maxHP(e.target.value)}
                        required
                      />
                      <div className="form-text text-muted">
                        Potencia máxima del motor (HP)
                      </div>
                    </div>
                  </>
                )}

                {category === 'articulo' && (
                  <>
                    <div className="col-12 mt-3">
                      <h6 className="mb-2">
                        Especificaciones Técnicas (Artículo)
                      </h6>
                    </div>
                    <div className="col-md-6 mt-2">
                      <input
                        className="form-control"
                        placeholder="Tipo de artículo"
                        value={art_type}
                        onChange={(e) => setArt_type(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mt-2">
                      <input
                        className="form-control"
                        placeholder="Uso principal"
                        value={art_usage}
                        onChange={(e) => setArt_usage(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {category === 'sup' && (
                  <>
                    <div className="col-12 mt-3">
                      <h6 className="mb-2">Especificaciones Técnicas (SUP)</h6>
                      <div className="mb-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-info"
                          onClick={loadSupTemplate}
                        >
                          Cargar plantilla SUP
                        </button>
                      </div>
                    </div>

                    <div className="col-md-6 mt-2">
                      <input
                        className="form-control"
                        placeholder="Marca"
                        value={sup_brand}
                        onChange={(e) => setSup_brand(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mt-2">
                      <input
                        className="form-control"
                        placeholder="Modelo"
                        value={sup_model}
                        onChange={(e) => setSup_model(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6 mt-2">
                      <input
                        className="form-control"
                        placeholder="Material"
                        value={sup_material}
                        onChange={(e) => setSup_material(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mt-2">
                      <input
                        className="form-control"
                        placeholder="Tipo de tabla"
                        value={sup_boardType}
                        onChange={(e) => setSup_boardType(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-4 mt-2">
                      <input
                        className="form-control"
                        placeholder="Construcción"
                        value={sup_construction}
                        onChange={(e) => setSup_construction(e.target.value)}
                        required
                      />
                      <div className="form-text text-muted">
                        Tipo de construcción (inflable, rígida, etc.)
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <input
                        className="form-control"
                        placeholder="Capacidad máx (kg)"
                        type="number"
                        step="any"
                        value={sup_maxWeightCapacity}
                        onChange={(e) =>
                          setSup_maxWeightCapacity(e.target.value)
                        }
                        required
                      />
                      <div className="form-text text-muted">
                        Capacidad máxima en kilogramos (kg)
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <input
                        className="form-control"
                        placeholder="Largo (m)"
                        type="number"
                        step="any"
                        value={sup_length}
                        onChange={(e) => setSup_length(e.target.value)}
                        required
                      />
                      <div className="form-text text-muted">
                        Largo en metros (m)
                      </div>
                    </div>

                    <div className="col-md-4 mt-2">
                      <input
                        className="form-control"
                        placeholder="Ancho (m)"
                        type="number"
                        step="any"
                        value={sup_width}
                        onChange={(e) => setSup_width(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4 mt-2">
                      <input
                        className="form-control"
                        placeholder="Grosor (m)"
                        type="number"
                        step="any"
                        value={sup_thickness}
                        onChange={(e) => setSup_thickness(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4 mt-2">
                      <input
                        className="form-control"
                        placeholder="Quillas"
                        value={sup_fins}
                        onChange={(e) => setSup_fins(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="col-12 mt-3">
                  <button className="btn btn-primary">Crear producto</button>
                </div>
              </div>
            </form>
          </div>

          <div className="card p-4">
            <h5 className="mb-3">Nuestros productos a la venta</h5>
            {marketplace.length === 0 ? (
              <p className="text-muted">No hay productos a la venta.</p>
            ) : (
              <div className="list-group">
                {marketplace.map((p) => (
                  <div
                    key={p.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{p.Productname}</strong>
                      <div className="text-muted small">
                        {p.price} • {p.category}
                      </div>
                    </div>
                    <div>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => removeProduct(p.id)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {selectedTab === 'store' && (
        <div className="card p-4">
          <CrearTiendas />
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}

export default Admin;
