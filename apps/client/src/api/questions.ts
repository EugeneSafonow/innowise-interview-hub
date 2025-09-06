import api from './api';

import { ICreateQuestionDto, IUpdateQuestionDto } from '@/types/questions';

export const questionsApi = {
  getDomains: () => api.get('/questions/domains'),
  getTopics: (domainId: string) => api.get(`/questions/topics?domainId=${domainId}`),
  getThemes: (topicId: string) => api.get(`/questions/themes?topicId=${topicId}`),
  getStructure: (domainId: string, topicId?: string, themeId?: string) =>
    api.post('/questions/structure', { domainId, topicId, themeId }),

  createQuestion: (data: ICreateQuestionDto) => api.post('/questions', data),
  getQuestions: () => api.get('/questions'),
  updateQuestion: (id: string, data: IUpdateQuestionDto) => api.put(`/questions/${id}`, data),
  deleteQuestion: (id: string) => api.delete(`/questions/${id}`),
};
