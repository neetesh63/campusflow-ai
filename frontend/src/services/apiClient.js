import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor to add Auth token & demo role header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const savedUser = localStorage.getItem('campusflow_user');
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        if (userObj.is_demo) {
          config.headers['x-demo-role'] = userObj.role || 'student';
        }
      } catch (e) {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Error Handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    console.warn('API Error Intercepted:', message);
    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

export default api;
