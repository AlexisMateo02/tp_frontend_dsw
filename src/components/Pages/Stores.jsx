/* Se utiliza para mostrar información sobre las diferentes sucursales, tiendas físicas 
o puntos de venta relacionados con la aplicación o empresa. 
En esta página, los usuarios pueden encontrar direcciones, mapas, horarios de atención y 
datos de contacto de cada tienda.*/
import React from 'react';
import store1 from '../../assets/store-01.webp';
import store2 from '../../assets/store-02.webp';
import { Link } from 'react-router-dom';
function Stores() {
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
      {/*Store*/}
      <div className="container store-wrap my-5 py-5">
        <div className="row">
          <div className="section-title mb-5 stores-title text-center">
            <h2 className="fw-semibold fs-1">Nuestras Tiendas</h2>
            <p>Descubre nuestras tiendas físicas y encuentra la más cercana </p>
          </div>
        </div>
        <div className="row align-items-center g-5">
          <div className="col-lg-6 mb-4 mb-lg-0 d-flex justify-content-center">
            <img src={store1} alt="Store" className="img-fluid" />
          </div>
          <div className="col-lg-6">
            <h2 className="mb-4">Sucursal 1</h2>
            <div className="row">
              <div className="col-md-6 mb-4">
                <h5 className="subtitle fw-semibold mb-4">Dirección</h5>
                <p className="text-muted mb-0">Vera Mujica 1222</p>
                <p className="text-muted">Tel : 232124343</p>
                <a href="#" className="underline-link text-black">
                  Como llegar
                </a>
              </div>
              <div className="col-md-6 mb-4">
                <h5 className="subtitle fw-semibold mb-4">Horario</h5>
                <div className="d-flex gap-5 text-muted flex-column flex-sm-row">
                  <span>Lunes a Viernes: 9:00 - 18:00 </span>
                  <span>Sábado: 10:00 - 13:00 </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-4">
                <h5 className="subtitle fw-semibold mb-4">Contacto</h5>
                <p className="text-muted mb-0">
                  Celular: <strong className="text-dark">0800 1234 5678</strong>
                </p>
                <p className="text-muted">
                  Email:
                  <strong className="text-dark">KBR@sucursal1.com</strong>
                </p>
              </div>
              <div className="col-md-6 mb-4">
                <h5 className="fw-semibold">Redes sociales</h5>
                <div className="store-social-icons d-flex gap-3 mt-4">
                  <i className="bi bi-instagram"></i>
                  <i className="bi bi-twitter-x"></i>
                  <i className="bi bi-facebook"></i>
                  <i className="bi bi-youtube"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/** Sucursal 2 **/}
      <div className="container store-wrap my-5 py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 mb-4 mb-lg-0 d-flex justify-content-center">
            <img src={store2} alt="Store" className="img-fluid" />
          </div>
          <div className="col-lg-6">
            <h2 className="mb-4">Sucursal 2</h2>
            <div className="row">
              <div className="col-md-6 mb-4">
                <h5 className="subtitle fw-semibold mb-4">Dirección</h5>
                <p className="text-muted mb-0">
                  Av. Génova 640 698, S2000 Rosario, Santa Fe
                </p>
                <p className="text-muted">Tel : 231219974</p>
                <a href="#" className="underline-link text-black">
                  Como llegar
                </a>
              </div>
              <div className="col-md-6 mb-4">
                <h5 className="subtitle fw-semibold mb-4">Horario</h5>
                <div className="d-flex gap-5 text-muted flex-column flex-sm-row">
                  <span>Lunes a Viernes: 9:00 - 18:00 </span>
                  <span>Sábado: 10:00 - 13:00 </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-4">
                <h5 className="subtitle fw-semibold mb-4">Contacto</h5>
                <p className="text-muted mb-0">
                  Celular: <strong className="text-dark">0800 8765 4321</strong>
                </p>
                <p className="text-muted">
                  Email:
                  <strong className="text-dark">KBR@sucursal2.com</strong>
                </p>
              </div>
              <div className="col-md-6 mb-4">
                <h5 className="fw-semibold">Redes sociales</h5>
                <div className="store-social-icons d-flex gap-3 mt-4">
                  <i className="bi bi-instagram"></i>
                  <i className="bi bi-twitter-x"></i>
                  <i className="bi bi-facebook"></i>
                  <i className="bi bi-youtube"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Stores;
