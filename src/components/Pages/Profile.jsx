import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

function Profile() {
  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        
        if (!api.hasApi()) {
          throw new Error('Backend no configurado');
        }

        const userData = await api.getProfile();
        setUser(userData);
        setProfileForm({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        
        if (error.message === 'Backend no configurado') {
          toast.error('Backend no configurado. Contacta al administrador.');
        } else if (error.message.includes('No se pudo conectar')) {
          toast.error('Error de conexión con el servidor. Verifica que esté funcionando.');
        } else if (error.message.includes('No tienes permisos')) {
          toast.error('No tienes permisos para acceder a este perfil.');
        } else {
          toast.error('Error al cargar el perfil: ' + error.message);
        }
        
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!profileForm.firstName || !profileForm.email) {
      toast.error('Nombre y email son requeridos');
      return;
    }

    // Validación del teléfono (si se proporciona)
    if (profileForm.phone && profileForm.phone.trim() !== '') {
      const phoneRegex = /^\+?\d{8,}$/;
      if (!phoneRegex.test(profileForm.phone.trim())) {
        toast.error('El teléfono debe contener solo números (mínimo 8 dígitos)');
        return;
      }
    }
    
    if (!api.hasApi()) {
      toast.error('Backend no configurado. No se puede guardar.');
      return;
    }

    setSavingProfile(true);
    
    try {
      const userId = user?.id;
      if (!userId) {
        throw new Error('ID de usuario no disponible');
      }

      const updateData = {
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        phone: profileForm.phone.trim() || '',
      };

      const result = await api.updateUser(userId, updateData);
      
      const updatedUser = { ...user, ...result };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      window.dispatchEvent(new Event('authChanged'));
      
      setIsEditingProfile(false);
      toast.success('Perfil actualizado correctamente');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.message.includes('No se pudo conectar')) {
        toast.error('Error de conexión. No se pudo guardar.');
      } else if (error.message.includes('ya está registrado')) {
        toast.error('El email ya está en uso por otro usuario.');
      } else if (error.message.includes('No tienes permisos')) {
        toast.error('No tienes permisos para actualizar este perfil.');
      } else if (error.message.includes('teléfono')) {
        toast.error('El formato del teléfono no es válido');
      } else {
        toast.error(error.message || 'No se pudo actualizar el perfil');
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('Contraseña actual y nueva contraseña son requeridas');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setChangingPassword(true);
    
    try {
      const userId = user?.id;
      if (!userId) {
        throw new Error('ID de usuario no disponible');
      }

      await api.changePassword(userId, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPassword(false);
      toast.success('Contraseña actualizada correctamente');
      
    } catch (error) {
      console.error('Error changing password:', error);
      
      if (error.message.includes('contraseña actual')) {
        toast.error('La contraseña actual es incorrecta');
      } else if (error.message.includes('No tienes permisos')) {
        toast.error('No tienes permisos para cambiar esta contraseña.');
      } else {
        toast.error(error.message || 'No se pudo cambiar la contraseña');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    navigate('/');
  };

  const cancelProfileEdit = () => {
    setProfileForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
    });
    setIsEditingProfile(false);
    toast.info('Cambios descartados');
  };

  const cancelPasswordChange = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangingPassword(false);
    toast.info('Cambio de contraseña cancelado');
  };

  if (loading) {
    return (
      <div className="container" style={{ marginTop: '100px' }}>
        <div className="text-center">
          <h3>Mi Perfil</h3>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ marginTop: '100px' }}>
        <h3>Mi Perfil</h3>
        <p>No hay usuario logueado o no se pudo cargar el perfil.</p>
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
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h3>Mi Perfil</h3>
          <p className="text-muted">Gestiona tu información personal y seguridad</p>
        </div>
        <button className="btn btn-danger" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <div className="row">
        {/* Información Personal */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Información Personal</h5>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => isEditingProfile ? cancelProfileEdit() : setIsEditingProfile(true)}
              >
                {isEditingProfile ? 'Cancelar' : 'Editar'}
              </button>
            </div>
            <div className="card-body">
              <form onSubmit={handleProfileSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre *</label>
                  <input
                    name="firstName"
                    value={profileForm.firstName}
                    onChange={handleProfileChange}
                    className="form-control"
                    required
                    disabled={!isEditingProfile}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input
                    name="lastName"
                    value={profileForm.lastName}
                    onChange={handleProfileChange}
                    className="form-control"
                    disabled={!isEditingProfile}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={profileForm.email}
                    className="form-control"
                    disabled
                  />
                  <small className="text-muted">El email no se puede modificar</small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="form-control"
                    disabled={!isEditingProfile}
                    placeholder="Ej: +541234567890"
                  />
                  <small className="text-muted">Solo números. Mínimo 8 dígitos. Opcionalmente, comenzar con +</small>
                </div>

                {isEditingProfile && (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-dark"
                      type="submit"
                      disabled={savingProfile}
                    >
                      {savingProfile ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={cancelProfileEdit}
                    >
                      Descartar
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Seguridad - Cambio de Contraseña */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Seguridad</h5>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => isChangingPassword ? cancelPasswordChange() : setIsChangingPassword(true)}
              >
                {isChangingPassword ? 'Cancelar' : 'Cambiar Contraseña'}
              </button>
            </div>
            <div className="card-body">
              {isChangingPassword ? (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Contraseña Actual *</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Nueva Contraseña *</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="form-control"
                      required
                      minLength={6}
                    />
                    <small className="text-muted">Mínimo 6 caracteres</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirmar Nueva Contraseña *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-dark"
                      type="submit"
                      disabled={changingPassword}
                    >
                      {changingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={cancelPasswordChange}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <p className="text-muted">
                    Para cambiar tu contraseña, haz clic en el botón "Cambiar Contraseña".
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;