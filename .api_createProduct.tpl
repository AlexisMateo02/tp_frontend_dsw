async createProduct(productData) {
  // If FormData (multipart), send directly (do not set Content-Type)
  if (typeof FormData !== 'undefined' && productData instanceof FormData) {
    const url = this.baseURL + '/products';
    const token = localStorage.getItem('authToken');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: 'Bearer ' + token }),
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
