import api from "./client";

export async function fetchProducts(params = {}) {
  const { data } = await api.get("/api/products", { params });
  return data?.data ?? data;
}
export async function createProduct(payload) {
  const { data } = await api.post("/api/products", payload);
  return data?.data ?? data;
}
export async function updateProduct(id, payload) {
  const { data } = await api.put(`/api/products/${id}`, payload);
  return data?.data ?? data;
}
export async function deleteProduct(id) {
  const { data } = await api.delete(`/api/products/${id}`);
  return data?.data ?? data;
}
