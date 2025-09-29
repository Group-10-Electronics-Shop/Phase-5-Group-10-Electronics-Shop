import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const getProducts = async () => {
  try {
    const res = await api.get("/products");
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createProduct = async (product) => {
  try {
    const res = await api.post("/products", product);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default api;
