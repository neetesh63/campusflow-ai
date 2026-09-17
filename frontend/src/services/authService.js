import api from './apiClient';

export const authService = {
  async login(email, password, role) {
    return await api.post('/auth/login', { email, password, role });
  },

  async register(userData) {
    return await api.post('/auth/register', userData);
  },

  async getProfile() {
    return await api.get('/auth/profile');
  },

  async updateProfile(profileData) {
    return await api.put('/auth/profile', profileData);
  }
};
