/* Aca vamos a definir una componente llamada Footer que va a representar el pie de pagina 
de nuestra pagina web. */
import React from 'react';
import { Link } from 'react-router-dom';

/*Aca estaba lo de las tarjetas y lo tuve sacar*/

function Footer() {
  return (
    <>
      <div className="footer mt-5 py-5">
        <div className="container ">
          <div className="row gy-4">
            <div className="col-lg-8">
              <div className="row">
                <div className="col-md-4 text-center">
                  <h3 className="mb-3">Centros de distribucion</h3>
                  <p className="mb-0">Encontra uno cerca de tu ubicacion</p>
                  <p className="mb-4">
                    Vos. Mira{' '}
                    <strong>
                      <Link
                        to="/stores"
                        className="text-dark text-decoration-none"
                      >
                        nuestros centros
                      </Link>
                    </strong>
                  </p>
                  <p className="mb-0">
                    <strong>+54 9 341 6666992</strong>
                  </p>
                  <p>hello@domain.com</p>
                </div>
                <div className="col-md-4 text-center">
                  <h3 className="mb-3">Links Utiles</h3>
                  <ul className="list-unstyled d-inline-block text-start">
                    <li className="mb-2">
                      <a
                        href="https://www.instagram.com/kayakbrokers?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                        className="text-decoration-none"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        - Instagram
                      </a>
                    </li>
                    <li className="mb-2">
                      <a
                        href="https://www.facebook.com/rosario.kayaks.2025"
                        className="text-decoration-none"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        - Facebook
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="col-md-4 text-center">
                  <h3 className="mb-3">Politica de Privacidad</h3>
                  <ul className="list-unstyled d-inline-block text-start">
                    <li className="mb-2">
                      <a href="/terms" className="text-decoration-none">
                        - Terminos y Condiciones
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-center">
              <h3 className="mb-4">Enterate de Todo</h3>
              <p className="mb-5">
                Ingresa tu email para ser el primero en enterarte que arribaron
                los nuevos productos{' '}
              </p>
              <div className="subscribe-box d-flex justify-content-center">
                <input
                  type="email"
                  className="form-control me-2"
                  placeholder="Ingresa tu direccion email"
                  style={{ maxWidth: '280px' }}
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
                    <a
                      href="https://www.instagram.com/kayakbrokers?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-reset"
                    >
                      <i className="ri-instagram-line"></i>
                    </a>
                    <i className="ri-twitter-x-line"></i>
                    <i className="ri-facebook-circle-fill"></i>
                    <i className="ri-youtube-fill"></i>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="footer-logo text-center">
                  <a href="#" className="navbar-brand mx-auto order-0">
                    <h3
                      className="m-0 fw-bold"
                      style={{ letterSpacing: '2px' }}
                    >
                      KBR
                    </h3>
                  </a>
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
