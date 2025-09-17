/* Se utiliza para mostrar la lista de deseos del usuario. */
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setWishlist(storedWishlist);
    setCart(storedCart);
  }, []);

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
    toast.error("Producto eliminado de la lista de deseos");
  };

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    let updatedCart;
    if (existingProduct) {
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${product.ProductName} agregado al carrito`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>
      <ol className="section-banner py-3 position-relative">
        <li className="position-relative">
          <Link to="/">Inicio</Link>
        </li>
        <li className="position-relative active">
          <Link to="#" className="ps-5">
            Favoritos {/*antes habia escrito Kayaks*/}
          </Link>
        </li>
      </ol>

      <div className="contain my-5">
        <h2 className="text-center fw-bold mb-4"> 💙 Lista de Deseos 💛</h2>

        {wishlist.length === 0 ? (
          <div className="text-center">
            <p className="lead text-muted">Tu lista de deseos está vacía.</p>
            <Link to="/shop" className="btn">
              <i className="ri-shopping-bag-line me-2"></i> Buscar productos
            </Link>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
            {wishlist.map((product) => (
              <div className="col" key={product.id}>
                <div className="card h-100 shadow-sm border-0">
                  <div
                    className="position-relative overflow-hidden"
                    style={{ height: "250px", backgroundColor: "#f8f9fa" }}
                  >
                    <img
                      src={product.image}
                      className="card-img-top h-100 object-fit-cover"
                      alt=""
                    />
                    {product.tag && (
                      <span
                        className={`badge position-absolute top-0 end-0 m-2 ${
                          product.tag === "New" ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {product.tag}
                      </span>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column text-center">
                    <p className="card-text fs-5 fw-semibold text-dark">
                      {product.price}
                    </p>
                    <h5 className="card-title">{product.Productname}</h5>
                    <div className="md-auto d-flex justify-content-between gap-2">
                      <button
                        className="btn w-100"
                        onClick={() => addToCart(product)}
                      >
                        <i className="ri-shopping-cart-2-line me-1">
                          Agregar al carrito
                        </i>
                      </button>
                      <button
                        className="btn w-100"
                        onClick={() => removeFromWishlist(product.id)}
                      >
                        <i className="ri-shopping-cart-2-line me-1">
                          Eliminar de favoritos
                        </i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default Wishlist;
