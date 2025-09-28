/* Mostrar la tienda o catálogo de productos dentro de la aplicación. 
En esta página, los usuarios pueden ver los productos disponibles, sus descripciones, precios y, 
en muchos casos, añadirlos al carrito de compras o realizar una compra.*/
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Data
import productsData from "../../data/Product.json";

function Shop() {
  const [filterSortOption, setFilterSortOption] = useState("all");
  const navigate = useNavigate();

  const handleFilterSort = () => {
    let filtered = [...productsData];
    if (filterSortOption === "new" || filterSortOption === "Sale") {
      filtered = filtered.filter((product) => product.tag === filterSortOption);
    }
    if (filterSortOption === "low") {
      filtered.sort(
        (a, b) =>
          parseFloat(a.price.replace("$", "")) -
          parseFloat(b.price.replace("$", ""))
      );
    }
    if (filterSortOption === "high") {
      filtered.sort(
        (a, b) =>
          parseFloat(b.price.replace("$", "")) -
          parseFloat(a.price.replace("$", ""))
      );
    }
    return filtered;
  };

  const displayedProducts = handleFilterSort();

  const addToWishlist = (product) => {
    const existing = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!existing.some((p) => p.id === product.id)) {
      const updated = [...existing, product];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      window.dispatchEvent(new Event("wishlistUpdates"));
      toast.success(`${product.Productname} agregado a la lista de deseos`);
    } else {
      toast.info(`${product.Productname} ya está en la lista de deseos`);
    }
  };
  const addToCart = (product) => {
    const existing = JSON.parse(localStorage.getItem("cart")) || [];
    const alreadyInCart = existing.find((p) => p.id === product.id);

    if (!alreadyInCart) {
      const updatedProduct = { ...product, quantity: 1 };
      const updatedCart = [...existing, updatedProduct];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`${product.Productname} agregado al carrito`);
    } else {
      toast.info(`${product.Productname} ya está en el carrito`);
    }
  };
  return (
    <>
      <ol className="section-banner py-3 position-relative">
        <li className="position-relative">
          <Link to="/">Inicio</Link>
        </li>
        <li className="position-relative active">
          <span className="ps-5">Products</span>
        </li>
      </ol>

      <div className="shop-container">
        <div className="container">
          <h1 className="text-center py-4 fw-semibold">Productos</h1>
          <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="text-muted" style={{ fontSize: "1.1rem" }}>
                Showing <strong>{displayedProducts.length}</strong> product
                {displayedProducts.length != 1 && "s"} for "
                {filterSortOption === "all"
                  ? "All"
                  : filterSortOption.charAt(0).toUpperCase() +
                    filterSortOption.slice(1)}
                "
              </div>
              <div>
                <select
                  className="form-select py-2 fs-6"
                  style={{
                    minWidth: "260px",
                    backgroundColor: "#f5f5f5",
                    border: "0px",
                  }}
                  value={filterSortOption}
                  onChange={(e) => setFilterSortOption(e.target.value)}
                >
                  <option value="all">Todos los Productos</option>
                  <option value="new">Nuevos</option>
                  <option value="sale">En Oferta</option>
                  <option value="low">Precio: Bajo a Alto</option>
                  <option value="high">Precio: Alto a Bajo</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            {displayedProducts.map((product) => (
              <div className="col-md-3 mb-4 " key={product.id}>
                <div key={product.id}>
                  <div className="product-item mb-5 text-center position-relative">
                    <div className="product-image w-100 position-relative overflow-hidden">
                      <img
                        src={product.image}
                        alt="product"
                        className="img-fluid"
                      />
                      <img
                        src={product.secondImage}
                        alt="product"
                        className="img-fluid"
                      />
                      <div className="product-icons gap-3">
                        <div
                          className="product-icon"
                          title="Agregar a favoritos"
                          onClick={() => addToWishlist(product)}
                        >
                          <i className="bi bi-heart fs-5"></i>
                        </div>
                        <div
                          className="product-icon"
                          title="Agregar al carrito"
                          onClick={() => addToCart(product)}
                        >
                          <i className="bi bi-cart3 fs-5"></i>
                        </div>
                      </div>
                      <span
                        className={`tag badge text-white ${
                          product.tag === "Nuevo" ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {product.tag}
                      </span>
                    </div>
                    <Link
                      to={`/product/${product.id}`}
                      className="text-decoration-none text-black "
                    >
                      <div className="product-content pt-3">
                        {product.oldPrice ? (
                          <div className="price">
                            <span className="text-muted text-decoration-line-through me-2">
                              {product.oldPrice}
                            </span>
                            <span className="fw-bold text-muted ">
                              {product.price}
                            </span>
                          </div>
                        ) : (
                          <span className="price">{product.price}</span>
                        )}
                        <h3 className="title pt-1">{product.Productname}</h3>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default Shop;
