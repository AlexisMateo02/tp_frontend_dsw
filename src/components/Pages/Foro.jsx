//Componetnte donde se muestran las publicaciones del foro que hacen los usuarios
//No se pueden efectuar compras desde aqui, solo ver las publicaciones y contactarse con el vendedor

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';
import normalizeImagePath from '../../lib/utils/normalizeImagePath';

//Definimos el componente Foro
export default function Foro() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); //Quiero tener un estado para el termino de busqueda, que ahora este vacio
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Función para cargar las publicaciones del foro
  const loadPosts = async () => {
    try {
      setLoading(true);

      if (api.hasApi()) {
        // Intentar cargar desde el backend
        try {
          const backendPosts = await api.getActiveForumPosts(); // Obtener publicaciones activas del foro desde el backend
          setPosts(backendPosts || []);
          return;
        } catch (error) {
          console.warn('Backend no disponible, usando localStorage:', error);
          toast.info('Mostrando publicaciones locales');
        }
      }

      // Si no hay backend, cargar desde localStorage
      const localPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
      setPosts(localPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Error al cargar publicaciones');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar publicaciones al montar el componente y cuando se actualicen
  useEffect(() => {
    loadPosts();

    const onPostsUpdated = () => loadPosts();
    window.addEventListener('postsUpdated', onPostsUpdated);

    return () => {
      window.removeEventListener('postsUpdated', onPostsUpdated);
    };
  }, []);

  // Efecto para manejar en la busqueda el tiempo que tarda en escribir el usuario y el tiempo q tarda en filtrar y mostrar resultados
  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Filtrar y ordenar posts
  const q = (debouncedTerm || '').toLowerCase();
  let filteredPosts = posts.slice();

  if (q) {
    filteredPosts = posts.filter((p) => {
      const fields = [
        p.title,
        p.content,
        p.description,
        p.contactInfo,
        p.contact,
        p.author?.firstName,
        p.author?.lastName,
        p.owner,
      ];
      return fields.some((f) => f && String(f).toLowerCase().includes(q));
    });
  }

  // Ordenar por fecha de creación
  filteredPosts.sort((a, b) => {
    const aTime = a.createdAt
      ? new Date(a.createdAt).getTime()
      : Number(a.id) || 0;
    const bTime = b.createdAt
      ? new Date(b.createdAt).getTime()
      : Number(b.id) || 0;
    return bTime - aTime;
  });

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando publicaciones...</p>
        </div>
      </div>
    );
  }

  //Diseño de la vista del foro y llamadas a las funciones antes definidas
  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="section-title text-center mb-4">
        <h2 className="fw-semibold">Foro para Ventas</h2>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-md-8">
          <div className="d-grid gap-3">
            <Link to="/foro/crear" className="btn btn-primary btn-lg py-3">
              <i className="bi bi-plus-circle me-2"></i> Crear Publicación
            </Link>

            <Link
              to="/foro/mis"
              className="btn btn-outline-primary btn-lg py-3"
            >
              <i className="bi bi-files me-2"></i> Mis Publicaciones
            </Link>

            <form
              className="d-flex align-items-center gap-2"
              onSubmit={(e) => e.preventDefault()} //para eviatr que recargue la pagina al buscar, que es lo q normalmente hace un form, para eso esta el preventDefault
              role="search"
            >
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Buscar publicaciones"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchTerm('')}
                    title="Limpiar"
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-12">
            <h4 className="mb-3">Comunidad KBR</h4>

            {posts.length === 0 ? (
              <div className="alert alert-secondary">
                No hay publicaciones todavía.
              </div>
            ) : (
              <>
                {searchTerm && (
                  <div className="mb-3">
                    <small className="text-muted">
                      Resultados para "{searchTerm}" ({filteredPosts.length})
                    </small>
                  </div>
                )}

                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                  {filteredPosts.map((post) => {
                    const title = post.title || 'Sin título';
                    // Manejar tanto URLs del servidor como base64
                    const img =
                      normalizeImagePath(
                        (post.images && post.images[0]) || '',
                        'forum'
                      ) || '/assets/placeholder.webp';
                    const owner = post.author
                      ? `${post.author.firstName} ${post.author.lastName}`.trim()
                      : post.owner || 'Anónimo';
                    const desc = post.content || post.description || '';
                    const price = post.price;

                    return (
                      <div className="col" key={post.id}>
                        <div className="card h-100 shadow-sm border-0">
                          <div
                            style={{
                              height: 200,
                              overflow: 'hidden',
                              backgroundColor: '#f8f9fa',
                            }}
                          >
                            <img
                              src={img}
                              alt={title}
                              className="img-fluid w-100 h-100 object-fit-cover"
                              onError={(e) => {
                                e.target.src = '/assets/placeholder.webp';
                              }}
                            />
                          </div>
                          <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{title}</h5>
                            <p className="text-muted small mb-2">
                              Por: {owner}
                            </p>
                            {price && (
                              <p className="text-success fw-bold mb-2">
                                $
                                {typeof price === 'number'
                                  ? price.toLocaleString('es-AR') // Formatear número
                                  : price}
                              </p>
                            )}
                            <p className="card-text text-truncate">{desc}</p>
                            <div className="mt-auto">
                              <Link
                                to={`/foro/publicacion/${post.id}`}
                                className="btn btn-sm btn-outline-primary w-100"
                              >
                                Ver detalles
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
