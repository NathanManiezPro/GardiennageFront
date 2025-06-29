import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  // ❌ Supprime "withCredentials" car on utilise des tokens JWT en Authorization header
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
