/*representa el componente que muestra las publicaciones o articulos dentro de la pagina web
permitiendo a los usuarios leer novedades, noticias o contenido relevante publicado 
por los autores del sitio.*/
import React from "react";

function Blog() {
  return (
    <>
      <ol className="section-banner py-3 position-relative">
        <li className="position-relative">
          <Link to="/">Inicio</Link>
        </li>
        <li className="position-relative active">
          <span className="ps-5">Blog</span>
        </li>
      </ol>
    </>
  );
}

export default Blog;
