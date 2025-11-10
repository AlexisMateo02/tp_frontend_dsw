const fs = require('fs');
const p = 'C:/Users/santi/OneDrive/Escritorio/DSW/tp_frontend_dsw/src/services/api.js';
let s = fs.readFileSync(p,'utf8');
const marker = 'async createProduct(productData)';
const start = s.indexOf(marker);
if (start === -1) { console.error('marker not found'); process.exit(1); }
const braceStart = s.indexOf('{', start);
let i = braceStart;
let depth = 0;
for (; i < s.length; i++) {
  if (s[i] === '{') depth++;
  else if (s[i] === '}') {
    depth--;
    if (depth === 0) break;
  }
}
const end = i; // position of closing brace
const newFunc = `async createProduct(productData) {
    // If FormData (multipart), send directly (do not set Content-Type)
    if (typeof FormData !== 'undefined' && productData instanceof FormData) {
      const url = `${this.baseURL}/products`;
      const token = localStorage.getItem('authToken');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
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
  }`;

const newS = s.slice(0, start) + newFunc + s.slice(end+1);
fs.writeFileSync(p, newS, 'utf8');
console.log('api.js patched (createProduct)');
