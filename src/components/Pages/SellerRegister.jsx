import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SellerRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    businessName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    logo: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm(f => ({ ...f, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.businessName.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error('Completa todos los campos obligatorios');
      return;
    }

    if (!validateEmail(form.email)) {
      toast.error('Email inválido');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const sellers = JSON.parse(localStorage.getItem('sellers')) || [];
      
      // Verificar si ya existe un vendedor con ese email
      if (sellers.some(s => s.email === form.email)) {
        toast.error('Ya existe un vendedor con ese email');
        setLoading(false);
        return;
      }

      const newSeller = {
        id: Date.now(),
        businessName: form.businessName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        description: form.description.trim() || 'Vendedor de productos náuticos',
        logo: form.logo || '/assets/placeholder-seller.png',
        rating: 5.0,
        totalReviews: 0,
        verified: false,
        joinedDate: new Date().toISOString()
      };

      sellers.push(newSeller);
      localStorage.setItem('sellers', JSON.stringify(sellers));
      localStorage.setItem('currentSeller', JSON.stringify(newSeller));

      toast.success('¡Registro exitoso! Redirigiendo a tu panel...');
      setLoading(false);
      
      setTimeout(() => {
        navigate('/seller-dashboard');
      }, 1500);
    }, 800);
  };

  return (
    <div className="container py-5" style={{ maxWidth: 680, marginTop: '100px' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="text-center mb-4">
        <h1 className="mb-2">Vende en Kayaks Brokers</h1>
        <p className="text-muted">Únete a nuestro marketplace y comienza a vender tus productos</p>
      </div>

      <div className="card shadow">
        <div className="card-body p-4">
          <h2 className="h4 mb-4">Registro de Vendedor</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre del Negocio *</label>
              <input
                type="text"
                name="businessName"
                className="form-control"
                value={form.businessName}
                onChange={handleChange}
                placeholder="Ej: Náutica del Sur"
                required
              />
              <small className="text-muted">Este será el nombre público de tu tienda</small>
            </div>

            <div className="mb-3">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Teléfono *</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={form.phone}
                onChange={handleChange}
                placeholder="+54 9 341 1234567"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Dirección del Negocio *</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={form.address}
                onChange={handleChange}
                placeholder="Calle 123, Rosario, Santa Fe"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Descripción del Negocio</label>
              <textarea
                name="description"
                className="form-control"
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Cuéntanos sobre tu negocio, qué productos vendes, tu experiencia en el rubro..."
              />
              <small className="text-muted">Esta descripción aparecerá en tu perfil público</small>
            </div>

            <div className="mb-4">
              <label className="form-label">Logo del Negocio (opcional)</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleLogoUpload}
              />
              {form.logo && (
                <div className="mt-2">
                  <img 
                    src={form.logo} 
                    alt="Logo preview"
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '50%' }}
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="terms"
                  required
                />
                <label className="form-check-label" htmlFor="terms">
                  Acepto los <Link to="/terms" target="_blank">términos y condiciones</Link> y la política de vendedores
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse como Vendedor'}
            </button>
          </form>

          <div className="text-center mt-3">
            <p className="mb-0">
              ¿Ya tienes una cuenta de vendedor? 
              <Link to="/seller-login" className="ms-1">Iniciar sesión</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Beneficios de ser vendedor */}
      <div className="row mt-5">
        <div className="col-md-4 text-center mb-3">
          <div className="display-4 text-primary mb-2">🛍️</div>
          <h5>Llega a más clientes</h5>
          <p className="text-muted">Accede a nuestra base de clientes interesados en productos náuticos</p>
        </div>
        <div className="col-md-4 text-center mb-3">
          <div className="display-4 text-success mb-2">💰</div>
          <h5>Comisiones competitivas</h5>
          <p className="text-muted">Paga solo por lo que vendes, sin costos mensuales</p>
        </div>
        <div className="col-md-4 text-center mb-3">
          <div className="display-4 text-info mb-2">📊</div>
          <h5>Panel de control</h5>
          <p className="text-muted">Gestiona tus productos y ventas desde un solo lugar</p>
        </div>
      </div>
    </div>
  );
}

export default SellerRegister;