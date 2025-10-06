import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Adjust if your backend URL differs

// ✅ Admin API module

// Get all products
export const fetchProducts = async () => {
  const res = await axios.get(`${API_URL}/products`);
  return res.data;
};

// Create a product
export const createProduct = async (productData) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API_URL}/products`, productData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// Update a product
export const updateProduct = async (id, updatedData) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API_URL}/products/${id}`, updatedData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// Delete a product
export const deleteProduct = async (id) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_URL}/products/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};

// ✅ Example: Admin-only fetch users (if needed)
export const fetchUsers = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/admin/users`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res.data;
};
