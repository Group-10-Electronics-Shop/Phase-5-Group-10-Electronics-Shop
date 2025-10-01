import axios from "axios";

const api = axios.create({
  baseURL: "/api", // relative path so Vite forwards to Flask backend
});

export default api;
