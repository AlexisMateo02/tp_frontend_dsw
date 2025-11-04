import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PublicacionDetails() {
  const { id } = useParams();

  const [mainImage, setMainImage] = useState('/assets/placeholder.webp');
  const [images, setImages] = useState([]);

  const posts = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('userPosts') || '[]');
    } catch {
      return [];
    }
  }, []);

  const post = useMemo(
    () => posts.find((p) => String(p.id) === String(id)),
    [posts, id]
  );

  useEffect(() => {
    if (post) {
      const list = (post.images || []).filter(Boolean);
      setImages(list);
      setMainImage(list[0] || '/assets/placeholder.webp');
    }
  }, [post]);

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

  return (
    <>
      <ol className="section-banner py-3 position-relative">
        <li className="position-relative">
          <a href="/">Inicio</a>
        </li>
        <li className="position-relative active">
          <a href="/foro" className="ps-5">
            Foro
          </a>
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
              <div
                className="d-flex flex-md-column me-md-3 gap-2 thumbnail-images"
                style={{
                  zIndex: 2, // evita overlays arriba
                  position: 'relative', // para que el zIndex tenga efecto
                  pointerEvents: 'auto', // por si algún contenedor tenía none
                }}
              >
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMainImage(img)}
                    aria-label={`Ver imagen ${idx + 1}`}
                    aria-pressed={mainImage === img}
                    className={`p-0 border-0 bg-transparent ${
                      mainImage === img ? 'shadow' : ''
                    }`}
                    style={{ lineHeight: 0, cursor: 'pointer' }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setMainImage(img);
                      }
                    }}
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
                        userSelect: 'none',
                      }}
                    />
                  </button>
                ))}
              </div>

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
                  zIndex: 1,
                  position: 'relative',
                }}
              />
            </div>
          </div>

          <div className="col-xl-6">
            <h2 className="mb-3">{post.title}</h2>
            <h4 className="mb-3 text-muted">
              {(() => {
                const p = post.price;
                if (!p && p !== 0) return '—';
                if (typeof p === 'number') {
                  const hasDecimals = p % 1 !== 0;
                  return `Precio: $${p.toLocaleString('es-AR', {
                    minimumFractionDigits: hasDecimals ? 2 : 0,
                    maximumFractionDigits: hasDecimals ? 2 : 0,
                  })}`;
                }
                const s = String(p).trim();
                if (s.includes('$')) return `Precio: ${s}`;
                return `Precio: $${s}`;
              })()}
            </h4>

            <div className="mb-3">
              <button
                className="btn btn-outline-primary me-2"
                onClick={() =>
                  navigator.clipboard?.writeText(window.location.href)
                }
              >
                Copiar enlace
              </button>
              <a
                className="btn btn-success"
                href={contactHref(post.contact, post)}
              >
                Contactar vendedor
              </a>
            </div>

            <hr />
            <p>
              <strong>Dueño:</strong> {post.owner || 'Anónimo'}
            </p>
            <p>
              <strong>Contacto:</strong>{' '}
              {post.contact ? (
                <a href={contactHref(post.contact, post)}>{post.contact}</a>
              ) : (
                '—'
              )}
            </p>
            <p>
              <strong>Descripción:</strong>{' '}
              {post.description || 'Sin descripción'}
            </p>

            <div className="mt-4">
              <a href="/foro" className="btn btn-secondary me-2">
                Volver al foro
              </a>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
