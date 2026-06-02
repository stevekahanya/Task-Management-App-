const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
};

// Auth
export const authAPI = {
  register: (body) =>
    fetch(`${BASE_URL}/auth/register`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  login: (body) =>
    fetch(`${BASE_URL}/auth/login`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  logout: () =>
    fetch(`${BASE_URL}/auth/logout`, { method: 'POST', headers: getHeaders() }).then(handleResponse),

  getMe: () =>
    fetch(`${BASE_URL}/auth/me`, { headers: getHeaders() }).then(handleResponse),
};

// Tasks
export const tasksAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/tasks/${query ? '?' + query : ''}`, { headers: getHeaders() }).then(handleResponse);
  },

  getOne: (id) =>
    fetch(`${BASE_URL}/tasks/${id}`, { headers: getHeaders() }).then(handleResponse),

  create: (body) =>
    fetch(`${BASE_URL}/tasks/`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  update: (id, body) =>
    fetch(`${BASE_URL}/tasks/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),
};

// Tags
export const tagsAPI = {
  getAll: () =>
    fetch(`${BASE_URL}/tags/`, { headers: getHeaders() }).then(handleResponse),

  create: (body) =>
    fetch(`${BASE_URL}/tags/`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE_URL}/tags/${id}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),
};
