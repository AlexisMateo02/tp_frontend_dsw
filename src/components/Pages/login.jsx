import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Completa email y contraseña');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Support a single hard-coded admin account
      if (email === 'admin@gmail.com' && password === '123456') {
        const adminUser = {
          id: 'admin',
          email: 'admin@gmail.com',
          name: 'Administrador',
          role: 'admin',
        };
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        window.dispatchEvent(new Event('authChanged'));
        toast.success('Ingreso como administrador');
        setLoading(false);
        setTimeout(() => navigate('/admin'), 400);
        return;
      }

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find((u) => u.email === email);
      if (!user) {
        toast.error('Usuario no encontrado');
        setLoading(false);
        return;
      }
      // Verificar contraseña codificada (base64) almacenada en el registro
      const encoded = user.password || '';
      if (encoded !== btoa(password)) {
        toast.error('Contraseña incorrecta');
        setLoading(false);
        return;
      }
      // Autenticación exitosa
      localStorage.setItem('currentUser', JSON.stringify(user));
      // notify other components (Nav) that auth state changed
      window.dispatchEvent(new Event('authChanged'));
      toast.success('Inicio de sesión exitoso');
      setLoading(false);
      // al iniciar sesión, llevar al usuario a la página principal
      setTimeout(() => navigate('/'), 800);
    }, 700);
  };

  return (
    <div className="container my-5" style={{ maxWidth: 520 }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="mb-4">Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          className="btn w-100"
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
          }}
        >
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="mt-3 text-center">
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </div>
  );
}

export default Login;
