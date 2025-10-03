const API_BASE_URL = "/api"; // let Vite proxy handle backend forwarding

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export default api;
