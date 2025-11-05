import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from './components/Nav/Nav.jsx';
import Index from './components/Pages/Index.jsx';
import ProductDetails from './components/Pages/ProductDetails';
import Wishlist from './components/Pages/Wishlist.jsx';
import Cart from './components/Pages/Cart.jsx';
import Checkout from './components/Pages/Checkout.jsx';
import Footer from './components/Footer/Footer.jsx';
import Admin from './components/Pages/Admin.jsx';
import React, { useEffect, useState } from 'react';
import About from './components/Pages/About.jsx';
import Shop from './components/Pages/Shop.jsx';
import Stores from './components/Pages/Stores.jsx';
import Contact from './components/Pages/Contact.jsx';
import Articles from './components/Pages/Articles.jsx';
import Terms from './components/Pages/Terms.jsx';
import Login from './components/Pages/login.jsx';
import Register from './components/Pages/Register.jsx';
import SellerRegister from './components/Pages/SellerRegister.jsx';
import SellerDashboard from './components/Pages/SellerDashboard.jsx';
import SellerProfile from './components/Pages/SellerProfile.jsx';
import Foro from './components/Pages/Foro.jsx';
import Publicar from './components/Pages/Publicar.jsx';
import Publicaciones from './components/Pages/Publicaciones.jsx';
import PublicacionDetails from './components/Pages/PublicacionDetails.jsx';
import Profile from './components/Pages/Profile.jsx';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const load = () => {
      try {
        const cu = JSON.parse(localStorage.getItem('currentUser') || 'null');
        setCurrentUser(cu);
      } catch {
        setCurrentUser(null);
      }
    };
    load();
    window.addEventListener('authChanged', load);
    window.addEventListener('storage', load);
    return () => {
      window.removeEventListener('authChanged', load);
      window.removeEventListener('storage', load);
    };
  }, []);

  // If admin is logged in, show only the admin panel (per user request)
  if (
    currentUser &&
    (currentUser.email === 'admin@gmail.com' || currentUser.role === 'admin')
  ) {
    return <Admin />;
  }

  return (
    <>
      <Nav />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/seller-register" element={<SellerRegister />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/seller/:sellerId" element={<SellerProfile />} />

          <Route path="/foro" element={<Foro />} />
          <Route path="/foro/crear" element={<Publicar />} />
          <Route path="/foro/mis" element={<Publicaciones />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/foro/publicacion/:id"
            element={<PublicacionDetails />}
          />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
