import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:3000/api";

export default function CrearTiendas() {
  const [stores, setStores] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [localties, setLocalties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    hours: "",
    image: undefined,
    adressDescription: "",
    localtyId: "",
  });

  // Cargar datos iniciales
  useEffect(() => {
    fetchStores();
    fetchLocalties();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await fetch(`${API_BASE}/pickUpPoints`);
      if (response.ok) {
        const result = await response.json();
        setStores(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("Error al cargar las tiendas");
    }
  };

  const fetchLocalties = async () => {
    try {
      const response = await fetch(`${API_BASE}/localties`);
      if (response.ok) {
        const result = await response.json();
        console.log("✅ Localidades cargadas:", result.data);
        setLocalties(result.data || []);
      } else {
        console.error("❌ Error en respuesta de localidades:", response.status);
        toast.error("Error al cargar las localidades");
      }
    } catch (error) {
      console.error("❌ Error fetching localties:", error);
      toast.error("Error de conexión al cargar localidades");
    }
  };

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
            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL("image/jpeg", quality);
            resolve(dataUrl);
          } catch (err) {
            reject(err);
          } finally {
            URL.revokeObjectURL(url);
          }
        };
        img.onerror = (e) => {
          URL.revokeObjectURL(url);
          reject(e || new Error("Image load error"));
        };
        img.src = url;
      } catch (e) {
        reject(e);
      }
    });

  const startCreate = () => {
    setEditingId(null);
    setForm({
      name: "",
      address: "",
      phone: "",
      hours: "",
      image: undefined,
      adressDescription: "",
      localtyId: "",
    });
  };

  const startEdit = (store) => {
    setEditingId(store.id);
    setForm({
      name: store.storeName || "",
      address: store.address || "",
      phone: store.phoneNumber || "",
      hours: store.horary || "",
      image: store.image,
      adressDescription: store.adressDescription || "",
      localtyId: store.localty?.id || store.localtyId || "",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    console.log("📝 Form data completo:", form);
    console.log("📝 localtyId value:", form.localtyId);
    console.log("📝 localtyId type:", typeof form.localtyId);

    if (!form.name.trim() || !form.address.trim() || !form.localtyId) {
      toast.error("Nombre, dirección y localidad son obligatorios");
      return;
    }

    // Verificar explícitamente que localtyId tenga un valor
    if (
      form.localtyId === "" ||
      form.localtyId === undefined ||
      form.localtyId === null
    ) {
      toast.error("Debe seleccionar una localidad válida");
      return;
    }

    setLoading(true);
    try {
      // Asegurarnos de que localtyId sea un número
      const localtyId = parseInt(form.localtyId);
      if (isNaN(localtyId)) {
        toast.error("ID de localidad inválido");
        return;
      }

      const requestBody = {
        storeName: form.name.trim(),
        address: form.address.trim(),
        adressDescription: form.adressDescription.trim(),
        phoneNumber: form.phone.trim(),
        horary: form.hours.trim(),
        image: form.image, // incluir imagen (dataURL) para guardarla en la BDD
        localty: localtyId, // Usar el número convertido
      };

      console.log("🚀 Enviando datos al servidor:", requestBody);
      console.log("🚀 localty en requestBody:", requestBody.localty);

      let url, method;

      if (editingId) {
        url = `${API_BASE}/pickUpPoints/${editingId}`;
        method = "PUT";
      } else {
        url = `${API_BASE}/pickUpPoints`;
        method = "POST";
      }

      console.log(`📨 ${method} request to: ${url}`);

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📊 Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Success response:", result);
        toast.success(
          editingId ? "Tienda actualizada" : "Tienda creada exitosamente"
        );
        fetchStores();
        startCreate();
      } else {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);

        try {
          const errorJson = JSON.parse(errorText);
          toast.error(
            `Error ${response.status}: ${
              errorJson.message || "Error del servidor"
            }`
          );
        } catch {
          toast.error(`Error ${response.status}: ${errorText}`);
        }
      }
    } catch (error) {
      console.error("❌ Error saving store:", error);
      toast.error("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 1200, 0.8);
      setForm((s) => ({ ...s, image: dataUrl }));
    } catch (err) {
      console.error(err);
      toast.error("No se pudo procesar la imagen");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar tienda? Esta acción no se puede deshacer."))
      return;

    try {
      const response = await fetch(`${API_BASE}/pickUpPoints/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.info("Tienda eliminada");
        fetchStores();
      } else {
        const errorText = await response.text();
        toast.error(`Error al eliminar: ${errorText}`);
      }
    } catch (error) {
      console.error("Error deleting store:", error);
      toast.error("Error de conexión");
    }
  };

  return (
    <div className="card p-4 mt-4">
      <h5 className="mb-3">Gestión de Tiendas</h5>

      <form onSubmit={handleSave} className="mb-3">
        <div className="row g-2">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Nombre de la tienda *"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
              disabled={loading}
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Teléfono"
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phone: e.target.value }))
              }
              disabled={loading}
            />
          </div>

          <div className="col-12 mt-2">
            <input
              className="form-control"
              placeholder="Dirección *"
              value={form.address}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, address: e.target.value }))
              }
              required
              disabled={loading}
            />
          </div>

          <div className="col-12 mt-2">
            <textarea
              className="form-control"
              placeholder="Descripción de la dirección (piso, entre calles, referencia, etc.)"
              value={form.adressDescription}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  adressDescription: e.target.value,
                }))
              }
              rows="2"
              disabled={loading}
            />
          </div>

          <div className="col-12 mt-2">
            <input
              className="form-control"
              placeholder="Horarios (ej. Lun a Vie 9-18)"
              value={form.hours}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, hours: e.target.value }))
              }
              disabled={loading}
            />
          </div>

          {/* Selección de Localidad - CORREGIDO */}
          <div className="col-12 mt-2">
            <label className="form-label">Localidad *</label>
            <select
              className="form-select"
              value={form.localtyId}
              onChange={(e) => {
                const selectedValue = e.target.value;
                console.log(
                  "📍 Localidad seleccionada:",
                  selectedValue,
                  "Tipo:",
                  typeof selectedValue
                );
                setForm((prev) => ({ ...prev, localtyId: selectedValue }));
              }}
              required
              disabled={loading}
            >
              <option value="">Seleccionar localidad</option>
              {localties.map((localty) => (
                <option key={localty.id} value={localty.id}>
                  {localty.name}, {localty.province?.name} - CP:{" "}
                  {localty.zipcode}
                </option>
              ))}
            </select>
            <div className="form-text">
              {localties.length === 0
                ? "Cargando localidades..."
                : `${localties.length} localidades disponibles`}
            </div>
          </div>

          <div className="col-md-6 mt-2">
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
              disabled={loading}
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
                  style={{ maxWidth: 220, maxHeight: 140, objectFit: "cover" }}
                />
              </div>
            </div>
          )}

          <div className="col-12 mt-3">
            <button
              className="btn btn-primary me-2"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  {editingId ? "Guardando..." : "Creando..."}
                </>
              ) : editingId ? (
                "Guardar cambios"
              ) : (
                "Crear tienda"
              )}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={startCreate}
                disabled={loading}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>

      <div>
        <h6 className="mb-2">Tiendas existentes</h6>
        {stores.length === 0 ? (
          <p className="text-muted">No hay tiendas registradas.</p>
        ) : (
          <div className="list-group">
            {stores.map((store) => (
              <div
                key={store.id}
                className="list-group-item d-flex justify-content-between align-items-start"
              >
                <div className="d-flex align-items-center">
                  {store.image && (
                    <img
                      src={store.image}
                      alt={store.storeName}
                      style={{
                        width: 80,
                        height: 60,
                        objectFit: "cover",
                        marginRight: 12,
                      }}
                    />
                  )}
                  <div>
                    <strong>{store.storeName}</strong>
                    <div className="small text-muted">{store.address}</div>
                    <div className="small text-muted">
                      {store.phoneNumber}{" "}
                      {store.horary ? "• " + store.horary : ""}
                    </div>
                    {store.localty && (
                      <div className="small text-muted">
                        📍 {store.localty.name}, {store.localty.province?.name}{" "}
                        - CP: {store.localty.zipcode}
                      </div>
                    )}
                  </div>
                </div>
                <div className="btn-group">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => startEdit(store)}
                    disabled={loading}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => remove(store.id)}
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
