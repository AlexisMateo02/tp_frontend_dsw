/*representa el componente que muestra las publicaciones o articulos dentro de la pagina web
permitiendo a los usuarios leer novedades, noticias o contenido relevante publicado 
por los autores del sitio.*/
import React from "react";
import blogs from "../../Blogs.json";
import { Link } from "react-router-dom";
function Blog() {
  return (
    <>
      <ol className="section-banner py-3 position-relative">
        <li className="position-relative">
          <Link to="/">Inicio</Link>
        </li>
        <li className="position-relative active">
          <span className="ps-5">Noticias</span>
        </li>
      </ol>

      <div className="container">
        <h1 className="text-center py-4 fw-semibold"></h1>
        <div className="row">
          {blogs.map((blog) => (
            <div className="col-lg-4 col-md-6 mb-0">
              <div className="blog-image w-100 position-relative overflow-hidden">
                <img src={blog.image} alt="blog-image" className="img-fluid" />
              </div>
              <div className="blog-content pt-3 w-100 position-relative">
                <div className="blog-title">
                  <span className="title">{blog.title}</span>
                </div>
                <h3>{blog.name}</h3>
                <ul className="py-3 d-flex w-100 text-center justify-cpntent-center gap-2">
                  <li>
                    By <span className="text-black ps-2 ">{blog.author}</span>
                  </li>
                  <li>
                    <span className="active position-relative ps-2">
                      {blog.date}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Blog;
