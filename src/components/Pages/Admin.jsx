import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function Admin() {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [allSellers, setAllSellers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const products = JSON.parse(localStorage.getItem('marketplaceProducts')) || [];
    const pending = products.filter(p => !p.approved);
    setPendingProducts(pending);

    const sellers = JSON.parse(localStorage.getItem('sellers')) || [];
    setAllSellers(sellers);
  };

  const approveProduct = (productId) => {
    const products = JSON.parse(localStorage.getItem('marketplaceProducts')) || [];
    const updated = products.map(p => 
      p.id === productId ? {...p, approved: true} : p
    );
    localStorage.setItem('marketplaceProducts', JSON.stringify(updated));
    toast.success('Producto aprobado');
    loadData();
  };

  const rejectProduct = (productId) => {
    const products = JSON.parse(localStorage.getItem('marketplaceProducts')) || [];
    const filtered = products.filter(p => p.id !== productId);
    localStorage.setItem('marketplaceProducts', JSON.stringify(filtered));
    toast.info('Producto rechazado');
    loadData();
  };

  const verifySeller = (sellerId) => {
    const sellers = JSON.parse(localStorage.getItem('sellers')) || [];
    const updated = sellers.map(s => 
      s.id === sellerId ? {...s, verified: true} : s
    );
    localStorage.setItem('sellers', JSON.stringify(updated));
    toast.success('Vendedor verificado');
    loadData();
  };

  return (
    <div className="container py-5">
      <h1 className="mb-5">Panel de Administración</h1>

      {/* Productos pendientes */}
      <div className="card mb-5">
        <div className="card-header">
          <h4 className="mb-0">Productos Pendientes de Aprobación ({pendingProducts.length})</h4>
        </div>
        <div className="card-body">
          {pendingProducts.length === 0 ? (
            <p className="text-muted">No hay productos pendientes</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Producto</th>
                    <th>Vendedor</th>
                    <th>Precio</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingProducts.map(product => (
                    <tr key={product.id}>
                      <td>
                        <img 
                          src={product.image} 
                          alt={product.Productname}
                          style={{ width: 60, height: 60, objectFit: 'cover' }}
                        />
                      </td>
                      <td>{product.Productname}</td>
                      <td>{product.sellerName}</td>
                      <td>{product.price}</td>
                      <td>
                        <span className="badge bg-info">{product.category}</span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-success me-2"
                          onClick={() => approveProduct(product.id)}
                        >
                          Aprobar
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => rejectProduct(product.id)}
                        >
                          Rechazar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Gestión de vendedores */}
      <div className="card">
        <div className="card-header">
          <h4 className="mb-0">Vendedores Registrados ({allSellers.length})</h4>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Negocio</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Productos</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {allSellers.map(seller => {
                  const products = JSON.parse(localStorage.getItem('marketplaceProducts')) || [];
                  const sellerProducts = products.filter(p => p.sellerId === seller.id);
                  
                  return (
                    <tr key={seller.id}>
                      <td>{seller.businessName}</td>
                      <td>{seller.email}</td>
                      <td>{seller.phone}</td>
                      <td>{sellerProducts.length}</td>
                      <td>
                        {seller.verified ? (
                          <span className="badge bg-success">Verificado</span>
                        ) : (
                          <span className="badge bg-warning">No verificado</span>
                        )}
                      </td>
                      <td>
                        {!seller.verified && (
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => verifySeller(seller.id)}
                          >
                            Verificar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;