//Componente en donde se pueden crear y gestionar localidades, desde obvio el panel de administrador
//esta componente se va a invocar en Admin.jsx ya que son solo ellos los que lo pueden hacer
//Importaciones
import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';

const API_BASE = 'http://localhost:3000/api';

//Definimos el componente CrearLocalidades
function CrearLocalidades() {
  const [localties, setLocalties] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    zipcode: '',
    provinceId: '',
  });

  // Llama al backend para obtener las localidades y guarda el resultado en el estado
  const fetchLocalties = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/localties`);
      if (response.ok) {
        const result = await response.json();
        setLocalties(result.data || []); //aca es donde guardamos en localities el resultado que nos da el backend por cuando definimos const [localties, setLocalties] = useState([]); ya que localties es el estado que contiene las localidades y setLocalties es la funcion que actualiza ese estado
      }
    } catch (error) {
      console.error('Error fetching localties:', error);
      toast.error('Error al cargar las localidades');
    }
  }, []);

  // Llama al backend para obtener las provincias y guarda el resultado en el estado
  const fetchProvinces = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/provinces`);
      if (response.ok) {
        const result = await response.json();
        setProvinces(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
      toast.error('Error al cargar las provincias');
    }
  }, []);

  useEffect(() => {
    fetchLocalties();
    fetchProvinces();
  }, [fetchLocalties, fetchProvinces]);

  const resetForm = () => {
    setForm({
      name: '',
      zipcode: '',
      provinceId: '',
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    //Validaciones basicas al crear localidad
    if (!form.name || !form.zipcode || !form.provinceId) {
      toast.error('Nombre, código postal y provincia son obligatorios');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/localties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          zipcode: form.zipcode,
          province: form.provinceId,
        }),
      });

      if (response.ok) {
        toast.success('Localidad creada exitosamente');
        resetForm();
        fetchLocalties();
      } else {
        const errorText = await response.text();
        toast.error(`Error al crear: ${errorText}`);
      }
    } catch (error) {
      console.error('Error creating localty:', error);
      toast.error('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  //Podemos eliminar una localidad
  const removeLocalty = async (id) => {
    if (
      !window.confirm('¿Estás seguro de que quieres eliminar esta localidad?')
    ) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/localties/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Localidad eliminada');
        fetchLocalties();
      } else {
        const errorText = await response.text();
        toast.error(`Error al eliminar: ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting localty:', error);
      toast.error('Error de conexión');
    }
  };

  //Diseñamos la vista del componente de la parte del panle que crea localidades
  return (
    <div>
      <h5 className="mb-3">Gestión de Localidades</h5>

      {/* Formulario de creación */}
      <div className="card p-4 mb-4">
        <h6 className="mb-3">Crear Nueva Localidad</h6>
        <form onSubmit={handleCreate}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Nombre de la Localidad *</label>
              <input
                className="form-control"
                placeholder="Nombre de la localidad"
                value={form.name}
                onChange={(e) =>
                  setForm((s) => ({ ...s, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Código Postal *</label>
              <input
                className="form-control"
                placeholder="Código postal"
                value={form.zipcode}
                onChange={(e) =>
                  setForm((s) => ({ ...s, zipcode: e.target.value }))
                }
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Provincia *</label>
              <select
                className="form-select"
                value={form.provinceId}
                onChange={(e) =>
                  setForm((s) => ({ ...s, provinceId: e.target.value }))
                }
                required
              >
                <option value="">Seleccionar provincia</option>
                {provinces.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 mt-3">
              <button className="btn btn-primary" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Localidad'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary ms-2"
                onClick={resetForm}
              >
                Limpiar
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Lista/Muestra de localidades existentes, localites (estado) contiene las localidades
      que fuimos cargando en el backend */}
      <div className="card p-4">
        <h6 className="mb-3">Localidades Existentes</h6>
        {localties.length === 0 ? (
          <p className="text-muted">No hay localidades creadas.</p>
        ) : (
          <div className="list-group">
            {localties.map((localty) => (
              <div
                key={localty.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{localty.name}</strong>
                  <div className="text-muted small">
                    Código Postal: {localty.zipcode} | Provincia:{' '}
                    {localty.province?.name}
                  </div>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeLocalty(localty.id)}
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

export default CrearLocalidades;
