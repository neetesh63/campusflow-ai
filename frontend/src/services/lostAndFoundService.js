import api from './apiClient';

export const lostAndFoundService = {
  async getItems(params = {}) {
    return await api.get('/lost-found', { params });
  },

  async createReport(itemData) {
    return await api.post('/lost-found', itemData);
  },

  async updateStatus(id, status) {
    return await api.put(`/lost-found/${id}/status`, { status });
  },

  async sendContactRequest(id, message) {
    return await api.post(`/lost-found/${id}/contact`, { message });
  },

  async findMatches(itemId) {
    return await api.post('/lost-found/match', { itemId });
  }
};
