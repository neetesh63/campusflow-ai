import axios from 'axios';

const isProduction = import.meta.env.PROD;
const configuredEnvUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

if (isProduction && !configuredEnvUrl) {
  console.warn('⚠️ Warning: VITE_API_BASE_URL is not defined in production environment variables! Falling back to relative path /api');
}

const rawBaseUrl = configuredEnvUrl || (isProduction ? '/api' : 'http://localhost:5000');
const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds to accommodate Render free-tier cold starts
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

// Response Interceptor with Transient Single Retry for Render Cold Starts
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Retry once on ECONNABORTED (timeout) or 504 Gateway Timeout
    if (
      originalRequest &&
      !originalRequest._retry &&
      (error.code === 'ECONNABORTED' || error.response?.status === 504)
    ) {
      originalRequest._retry = true;
      console.warn('Backend cold start / timeout detected. Retrying request once...');
      try {
        const retryRes = await api(originalRequest);
        return retryRes;
      } catch (retryErr) {
        return Promise.reject({
          message: 'Backend server connection timeout. If hosted on Render, the server may be spinning up — please try again.',
          status: retryErr.response?.status || 504,
          data: retryErr.response?.data
        });
      }
    }

    let message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    if (error.code === 'ECONNABORTED' || message.includes('timeout')) {
      message = 'Backend server connection timeout. If hosted on Render, the server may be spinning up — please try again.';
    }

    console.warn('API Error Intercepted:', message);
    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

export default api;
