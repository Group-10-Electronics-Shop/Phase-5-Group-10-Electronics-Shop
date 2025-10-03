import axios from "axios";

const API_URL = "http://localhost:5000/api/products"; // adjust if backend URL is different

// Get all products
export const fetchProducts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Create a product
export const createProduct = async (productData) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(API_URL, productData, {
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

  const res = await axios.put(`${API_URL}/${id}`, updatedData, {
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
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  } 
    catch (err) {
    console.error("Delete failed:", err);
    throw err; // re-throw so frontend can handle
  }
};