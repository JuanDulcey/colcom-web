import { apiRequest, toQuery } from './client.js';

export const solicitudesApi = {
  createPublic: (data) => apiRequest('/solicitudes/public', { method: 'POST', body: data }),
  getAll: (filters) => apiRequest(`/solicitudes${toQuery(filters)}`),
  getById: (id) => apiRequest(`/solicitudes/${id}`),
  update: (id, data) => apiRequest(`/solicitudes/${id}`, { method: 'PATCH', body: data }),
  updateStatus: (id, data) => apiRequest(`/solicitudes/${id}/estado`, { method: 'PATCH', body: { estado: data.estado } }),
  remove: (id) => apiRequest(`/solicitudes/${id}`, { method: 'DELETE' }),
};
