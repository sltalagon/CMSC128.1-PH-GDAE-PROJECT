// src/api/api.js
// Central API utility — uses session cookie from Google OAuth2 login

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : "http://localhost:8080/api";

// GET request
export const apiGet = async (endpoint) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`GET ${endpoint} failed: ${response.status}`);
  }
  return response.json();
};

// POST request
export const apiPost = async (endpoint, body) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`POST ${endpoint} failed: ${response.status}`);
  }
  return response.json();
};

// PUT request
export const apiPut = async (endpoint, body) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`PUT ${endpoint} failed: ${response.status}`);
  }
  return response.json();
};

// PATCH request — ADDED THIS TO FIX BUILD ERROR
export const apiPatch = async (endpoint, body) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`PATCH ${endpoint} failed: ${response.status}`);
  }
  return response.json();
};

// DELETE request
export const apiDelete = async (endpoint) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`DELETE ${endpoint} failed: ${response.status}`);
  }
  // Some DELETE endpoints return no content (204)
  if (response.status === 204) return null;
  return response.json();
};

// Helper to trigger Google login
export const loginWithGoogle = () => {
  const baseUrl = API_BASE.replace(/\/api$/, "");
  window.location.href = `${baseUrl}/oauth2/authorization/google`;
};

// Helper to check if user is logged in
export const checkAuthStatus = async () => {
  try {
    const response = await fetch(`${API_BASE}/admin/me`, {
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
};
