/* Se utiliza para mostrar información sobre las diferentes sucursales, tiendas físicas 
o puntos de venta relacionados con la aplicación o empresa. 
En esta página, los usuarios pueden encontrar direcciones, mapas, horarios de atención y 
datos de contacto de cada tienda.*/
/*Antes esto tenia mas sentido porque las tiendas eran fijas, cambiamos a que
ahora s epueda crear y modifcar, es decir las tiendas se dan de alta, dejamos igual
no borramos lo anterior por las dudas, quedaba lindo :)*/

/*La tiendas las dos sucursales fijas que estan aca acragadas aparecen cuando no hya nignuna tienda
cargada en el alta tienda*/

/*Pero ahora aca lo usamos para alojar las tiendas dadas de alta*/
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import normalizeImagePath from "../../lib/utils/normalizeImagePath";

function Stores() {
  const [stores, setStores] = useState([]);

  // Cargar las tiendas desde localStorage al montar el componente, deberia ser del backend
  useEffect(() => {
    const loadStores = async () => {
      // Solo usar la API (BDD). Si no hay respuesta o está vacía, mostrar "Próximamente".
      try {
        if (!api.hasApi()) {
          console.warn(
            'API no configurada (VITE_API_URL). Mostrando sección "Próximamente".'
          );
          setStores([]);
          return;
        }

        const result = await api.getPickUpPoints();
        // `api.request` devuelve data || data.data; asegurarse que sea array
        const list = Array.isArray(result)
          ? result
          : result && Array.isArray(result.data)
          ? result.data
          : [];
        console.log("🛰️ Stores API result:", list);
        setStores(list);
      } catch (err) {
        console.error("Error cargando tiendas desde la BDD:", err);
        setStores([]);
      }
    };

    loadStores();
  }, []);

  //Diseño del componente Stores
  return (
    <>
      <ol className="section-banner py-3 position-relative">
        <li className="position-relative">
          <Link to="/">Inicio</Link>
        </li>
        <li className="position-relative active">
          <span className="ps-5">Stores</span>
        </li>
      </ol>

      <div className="container store-wrap my-5 py-5">
        <div className="row">
          <div className="section-title mb-5 stores-title text-center">
            <h2 className="fw-semibold fs-1">Nuestras Tiendas</h2>
            <p>Descubre nuestras tiendas físicas y encuentra la más cercana </p>
          </div>
        </div>

        {stores.length > 0 ? (
          stores.map((s) => (
            <div
              key={s.id || s.name}
              className="row align-items-center g-5 mb-4"
            >
              <div className="col-lg-5 mb-3 mb-lg-0 d-flex justify-content-center">
                <div style={{ width: "100%", maxWidth: 520 }}>
                  <img
                    src={
                      normalizeImagePath(s.image || "", "forum") ||
                      "/assets/placeholder.webp"
                    }
                    alt={s.storeName || s.name}
                    className="img-fluid rounded"
                    style={{ width: "100%", height: 320, objectFit: "cover" }}
                  />
                </div>
              </div>
              <div className="col-lg-7">
                <h2 className="mb-3">{s.storeName || s.name}</h2>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <h6 className="mb-1 fw-semibold">Dirección</h6>
                    <p className="text-muted mb-0">{s.address || "—"}</p>
                    {s.adressDescription && (
                      <small className="text-muted d-block">
                        {s.adressDescription}
                      </small>
                    )}
                  </div>
                  <div className="col-md-4 mb-3">
                    <h6 className="mb-1 fw-semibold">Horario</h6>
                    <p className="text-muted mb-0">
                      {s.horary || s.hours || "—"}
                    </p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <h6 className="mb-1 fw-semibold">Teléfono</h6>
                    <p className="text-muted mb-0">
                      {s.phoneNumber || s.phone || "—"}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      s.address || s.name
                    )}`}
                    className="text-decoration-none"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cómo llegar
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <h1>proximamente</h1>
          </div>
        )}
      </div>
    </>
  );
}

export default Stores;
