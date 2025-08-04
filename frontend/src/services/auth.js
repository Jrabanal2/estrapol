import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/auth`;

const authAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

export const register = async (userData) => {
  const response = await authAxios.post('/register', userData);
  if (response.data.token) {
    localStorage.setItem('profile', JSON.stringify(response.data.result));
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const login = async (credentials) => {
  const response = await authAxios.post('/login', credentials);
  if (response.data.token) {
    localStorage.setItem('profile', JSON.stringify(response.data.result));
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('profile');
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  const profile = localStorage.getItem('profile');
  return profile ? JSON.parse(profile) : null;
};

export const getToken = () => localStorage.getItem('token');
export const isAuthenticated = () => !!getToken();
