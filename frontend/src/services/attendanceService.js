import api from './apiClient';

export const attendanceService = {
  async getRecords(params = {}) {
    return await api.get('/attendance', { params });
  },

  async markAttendance(data) {
    return await api.post('/attendance/mark', data);
  }
};
