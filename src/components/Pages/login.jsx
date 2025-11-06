import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Completa email y contraseña');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.login(email, password);
      
      toast.success('Inicio de sesión exitoso');
      window.dispatchEvent(new Event('authChanged'));
      
      // Redirigir según el rol
      const user = response.user || response;
      if (user.role === 'admin') {
        setTimeout(() => navigate('/admin'), 400);
      } else {
        setTimeout(() => navigate('/'), 800);
      }
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
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