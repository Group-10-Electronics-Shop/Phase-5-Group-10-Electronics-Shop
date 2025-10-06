const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

// ✅ Fixed: Get token from correct storage key
function getAuthHeader() {
  const token = localStorage.getItem('auth_token'); // Changed from 'access_token'
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Generic fetch helper
export async function fetchJSON(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 
      'Content-Type': 'application/json', 
      ...getAuthHeader(), 
      ...(opts.headers || {}) 
    },
    ...opts,
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  
  const data = await res.json();
  return data;
}

// ==================== AUTH ====================
export const register = (body) => 
  fetchJSON('/api/auth/register', { method: 'POST', body: JSON.stringify(body) });

export const login = (body) => 
  fetchJSON('/api/auth/login', { method: 'POST', body: JSON.stringify(body) });

export const getProfile = () => 
  fetchJSON('/api/auth/profile');

// ==================== PRODUCTS ====================
export const getProducts = (query = '') => 
  fetchJSON(`/api/products${query}`);

export const getProduct = (id) => 
  fetchJSON(`/api/products/${id}`);

export const createProduct = (body) => 
  fetchJSON('/api/products', { method: 'POST', body: JSON.stringify(body) });

export const updateProduct = (id, body) => 
  fetchJSON(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(body) });

export const deleteProduct = (id) => 
  fetchJSON(`/api/products/${id}`, { method: 'DELETE' });

// ==================== CATEGORIES ====================
export const getCategories = () => 
  fetchJSON('/api/categories');

export const createCategory = (body) => 
  fetchJSON('/api/categories', { method: 'POST', body: JSON.stringify(body) });

// ==================== CART ====================
export const getCart = () => 
  fetchJSON('/api/cart');

export const addToCart = (productId, quantity = 1) => 
  fetchJSON('/api/cart/add', { 
    method: 'POST', 
    body: JSON.stringify({ product_id: productId, quantity }) 
  });

export const updateCartItem = (itemId, quantity) => 
  fetchJSON(`/api/cart/update/${itemId}`, { 
    method: 'PUT', 
    body: JSON.stringify({ quantity }) 
  });

export const removeFromCart = (itemId) => 
  fetchJSON(`/api/cart/remove/${itemId}`, { method: 'DELETE' });

// ==================== ORDERS ====================
export const getOrders = () => 
  fetchJSON('/api/orders');

export const createOrder = (body) => 
  fetchJSON('/api/orders/create', { method: 'POST', body: JSON.stringify(body) });

// ==================== ADMIN ====================
export const getUsers = () => 
  fetchJSON('/api/admin/users');

export const getDashboardAnalytics = () => 
  fetchJSON('/api/admin/analytics/dashboard');

export const getProductAnalytics = () => 
  fetchJSON('/api/admin/analytics/products');

export default {
  register,
  login,
  getProfile,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  getOrders,
  createOrder,
  getUsers,
  getDashboardAnalytics,
  getProductAnalytics
};