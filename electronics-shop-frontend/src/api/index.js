import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // ✅ FIX: use the correct key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  refresh: () => api.post('/auth/refresh'),
  profile: () => api.get('/auth/profile'),
  updateProfile: (payload) => api.put('/auth/profile', payload),
  changePassword: (payload) => api.post('/auth/change-password', payload),
};

export const products = {
  fetchAll: (params) => api.get('/products', { params }),
  fetchById: (id) => api.get(`/products/${id}`),
  fetchFeatured: () => api.get('/products/featured'),
  search: (q) => api.get('/products/search', { params: { q } }),
};

export const cart = {
  get: () => api.get('/cart'),
  add: (payload) => api.post('/cart/add', payload),
  updateItem: (itemId, payload) => api.put(`/cart/update/${itemId}`, payload),
  removeItem: (itemId) => api.delete(`/cart/remove/${itemId}`),
  clear: () => api.delete('/cart/clear'),
  count: () => api.get('/cart/count'),
};

export const orders = {
  create: (payload) => api.post('/orders/create', payload),
  getAll: () => api.get('/orders/all'),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (orderId) => api.put(`/orders/${orderId}/cancel`),
  updateStatus: (orderId, payload) => api.put(`/orders/${orderId}/update-status`, payload),
};

export const addresses = {
  list: () => api.get('/addresses'),
  create: (payload) => api.post('/addresses', payload),
  get: (id) => api.get(`/addresses/${id}`),
  update: (id, payload) => api.put(`/addresses/${id}`, payload),
  delete: (id) => api.delete(`/addresses/${id}`),
  setDefault: (id) => api.put(`/addresses/${id}/set-default`),
};

export const wishlist = {
  get: () => api.get('/wishlist'),
  add: (payload) => api.post('/wishlist', payload),
  remove: (id) => api.delete(`/wishlist/${id}`),
};

export const admin = {
  getDashboard: () => api.get('/admin/analytics/dashboard'),
  getRevenue: () => api.get('/admin/analytics/revenue'),
  getOrdersAnalytics: () => api.get('/admin/analytics/orders'),
  getProductsAnalytics: () => api.get('/admin/analytics/products'),

  getUsers: () => api.get('/admin/users'),
  createUser: (payload) => api.post('/admin/users', payload),
  updateUser: (userId, payload) => api.put(`/admin/users/${userId}`, payload),
  toggleUserStatus: (userId) => api.put(`/admin/users/${userId}/toggle-status`),

  getAllOrders: () => api.get('/orders/all'),
  updateOrderStatus: (orderId, payload) => api.put(`/orders/${orderId}/update-status`, payload),
};

export default api;
