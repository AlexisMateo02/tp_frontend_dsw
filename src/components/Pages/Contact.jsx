/* en esta página, los usuarios pueden encontrar información para comunicarse con los responsables 
del sitio, como formularios de contacto, direcciones de correo electrónico, teléfonos o 
enlaces a redes sociales.
*/
import React from "react";

function Contact() {
  return (
    <>
      <section className="contact-section mt-5">
        <div className="container">
          <h2 className="section-title">Contacta con nosotros</h2>
          <p className="section-subtitle">
            Se el primero en enterarte sobre todo lo nuevo en KBR
          </p>
          <div className="row contact-boxes">
            {/*Direccion*/}
            <div className="contact-col">
              <div className="contact-box bg-transparent border-0">
                <i className="ri-map-pin-line icon"></i>
                <h5>Direccion</h5>
                <p>Soluciones integrales KBR </p>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  Get Direction
                </a>
              </div>
            </div>
            {/*Contact*/}
            <div className="contact-col">
              <div className="contact-box bg-transparent border-0">
                <i className="ri-phone-line icon"></i>
                <h5>Contacto</h5>
                <p>
                  <strong>Celular:</strong> +341 69879850
                </p>
                <p>
                  <strong>E-mail:</strong> KBR@contact.com
                </p>
              </div>
            </div>
            {/*Hours*/}
            <div className="contact-col">
              <div className="contact-box bg-transparent border-0">
                <i className="ri-time-line icon"></i>
                <h5>Horarios</h5>
                <p>
                  <strong>Lun - Vie</strong> 10hs - 20hs
                </p>
                <p>
                  <strong>Sab</strong> 10hs- 13hs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
