import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function CrearTiendas() {
  const [stores, setStores] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    hours: '',
    image: undefined,
  });

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('stores') || '[]');
    setStores(s);
  }, []);

  // compress image to dataURL (max width 1200, quality 0.8)
  const compressImageFile = (file, maxWidth = 1200, quality = 0.8) =>
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
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
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

  const saveStores = (next) => {
    localStorage.setItem('stores', JSON.stringify(next));
    setStores(next);
    window.dispatchEvent(new Event('storesUpdated'));
  };

  const startCreate = () => {
    setEditingId(null);
    setForm({ name: '', address: '', phone: '', hours: '', image: undefined });
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setForm({
      name: s.name || '',
      address: s.address || '',
      phone: s.phone || '',
      hours: s.hours || '',
      image: s.image,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim()) {
      toast.error('Nombre y dirección son obligatorios');
      return;
    }

    if (editingId) {
      const next = stores.map((st) =>
        st.id === editingId
          ? { ...st, ...form, updatedAt: new Date().toISOString() }
          : st
      );
      saveStores(next);
      toast.success('Tienda actualizada');
    } else {
      const id = Date.now();
      const next = [
        { id, ...form, createdAt: new Date().toISOString() },
        ...stores,
      ];
      saveStores(next);
      toast.success('Tienda creada');
    }
    startCreate();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 1200, 0.8);
      setForm((s) => ({ ...s, image: dataUrl }));
    } catch (err) {
      console.error(err);
      toast.error('No se pudo procesar la imagen');
    }
  };

  const remove = (id) => {
    if (!window.confirm('¿Eliminar tienda? Esta acción no se puede deshacer.'))
      return;
    const next = stores.filter((s) => s.id !== id);
    saveStores(next);
    toast.info('Tienda eliminada');
  };

  return (
    <div className="card p-4 mt-4">
      <h5 className="mb-3">Gestión de Tiendas</h5>

      <form onSubmit={handleSave} className="mb-3">
        <div className="row g-2">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Nombre de la tienda"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            />
          </div>
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Teléfono"
              value={form.phone}
              onChange={(e) =>
                setForm((s) => ({ ...s, phone: e.target.value }))
              }
            />
          </div>
          <div className="col-12 mt-2">
            <input
              className="form-control"
              placeholder="Dirección"
              value={form.address}
              onChange={(e) =>
                setForm((s) => ({ ...s, address: e.target.value }))
              }
            />
          </div>
          <div className="col-12 mt-2">
            <input
              className="form-control"
              placeholder="Horarios (ej. Lun a Vie 9-18)"
              value={form.hours}
              onChange={(e) =>
                setForm((s) => ({ ...s, hours: e.target.value }))
              }
            />
          </div>
          <div className="col-md-6 mt-2">
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
            />
            <small className="text-muted">
              Sube una foto para la tienda (opcional)
            </small>
          </div>

          {form.image && (
            <div className="col-md-6 mt-2 d-flex align-items-center">
              <div>
                <div className="mb-1">Vista previa:</div>
                <img
                  src={form.image}
                  alt="preview"
                  style={{ maxWidth: 220, maxHeight: 140, objectFit: 'cover' }}
                />
              </div>
            </div>
          )}

          <div className="col-12 mt-3">
            <button className="btn btn-primary me-2" type="submit">
              {editingId ? 'Guardar cambios' : 'Crear tienda'}
            </button>
          </div>
        </div>
      </form>

      <div>
        <h6 className="mb-2">Tiendas existentes</h6>
        {stores.length === 0 ? (
          <p className="text-muted">No hay tiendas registradas.</p>
        ) : (
          <div className="list-group">
            {stores.map((s) => (
              <div
                key={s.id}
                className="list-group-item d-flex justify-content-between align-items-start"
              >
                <div className="d-flex align-items-center">
                  <img
                    src={s.image || '/assets/placeholder.webp'}
                    alt={s.name}
                    style={{
                      width: 80,
                      height: 60,
                      objectFit: 'cover',
                      marginRight: 12,
                    }}
                  />
                  <div>
                    <strong>{s.name}</strong>
                    <div className="small text-muted">{s.address}</div>
                    <div className="small text-muted">
                      {s.phone} {s.hours ? '• ' + s.hours : ''}
                    </div>
                  </div>
                </div>
                <div className="btn-group">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => startEdit(s)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => remove(s.id)}
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
/*Panel que solo ve el administrador donde puede editar y dar de alta nuevas tiendas
tiene Nombre, Direccion, Telefono y horarios*/
