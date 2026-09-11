import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5005/api', // URL de tu backend en Docker
});

// Interceptor para inyectar el token en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});