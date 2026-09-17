import api from './apiClient';

export const analyticsService = {
  async getAnalytics() {
    return await api.get('/analytics');
  }
};
