import React, { useEffect, useState, useCallback } from 'react';
import CrearTiendas from './crearTiendas.jsx';
import CrearLocalidades from './crearLocalidades.jsx';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = 'http://localhost:3000/api';

function Admin() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('kayakType');
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para KayakType
  const [kt_model, setKt_model] = useState('');
  const [kt_brand, setKt_brand] = useState('');
  const [kt_material, setKt_material] = useState('');
  const [kt_paddlersQuantity, setKt_paddlersQuantity] = useState('');
  const [kt_maxWeightCapacity, setKt_maxWeightCapacity] = useState('');
  const [kt_length, setKt_length] = useState('');
  const [kt_beam, setKt_beam] = useState('');
  const [kt_constructionType, setKt_constructionType] = useState('');

  // Estados para ArticleType
  const [at_name, setAt_name] = useState('');
  const [at_mainUse, setAt_mainUse] = useState('');

  // Estados para SUPType
  const [st_model, setSt_model] = useState('');
  const [st_brand, setSt_brand] = useState('');
  const [st_material, setSt_material] = useState('');
  const [st_paddlersQuantity, setSt_paddlersQuantity] = useState('');
  const [st_maxWeightCapacity, setSt_maxWeightCapacity] = useState('');
  const [st_constructionType, setSt_constructionType] = useState('');
  const [st_length, setSt_length] = useState('');
  const [st_width, setSt_width] = useState('');
  const [st_thickness, setSt_thickness] = useState('');
  const [st_boardType, setSt_boardType] = useState('');
  const [st_finConfiguration, setSt_finConfiguration] = useState('');

  // Estados para BoatType
  const [bt_model, setBt_model] = useState('');
  const [bt_brand, setBt_brand] = useState('');
  const [bt_boatCategory, setBt_boatCategory] = useState('');
  const [bt_material, setBt_material] = useState('');
  const [bt_passengerCapacity, setBt_passengerCapacity] = useState('');
  const [bt_maxWeightCapacity, setBt_maxWeightCapacity] = useState('');
  const [bt_length, setBt_length] = useState('');
  const [bt_beam, setBt_beam] = useState('');
  const [bt_hullType, setBt_hullType] = useState('');
  const [bt_motorType, setBt_motorType] = useState('');
  const [bt_maxHorsePower, setBt_maxHorsePower] = useState('');

  // Estados para Product
  const [p_Productname, setP_Productname] = useState('');
  const [p_price, setP_price] = useState('');
  const [p_oldPrice, setP_oldPrice] = useState('');
  const [p_tag, setP_tag] = useState('');
  const [p_category, setP_category] = useState('');
  const [p_stock, setP_stock] = useState(1);
  const [p_image, setP_image] = useState('');
  const [p_secondImage, setP_secondImage] = useState('');
  const [p_thirdImage, setP_thirdImage] = useState('');
  const [p_fourthImage, setP_fourthImage] = useState('');
  const [p_description, setP_description] = useState('');
  const [p_includes, setP_includes] = useState('');
  const [p_kayakTypeId, setP_kayakTypeId] = useState('');
  const [p_supTypeId, setP_supTypeId] = useState('');
  const [p_boatTypeId, setP_boatTypeId] = useState('');
  const [p_articleTypeId, setP_articleTypeId] = useState('');
  const [p_approved, setP_approved] = useState(false);

  // Estados para tipos disponibles
  const [kayakTypes, setKayakTypes] = useState([]);
  const [supTypes, setSupTypes] = useState([]);
  const [boatTypes, setBoatTypes] = useState([]);
  const [articleTypes, setArticleTypes] = useState([]);

  // Función para leer archivos como DataURL
  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let { width, height } = img;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          0.7
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e, imageNumber) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 2MB');
      return;
    }

    try {
      // 🔥 ESTA LÍNEA USA compressImage - por eso debe estar definida antes
      const compressedFile = await compressImage(file);
      const dataUrl = await readFileAsDataURL(compressedFile);

      console.log(
        `📏 Longitud de Base64 COMPRIMIDA: ${dataUrl.length} caracteres`
      );

      switch (imageNumber) {
        case 1:
          setP_image(dataUrl);
          break;
        case 2:
          setP_secondImage(dataUrl);
          break;
        case 3:
          setP_thirdImage(dataUrl);
          break;
        case 4:
          setP_fourthImage(dataUrl);
          break;
        default:
          break;
      }

      toast.success('Imagen comprimida y cargada correctamente');
    } catch (error) {
      console.error('Error comprimiendo imagen:', error);
      toast.error('Error al procesar la imagen');
    }
  };

  // Eliminar imagen
  const removeImage = (imageNumber) => {
    switch (imageNumber) {
      case 1:
        setP_image('');
        break;
      case 2:
        setP_secondImage('');
        break;
      case 3:
        setP_thirdImage('');
        break;
      case 4:
        setP_fourthImage('');
        break;
      default:
        break;
    }
    toast.info('Imagen eliminada');
  };

  // Cargar tipos disponibles para productos
  const fetchTypes = useCallback(async () => {
    try {
      const [kayakRes, supRes, boatRes, articleRes] = await Promise.all([
        fetch(`${API_BASE}/kayakTypes`),
        fetch(`${API_BASE}/supTypes`),
        fetch(`${API_BASE}/boatTypes`),
        fetch(`${API_BASE}/articleTypes`),
      ]);

      if (kayakRes.ok) {
        const data = await kayakRes.json();
        setKayakTypes(data.data || []);
      }
      if (supRes.ok) {
        const data = await supRes.json();
        setSupTypes(data.data || []);
      }
      if (boatRes.ok) {
        const data = await boatRes.json();
        setBoatTypes(data.data || []);
      }
      if (articleRes.ok) {
        const data = await articleRes.json();
        setArticleTypes(data.data || []);
      }
    } catch (error) {
      console.error('Error loading types:', error);
    }
  }, []);

  // Función para cargar entidades con useCallback
  const fetchEntities = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = '';

      switch (selectedTab) {
        case 'kayakType':
          endpoint = '/kayakTypes';
          break;
        case 'articleType':
          endpoint = '/articleTypes';
          break;
        case 'supType':
          endpoint = '/supTypes';
          break;
        case 'boatType':
          endpoint = '/boatTypes';
          break;
        case 'product':
          endpoint = '/products';
          break;
        default:
          return;
      }

      const url = `${API_BASE}${endpoint}`;
      console.log(`🔄 Fetching from: ${url}`);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(
        `📊 Response status: ${response.status} ${response.statusText}`
      );

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Full response:`, result);

        // EXTRAER LOS DATOS DE LA PROPIEDAD 'data'
        const entitiesData = result.data || [];
        console.log(`✅ Entities data:`, entitiesData);

        setEntities(Array.isArray(entitiesData) ? entitiesData : []);
      } else if (response.status === 404) {
        console.warn(`❌ Endpoint ${endpoint} not found`);
        setEntities([]);
      } else {
        console.error(`❌ Error ${response.status}: ${response.statusText}`);
        toast.error(`Error ${response.status} al cargar los datos`);
      }
    } catch (error) {
      console.error('❌ Error fetching entities:', error);
      toast.error('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  }, [selectedTab]);

  // Cargar entidades cuando cambia la pestaña
  useEffect(() => {
    console.log(`🔄 Selected tab changed to: ${selectedTab}`);
    if (selectedTab !== 'localty' && selectedTab !== 'store') {
      fetchEntities();
    }
    if (selectedTab === 'product') {
      fetchTypes();
    }
  }, [fetchEntities, fetchTypes, selectedTab]);

  const resetForm = () => {
    // Reset KayakType
    setKt_model('');
    setKt_brand('');
    setKt_material('');
    setKt_paddlersQuantity('');
    setKt_maxWeightCapacity('');
    setKt_length('');
    setKt_beam('');
    setKt_constructionType('');

    // Reset ArticleType
    setAt_name('');
    setAt_mainUse('');

    // Reset SUPType
    setSt_model('');
    setSt_brand('');
    setSt_material('');
    setSt_paddlersQuantity('');
    setSt_maxWeightCapacity('');
    setSt_constructionType('');
    setSt_length('');
    setSt_width('');
    setSt_thickness('');
    setSt_boardType('');
    setSt_finConfiguration('');

    // Reset BoatType
    setBt_model('');
    setBt_brand('');
    setBt_boatCategory('');
    setBt_material('');
    setBt_passengerCapacity('');
    setBt_maxWeightCapacity('');
    setBt_length('');
    setBt_beam('');
    setBt_hullType('');
    setBt_motorType('');
    setBt_maxHorsePower('');

    // Reset Product
    setP_Productname('');
    setP_price('');
    setP_oldPrice('');
    setP_tag('');
    setP_category('');
    setP_stock(1);
    setP_image('');
    setP_secondImage('');
    setP_thirdImage('');
    setP_fourthImage('');
    setP_description('');
    setP_includes('');
    setP_kayakTypeId('');
    setP_supTypeId('');
    setP_boatTypeId('');
    setP_articleTypeId('');
    setP_approved(false);
  };

  const validateKayakType = () => {
    if (!kt_brand || !kt_model || !kt_material) return false;
    const paddlers = Number(kt_paddlersQuantity);
    const cap = Number(kt_maxWeightCapacity);
    if (!Number.isFinite(paddlers) || paddlers < 1) return false;
    if (!Number.isFinite(cap) || cap <= 0) return false;
    if (!kt_constructionType) return false;
    return true;
  };

  const validateArticleType = () => {
    return at_name && at_mainUse;
  };

  const validateSUPType = () => {
    if (!st_brand || !st_model || !st_material) return false;
    if (!st_boardType || !st_constructionType) return false;
    const maxW = Number(st_maxWeightCapacity);
    const len = Number(st_length);
    const wid = Number(st_width);
    const th = Number(st_thickness);
    if (!Number.isFinite(maxW) || maxW <= 0) return false;
    if (!Number.isFinite(len) || len <= 0) return false;
    if (!Number.isFinite(wid) || wid <= 0) return false;
    if (!Number.isFinite(th) || th <= 0) return false;
    return true;
  };

  const validateBoatType = () => {
    if (!bt_brand || !bt_model || !bt_material) return false;
    const capPersons = Number(bt_passengerCapacity);
    const maxW = Number(bt_maxWeightCapacity);
    if (!Number.isFinite(capPersons) || capPersons < 1) return false;
    if (!Number.isFinite(maxW) || maxW <= 0) return false;
    if (!bt_hullType) return false;
    return true;
  };

  const validateProduct = () => {
    if (!p_Productname || p_Productname.length < 2) return false;
    if (!p_price || !/^\$?\d+(\.\d{1,2})?$/.test(p_price.replace(',', '.')))
      return false;
    if (!p_category) return false;
    if (!p_image) return false;
    if (p_stock < 0 || p_stock > 10000) return false;

    // Validaciones específicas por categoría
    if (p_category === 'kayak' && !p_kayakTypeId) return false;
    if (p_category === 'sup' && !p_supTypeId) return false;
    if (p_category === 'embarcacion' && !p_boatTypeId) return false;
    if (p_category === 'articulo' && !p_articleTypeId) return false;

    return true;
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    let isValid = false;
    let newEntity = {};
    let endpoint = '';

    switch (selectedTab) {
      case 'kayakType':
        isValid = validateKayakType();
        endpoint = '/kayakTypes';
        if (isValid) {
          newEntity = {
            model: kt_model,
            brand: kt_brand,
            material: kt_material,
            paddlersQuantity: Number(kt_paddlersQuantity) || 1,
            maxWeightCapacity: Number(kt_maxWeightCapacity) || 0,
            constructionType: kt_constructionType,
            length: Number(kt_length) || 0,
            beam: Number(kt_beam) || 0,
          };
        } else {
          toast.error('Completa las especificaciones de Kayak correctamente');
        }
        break;

      case 'articleType':
        isValid = validateArticleType();
        endpoint = '/articleTypes';
        if (isValid) {
          newEntity = {
            name: at_name,
            mainUse: at_mainUse,
          };
        } else {
          toast.error('Completa nombre y uso principal');
        }
        break;

      case 'supType':
        isValid = validateSUPType();
        endpoint = '/supTypes';
        if (isValid) {
          newEntity = {
            model: st_model,
            brand: st_brand,
            material: st_material,
            paddlersQuantity: Number(st_paddlersQuantity) || 1,
            maxWeightCapacity: Number(st_maxWeightCapacity) || 0,
            constructionType: st_constructionType,
            length: Number(st_length) || 0,
            width: Number(st_width) || 0,
            thickness: Number(st_thickness) || 0,
            boardType: st_boardType,
            finConfiguration: st_finConfiguration,
          };
        } else {
          toast.error('Completa las especificaciones de SUP correctamente');
        }
        break;

      case 'boatType':
        isValid = validateBoatType();
        endpoint = '/boatTypes';
        if (isValid) {
          newEntity = {
            model: bt_model,
            brand: bt_brand,
            boatCategory: bt_boatCategory,
            material: bt_material,
            passengerCapacity: Number(bt_passengerCapacity) || 0,
            maxWeightCapacity: Number(bt_maxWeightCapacity) || 0,
            length: Number(bt_length) || 0,
            beam: Number(bt_beam) || 0,
            hullType: bt_hullType,
            motorType: bt_motorType,
            maxHorsePower: Number(bt_maxHorsePower) || 0,
          };
        } else {
          toast.error(
            'Completa las especificaciones de Embarcación correctamente'
          );
        }
        break;

      case 'product':
        isValid = validateProduct();
        endpoint = '/products';
        if (isValid) {
          newEntity = {
            Productname: p_Productname,
            price: p_price,
            oldPrice: p_oldPrice || undefined,
            tag: p_tag || undefined,
            category: p_category,
            stock: Number(p_stock) || 1,
            image: p_image,
            secondImage: p_secondImage || undefined,
            thirdImage: p_thirdImage || undefined,
            fourthImage: p_fourthImage || undefined,
            description: p_description || undefined,
            includes: p_includes || undefined,
            kayakTypeId: p_kayakTypeId ? Number(p_kayakTypeId) : undefined,
            supTypeId: p_supTypeId ? Number(p_supTypeId) : undefined,
            boatTypeId: p_boatTypeId ? Number(p_boatTypeId) : undefined,
            articleTypeId: p_articleTypeId
              ? Number(p_articleTypeId)
              : undefined,
          };
        } else {
          toast.error(
            'Completa los campos requeridos del producto correctamente'
          );
        }
        break;

      default:
        return;
    }

    if (!isValid) return;

    // 🔍 AGREGAR ESTO PARA DEBUG
    console.log('🔍 Datos que se enviarán:', {
      ...newEntity,
      imageLength: newEntity.image ? newEntity.image.length : 0,
      secondImageLength: newEntity.secondImage
        ? newEntity.secondImage.length
        : 0,
      thirdImageLength: newEntity.thirdImage ? newEntity.thirdImage.length : 0,
      fourthImageLength: newEntity.fourthImage
        ? newEntity.fourthImage.length
        : 0,
    });

    setLoading(true);
    try {
      const url = `${API_BASE}${endpoint}`;
      console.log(`🚀 Creating entity at: ${url}`, newEntity);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntity),
      });

      console.log(
        `📨 Create response status: ${response.status} ${response.statusText}`
      );

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Create response:', result);

        toast.success(
          `${selectedTab.replace('Type', ' Type')} creado exitosamente`
        );
        resetForm();
        fetchEntities(); // Recargar la lista
      } else {
        // Intentar parsear JSON de error para mostrar información útil
        let errorBody = null;
        try {
          errorBody = await response.json();
        } catch {
          try {
            errorBody = await response.text();
          } catch {
            errorBody = `Error ${response.status}: ${response.statusText}`;
          }
        }

        console.error('❌ Error response:', errorBody);

        // Extraer un mensaje legible si el backend lo provee
        let friendlyMessage = `Error ${response.status}: No se pudo crear`;
        if (errorBody) {
          if (typeof errorBody === 'string') {
            friendlyMessage = errorBody;
          } else if (errorBody.message) {
            friendlyMessage = errorBody.message;
          } else if (errorBody.errors) {
            // Si el backend devuelve errores por campo, formatearlos
            try {
              if (Array.isArray(errorBody.errors)) {
                friendlyMessage = errorBody.errors
                  .map((e) => e.msg || e.message || JSON.stringify(e))
                  .join('; ');
              } else {
                // objeto con claves por campo
                friendlyMessage = Object.entries(errorBody.errors)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join('; ');
              }
            } catch {
              friendlyMessage = JSON.stringify(errorBody.errors);
            }
          } else {
            // Fallback: stringify pequeño
            try {
              const s = JSON.stringify(errorBody);
              friendlyMessage =
                s.length > 200
                  ? `Error ${response.status}: Revisar consola para más detalles`
                  : s;
            } catch {
              /* noop */
            }
          }
        }

        toast.error(friendlyMessage);
      }
    } catch (error) {
      console.error('❌ Error creating entity:', error);
      toast.error('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const removeEntity = async (id) => {
    if (
      !window.confirm('¿Estás seguro de que quieres eliminar este elemento?')
    ) {
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      switch (selectedTab) {
        case 'kayakType':
          endpoint = '/kayakTypes';
          break;
        case 'articleType':
          endpoint = '/articleTypes';
          break;
        case 'supType':
          endpoint = '/supTypes';
          break;
        case 'boatType':
          endpoint = '/boatTypes';
          break;
        case 'product':
          endpoint = '/products';
          break;
        default:
          return;
      }

      const url = `${API_BASE}${endpoint}/${id}`;
      console.log(`🗑️ Deleting entity at: ${url}`);

      const response = await fetch(url, {
        method: 'DELETE',
      });

      console.log(
        `📨 Delete response status: ${response.status} ${response.statusText}`
      );

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Delete response:', result);

        toast.info(`${selectedTab.replace('Type', ' Type')} eliminado`);
        fetchEntities(); // Recargar la lista
      } else {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        toast.error(`Error ${response.status}: No se pudo eliminar`);
      }
    } catch (error) {
      console.error('❌ Error deleting entity:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const approveProduct = async (id) => {
    setLoading(true);
    try {
      const url = `${API_BASE}/products/${id}/approve`;
      console.log(`✅ Approving product at: ${url}`);

      const response = await fetch(url, {
        method: 'PATCH',
      });

      console.log(
        `📨 Approve response status: ${response.status} ${response.statusText}`
      );

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Approve response:', result);

        toast.success('Producto aprobado exitosamente');
        fetchEntities(); // Recargar la lista
      } else {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        toast.error(`Error ${response.status}: No se pudo aprobar el producto`);
      }
    } catch (error) {
      console.error('❌ Error approving product:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('authChanged'));
    navigate('/');
  };

  const renderForm = () => {
    switch (selectedTab) {
      case 'kayakType':
        return (
          <>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Modelo"
                value={kt_model}
                onChange={(e) => setKt_model(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
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
                placeholder="Cantidad de remadores"
                type="number"
                min="1"
                value={kt_paddlersQuantity}
                onChange={(e) => setKt_paddlersQuantity(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4 mt-2">
              <input
                className="form-control"
                placeholder="Capacidad máxima (kg)"
                type="number"
                step="any"
                value={kt_maxWeightCapacity}
                onChange={(e) => setKt_maxWeightCapacity(e.target.value)}
                required
              />
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
            </div>
            <div className="col-12 mt-2">
              <input
                className="form-control"
                placeholder="Tipo de construcción"
                value={kt_constructionType}
                onChange={(e) => setKt_constructionType(e.target.value)}
                required
              />
            </div>
          </>
        );

      case 'articleType':
        return (
          <>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Nombre del artículo"
                value={at_name}
                onChange={(e) => setAt_name(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Uso principal"
                value={at_mainUse}
                onChange={(e) => setAt_mainUse(e.target.value)}
                required
              />
            </div>
          </>
        );

      case 'supType':
        return (
          <>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Modelo"
                value={st_model}
                onChange={(e) => setSt_model(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Marca"
                value={st_brand}
                onChange={(e) => setSt_brand(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mt-2">
              <input
                className="form-control"
                placeholder="Material"
                value={st_material}
                onChange={(e) => setSt_material(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mt-2">
              <input
                className="form-control"
                placeholder="Tipo de tabla"
                value={st_boardType}
                onChange={(e) => setSt_boardType(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4 mt-2">
              <input
                className="form-control"
                placeholder="Capacidad máxima (kg)"
                type="number"
                step="any"
                value={st_maxWeightCapacity}
                onChange={(e) => setSt_maxWeightCapacity(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4 mt-2">
              <input
                className="form-control"
                placeholder="Largo (m)"
                type="number"
                step="any"
                value={st_length}
                onChange={(e) => setSt_length(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4 mt-2">
              <input
                className="form-control"
                placeholder="Ancho (m)"
                type="number"
                step="any"
                value={st_width}
                onChange={(e) => setSt_width(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4 mt-2">
              <input
                className="form-control"
                placeholder="Grosor (m)"
                type="number"
                step="any"
                value={st_thickness}
                onChange={(e) => setSt_thickness(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4 mt-2">
              <input
                className="form-control"
                placeholder="Tipo de construcción"
                value={st_constructionType}
                onChange={(e) => setSt_constructionType(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4 mt-2">
              <input
                className="form-control"
                placeholder="Configuración de quillas"
                value={st_finConfiguration}
                onChange={(e) => setSt_finConfiguration(e.target.value)}
              />
            </div>
          </>
        );

      case 'boatType':
        return (
          <>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Modelo"
                value={bt_model}
                onChange={(e) => setBt_model(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
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
                placeholder="Categoría de embarcación"
                value={bt_boatCategory}
                onChange={(e) => setBt_boatCategory(e.target.value)}
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
                placeholder="Capacidad de pasajeros"
                type="number"
                min="1"
                value={bt_passengerCapacity}
                onChange={(e) => setBt_passengerCapacity(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4 mt-2">
              <input
                className="form-control"
                placeholder="Capacidad máxima (kg)"
                type="number"
                step="any"
                value={bt_maxWeightCapacity}
                onChange={(e) => setBt_maxWeightCapacity(e.target.value)}
                required
              />
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
                placeholder="Tipo de motor"
                value={bt_motorType}
                onChange={(e) => setBt_motorType(e.target.value)}
              />
            </div>
            <div className="col-12 mt-2">
              <input
                className="form-control"
                placeholder="Caballos de fuerza máximos"
                type="number"
                step="any"
                value={bt_maxHorsePower}
                onChange={(e) => setBt_maxHorsePower(e.target.value)}
              />
            </div>
          </>
        );

      case 'product':
        return (
          <>
            <div className="col-md-8">
              <input
                className="form-control"
                placeholder="Nombre del producto"
                value={p_Productname}
                onChange={(e) => setP_Productname(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-control"
                value={p_category}
                onChange={(e) => setP_category(e.target.value)}
                required
              >
                <option value="">Selecciona categoría</option>
                <option value="kayak">Kayak</option>
                <option value="sup">SUP</option>
                <option value="embarcacion">Embarcación</option>
                <option value="articulo">Artículo</option>
              </select>
            </div>

            <div className="col-md-4 mt-2">
              <input
                className="form-control"
                placeholder="Precio (ej: 100.00)"
                value={p_price}
                onChange={(e) => setP_price(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4 mt-2">
              <input
                className="form-control"
                placeholder="Precio anterior (opcional)"
                value={p_oldPrice}
                onChange={(e) => setP_oldPrice(e.target.value)}
              />
            </div>
            <div className="col-md-4 mt-2">
              <input
                className="form-control"
                placeholder="Tag (opcional)"
                value={p_tag}
                onChange={(e) => setP_tag(e.target.value)}
              />
            </div>

            <div className="col-md-4 mt-2">
              <input
                className="form-control"
                placeholder="Stock"
                type="number"
                min="0"
                max="10000"
                value={p_stock}
                onChange={(e) => setP_stock(e.target.value)}
                required
              />
            </div>

            {/* Selectores de tipos según categoría */}
            {p_category === 'kayak' && (
              <div className="col-md-8 mt-2">
                <select
                  className="form-control"
                  value={p_kayakTypeId}
                  onChange={(e) => setP_kayakTypeId(e.target.value)}
                  required
                >
                  <option value="">Selecciona tipo de kayak</option>
                  {kayakTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.brand} - {type.model}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {p_category === 'sup' && (
              <div className="col-md-8 mt-2">
                <select
                  className="form-control"
                  value={p_supTypeId}
                  onChange={(e) => setP_supTypeId(e.target.value)}
                  required
                >
                  <option value="">Selecciona tipo de SUP</option>
                  {supTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.brand} - {type.model}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {p_category === 'embarcacion' && (
              <div className="col-md-8 mt-2">
                <select
                  className="form-control"
                  value={p_boatTypeId}
                  onChange={(e) => setP_boatTypeId(e.target.value)}
                  required
                >
                  <option value="">Selecciona tipo de embarcación</option>
                  {boatTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.brand} - {type.model}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {p_category === 'articulo' && (
              <div className="col-md-8 mt-2">
                <select
                  className="form-control"
                  value={p_articleTypeId}
                  onChange={(e) => setP_articleTypeId(e.target.value)}
                  required
                >
                  <option value="">Selecciona tipo de artículo</option>
                  {articleTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* NUEVA SECCIÓN PARA SUBIR IMÁGENES - REEMPLAZA LOS INPUTS DE URL */}
            <div className="col-12 mt-3">
              <h6>Imágenes del Producto</h6>
              <div className="row">
                {/* Imagen Principal */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">
                    Imagen Principal *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 1)}
                    className="form-control"
                    required
                  />
                  {p_image && (
                    <div className="mt-2">
                      <img
                        src={p_image}
                        alt="Previsualización"
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          border: '2px solid #ddd',
                          borderRadius: '8px',
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger ms-2"
                        onClick={() => removeImage(1)}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>

                {/* Segunda Imagen */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Segunda Imagen (Opcional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 2)}
                    className="form-control"
                  />
                  {p_secondImage && (
                    <div className="mt-2">
                      <img
                        src={p_secondImage}
                        alt="Previsualización 2"
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          border: '2px solid #ddd',
                          borderRadius: '8px',
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger ms-2"
                        onClick={() => removeImage(2)}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>

                {/* Tercera Imagen */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Tercera Imagen (Opcional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 3)}
                    className="form-control"
                  />
                  {p_thirdImage && (
                    <div className="mt-2">
                      <img
                        src={p_thirdImage}
                        alt="Previsualización 3"
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          border: '2px solid #ddd',
                          borderRadius: '8px',
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger ms-2"
                        onClick={() => removeImage(3)}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>

                {/* Cuarta Imagen */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Cuarta Imagen (Opcional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 4)}
                    className="form-control"
                  />
                  {p_fourthImage && (
                    <div className="mt-2">
                      <img
                        src={p_fourthImage}
                        alt="Previsualización 4"
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          border: '2px solid #ddd',
                          borderRadius: '8px',
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger ms-2"
                        onClick={() => removeImage(4)}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-12 mt-2">
              <textarea
                className="form-control"
                placeholder="Descripción (opcional)"
                rows="3"
                value={p_description}
                onChange={(e) => setP_description(e.target.value)}
              />
            </div>
            <div className="col-12 mt-2">
              <textarea
                className="form-control"
                placeholder="Incluye (opcional)"
                rows="2"
                value={p_includes}
                onChange={(e) => setP_includes(e.target.value)}
              />
            </div>

            <div className="col-12 mt-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={p_approved}
                  onChange={(e) => setP_approved(e.target.checked)}
                  id="approvedCheck"
                />
                <label className="form-check-label" htmlFor="approvedCheck">
                  Producto aprobado
                </label>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderEntityList = () => {
    if (loading) {
      return (
        <div className="text-center py-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando...</p>
        </div>
      );
    }

    if (entities.length === 0) {
      return (
        <p className="text-muted">
          No hay {selectedTab.replace('Type', ' Types')} creados.
        </p>
      );
    }

    return (
      <div className="list-group">
        {entities.map((entity) => (
          <div
            key={entity.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>
                {entity.model || entity.name || entity.Productname}
              </strong>
              <div className="text-muted small">
                {entity.brand && `Marca: ${entity.brand}`}
                {entity.mainUse && `Uso: ${entity.mainUse}`}
                {entity.price && `Precio: $${entity.price}`}
                {entity.category && `Categoría: ${entity.category}`}
                {entity.approved !== undefined && (
                  <span
                    className={`badge ${
                      entity.approved ? 'bg-success' : 'bg-warning'
                    } ms-2`}
                  >
                    {entity.approved ? 'Aprobado' : 'Pendiente'}
                  </span>
                )}
              </div>
            </div>
            <div>
              {selectedTab === 'product' && !entity.approved && (
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={() => approveProduct(entity.id)}
                  disabled={loading}
                >
                  Aprobar
                </button>
              )}
              <button
                className="btn btn-sm btn-danger"
                onClick={() => removeEntity(entity.id)}
                disabled={loading}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    );
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

      <div className="mb-3 d-flex gap-2 flex-wrap">
        <button
          type="button"
          className={`btn ${
            selectedTab === 'kayakType' ? 'btn-primary' : 'btn-outline-primary'
          }`}
          onClick={() => setSelectedTab('kayakType')}
        >
          Tipo Kayak
        </button>
        <button
          type="button"
          className={`btn ${
            selectedTab === 'articleType'
              ? 'btn-primary'
              : 'btn-outline-primary'
          }`}
          onClick={() => setSelectedTab('articleType')}
        >
          Tipo Artículo
        </button>
        <button
          type="button"
          className={`btn ${
            selectedTab === 'supType' ? 'btn-primary' : 'btn-outline-primary'
          }`}
          onClick={() => setSelectedTab('supType')}
        >
          Tipo SUP
        </button>
        <button
          type="button"
          className={`btn ${
            selectedTab === 'boatType' ? 'btn-primary' : 'btn-outline-primary'
          }`}
          onClick={() => setSelectedTab('boatType')}
        >
          Tipo Embarcación
        </button>
        <button
          type="button"
          className={`btn ${
            selectedTab === 'product' ? 'btn-primary' : 'btn-outline-primary'
          }`}
          onClick={() => setSelectedTab('product')}
        >
          Productos
        </button>
        <button
          type="button"
          className={`btn ${
            selectedTab === 'localty' ? 'btn-primary' : 'btn-outline-primary'
          }`}
          onClick={() => setSelectedTab('localty')}
        >
          Localidades
        </button>
        <button
          type="button"
          className={`btn ${
            selectedTab === 'store' ? 'btn-primary' : 'btn-outline-primary'
          }`}
          onClick={() => setSelectedTab('store')}
        >
          Alta Tienda
        </button>
      </div>

      {/* Tipos de Productos */}
      {selectedTab !== 'store' && selectedTab !== 'localty' && (
        <>
          <div className="card p-4 mb-4">
            <h5 className="mb-3">
              {selectedTab === 'product'
                ? 'Crear nuevo Producto'
                : `Crear nuevo ${selectedTab.replace('Type', ' Type')}`}
            </h5>
            <form onSubmit={handleCreate}>
              <div className="row g-2">
                {renderForm()}
                <div className="col-12 mt-3">
                  <button className="btn btn-primary" disabled={loading}>
                    {loading
                      ? 'Creando...'
                      : selectedTab === 'product'
                      ? 'Crear Producto'
                      : `Crear ${selectedTab.replace('Type', ' Type')}`}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="card p-4">
            <h5 className="mb-3">
              {selectedTab === 'product'
                ? 'Productos existentes'
                : `${selectedTab.replace('Type', ' Types')} existentes`}
            </h5>
            {renderEntityList()}
          </div>
        </>
      )}

      {/* Localidades */}
      {selectedTab === 'localty' && (
        <div className="card p-4">
          <CrearLocalidades />
        </div>
      )}

      {/* Tiendas */}
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
