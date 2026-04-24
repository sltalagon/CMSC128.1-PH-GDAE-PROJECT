// src/api/api.js
// Central API utility — uses JWT from localStorage instead of session cookies

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api`;

// Helper to build headers and attach the JWT
const getHeaders = (isJson = false) => {
  const token = localStorage.getItem("jwt");
  const headers = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (isJson) {
    headers["Content-Type"] = "application/json";
  }
  
  return headers;
};

// GET request
export const apiGet = async (endpoint) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "GET",
    headers: getHeaders(), // Attached here
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
    headers: getHeaders(true), // JSON + Token
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`POST ${endpoint} failed: ${response.status}`);
  }
  
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    return response.text();
  }
};

// PUT request
export const apiPut = async (endpoint, body) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`PUT ${endpoint} failed: ${response.status}`);
  }
  
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    return response.text();
  }
};

// PATCH request
export const apiPatch = async (endpoint, body) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "PATCH",
    headers: getHeaders(true),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`PATCH ${endpoint} failed: ${response.status}`);
  }
  
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    return response.text();
  }
};

// DELETE request
export const apiDelete = async (endpoint) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "DELETE",
    headers: getHeaders(true),
  });
  if (!response.ok) {
    throw new Error(`DELETE ${endpoint} failed: ${response.status}`);
  }
  
  if (response.status === 204) return null;
  
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    return response.text(); 
  }
};

// Helper to trigger Google login
export const loginWithGoogle = () => {
  const baseUrl = API_BASE.replace(/\/api$/, "");
  window.location.href = `${baseUrl}/oauth2/authorization/google`;
};

// Helper to log out
export const logout = () => {
  localStorage.removeItem("jwt");
  window.location.href = "/admin/login"; 
};

// Helper to check if user is logged in
export const checkAuthStatus = async () => {
  if (!localStorage.getItem("jwt")) {
    return false;
  }

  try {
    await apiGet("/admin/me");
    return true;
  } catch {
    localStorage.removeItem("jwt"); 
    return false;
  }
};