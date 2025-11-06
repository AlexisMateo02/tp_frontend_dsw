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
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import store1 from '../../assets/store-01.webp';
import store2 from '../../assets/store-02.webp';

function Stores() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('stores') || '[]');
      setStores(Array.isArray(s) ? s : []);
    } catch {
      setStores([]);
    }
  }, []);

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
                <div style={{ width: '100%', maxWidth: 520 }}>
                  <img
                    src={s.image || '/assets/placeholder.webp'}
                    alt={s.name}
                    className="img-fluid rounded"
                    style={{ width: '100%', height: 320, objectFit: 'cover' }}
                  />
                </div>
              </div>
              <div className="col-lg-7">
                <h2 className="mb-3">{s.name}</h2>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <h6 className="mb-1 fw-semibold">Dirección</h6>
                    <p className="text-muted mb-0">{s.address || '—'}</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <h6 className="mb-1 fw-semibold">Horario</h6>
                    <p className="text-muted mb-0">{s.hours || '—'}</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <h6 className="mb-1 fw-semibold">Teléfono</h6>
                    <p className="text-muted mb-0">{s.phone || '—'}</p>
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
          <>
            <div className="row align-items-center g-5 mb-4">
              <div className="col-lg-5 mb-3 mb-lg-0 d-flex justify-content-center">
                <div style={{ width: '100%', maxWidth: 520 }}>
                  <img
                    src={store1}
                    alt="Store"
                    className="img-fluid rounded"
                    style={{ width: '100%', height: 320, objectFit: 'cover' }}
                  />
                </div>
              </div>
              <div className="col-lg-7">
                <h2 className="mb-3">Sucursal 1</h2>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <h6 className="mb-1 fw-semibold">Dirección</h6>
                    <p className="text-muted mb-0">Vera Mujica 1222</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <h6 className="mb-1 fw-semibold">Horario</h6>
                    <p className="text-muted mb-0">
                      Lunes a Viernes: 9:00 - 18:00
                    </p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <h6 className="mb-1 fw-semibold">Teléfono</h6>
                    <p className="text-muted mb-0">232124343</p>
                  </div>
                </div>
                <div className="mt-3">
                  <a
                    href="https://maps.app.goo.gl/YSeq39955dMcH67w7"
                    className="text-decoration-none"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cómo llegar
                  </a>
                </div>
              </div>
            </div>

            <div className="row align-items-center g-5 mt-5 mb-4">
              <div className="col-lg-5 mb-3 mb-lg-0 d-flex justify-content-center">
                <div style={{ width: '100%', maxWidth: 520 }}>
                  <img
                    src={store2}
                    alt="Store"
                    className="img-fluid rounded"
                    style={{ width: '100%', height: 320, objectFit: 'cover' }}
                  />
                </div>
              </div>
              <div className="col-lg-7">
                <h2 className="mb-3">Sucursal 2</h2>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <h6 className="mb-1 fw-semibold">Dirección</h6>
                    <p className="text-muted mb-0">
                      2000, Zeballos 1341, S2000 Rosario, Santa Fe
                    </p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <h6 className="mb-1 fw-semibold">Horario</h6>
                    <p className="text-muted mb-0">
                      Lunes a Viernes: 9:00 - 18:00
                    </p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <h6 className="mb-1 fw-semibold">Teléfono</h6>
                    <p className="text-muted mb-0">231219974</p>
                  </div>
                </div>
                <div className="mt-3">
                  <a
                    href="https://maps.app.goo.gl/eZ4d3PLBQXq5dZFe9"
                    className="text-decoration-none"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cómo llegar
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Stores;
