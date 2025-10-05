export function loginAs({ token = null, role = "user", name = "User" } = {}) {
  if (!token) token = "demo-token-" + Date.now();
  localStorage.setItem("auth_token", token);
  localStorage.setItem("auth_role", role);
  localStorage.setItem("auth_name", name);
  // small signal for other tabs/listeners (optional)
  window.dispatchEvent(new Event('storage'));
}

export function logout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_role");
  localStorage.removeItem("auth_name");
  window.dispatchEvent(new Event('storage'));
}

export function getRole() {
  return localStorage.getItem("auth_role") || null;
}

export function getName() {
  return localStorage.getItem("auth_name") || null;
}

export function isAdmin() {
  return getRole() === "admin";
}

export function isAuthenticated() {
  return !!localStorage.getItem("auth_token");
}