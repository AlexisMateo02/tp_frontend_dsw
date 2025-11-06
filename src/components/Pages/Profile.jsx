import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';

/*
  Componente MiPerfil
  - Lee el usuario actual desde localStorage.currentUser
  - Muestra un formulario para editar: firstName, lastName, email, phone
  - Guarda los cambios en localStorage.users (busca por id o email) y actualiza localStorage.currentUser
  - Dispara evento 'authChanged' para que la Nav y otras partes de la app se enteren
*/

function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [avatarProcessing, setAvatarProcessing] = useState(false);
  const fileRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const cur = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (cur) {
        setUser(cur);
        setForm({
          firstName: cur.firstName || '',
          lastName: cur.lastName || '',
          email: cur.email || '',
          phone: cur.phone || '',
        });
        if (cur.avatar) setPreviewAvatar(cur.avatar);
      }
    } catch {
      setUser(null);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.email) {
      toast.error('Nombre y email son requeridos');
      return;
    }
    setSaving(true);
    console.log('Profile: handleSubmit', { form, previewAvatar, user });
    toast.info('Guardando cambios...');
    try {
      // load users array
      const usersRaw = localStorage.getItem('users');
      let users = [];
      try {
        users = usersRaw ? JSON.parse(usersRaw) : [];
      } catch {
        users = [];
      }

      // find user by id (if exists) or by email
      let updated = false;
      const id = user && user.id ? user.id : null;
      if (id) {
        users = users.map((u) => {
          if (u.id === id) {
            updated = true;
            return { ...u, ...form, avatar: previewAvatar || u.avatar };
          }
          return u;
        });
      }

      if (!updated) {
        // try to find by email
        users = users.map((u) => {
          if (u.email && user && user.email && u.email === user.email) {
            updated = true;
            return { ...u, ...form, avatar: previewAvatar || u.avatar };
          }
          return u;
        });
      }

      if (!updated) {
        // if user not found, create a simple id and push
        const newId = Date.now();
        users.push({ id: newId, ...form, avatar: previewAvatar || null });
      }

      // If API is configured and user has an id, attempt to save to backend first.
      // let backendSaved = false; (not used)
      const apiEnabled = api.hasApi();
      const userId = (user && user.id) || null;
      const newCurrent = { ...user, ...form };

      if (apiEnabled && userId) {
        try {
          // If there is a previewAvatar (data URL), upload it first
          if (previewAvatar && previewAvatar.startsWith('data:')) {
            const uploadResp = await api.uploadAvatar(userId, previewAvatar);
            // backend may return avatarUrl or updated user
            if (uploadResp && uploadResp.avatarUrl) {
              newCurrent.avatar = uploadResp.avatarUrl;
            } else if (uploadResp && uploadResp.avatar) {
              newCurrent.avatar = uploadResp.avatar;
            }
          }
          // update user object on server
          const updated = await api.updateUser(userId, newCurrent);
          // if backend returns updated user, use that
          if (updated) {
            Object.assign(newCurrent, updated);
          }
        } catch (err) {
          console.error(
            'Backend save failed, falling back to localStorage',
            err
          );
          toast.warn(
            'No se pudo guardar en el servidor — se guardará localmente.'
          );
        }
      }

      // Persist to localStorage (always) so the app works offline too.
      try {
        localStorage.setItem('users', JSON.stringify(users));
      } catch (err) {
        console.error('Error saving users to localStorage', err);
      }

      // persist currentUser locally as well
      try {
        localStorage.setItem('currentUser', JSON.stringify(newCurrent));
      } catch (err) {
        console.error('Error saving currentUser to localStorage', err);
      }
      // notify other components
      window.dispatchEvent(new Event('authChanged'));

      setUser(newCurrent);
      setForm({
        firstName: newCurrent.firstName || '',
        lastName: newCurrent.lastName || '',
        email: newCurrent.email || '',
        phone: newCurrent.phone || '',
      });
      setIsEditing(false);
      toast.success('Perfil guardado correctamente');
    } catch (err) {
      console.error('Error guardando perfil', err);
      toast.error('No se pudo guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (file) => {
    if (!file) return;
    setAvatarProcessing(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      // compress image using canvas to avoid large localStorage usage
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 900; // limit max dimension
          let { width, height } = img;
          let scale = 1;
          if (width > maxDim || height > maxDim) {
            scale = Math.min(maxDim / width, maxDim / height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          // try a few qualities to keep size reasonable
          const compressed = canvas.toDataURL('image/jpeg', 0.75);
          setPreviewAvatar(compressed);
        } catch (err) {
          console.error('Error compressing avatar', err);
          // fallback to original
          setPreviewAvatar(dataUrl);
        } finally {
          setAvatarProcessing(false);
        }
      };
      img.onerror = () => {
        // fallback
        setPreviewAvatar(dataUrl);
        setAvatarProcessing(false);
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      setAvatarProcessing(false);
      toast.error('No se pudo leer la imagen');
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('authChanged'));
    navigate('/');
  };

  if (!user) {
    return (
      <div className="container" style={{ marginTop: '100px' }}>
        <h3>Mi Perfil</h3>
        <p>No hay usuario logueado.</p>
        <p>
          <Link to="/login" className="btn btn-dark">
            Iniciar sesión
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '100px', maxWidth: 900 }}>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h3>Mi Perfil</h3>
          <p className="text-muted">Aquí puedes ver y editar tus datos.</p>
        </div>
        <div>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => setIsEditing((s) => !s)}
          >
            {isEditing ? 'Cancelar' : 'Editar mi perfil'}
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 text-center">
          <div style={{ width: 220, margin: '0 auto' }}>
            <img
              src={
                previewAvatar ||
                user.avatar ||
                '/assets/images/avatar-placeholder.png'
              }
              alt="avatar"
              style={{
                width: 220,
                height: 220,
                objectFit: 'cover',
                borderRadius: '50%',
                border: '1px solid #ddd',
              }}
            />
            {isEditing && (
              <div className="mt-3">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) =>
                    handleAvatarChange(e.target.files && e.target.files[0])
                  }
                />
                <small className="text-muted">
                  Puedes subir JPG/PNG. Se almacenará localmente.
                </small>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-8">
          <form ref={formRef} onSubmit={handleSubmit} className="mt-0">
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Apellido</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="form-control"
                required
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Teléfono</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-dark"
                  type="submit"
                  disabled={saving || avatarProcessing}
                  onClick={(e) => {
                    // fallback to ensure submit fires even if something blocks the form
                    e.preventDefault();
                    if (saving || avatarProcessing) return;
                    try {
                      handleSubmit(e);
                    } catch (err) {
                      console.error('Submit fallback error', err);
                      toast.error('Error al intentar guardar');
                    }
                  }}
                >
                  {saving
                    ? 'Guardando...'
                    : avatarProcessing
                    ? 'Procesando imagen...'
                    : 'Guardar cambios'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    // reset form to current user
                    setForm({
                      firstName: user.firstName || '',
                      lastName: user.lastName || '',
                      email: user.email || '',
                      phone: user.phone || '',
                    });
                    setPreviewAvatar(user.avatar || null);
                    toast.info('Cambios descartados');
                    setIsEditing(false);
                  }}
                >
                  Descartar
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
/*Componente Profile
Este componente representa la página de perfil del usuario.
Muestra la información del usuario y permite editarla.*/
