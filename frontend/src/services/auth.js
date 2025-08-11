import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/auth`;

const authAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

export const register = async (userData) => {
  try {
    const response = await authAxios.post('/register', userData);
    if (response.data.token) {
      localStorage.setItem('profile', JSON.stringify(response.data.result));
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error en el registro');
  }
};

export const login = async (credentials) => {
  try {
    const response = await authAxios.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('profile', JSON.stringify(response.data.result));
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    // Aquí se captura el mensaje exacto del backend
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
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
