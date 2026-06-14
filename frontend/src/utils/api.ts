export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Safely remove /api from the end of the URL for the frontend BASE_URL
let _baseUrl = API_BASE_URL.replace(/\/+$/, ''); // Remove trailing slashes
if (_baseUrl.endsWith('/api')) {
  _baseUrl = _baseUrl.slice(0, -4);
}
export const BASE_URL = _baseUrl;

// Helper to get auth headers
const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('chronoLink_token');
  const headers: HeadersInit = {};
  
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

const handleAuthError = (status: number, endpoint: string) => {
  if (status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
    localStorage.removeItem('chronoLink_user');
    localStorage.removeItem('chronoLink_token');
    window.location.href = '/login';
  }
};

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      handleAuthError(response.status, endpoint);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return response.json();
  },

  post: async (endpoint: string, data: any, isMultipart = false) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(isMultipart),
      body: isMultipart ? data : JSON.stringify(data),
    });
    if (!response.ok) {
      handleAuthError(response.status, endpoint);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return response.json();
  },

  put: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      handleAuthError(response.status, endpoint);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return response.json();
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      handleAuthError(response.status, endpoint);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return response.json();
  },
};
