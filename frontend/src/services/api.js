import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para añadir token solo en rutas protegidas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  // Evitar enviar token en login y register
  if (token && !config.url.includes('/auth/login') && !config.url.includes('/auth/register')) {
    config.headers.Authorization = `Bearer ${token}`;
    console.debug('[API] Token añadido a la petición:', token.substring(0, 15) + '...', '->', config.url);
  } else {
    console.debug('[API] Petición sin token o en login/register:', config.url);
  }

  return config;
}, (error) => {
  console.error('[API] Error en interceptor de request:', error);
  return Promise.reject(error);
});

// Interceptor de respuestas
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    if (status === 401) {
      console.warn('[API] Token inválido o expirado. Limpiando almacenamiento.');
      localStorage.removeItem('token');
      localStorage.removeItem('profile');

      // Redirigir si el token expiró
      if (code === 'TOKEN_EXPIRED') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Métodos de API
export const fetchTopics = () => api.get('/api/topics');
export const fetchTopicDetails = (topicId) => api.get(`/api/topics/${topicId}`);
export const fetchQuestionsByTopic = (topicId) => api.get(`/api/questions/topic/${topicId}`);
export const fetchRandomQuestions = (topicId, count) => api.get(`/api/questions/random/${topicId}/${count}`);
export const login = (credentials) => api.post('/api/auth/login', credentials);
export const register = (userData) => api.post('/api/auth/register', userData);

export default api;
