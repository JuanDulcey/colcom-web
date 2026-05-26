import { apiRequest, toQuery } from './client.js';

export const noticiasApi = {
  publicByCountry: (countrySlug, filters = {}) => apiRequest(`/public/paises/${countrySlug}/noticias${toQuery(filters)}`),
  publicBySlug: (countrySlug, newsSlug) => apiRequest(`/public/paises/${countrySlug}/noticias/${newsSlug}`),
  getAll: (filters) => apiRequest(`/noticias${toQuery(filters)}`),
  getById: (id) => apiRequest(`/noticias/${id}`),
  create: (data) => apiRequest('/noticias', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/noticias/${id}`, { method: 'PATCH', body: data }),
  updateState: (id, estado) => apiRequest(`/noticias/${id}/estado`, { method: 'PATCH', body: { estado } }),
  uploadImage: (id, file) => {
    const form = new FormData();
    form.append('file', file);
    return apiRequest(`/noticias/${id}/imagen`, { method: 'PATCH', body: form });
  },
  remove: (id) => apiRequest(`/noticias/${id}`, { method: 'DELETE' }),
};
