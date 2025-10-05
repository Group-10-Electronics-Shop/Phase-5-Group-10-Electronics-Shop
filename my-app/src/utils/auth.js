// src/utils/auth.js
const TOKEN_KEY = "auth_token";
const ROLE_KEY  = "auth_role";
const NAME_KEY  = "auth_name";

export function loginAs({ token, role = "user", name = "User" } = {}) {
  const safeToken = token || `demo-${Date.now()}`;
  localStorage.setItem(TOKEN_KEY, safeToken);
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(NAME_KEY, name);
  // notify listeners (Header, etc.)
  window.dispatchEvent(new Event("storage"));
  return { token: safeToken, role, name };
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(NAME_KEY);
  window.dispatchEvent(new Event("storage"));
}

export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY);
}

export function isAdmin() {
  return localStorage.getItem(ROLE_KEY) === "admin";
}

export function getRole() {
  return localStorage.getItem(ROLE_KEY);
}

export function getName() {
  return localStorage.getItem(NAME_KEY);
}