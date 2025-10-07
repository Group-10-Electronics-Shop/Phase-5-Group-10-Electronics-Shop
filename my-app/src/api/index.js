import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://phase-5-group-10-electronics-shop-18.onrender.com/api";

// 🔐 Hardcoded admin credentials
const ADMIN_EMAIL = "admin@shop.com";
const ADMIN_PASSWORD = "admin123";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// 🧭 Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      `[API Request] ${config.method.toUpperCase()} ${config.url}`,
      config.data
    );
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// 🧱 Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error("[API Response Error]", error.response || error);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// ======================
// 🔐 AUTH API FUNCTIONS
// ======================

// 🧠 Custom logic: Admin uses fixed credentials (bypasses backend)
export const loginUser = async (email, password) => {
  // ✅ Check for admin credentials first
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    console.log("[ADMIN LOGIN DETECTED]");
    const adminData = {
      token: "admin-static-token", // fake token just for local session
      user: {
        email: ADMIN_EMAIL,
        role: "admin",
        first_name: "Admin",
        last_name: "User",
      },
    };

    // Store in localStorage for consistency
    localStorage.setItem("token", adminData.token);
    localStorage.setItem("user", JSON.stringify(adminData.user));

    return adminData;
  }

  // 🧾 Normal user login
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

// 📝 Normal user registration (admins do not register)
export const registerUser = async (userData) => {
  if (
    userData.email === ADMIN_EMAIL ||
    userData.password === ADMIN_PASSWORD
  ) {
    throw new Error("Admins cannot register. Please log in instead.");
  }

  const res = await api.post("/auth/register", userData);
  return res.data;
};

// ======================
// 🛍 PRODUCTS API
// ======================

export const fetchProducts = async () => {
  const res = await api.get("/products");
  const data = res.data.data || res.data;
  return data.products || data;
};

export const getProducts = fetchProducts; // Alias

// 🧩 Helper: Check if current user is hardcoded admin
const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  return user?.role === "admin" && token === "admin-static-token";
};

// Create Product (simulate for admin)
export const createProduct = async (productData) => {
  if (isAdmin()) {
    console.log("[ADMIN SIMULATION] Product created (frontend only)", productData);
    return { message: "Product created (admin simulation)", data: productData };
  }

  const res = await api.post("/products", productData);
  return res.data.data || res.data;
};

// Update Product (simulate for admin)
export const updateProduct = async (id, productData) => {
  if (isAdmin()) {
    console.log(`[ADMIN SIMULATION] Product ${id} updated (frontend only)`, productData);
    return { message: "Product updated (admin simulation)", data: productData };
  }

  const res = await api.put(`/products/${id}`, productData);
  return res.data.data || res.data;
};

// Delete Product (simulate for admin)
export const deleteProduct = async (id) => {
  if (isAdmin()) {
    console.log(`[ADMIN SIMULATION] Product ${id} deleted (frontend only)`);
    return { message: "Product deleted (admin simulation)" };
  }

  const res = await api.delete(`/products/${id}`);
  return res.data.data || res.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data.data || res.data;
};

// ======================
// 🏷 CATEGORIES API
// ======================

export const fetchCategories = async () => {
  const res = await api.get("/categories");
  return res.data.data || res.data;
};

// ======================
// 🛒 CART API
// ======================

export const fetchCart = async () => {
  const res = await api.get("/cart");
  return res.data.data || res.data;
};

export const addToCartAPI = async (productId, quantity = 1) => {
  const res = await api.post("/cart/add", { product_id: productId, quantity });
  return res.data.data || res.data;
};

export default api;

