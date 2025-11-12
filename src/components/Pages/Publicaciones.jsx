// Componente en donde vamos a crear las publicaciones

import React, { useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';
import normalizeImagePath from '../../lib/utils/normalizeImagePath';

export default function Publicaciones() {
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editImages, setEditImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  const loadMyPosts = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      if (api.hasApi()) {
        try {
          // Cargar todas las publicaciones y filtrar las del usuario
          const allPosts = await api.getForumPosts();
          const myPosts = allPosts.filter(
            (p) =>
              p.author?.id === currentUser.id ||
              p.author?.email === currentUser.email
          );
          setPosts(myPosts);
          return;
        } catch (error) {
          console.warn('Backend no disponible, usando localStorage:', error);
        }
      }

      // Fallback a localStorage
      const localPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
      const myPosts = localPosts.filter((p) => isOwnedByUser(p, currentUser));
      setPosts(myPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Error al cargar publicaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyPosts();

    const onUpdated = () => loadMyPosts();
    window.addEventListener('postsUpdated', onUpdated);
    return () => window.removeEventListener('postsUpdated', onUpdated);
  }, []);

  const isOwnedByUser = (post, user) => {
    if (!user) return false;
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    return (
      (post.ownerEmail && user.email && post.ownerEmail === user.email) ||
      (post.contact && user.email && post.contact === user.email) ||
      (post.author?.email && user.email && post.author.email === user.email) ||
      (post.owner && fullName && post.owner === fullName)
    );
  };

  const remove = async (id) => {
    if (
      !window.confirm(
        '¿Eliminar publicación? Esta acción no se puede deshacer.'
      )
    ) {
      return;
    }

    try {
      if (api.hasApi()) {
        try {
          await api.deleteForumPost(id);
          toast.success('Publicación eliminada');
          window.dispatchEvent(new Event('postsUpdated'));
          loadMyPosts();
          return;
        } catch (error) {
          console.warn('Error en backend, eliminando localmente:', error);
        }
      }

      // Fallback a localStorage
      const localPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
      const filtered = localPosts.filter((p) => String(p.id) !== String(id));
      localStorage.setItem('userPosts', JSON.stringify(filtered));
      window.dispatchEvent(new Event('postsUpdated'));
      toast.success('Publicación eliminada localmente');
      loadMyPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('No se pudo eliminar la publicación');
    }
  };

  const startEdit = (post) => {
    setEditingId(post.id);
    setEditForm({
      title: post.title || '',
      price: post.price || '',
      description: post.content || post.description || '',
      contact: post.contactInfo || post.contact || '',
    });
    setEditImages(post.images || []);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
    setEditImages([]);
    try {
      if (fileRef.current) fileRef.current.value = '';
    } catch (e) {
      console.warn('Could not reset edit file input', e);
    }
  };

  const compressImage = (file, maxWidth = 1200, quality = 0.75) =>
    new Promise((resolve, reject) => {
      try {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          try {
            const scale = Math.min(1, maxWidth / img.width);
            const w = Math.round(img.width * scale);
            const h = Math.round(img.height * scale);
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            canvas.toBlob(
              (blob) => {
                if (!blob) return reject(new Error('Canvas is empty'));
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              },
              'image/jpeg',
              quality
            );
          } catch (err) {
            reject(err);
          } finally {
            URL.revokeObjectURL(url);
          }
        };
        img.onerror = (e) => {
          URL.revokeObjectURL(url);
          reject(e || new Error('Image load error'));
        };
        img.src = url;
      } catch (e) {
        reject(e);
      }
    });

  const handleEditFiles = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (files.length === 0) return;
    try {
      const dataUrls = await Promise.all(
        files.map((f) => compressImage(f, 1200, 0.75))
      );
      setEditImages(dataUrls);
    } catch (err) {
      console.error(err);
      toast.error('No se pudieron procesar las imágenes');
    }
  };

  const saveEdit = async (id) => {
    if (
      !editForm.title.trim() ||
      !editForm.description.trim() ||
      !editForm.contact.trim()
    ) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    if (!editImages || editImages.length === 0) {
      toast.error('Debes incluir al menos 1 imagen');
      return;
    }

    setSaving(true);

    try {
      const updateData = {
        title: editForm.title.trim(),
        content: editForm.description.trim(),
        contactInfo: editForm.contact.trim(),
        images: editImages.slice(0, 5),
        price: editForm.price.trim()
          ? parseFloat(editForm.price.trim())
          : undefined,
        authorId: currentUser.id,
      };

      if (api.hasApi()) {
        try {
          await api.updateForumPost(id, updateData);
          toast.success('Publicación actualizada');
          window.dispatchEvent(new Event('postsUpdated'));
          cancelEdit();
          loadMyPosts();
          return;
        } catch (error) {
          console.warn('Error en backend, actualizando localmente:', error);
        }
      }

      // Fallback a localStorage
      const localPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
      const updated = localPosts.map((p) => {
        if (String(p.id) === String(id)) {
          return {
            ...p,
            title: updateData.title,
            content: updateData.content,
            description: updateData.content,
            contact: updateData.contactInfo,
            contactInfo: updateData.contactInfo,
            price: updateData.price,
            images: updateData.images,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      localStorage.setItem('userPosts', JSON.stringify(updated));
      window.dispatchEvent(new Event('postsUpdated'));
      toast.success('Publicación actualizada localmente');
      cancelEdit();
      loadMyPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('No se pudo actualizar la publicación');
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando tus publicaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="mb-4">Mis Publicaciones</h2>

      {posts.length === 0 ? (
        <div className="alert alert-secondary">
          No tienes publicaciones aún.
          <Link to="/foro/crear" className="btn btn-primary ms-3">
            Crear una publicación
          </Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {posts.map((post) => (
            <div className="col" key={post.id}>
              <div className="card h-100 shadow-sm border-0">
                <div
                  style={{
                    height: 220,
                    overflow: 'hidden',
                    backgroundColor: '#f8f9fa',
                  }}
                >
                  <img
                    src={
                      normalizeImagePath(
                        (post.images && post.images[0]) || '',
                        'forum'
                      ) || '/assets/placeholder.webp'
                    }
                    alt={post.title}
                    className="img-fluid w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  {editingId === post.id ? (
                    <>
                      <div className="mb-2">
                        <label className="form-label small">Título</label>
                        <input
                          className="form-control"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm((s) => ({
                              ...s,
                              title: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="mb-2">
                        <label className="form-label small">Precio</label>
                        <input
                          type="number"
                          className="form-control"
                          value={editForm.price}
                          onChange={(e) =>
                            setEditForm((s) => ({
                              ...s,
                              price: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="mb-2">
                        <label className="form-label small">Descripción</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm((s) => ({
                              ...s,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="mb-2">
                        <label className="form-label small">Contacto</label>
                        <input
                          className="form-control"
                          value={editForm.contact}
                          onChange={(e) =>
                            setEditForm((s) => ({
                              ...s,
                              contact: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="mb-2">
                        <label className="form-label small">Imágenes</label>
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleEditFiles}
                          className="form-control"
                        />
                        <small className="text-muted">
                          Sube hasta 5 imágenes
                        </small>
                      </div>

                      <div className="d-flex gap-2 mt-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => saveEdit(post.id)}
                          disabled={saving}
                        >
                          {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={cancelEdit}
                          disabled={saving}
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h5 className="card-title">{post.title}</h5>
                      {post.price && (
                        <p className="text-success fw-bold mb-1">
                          $
                          {typeof post.price === 'number'
                            ? post.price.toLocaleString('es-AR')
                            : post.price}
                        </p>
                      )}
                      <p className="card-text text-truncate mb-2">
                        {post.content || post.description}
                      </p>
                      <div className="mt-auto d-flex gap-2">
                        <Link
                          to={`/foro/publicacion/${post.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Ver
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => startEdit(post)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => remove(post.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
