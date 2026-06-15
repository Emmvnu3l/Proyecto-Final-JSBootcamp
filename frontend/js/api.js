const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Error en la solicitud');
  }

  return response.json();
}

// Auth
export const register = (data) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) });
export const login = (data) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) });

// News
export const getNews = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/news?${query}`);
};
export const getNewsById = (id) => apiRequest(`/news/${id}`);
export const createNews = (formData) => {
  const token = localStorage.getItem('token');
  return fetch(`${API_BASE}/news`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(r => {
    if (!r.ok) throw new Error('Error al crear noticia');
    return r.json();
  });
};
export const updateNews = (id, formData) => {
  const token = localStorage.getItem('token');
  return fetch(`${API_BASE}/news/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(r => {
    if (!r.ok) throw new Error('Error al actualizar noticia');
    return r.json();
  });
};
export const deleteNews = (id) => apiRequest(`/news/${id}`, { method: 'DELETE' });

// Categories
export const getCategories = () => apiRequest('/categories');

// Comments
export const getCommentsByNews = (newsId) => apiRequest(`/comments/news/${newsId}`);
export const createComment = (data) => apiRequest('/comments', { method: 'POST', body: JSON.stringify(data) });

// Likes
export const getLikesByNews = (newsId) => apiRequest(`/likes/news/${newsId}`);
export const toggleLike = (data) => apiRequest('/likes', { method: 'POST', body: JSON.stringify(data) });
