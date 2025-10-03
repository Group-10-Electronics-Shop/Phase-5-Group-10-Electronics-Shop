import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/products";

// Get all products (public)
export const fetchProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create product (requires token)
export const createProduct = async (productData, token) => {
  const response = await axios.post(API_URL, productData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete product (requires token)
export const deleteProduct = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
