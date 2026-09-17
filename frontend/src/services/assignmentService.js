import api from './apiClient';

export const assignmentService = {
  async getAssignments(params = {}) {
    return await api.get('/assignments', { params });
  },

  async createAssignment(data) {
    return await api.post('/assignments', data);
  },

  async submitAssignment(data) {
    return await api.post('/assignments/submit', data);
  }
};
