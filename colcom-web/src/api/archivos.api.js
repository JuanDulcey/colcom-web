import { apiRequest, toQuery } from './client.js';

export const archivosApi = {
  getAll: (filters) => apiRequest(`/archivos${toQuery(filters)}`),
  getById: (id) => apiRequest(`/archivos/${id}`),
  createManual: (data) => apiRequest('/archivos', { method: 'POST', body: data }),
  upload: (file, moduleId, referenceId) => {
    const form = new FormData();
    form.append('file', file);
    form.append('nombre_archivo', file.name);
    form.append('modulo', moduleId);
    form.append('referencia_id', referenceId);
    return apiRequest('/archivos/upload', { method: 'POST', body: form });
  },
  update: (id, data) => apiRequest(`/archivos/${id}`, { method: 'PUT', body: data }),
  patch: (id, data) => apiRequest(`/archivos/${id}`, { method: 'PATCH', body: data }),
  remove: (id) => apiRequest(`/archivos/${id}`, { method: 'DELETE' }),
};
