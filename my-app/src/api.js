import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ Fetch all products
export const getProducts = async () => {
  try {
    const res = await api.get("/products");
    // Some backends return { products: [...] }, others return [...]
    return res.data.products || res.data;
  } catch (err) {
    console.error("Failed to fetch products:", err);
    throw err;
  }
};

// ✅ Create a product (admin only)
export const createProduct = async (product) => {
  try {
    const res = await api.post("/products", product, {
      headers: { ...getAuthHeaders() },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to create product:", err);
    throw err;
  }
};

// ✅ Update a product (admin only)
export const updateProduct = async (id, product) => {
  try {
    const res = await api.put(`/products/${id}`, product, {
      headers: { ...getAuthHeaders() },
    });
    return res.data;
  } catch (err) {
    console.error(`Failed to update product with id ${id}:`, err);
    throw err;
  }
};

// ✅ Delete a product (admin only)
export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`/products/${id}`, {
      headers: { ...getAuthHeaders() },
    });
    return res.data;
  } catch (err) {
    console.error(`Failed to delete product with id ${id}:`, err);
    throw err;
  }
};

export default api;
