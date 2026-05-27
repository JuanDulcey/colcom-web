import { apiRequest, toQuery } from './client.js';

export const testimoniosApi = {
  publicByCountry: (countrySlug, filters = {}) => apiRequest(`/public/paises/${countrySlug}/testimonios${toQuery(filters)}`),
  publicById: (countrySlug, id) => apiRequest(`/public/paises/${countrySlug}/testimonios/${id}`),
  getAll: (filters) => apiRequest(`/testimonios${toQuery(filters)}`),
  getById: (id) => apiRequest(`/testimonios/${id}`),
  create: (data) => apiRequest('/testimonios', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/testimonios/${id}`, { method: 'PATCH', body: data }),
  updateState: (id, estado) => apiRequest(`/testimonios/${id}/estado`, { method: 'PATCH', body: { estado } }),
  uploadImage: (id, file) => {
    const form = new FormData();
    form.append('file', file);
    return apiRequest(`/testimonios/${id}/foto`, { method: 'POST', body: form });
  },
  remove: (id) => apiRequest(`/testimonios/${id}`, { method: 'DELETE' }),
};
