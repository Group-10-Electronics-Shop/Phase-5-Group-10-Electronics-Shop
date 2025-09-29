import axios from "axios";
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});
// attach token if present
client.interceptors.request.use(cfg => {
  try {
    const token = localStorage.getItem("token");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  } catch (e) {}
  return cfg;
}, err => Promise.reject(err));
export default client;
