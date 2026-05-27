import { apiRequest } from './client.js';

export const authApi = {
  login: async (credentials) => {
    const res = await apiRequest('/auth/login', { method: 'POST', body: credentials });
    return res.data;
  },
  me: async () => {
    const res = await apiRequest('/auth/me');
    return { user: res.data };
  },
  logout: async () => ({ ok: true }),
  securityQuestion: (username) => apiRequest('/auth/security-question', { method: 'POST', body: { username } }),
  forgotPassword: (payload) => apiRequest('/auth/forgot-password', { method: 'POST', body: payload }),
  changeMyPassword: (payload) => apiRequest('/auth/change-my-password', { method: 'PATCH', body: payload }),
  updateSecurityQuestion: (payload) => apiRequest('/auth/security-question', { method: 'PATCH', body: payload }),
  getSecurityQuestionMe: () => apiRequest('/auth/security-question/me', { method: 'GET' }),
};
