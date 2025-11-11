/*representa el componente que muestra la informacion sobre la pagina web,
por ejemplo en nuestra pagina es el Quienes Somos?*/
import React, { useState } from 'react';
// Importamos imagenes utilizadas en la pagina que la vamos a invocar con el nombre dado
import head from '../../assets/about-head-shape.jpeg';
import about1 from '../../assets/banner-female-2.webp';
import about2 from '../../assets/discover-1.webp';
import client1 from '../../assets/brand-logo-1.png';
import client2 from '../../assets/brand-logo-2.png';
import client3 from '../../assets/brand-logo-3.png';
import client4 from '../../assets/brand-logo-4.png';
import client5 from '../../assets/brand-logo-5.png';
import client6 from '../../assets/brand-logo-6.png';
import santi from '../../assets/santi.webp';
import ale from '../../assets/ale.webp';
import rafa from '../../assets/rafa.webp';
import laza from '../../assets/laza.webp';

const About = () => {
  //estado para las citas de los clientes
  const [quote, setQuote] = useState(
    'La vida es mejor en el agua, y un kayak es la llave para desbloquear aventuras inolvidables.'
  ); // la cita inicial que se muestra es la que cuadno apenas entras a la pagina te la muestra por defecto, despues vos seleccionas el logo que quieras y te muestra la cita correspondiente

  return (
    <>
      {/*Encabezado*/}
      <section className="about-glowing-section d-flex align-items-center ">
        <div className="container ">
          <div className="row">
            <div className="col-md-6 text-md-start text-center">
              <p className="text-uppercase text-muted small ">Conocenos!</p>
              <h1 className="fw-bold display-5">
                Sobre Kayaks Brokers Rosario
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/*Parte principal (main) del componente About, donde aparece toda nuestra informacion*/}

      {/*Info con logo de la empresa*/}
      <section className="py-5">
        <div className="container mb-5">
          <div className="row align-items-center flex-md-row-reverse">
            <div className="col-md-6 mb-4 mb-md-0 about-img1">
              <img
                src={head}
                alt="Kayaks Brokers"
                className="img-fluid rounded"
              />
            </div>
            <div className="col-md-6 text-md-start text-center">
              <h2 className="fw-bold mb-3 text-center">KBR</h2>
              <h4 className="fw-bold mb-3">
                Somos una empresa dedicada a la venta de kayaks, lanchas,
                artículos marítimos y mucho más... en Rosario, Argentina.
              </h4>
              <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                Fundada en 2023, Kayaks Brokers Rosario se ha convertido en un
                referente para los entusiastas de los deportes acuáticos y la
                navegación en la región. Nuestro compromiso es ofrecer productos
                de alta calidad y un servicio excepcional a nuestros clientes.
              </p>
            </div>
          </div>
        </div>

        {/*Info con foto*/}
        <div className="container mb-5">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0 about-img1">
              <img src={about1} alt="Face" className="img-fluid rounded" />
            </div>
            <div className="col-md-6">
              <h4 className="fw-bold">
                Rema con calidad y disfruta de la naturaleza que te rodea!
              </h4>
              <p className="text-muted">
                En Kayaks Brokers Rosario, nos enorgullece ofrecer una amplia
                gama de kayaks y lanchas de las mejores marcas del mercado. Ya
                sea que seas un principiante buscando tu primer kayak o un
                navegante experimentado en busca de una lancha de alto
                rendimiento, tenemos el equipo perfecto para vos.
              </p>
            </div>
          </div>
        </div>
        {/*Mas info ahora de nuestra mision con foto*/}
        <div className="container">
          <div className="row align-items-center flex-md-row-reverse">
            <div className="col-md-6 mb-4 mb-md-0 about-img1">
              <img src={about2} alt="Products" className="img-fluidrounded" />
            </div>
            <div className="col-md-6">
              <div className="fw-bold">
                <h3>Nuestra Misión</h3>
              </div>
              <p className="text-muted">
                En Kayaks Brokers Rosario, nuestra misión es proporcionar a
                nuestros clientes la mejor experiencia en la compra de productos
                náuticos. Nos esforzamos por ofrecer un servicio al cliente
                excepcional y asesoramiento para ayudar a nuestros clientes a
                encontrar el equipo adecuado para sus necesidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*Boton interactivo de clientes de la empresa que vemos los distintos opiniones de c/u*/}
      {/*Es la que definimos al principio const About para dejar una predeterminada*/}
      <section className="container-fluid bg-light">
        <div className="container py-5 text-center">
          <div
            className="mx-auto"
            style={{
              maxWidth: '800px',
            }}
          >
            <p className="fs-4 mb-4 fw-bold">{quote}</p>
          </div>
          <div className="row justify-content-center align-items-center mt-5 gy-4">
            <div
              className="col-6 col-sm-4 col-md-2 d-flex justify-content-center brands-img"
              onClick={() =>
                setQuote(
                  'Navegar es vivir, y con un kayak de Kayaks Brokers Rosario, cada viaje es una aventura inolvidable.'
                )
              }
              style={{ cursor: 'pointer' }}
            >
              <img
                src={client1}
                alt="Goodness"
                className="img-fluid"
                style={{ maxHeight: '60px', objectFit: 'contain' }}
              />
            </div>
            <div
              className="col-6 col-sm-4 col-md-2 d-flex justify-content-center brands-img"
              onClick={() =>
                setQuote(
                  'Explora nuevos horizontes y descubre la libertad del agua con los kayaks y lanchas de Kayaks Brokers Rosario.'
                )
              }
              style={{ cursor: 'pointer' }}
            >
              <img
                src={client2}
                alt="Grand Golden Gallery"
                className="img-fluid"
                style={{ maxHeight: '60px', objectFit: 'contain' }}
              />
            </div>
            <div
              className="col-6 col-sm-4 col-md-2 d-flex justify-content-center brands-img"
              onClick={() =>
                setQuote(
                  'La vida es mejor en el agua, y un kayak es la llave para desbloquear aventuras inolvidables.'
                )
              }
              style={{ cursor: 'pointer' }}
            >
              <img
                src={client3}
                alt="Parker & Co."
                className="img-fluid"
                style={{ maxHeight: '60px', objectFit: 'contain' }}
              />
            </div>
            <div
              className="col-6 col-sm-4 col-md-2 d-flex justify-content-center brands-img"
              onClick={() =>
                setQuote(
                  'Disfrutar es vivir, y con un kayak de Kayaks Brokers Rosario, cada aventura nos representa un goce inolvidable.'
                )
              }
              style={{ cursor: 'pointer' }}
            >
              <img
                src={client4}
                alt="The Beast"
                className="img-fluid"
                style={{ maxHeight: '60px', objectFit: 'contain' }}
              />
            </div>
            <div
              className="col-6 col-sm-4 col-md-2 d-flex justify-content-center brands-img"
              onClick={() =>
                setQuote(
                  'Explora nuevos horizontes y descubre la libertad del agua con los kayaks y lanchas de Kayaks Brokers Rosario.'
                )
              }
              style={{ cursor: 'pointer' }}
            >
              <img
                src={client5}
                alt="The Hayden"
                className="img-fluid"
                style={{ maxHeight: '60px', objectFit: 'contain' }}
              />
            </div>
            <div
              className="col-6 col-sm-4 col-md-2 d-flex justify-content-center brands-img"
              onClick={() =>
                setQuote('El Rio lo disfrutas con los articulos de KBR')
              }
              style={{ cursor: 'pointer' }}
            >
              <img
                src={client6}
                alt="Good Mood"
                className="img-fluid"
                style={{ maxHeight: '60px', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/*Informacion de los miembros de nuestro equipo, con sus fotos y redes sociales*/}
      <section className="team-section">
        <h2 className="team-title">
          Nuestro Equipo integrado por profesionales <br />
          que ofrecen una excelente atencion y asesoramiento.
        </h2>
        <div className="team-row">
          <div className="team-member">
            <div className="team-image-wrapper">
              <img src={santi} alt="Santi" className="team-image" />
              <div className="team-social">
                <a
                  href="https://www.instagram.com/santiago_martina/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                >
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: 24, height: 24, color: '#E1306C' }}
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="5"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3.5"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="1.5"
                    />
                    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>
            <h3 className="team-name">Santiago Martina</h3>
            <p className="team-role">Fundador</p>
          </div>
          <div className="team-member">
            <div className="team-image-wrapper">
              <img src={ale} alt="Ale" className="team-image" />
              <div className="team-social">
                <a
                  href="https://www.instagram.com/alexis_mateo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                >
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: 24, height: 24, color: '#E1306C' }}
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="5"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3.5"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="1.5"
                    />
                    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>
            <h3 className="team-name">Alexis Mateo</h3>
            <p className="team-role">Fundador</p>
          </div>

          <div className="team-member">
            <div className="team-image-wrapper">
              <img src={rafa} alt="Rafi" className="team-image" />
              <div className="team-social">
                <a
                  href="https://www.instagram.com/rafiboveri/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                >
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: 24, height: 24, color: '#E1306C' }}
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="5"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3.5"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="1.5"
                    />
                    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>
            <h3 className="team-name">Rafi Boveri</h3>
            <p className="team-role">Fundadora</p>
          </div>

          <div className="team-member">
            <div className="team-image-wrapper">
              <img src={laza} alt="Laza" className="team-image" />
              <div className="team-social">
                <a
                  href="https://www.instagram.com/lazaro_cardelli/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                >
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: 24, height: 24, color: '#E1306C' }}
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="5"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3.5"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="1.5"
                    />
                    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>
            <h3 className="team-name">Lazaro Cardelli</h3>
            <p className="team-role">Fundador, CEO</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
