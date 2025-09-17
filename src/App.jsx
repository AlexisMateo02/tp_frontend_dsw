import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav/Nav.jsx";
import Index from "./components/Pages/Index.jsx";
import ProductDetails from "./components/Pages/ProductDetails";
import Wishlist from "./components/Pages/Wishlist.jsx";
import Cart from "./components/Pages/Cart.jsx";
import Checkout from "./components/Pages/Checkout.jsx";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />}></Route>
      </Routes>
    </>
  );
}

export default App;
