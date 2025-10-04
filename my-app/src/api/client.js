import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || ""; // "" uses Vite proxy
export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" }
});

function getTokens() {
  return {
    access: localStorage.getItem("access_token"),
    refresh: localStorage.getItem("refresh_token")
  };
}
function setAccess(token) {
  if (token) localStorage.setItem("access_token", token);
}
function setTokens({ access, refresh }) {
  if (access) localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
}

// Attach access token to every request
api.interceptors.request.use((config) => {
  const { access } = getTokens();
  if (access) {
    config.headers = { ...config.headers, Authorization: `Bearer ${access}` };
  }
  return config;
});

// Auto-refresh logic (single refresh in-flight)
let refreshing = null;
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    // avoid intercepting refresh endpoint or non-401
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes("/api/auth/refresh")
    ) {
      original._retry = true;
      try {
        if (!refreshing) {
          const { refresh } = getTokens();
          if (!refresh) throw new Error("No refresh token");
          refreshing = (async () => {
            const r = await api.post(
              "/api/auth/refresh",
              null,
              { headers: { Authorization: `Bearer ${refresh}` } }
            );
            // some backends return { data: { access_token } }, others { access_token }
            const newAccess = r.data?.access_token ?? r.data?.data?.access_token;
            setAccess(newAccess);
            refreshing = null;
            return newAccess;
          })();
        }
        await refreshing;
        // reattach new access and retry
        const { access } = getTokens();
        if (access) original.headers = { ...original.headers, Authorization: `Bearer ${access}` };
        return api(original);
      } catch (e) {
        refreshing = null;
        // hard logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // optional: redirect to login page
        // window.location.assign('/login');
        throw error;
      }
    }
    throw error;
  }
);

export { setTokens, setAccess, getTokens };
export default api;
