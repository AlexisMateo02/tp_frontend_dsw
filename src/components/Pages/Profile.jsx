//Componente de perfil de usuario
//Vamos a poder editar nuestros datos personales, cambiar la contraseña y ver nuestras órdenes recientes

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; // para notificaciones/carteles
import { Link, useNavigate } from 'react-router-dom'; //navegacion entre paginas, link para navegacion interna y useNavigate para redireccionar cuando cerramos sesion
import api from '../../services/api'; //importamos el servicio api para llamadas al backend

//Definimos el componente Profile
function Profile() {
  const [user, setUser] = useState(null); //inicializamos el estado del usuario hasta que carguemos sus datos
  const [profileForm, setProfileForm] = useState({
    //inicializamos el formulario de perfil
    //cuando editamos estos campos no aparecen vacios porque los llenamos con los datos de la llamada al backend
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    //cambio de contraseña empieza vacio
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingProfile, setSavingProfile] = useState(false); //savingProfile comienza en false, y cuando guardamos el perfil se pone en true. Cuando termina de guardarse vuelve a false
  const [changingPassword, setChangingPassword] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true); //loading comienza en true hasta que carguemos los datos del usuario
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const navigate = useNavigate(); //para redireccionar al cerrar sesion

  // useEffect para cargar el perfil del usuario al montar el componente
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);

        //valida que el backend exista
        if (!api.hasApi()) {
          throw new Error('Backend no configurado');
        }

        const userData = await api.getProfile(); //llamamos a la api para obtener los datos del perfil (es decir, pide el perfil al backend)
        setUser(userData); //seteamos el estado del usuario con los datos recibidos
        // Rellenar el formulario con los datos recibidos
        setProfileForm({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
        });

        // Cargar órdenes del usuario después de cargar el perfil
        if (userData.id) {
          //verificamos que exista el id del usuario
          loadUserOrders(userData.id); //si existe, cargamos sus órdenes
        }
      } catch (error) {
        console.error('Error loading profile:', error); //mostramos el error en la consola

        //Errores específicos para mostrar mensajes adecuados, segun el mesanje de error.message
        if (error.message === 'Backend no configurado') {
          toast.error('Backend no configurado. Contacta al administrador.');
        } else if (error.message.includes('No se pudo conectar')) {
          toast.error(
            'Error de conexión con el servidor. Verifica que esté funcionando.'
          );
        } else if (error.message.includes('No tienes permisos')) {
          toast.error('No tienes permisos para acceder a este perfil.');
        } else {
          toast.error('Error al cargar el perfil: ' + error.message);
        }

        setUser(null); //si hay error, seteamos el usuario en null
      } finally {
        setLoading(false); //siempre se ejecuta, seteamos loading en false cuando termina la carga (asi nos asegueramos que no quede en true si hay error, y se quede estancado el loading)
      }
    };

    loadUserProfile();
  }, []);

  // Función para cargar las órdenes del usuario
  const loadUserOrders = async (userId) => {
    //recibe el id del usuario
    try {
      setLoadingOrders(true); //muestra cargando mientras busca las órdenes, que setloadingorders esta en true
      console.log('🔄 Cargando órdenes para usuario ID:', userId);

      const response = await fetch(
        //pedimos las órdenes del usuario al backend
        `http://localhost:3000/api/orders/user/${userId}` //hacemos fetch directo porque no tenemos esta funcion en el servicio api
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`); //si la respuesta no es ok, lanzamos un error
      }

      const result = await response.json();
      console.log('✅ Órdenes recibidas:', result); //mostramos en consola las órdenes recibidas

      if (result.data) {
        //si hay datos en la respuesta, seteamos las órdenes del usuario, si no, las dejamos en un array vacio de que no hay ordenes
        setUserOrders(result.data);
      } else {
        setUserOrders([]);
      }
    } catch (error) {
      //si hay error, mostramos en consola y seteamos las órdenes en vacio
      console.error('❌ Error cargando órdenes:', error);
      setUserOrders([]);
    } finally {
      setLoadingOrders(false); //siempre se ejecuta, seteamos loadingorders en false cuando termina la carga, para no entrar en un bucle infinito de carga si es que hay error
    }
  };

  //maneja los cambios en el formulario de perfil
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  //maneja los cambios en el formulario de cambio de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  //maneja el submit del formulario de perfil, actualiza los datos del usuario en el backend
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    // Validación del nombre y email, es decir si no existe alguno de los dos, mostramos error y no dejamos continuar
    if (!profileForm.firstName || !profileForm.email) {
      toast.error('Nombre y email son requeridos');
      return;
    }

    // Validación del teléfono (si se proporciona)
    if (profileForm.phone && profileForm.phone.trim() !== '') {
      const phoneRegex = /^\+?\d{8,}$/;
      if (!phoneRegex.test(profileForm.phone.trim())) {
        toast.error(
          'El teléfono debe contener solo números (mínimo 8 dígitos)'
        );
        return;
      }
    }

    // Verifica que el backend esté configurado
    if (!api.hasApi()) {
      toast.error('Backend no configurado. No se puede guardar.');
      return;
    }

    setSavingProfile(true); //seteamos savingprofile en true para mostrar que se está guardando

    try {
      const userId = user?.id; //obtenemos el id del usuario actual, evitando errores con el optional ? si user es null
      if (!userId) {
        //si no existe el id del usuario, lanzamos un error
        throw new Error('ID de usuario no disponible');
      }

      const updateData = {
        //preparamos los datos a actualizar
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        phone: profileForm.phone.trim() || '',
      };

      const result = await api.updateUser(userId, updateData); //llamamos a la api para actualizar el usuario en el backend

      // Actualizamos el estado del usuario y el localStorage con los nuevos datos
      const updatedUser = { ...user, ...result };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      window.dispatchEvent(new Event('authChanged'));

      setIsEditingProfile(false);
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error updating profile:', error);

      //si te sale error, mostramos mensajes adecuados segun el error
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
      setSavingProfile(false); //siempre se ejecuta, seteamos savingprofile en false cuando termina la carga (asi nos asegueramos que no quede en true si hay error, y se quede estancado el guardado)
    }
  };

  //maneja el submit del formulario de cambio de contraseña
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    //Condiciones de validacion para el cambio de contraseña

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

    setChangingPassword(true); //seteamos changingpassword en true para mostrar que se está cambiando la contraseña

    // Verifica que el backend esté configurado
    try {
      const userId = user?.id;
      if (!userId) {
        throw new Error('ID de usuario no disponible');
      }

      // Llamamos a la API para cambiar la contraseña
      await api.changePassword(userId, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      // Si todo sale bien, reseteamos el formulario y cerramos la edición
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPassword(false); //cerramos la edicion del cambio de contraseña
      toast.success('Contraseña actualizada correctamente');
    } catch (error) {
      console.error('Error changing password:', error);

      //si te sale error, mostramos mensajes adecuados segun el error
      if (error.message.includes('contraseña actual')) {
        toast.error('La contraseña actual es incorrecta');
      } else if (error.message.includes('No tienes permisos')) {
        toast.error('No tienes permisos para cambiar esta contraseña.');
      } else {
        toast.error(error.message || 'No se pudo cambiar la contraseña');
      }
    } finally {
      setChangingPassword(false); //
    }
  };

  //maneja el logout del usuario
  const handleLogout = () => {
    api.logout();
    navigate('/'); //redirecciona al home cuando cierra sesion
  };

  //cuadno cancelamos la edicion del perfil, reseteamos el formulario a los datos actuales del usuario
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

  //cuando cancelamos el cambio de contraseña, reseteamos el formulario (lo mismo que lo anterior cuando cancelamos editar perfil)
  const cancelPasswordChange = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangingPassword(false);
    toast.info('Cambio de contraseña cancelado');
  };

  // Función para formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Función para obtener clase CSS del estado
  const getStatusClass = (status) => {
    const statusClassMap = {
      pending: 'bg-warning text-dark',
      confirmed: 'bg-info',
      shipped: 'bg-primary',
      delivered: 'bg-success',
      cancelled: 'bg-danger',
    };
    return statusClassMap[status] || 'bg-secondary';
  };

  // Función para traducir estados, ya que viene predefinido en ingles desde el backend
  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      shipped: 'Enviada',
      delivered: 'Entregada',
      cancelled: 'Cancelada',
    };
    return statusMap[status] || status; //si no encuentra el estado, devuelve el mismo estado
  };

  if (loading) {
    //si loading es true, mostramos cargando mientras carga el perfil
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
    //si no hay usuario, mostramos mensaje de que no hay usuario logueado, y nos redirige a inciar sesion, ya que no hay nigun usuario logueado para poder editar sus datos
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

  //Mostrar perfil de usuario
  return (
    <div className="container" style={{ marginTop: '100px', maxWidth: 1200 }}>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h3>Mi Perfil</h3>
          <p className="text-muted">
            Gestiona tu información personal y seguridad
          </p>
        </div>
        <button className="btn btn-danger" onClick={handleLogout}>
          {/* cuando el usuario hace click en cerrar sesion, invoca handleLogout antes definido */}
          Cerrar sesión
        </button>
      </div>
      <div className="row">
        {/*CAMBIO/EDITAR DATOS PERSONALES*/}
        {/* Información Personal */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Información Personal</h5>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() =>
                  //cuando hacemosclick en editar, tenemos dos opciones, cancelar edicion o empezar a editar y guardar los cambios
                  isEditingProfile
                    ? cancelProfileEdit()
                    : setIsEditingProfile(true)
                }
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
                    placeholder="Ingrese su nombre"
                    required
                    disabled={!isEditingProfile}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input
                    name="lastName"
                    value={profileForm.lastName} //el input muestra el valor del estado profileform.lastname
                    onChange={handleProfileChange} //cuando cambia el input, invoca handleprofilechange para actualizar el estado
                    placeholder="Ingrese su apellido"
                    className="form-control"
                    disabled={!isEditingProfile} //si no estamos editando el perfil, el campo esta deshabilitado
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email </label>
                  <input
                    name="email"
                    type="email"
                    value={profileForm.email}
                    className="form-control"
                    disabled //el email no se puede modificar
                  />

                  <small className="text-muted">
                    El email no se puede modificar
                  </small>
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
                  <small className="text-muted">
                    Solo números. Mínimo 8 dígitos. Opcionalmente, comenzar con
                    +
                  </small>
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

        {/*CAMBIO/EDITAR  CONTRASENIA*/}
        {/* Seguridad Cajita con boton de -> Cambio de Contraseña */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Seguridad</h5>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() =>
                  isChangingPassword
                    ? cancelPasswordChange()
                    : setIsChangingPassword(true)
                }
              >
                {/*Se puede cancelar o aceptar el cambio de contraseña*/}
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
                    <label className="form-label">
                      Confirmar Nueva Contraseña
                    </label>
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
                    Para cambiar tu contraseña, haz clic en el botón "Cambiar
                    Contraseña".
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* VER LAS ORDENES */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Mis Órdenes Recientes</h5>
              <Link
                to="/user/orders"
                className="btn btn-outline-primary btn-sm"
              >
                Ver Todas
              </Link>
            </div>
            <div className="card-body">
              {loadingOrders ? (
                <div className="text-center py-3">
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="visually-hidden">Cargando órdenes...</span>
                  </div>
                  <p className="mt-2 mb-0 text-muted">Cargando órdenes...</p>
                </div>
              ) : userOrders.length === 0 ? (
                <div className="text-center py-3">
                  <i className="bi bi-inbox display-6 text-muted"></i>
                  <p className="mt-2 mb-0 text-muted">
                    No tienes órdenes realizadas
                  </p>
                  <Link to="/articles" className="btn btn-primary btn-sm mt-2">
                    Realizar mi primera compra
                  </Link>
                </div>
              ) : (
                <div>
                  {userOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="border-bottom pb-2 mb-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">Orden #{order.orderNumber}</h6>
                          <p className="mb-1 small text-muted">
                            {formatDate(order.orderDate)} •{' '}
                            {order.items?.length || 0} producto(s)
                          </p>
                          <p className="mb-1 fw-bold">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                        <div className="text-end">
                          <span
                            className={`badge ${getStatusClass(order.status)}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                          <br />
                          <Link
                            to={`/order-confirmation/${order.id}`}
                            className="btn btn-outline-primary btn-sm mt-1"
                          >
                            Ver
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}

                  {userOrders.length > 3 && (
                    <div className="text-center mt-3">
                      <Link
                        to="/user/orders"
                        className="btn btn-outline-secondary btn-sm"
                      >
                        Ver todas las órdenes ({userOrders.length})
                      </Link>
                    </div>
                  )}
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
