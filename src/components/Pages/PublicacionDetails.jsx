import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';
import normalizeImagePath from '../../lib/utils/normalizeImagePath';

export default function PublicacionDetails() {
  // Inicializar estados y hooks
  const { id } = useParams(); // Obtener ID de la publicación desde la URL
  const [post, setPost] = useState(null);
  const [mainImage, setMainImage] = useState('/assets/placeholder.webp');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar detalles de la publicación al montar el componente o cuando cambie el ID
  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);

        // Intentar cargar desde el backend
        if (api.hasApi()) {
          try {
            const postData = await api.getForumPost(id);
            setPost(postData);

            // Procesar imágenes, ya que pueden venir en varios formatos, las normalizamos
            const rawImgs = postData.images || postData.image || [];
            const imgList = (Array.isArray(rawImgs) ? rawImgs : [rawImgs])
              .map((it) => {
                if (!it) return null;
                if (typeof it === 'string')
                  return normalizeImagePath(it, 'forum');
                if (typeof it === 'object') {
                  const src = it.url || it.path || it.src || it.name;
                  if (src && typeof src === 'string')
                    return normalizeImagePath(src, 'forum');
                  return null;
                }
                return null;
              })
              .filter(Boolean);

            setImages(imgList);
            setMainImage(imgList[0] || '/assets/placeholder.webp');
            return;
          } catch (error) {
            console.warn(
              'Backend no disponible, buscando en localStorage:',
              error
            );
          }
        }

        // Si no hay backend, cargar desde localStorage
        const localPosts = JSON.parse(
          localStorage.getItem('userPosts') || '[]'
        );
        const foundPost = localPosts.find((p) => String(p.id) === String(id));

        // Procesar imágenes si se encontró la publicación
        if (foundPost) {
          setPost(foundPost);
          const rawImgs = foundPost.images || foundPost.image || [];
          const imgList = (Array.isArray(rawImgs) ? rawImgs : [rawImgs])
            .map((it) => {
              if (!it) return null;
              if (typeof it === 'string')
                return normalizeImagePath(it, 'forum');
              if (typeof it === 'object') {
                const src = it.url || it.path || it.src || it.name;
                if (src && typeof src === 'string')
                  return normalizeImagePath(src, 'forum');
                return null;
              }
              return null;
            })
            .filter(Boolean);

          setImages(imgList);
          setMainImage(imgList[0] || '/assets/placeholder.webp');
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error('Error loading post:', error);
        toast.error('Error al cargar la publicación');
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  // Función para generar el enlace de contacto adecuado, via mail y con el mesnaje predefinido
  const contactHref = (c, postData) => {
    if (!c) return '#';
    if (/@/.test(c)) {
      const subject = `Consulta sobre: ${postData?.title || ''}`;
      const lines = [
        'Hola,',
        '',
        `Me interesa la publicación: "${postData?.title || ''}"${
          postData?.id ? ` (ID: ${postData.id})` : ''
        }.`,
        'Quisiera por favor que me informen:',
        '- Estado del artículo',
        '- Medidas o especificaciones relevantes',
        '- Precio final con envío (si aplica)',
        '- Tiempo estimado de entrega o retiro',
        '',
        'Mi nombre:',
        'Mi contacto (email o teléfono):',
        'Gracias.',
      ];
      const body = lines.join('\n');
      return `mailto:${c}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    }
    const digits = c.replace(/\D/g, '');
    if (digits.length >= 6) return `tel:${digits}`;
    return `mailto:${c}`;
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando publicación...</p>
      </div>
    );
  }

  // si no se encuentra la publicacion
  if (!post) {
    return (
      <div className="container text-center py-5">
        <h2>Publicación no encontrada</h2>
        <p>La publicación que buscas no existe o fue removida.</p>
        <Link to="/foro" className="btn btn-primary">
          Volver al Foro
        </Link>
      </div>
    );
  }

  // Obtener nombre del propietario de la publicación
  const ownerName = post.author
    ? `${post.author.firstName} ${post.author.lastName}`.trim()
    : post.owner || 'Anónimo';

  // Obtener información de contacto
  const contactInfo = post.contactInfo || post.contact || '—';
  const description = post.content || post.description || 'Sin descripción';

  //Diseñamos la vista de los detalles de la publicacion y hacemos llamadas a las funciones antes definidas
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <ol className="section-banner py-3 position-relative">
        <li className="position-relative">
          <Link to="/">Inicio</Link>
        </li>
        <li className="position-relative active">
          <Link to="/foro" className="ps-5">
            Foro
          </Link>
        </li>
        <li className="position-relative active">
          <span className="ps-5">{post.title}</span>
        </li>
      </ol>

      <div className="container py-5">
        <div className="row">
          <div className="col-xl-6">
            <div className="d-flex flex-column-reverse flex-md-row mb-4">
              {/* Miniaturas */}
              {images.length > 1 && (
                <div className="d-flex flex-md-column me-md-3 gap-2 thumbnail-images">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMainImage(img)}
                      className={`p-0 border-0 bg-transparent ${
                        mainImage === img ? 'shadow' : ''
                      }`}
                      style={{ lineHeight: 0, cursor: 'pointer' }}
                    >
                      <img
                        src={img}
                        alt={`Miniatura ${idx + 1}`}
                        loading="lazy"
                        className={`img-thumbnail ${
                          mainImage === img ? 'border border-2 border-dark' : ''
                        }`}
                        style={{
                          width: 90,
                          height: 100,
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Imagen principal */}
              <img
                src={mainImage}
                className="img-fluid"
                alt="Imagen principal de la publicación"
                style={{
                  width: '100%',
                  maxWidth: 450,
                  height: 300,
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>

          <div className="col-xl-6">
            <h2 className="mb-3">{post.title}</h2>

            {post.price && (
              <h4 className="mb-3 text-success">
                $
                {typeof post.price === 'number'
                  ? post.price.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                    })
                  : post.price}
              </h4>
            )}

            <div className="mb-3">
              <button
                className="btn btn-outline-primary me-2"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success('Enlace copiado al portapapeles');
                }}
              >
                <i className="bi bi-share"></i> Compartir
              </button>
              <a
                className="btn btn-success"
                href={contactHref(contactInfo, post)}
              >
                <i className="bi bi-chat-dots"></i> Contactar vendedor
              </a>
            </div>

            <hr />

            <div className="mb-3">
              <strong>Vendedor:</strong> {ownerName}
            </div>

            <div className="mb-3">
              <strong>Contacto:</strong>{' '}
              {contactInfo !== '—' ? (
                <a href={contactHref(contactInfo, post)}>{contactInfo}</a>
              ) : (
                '—'
              )}
            </div>

            <div className="mb-3">
              <strong>Descripción:</strong>
              <p className="mt-2" style={{ whiteSpace: 'pre-wrap' }}>
                {description}
              </p>
            </div>

            {post.status && (
              <div className="mb-3">
                <span
                  className={`badge ${
                    post.status === 'active'
                      ? 'bg-success'
                      : post.status === 'sold'
                      ? 'bg-secondary'
                      : 'bg-warning'
                  }`}
                >
                  {post.status === 'active'
                    ? 'Disponible'
                    : post.status === 'sold'
                    ? 'Vendido'
                    : 'Expirado'}
                </span>
              </div>
            )}

            <div className="mt-4">
              <Link to="/foro" className="btn btn-secondary me-2">
                <i className="bi bi-arrow-left"></i> Volver al foro
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
