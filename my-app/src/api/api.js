const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

function getAuthHeader() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchJSON(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeader(), ...(opts.headers || {}) },
    ...opts,
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch (e) { return text; }
}

export const getProducts = (query = '') => fetchJSON(`/api/products${query}`);
export const getProduct = (id) => fetchJSON(`/api/products/${id}`);
export const deleteProduct = (id) => fetchJSON(`/api/products/${id}`, { method: 'DELETE' });

// Create/update using multipart formdata (for image upload)
export async function createProductForm(formData) {
  const res = await fetch(`${API_BASE}/api/products`, {
    method: 'POST',
    headers: { ...getAuthHeader() }, // DO NOT set Content-Type
    body: formData
  });
  return res.json();
}

export async function updateProductForm(id, formData) {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'PUT',
    headers: { ...getAuthHeader() },
    body: formData
  });
  return res.json();
}

// JSON create/update (if your backend expects JSON instead of multipart)
export const createProduct = (body) => fetchJSON('/api/products', { method: 'POST', body: JSON.stringify(body) });
export const updateProduct = (id, body) => fetchJSON(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(body) });