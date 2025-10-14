/* en esta página, los usuarios pueden encontrar información para comunicarse con los responsables 
del sitio, como formularios de contacto, direcciones de correo electrónico, teléfonos o 
enlaces a redes sociales.
*/
import React, { useState } from 'react';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Número destinatario en formato internacional sin signos: 5493416475580
    const phone = '5493416475580';
    const text = `Nombre: ${name}%0AEmail: ${email}%0AMensaje: ${encodeURIComponent(
      message
    )}`;
    // Abrir WhatsApp Web / App
    const url = `https://wa.me/${phone}?text=${text}`;
    window.open(url, '_blank');
    // Limpiar formulario
    setName('');
    setEmail('');
    setMessage('');
  };

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

      <div className="contact-page">
        {/*Map Section*/}
        <section className="map-section container">
          <iframe
            title="Nuestra Ubicacion"
            className="map rounded"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d214269.0913165688!2d-60.696639499999996!3d-32.9522093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b6539335d7d75b%3A0xec4086e90258a557!2sRosario%2C%20Santa%20Fe!5e0!3m2!1ses-419!2sar!4v1759095119655!5m2!1ses-419!2sar"
            allowfullscreen=""
          ></iframe>
        </section>
        {/*Contact Form Section */}
        <section className="message-section">
          <h2 className="form-title">Enviar mensaje </h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="row">
              <input
                type="text"
                placeholder="Name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="row">
              <textarea
                placeholder="Mensaje"
                className="textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn px-5">
              Enviar por WhatsApp
            </button>
          </form>
        </section>
      </div>
    </>
  );
}

export default Contact;
