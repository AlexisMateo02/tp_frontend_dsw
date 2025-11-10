const fs = require('fs');
const p = 'C:/Users/santi/OneDrive/Escritorio/DSW/tp_frontend_dsw/src/services/api.js';
let s = fs.readFileSync(p,'utf8');
// replace createProduct implementation
s = s.replace(/async createProduct\(productData\) \{[\s\S]*?\n\s*\}/m, `async createProduct(productData) {
    // If FormData (multipart), send directly (do not set Content-Type)
    if (typeof FormData !== 'undefined' && productData instanceof FormData) {
      const url = `${this.baseURL}/products`;
      const token = localStorage.getItem('authToken');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // let browser set Content-Type with boundary
        },
        body: productData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || `Error ${response.status}: ${response.statusText}`);
      }

      const d = await response.json();
      return d.data || d;
    }

    // default JSON behavior
    return await this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }
`);
fs.writeFileSync(p,s,'utf8');
console.log('api.js patched');
