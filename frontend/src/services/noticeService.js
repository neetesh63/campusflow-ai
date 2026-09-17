import api from './apiClient';

export const noticeService = {
  async getNotices(params = {}) {
    return await api.get('/notices', { params });
  },

  async createNotice(data) {
    return await api.post('/notices', data);
  },

  async deleteNotice(id) {
    return await api.delete(`/notices/${id}`);
  }
};
