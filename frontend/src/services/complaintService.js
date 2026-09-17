import api from './apiClient';

export const complaintService = {
  async getComplaints(params = {}) {
    return await api.get('/complaints', { params });
  },

  async createComplaint(data) {
    return await api.post('/complaints', data);
  },

  async updateStatus(id, data) {
    return await api.put(`/complaints/${id}/status`, data);
  }
};
