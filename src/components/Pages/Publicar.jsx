//Componente para crear una nueva publicación en el foro

//  Importar dependencias necesarias
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

// Definir el componente Publicar
export default function Publicar() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null'); // Obtener usuario actual desde localStorage

  const [form, setForm] = useState({
    // Estado para los campos del formulario
    title: '',
    price: '',
    description: '',
    contact: currentUser?.email || '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Redirigir automaticamente a login si no ingresaste sesion
    if (!currentUser) {
      toast.info('Debes iniciar sesión para crear una publicación');
      navigate('/login', { state: { returnTo: '/foro/crear' } });
    }
  }, [currentUser, navigate]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    // Actualizar el estado del formulario cada vez que el usuario escribe en un campo
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Validar los campos del formulario antes de enviar
  const validate = () => {
    if (!form.title.trim()) return 'Título es obligatorio';
    if (!form.description.trim()) return 'Descripción es obligatoria';
    if (!form.contact.trim()) return 'Contacto es obligatorio';
    if (!images || images.length === 0) return 'Debes subir al menos 1 imagen';
    if (images.length > 5) return 'Máximo 5 imágenes permitidas';
    return null;
  };

  //IMÁGENES
  // Función para comprimir imágenes antes de subir
  const compressImage = (file, maxWidth = 800, quality = 0.6) =>
    new Promise((resolve, reject) => {
      try {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          try {
            // Calcular nuevas dimensiones
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            // Dibujar imagen comprimida
            ctx.drawImage(img, 0, 0, width, height);

            // Convertir a JPEG con mayor compresión
            canvas.toBlob(
              (blob) => {
                if (!blob) return reject(new Error('Canvas empty'));

                // Verificar tamaño y comprimir más si es necesario
                if (blob.size > 300000) {
                  canvas.toBlob(
                    (smallerBlob) => {
                      const reader = new FileReader();
                      reader.onload = () => {
                        URL.revokeObjectURL(url);
                        resolve(reader.result);
                      };
                      reader.onerror = reject;
                      reader.readAsDataURL(smallerBlob);
                    },
                    'image/jpeg',
                    quality * 0.7 // Más compresión
                  );
                } else {
                  const reader = new FileReader();
                  reader.onload = () => {
                    URL.revokeObjectURL(url);
                    resolve(reader.result);
                  };
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                }
              },
              'image/jpeg',
              quality
            );
          } catch (err) {
            URL.revokeObjectURL(url);
            reject(err);
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Error loading image'));
        };
        img.src = url;
      } catch (e) {
        reject(e);
      }
    });

  // Manejar selección de archivos (imágenes)
  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (files.length === 0) return;

    try {
      toast.info('Procesando imágenes...');
      const dataUrls = await Promise.all(
        files.map((f) => compressImage(f, 1200, 0.75))
      );
      setImages(dataUrls);
      toast.success('Imágenes procesadas correctamente');
    } catch (err) {
      console.error('Error procesando imágenes', err);
      toast.error('No se pudieron procesar las imágenes');
    }
  };

  // Eliminar una imagen de la lista
  const removeImage = (idx) => {
    const next = [...images];
    next.splice(idx, 1);
    setImages(next);
    try {
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e) {
      console.warn('Could not reset file input', e);
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('🔍 Iniciando submit...');
    console.log('📸 Número de imágenes:', images.length);

    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setLoading(true);

    // Intentar crear la publicación
    try {
      let imageUrls = [];

      // Si hay API disponible, subir IMÁGENES al servidor
      if (api.hasApi() && images.length > 0) {
        console.log('🔄 Subiendo imágenes al servidor...');

        try {
          const uploadedUrls = [];
          for (let i = 0; i < images.length; i++) {
            const imageDataUrl = images[i];
            console.log(`📤 Subiendo imagen ${i + 1}...`);

            try {
              const uploadResult = await api.uploadForumImage(imageDataUrl);
              console.log('✅ Imagen subida:', uploadResult);
              uploadedUrls.push(uploadResult.imageUrl);
            } catch (uploadError) {
              console.error(`❌ Error subiendo imagen ${i + 1}:`, uploadError);
              toast.warn(`No se pudo subir la imagen ${i + 1}, se omitirá`);
            }
          }

          if (uploadedUrls.length > 0) {
            imageUrls = uploadedUrls;
            console.log('📊 URLs de imágenes subidas:', imageUrls);
          } else {
            toast.error('No se pudieron subir las imágenes al servidor');
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('💥 Error en upload de imágenes:', error);
          toast.warn('Error subiendo imágenes, guardando en base64');
          // Fallback: usar base64 si falla el upload
          imageUrls = images;
        }
      } else {
        // Sin API o sin imágenes, usar base64
        imageUrls = images;
      }

      // Preparar datos para el backend, es decir guarda los datos de la publicación en el backend
      const postData = {
        title: form.title.trim(),
        content: form.description.trim(),
        contactInfo: form.contact.trim(),
        authorId: currentUser.id,
        images: imageUrls, // Ahora pueden ser URLs o base64
        price: form.price.trim() ? parseFloat(form.price.trim()) : undefined,
      };

      console.log('📨 Enviando datos de publicación:', {
        ...postData,
        images: imageUrls.length, // Solo mostrar cantidad para no saturar console
      });

      if (api.hasApi()) {
        try {
          await api.createForumPost(postData);
          toast.success('Publicación creada correctamente');
          window.dispatchEvent(new Event('postsUpdated'));
          setTimeout(() => navigate('/foro'), 700);
          return;
        } catch (error) {
          console.warn('Error en backend, guardando localmente:', error);
          toast.warn('No se pudo guardar en el servidor, guardando localmente');
        }
      }

      // Si no hay backend, guardar localmente en el localStorage
      const localPost = {
        id: Date.now(),
        ...postData,
        owner: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
        ownerEmail: currentUser.email,
        contact: postData.contactInfo,
        description: postData.content,
        createdAt: new Date().toISOString(),
      };

      // Guardar en localStorage
      const existing = JSON.parse(localStorage.getItem('userPosts') || '[]');
      existing.unshift(localPost);
      localStorage.setItem('userPosts', JSON.stringify(existing));

      window.dispatchEvent(new Event('postsUpdated'));
      toast.success('Publicación creada localmente');
      setTimeout(() => navigate('/foro'), 700);
    } catch (err) {
      console.error('💥 Error general:', err);
      toast.error(err.message || 'No se pudo crear la publicación');
    } finally {
      setLoading(false);
    }
  };

  // Si no hay usuario actual, no mostrar nada
  if (!currentUser) {
    return null;
  }

  // Diseñamos el formulario de creación de publicación y hacemos llamadas a las funciones antes definidas
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
          <small className="text-muted">
            Mínimo 10 caracteres, máximo 5000
          </small>
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
            <label className="form-label">
              Vista previa ({images.length}/5)
            </label>
            <div className="d-flex flex-wrap gap-2">
              {images.map((src, idx) => (
                <div key={idx} style={{ width: 100, position: 'relative' }}>
                  <img
                    src={src}
                    alt={`Preview ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 6,
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    style={{ position: 'absolute', top: 4, right: 4 }}
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
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Publicando...' : 'Publicar'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/foro')}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
