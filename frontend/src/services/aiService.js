import api from './apiClient';

export const aiService = {
  async sendChatMessage(message, history = []) {
    return await api.post('/ai/chat', { message, history }, { timeout: 45000 });
  },

  async generateStudyPlan(planParams) {
    return await api.post('/ai/study-plan', planParams, { timeout: 45000 });
  }
};
