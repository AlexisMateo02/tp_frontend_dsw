/* Aca vamos a definir una componente llamada Footer que va a representar el pie de pagina 
de nuestra pagina web. */
import React from "react";

function Footer() {
  return (
    <>
      <div className="footer mt-5 py-5">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-8">
              <div className="row">
                <div className="col-md-4">
                  <h3 className="mb-3">Centros de distribucion</h3>
                  <p className="mb-0">Encontra uno cerca de tu ubicacion</p>
                  <p className="mb-4">
                    Vos. Mira <strong>nuestros centros</strong>
                  </p>
                  <p className="mb-0">
                    <strong>+54 9 341 6666992</strong>
                  </p>
                  <p>hello@domain.com</p>
                </div>
                <div className="col-md-4">
                  <h3 className="mb-3">Links Utiles</h3>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <a href="#" className="text-decoration-none">
                        - Nuevos Productos
                      </a>
                    </li>
                    <li className="mb-2">
                      <a href="#" className="text-decoration-none">
                        - Más Vendidos
                      </a>
                    </li>
                    <li className="mb-2">
                      <a href="#" className="text-decoration-none">
                        - Ofertas y Descuentos
                      </a>
                    </li>
                    <li className="mb-2">
                      <a href="#" className="text-decoration-none">
                        - Gift Cards Online
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-md-4">
                  <h3 className="mb-3">Informacion</h3>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <a href="#" className="text-decoration-none">
                        - Devoluciones
                      </a>
                    </li>
                    <li className="mb-2">
                      <a href="#" className="text-decoration-none">
                        - Contactanos
                      </a>
                    </li>
                    <li className="mb-2">
                      <a href="#" className="text-decoration-none">
                        - Envios
                      </a>
                    </li>
                    <li className="mb-2">
                      <a href="#" className="text-decoration-none">
                        - Terminos y Condiciones
                      </a>
                    </li>
                    <li className="mb-2">
                      <a href="#" className="text-decoration-none">
                        - Politicas de Privacidad
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <h3 className="mb-4">Enterate de Todo</h3>
              <p className="mb-5">
                Ingresa tu email para ser el primero en enterarte que arribaron
                los nuevos productos{" "}
              </p>
              <div className="subscribe-box d-flex">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Ingresa tu direccion email"
                />
                <button className="btn">Suscribite!</button>
              </div>
            </div>
          </div>
          <div className="footer-bottom mt-5">
            <div className="row align-items-start">
              <div className="col-lg-4">
                <div
                  className="footer-icon-text d-flex gap-3 justify-content-center
                    justify-content-lg-end"
                >
                  <p>KBR 2025| Powered by KBR</p>
                  <div className="footer-icons d-flex gap-2">
                    <i className="ri-instagram-line"></i>
                    <i className="ri-twitter-x-line"></i>
                    <i className="ri-facebook-circle-fill"></i>
                    <i className="ri-youtube-fill"></i>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="footer-logo text-center">
                  <a href="#" className="navbar-brand mx-auto order-0"></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
