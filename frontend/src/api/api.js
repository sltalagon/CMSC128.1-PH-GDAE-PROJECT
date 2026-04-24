// src/api/api.js
// Central API utility — uses JWT token from localStorage

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api`;

// Token storage
export const getToken = () => localStorage.getItem("jwt");
export const setToken = (token) => {
  removeToken(); 
  localStorage.setItem("jwt", token);
};
export const removeToken = () => localStorage.removeItem("jwt");

// Helper to build auth headers
const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// Helper to parse response body safely
const parseResponse = async (response) => {
  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
};

// GET request
export const apiGet = async (endpoint) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error(`GET ${endpoint} failed: ${response.status}`);
  }
  return parseResponse(response);
};

// POST request
export const apiPost = async (endpoint, body) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`POST ${endpoint} failed: ${response.status}`);
  }
  return parseResponse(response);
};

// PUT request
export const apiPut = async (endpoint, body) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`PUT ${endpoint} failed: ${response.status}`);
  }
  return parseResponse(response);
};

// PATCH request
export const apiPatch = async (endpoint, body) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`PATCH ${endpoint} failed: ${response.status}`);
  }
  return parseResponse(response);
};

// DELETE request
export const apiDelete = async (endpoint) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error(`DELETE ${endpoint} failed: ${response.status}`);
  }
  return parseResponse(response);
};

// Helper to trigger Google login — clears old session first
export const loginWithGoogle = () => {
  removeToken(); 
  const baseUrl = API_BASE.replace(/\/api$/, "");
  window.location.href = `${baseUrl}/oauth2/authorization/google?prompt=select_account`;
};

// Helper to log out — clears token and redirects
export const logout = () => {
  removeToken();
  window.location.href = "/admin/login";
};

// Helper to check if user is logged in
export const checkAuthStatus = async () => {
  try {
    await apiGet("/admin/me");
    return true;
  } catch {
    return false;
  }
};