import api from './apiClient';

export const placementService = {
  async getOpportunities() {
    return await api.get('/placement/opportunities');
  },

  async getStats() {
    return await api.get('/placement/stats');
  },

  async getApplications() {
    return await api.get('/placement/applications');
  },

  async getDrives() {
    return await api.get('/placement/drives');
  },

  async applyForOpportunity(opportunity) {
    return await api.post('/placement/apply', opportunity);
  },

  async seedDemoData() {
    return await api.post('/placement/seed');
  },

  async getProgress() {
    return await api.get('/placement/progress');
  },

  async updateProgress(data) {
    return await api.put('/placement/progress', data);
  }
};

export default placementService;
