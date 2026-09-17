import api from './apiClient';

export const eventService = {
  async getEvents(params = {}) {
    return await api.get('/events', { params });
  },

  async createEvent(data) {
    return await api.post('/events', data);
  }
};
