import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      toast.error('Completa los campos requeridos');
      return;
    }
    if (!validateEmail(email)) {
      toast.error('Email inválido');
      return;
    }
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirm) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    // Simular guardado: usuarios guardados en localStorage bajo 'users'
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      if (users.some((u) => u.email === email)) {
        toast.error('Ya existe una cuenta con ese email');
        setLoading(false);
        return;
      }
      // Codificar la contraseña en base64 para no guardarla en texto claro (solo para demo)
      const encodedPassword = btoa(password);
      const newUser = {
        id: Date.now(),
        firstName,
        lastName,
        email,
        phone,
        password: encodedPassword,
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      toast.success('Registro exitoso. Redirigiendo a login...');
      setLoading(false);
      setTimeout(() => navigate('/login'), 1200);
    }, 800);
  };

  return (
    <div className="container my-5" style={{ maxWidth: 680 }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="mb-4">Crear cuenta</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="mb-3 col-md-6">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 col-md-6">
            <label className="form-label">Apellido</label>
            <input
              type="text"
              className="form-control"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>
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
          <label className="form-label">Teléfono (opcional)</label>
          <input
            type="text"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
        <div className="mb-3">
          <label className="form-label">Confirmar contraseña</label>
          <input
            type="password"
            className="form-control"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        <button
          className="btn btn-primary w-100"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="mt-3 text-center ">
        <div className="mb-3"></div>
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}

export default Register;
