// Componente para crear y gestionar provincias desde el panel de administrador
// funcionalidad similar a crearLocalidades.jsx pero para provincias

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

const API_BASE = 'http://localhost:3000/api';

function CrearProvincias() {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    country: 'Argentina',
  });

  // Cargar provincias
  const fetchProvinces = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/provinces`);
      if (response.ok) {
        const result = await response.json();
        setProvinces(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching provinces', error);
      toast.error('Error al cargar provincias');
    }
  }, []);

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  const resetForm = () => {
    setForm({
      name: '',
      country: 'Argentina',
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.name || !form.country) {
      toast.error('El nombre y el país de la provincia son requeridos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/provinces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          country: form.country,
        }),
      });

      if (response.ok) {
        toast.success('Provincia creada exitosamente');
        resetForm();
        fetchProvinces();
      } else {
        const errorText = await response.text();
        toast.error(`Error al crear: ${errorText}`);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      toast.error('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const removeProvince = async (id) => {
    if (
      !window.confirm('¿Estás seguro de que quieres eliminar esta provincia?')
    ) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/provinces/${id}`, {
        method: 'DELETE',
      });

      if (response.ok || response.status === 204) {
        toast.success('Provincia eliminada correctamente');
        fetchProvinces();
      } else {
        const errorText = await response.text();
        toast.error(`Error al eliminar: ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting province:', error);
      toast.error('Error de conexión');
    }
  };

  // Vista del componente
  return (
    <div>
      <h5 className="mb-3">Gestión de Provincias</h5>

      {/* Formulario de creación */}
      <div className="card p-4 mb-4">
        <h6 className="mb-3">Crear Nueva Provincia</h6>
        <form onSubmit={handleCreate}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Nombre de la Provincia *</label>
              <input
                className="form-control"
                placeholder="Nombre de la provincia"
                value={form.name}
                onChange={(e) =>
                  setForm((s) => ({ ...s, name: e.target.value }))
                }
                required
                disabled={loading}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">País *</label>
              <select
                className="form-select"
                value={form.country}
                onChange={(e) =>
                  setForm((s) => ({ ...s, country: e.target.value }))
                }
                required
                disabled={loading}
              >
                <option value="Argentina">Argentina</option>
                <option value="Uruguay">Uruguay</option>
                <option value="Chile">Chile</option>
                <option value="Brasil">Brasil</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Bolivia">Bolivia</option>
              </select>
            </div>

            <div className="col-12 mt-3">
              <button className="btn btn-primary" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Provincia'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary ms-2"
                onClick={resetForm}
                disabled={loading}
              >
                Limpiar
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Lista de provincias existentes */}
      <div className="card p-4">
        <h6 className="mb-3">Provincias Existentes</h6>
        {provinces.length === 0 ? (
          <p className="text-muted">No hay provincias creadas.</p>
        ) : (
          <div className="list-group">
            {provinces.map((province) => (
              <div
                key={province.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{province.name}</strong>
                  <div className="text-muted small">
                    País: {province.country}
                  </div>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeProvince(province.id)}
                    disabled={loading}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CrearProvincias;
