/* en esta página, los usuarios pueden encontrar información para comunicarse con los responsables 
del sitio, como formularios de contacto, direcciones de correo electrónico, teléfonos o 
enlaces a redes sociales.
*/
import React, { useState } from 'react';

function Contact() {
  // Estados para los campos del formulario, los actualizo vacios ingresar o recargar la pagina
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  //Definimos handle para enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const phone = '5493416475580'; // Numero destinatario
    const text = `Nombre: ${name}%0AEmail: ${email}%0AMensaje: ${encodeURIComponent(
      message //texto del mensaje codificado para URL
    )}`;
    // Abrir WhatsApp Web / App
    const url = `https://wa.me/${phone}?text=${text}`;
    window.open(url, '_blank');
    // Limpiar formulario cuando se envia
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
                  Cómo llegar
                </a>
              </div>
            </div>
            {/*como contactarnos*/}
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
            {/*Horarios*/}
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
        {/*Ver la ubicacion en el mapa*/}
        <section className="map-section container">
          <iframe
            title="Nuestra Ubicacion"
            className="map rounded"
            src="https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d942.9713838910083!2d-60.64404054782861!3d-32.9545006518788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e6!4m3!3m2!1d-32.954482899999995!2d-60.643856199999995!4m5!1s0x95b7ab11d0eb49c3%3A0x11f1d3d54f950dd0!2s2000%2C%20Zeballos%201341%2C%20S2000%20Rosario%2C%20Santa%20Fe!3m2!1d-32.9545032!2d-60.643819!5e0!3m2!1sen!2sar!4v1760470609915!5m2!1sen!2sar"
          ></iframe>
        </section>
        {/*Seccion del formulario para enviar mensajes, ingresamos nombre, correo y mensaje*/}
        <section className="message-section">
          <h2 className="form-title">Enviar mensaje </h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="row">
              <input
                type="text"
                placeholder="Nombre"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Correo electrónico"
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
