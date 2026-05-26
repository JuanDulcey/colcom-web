import { apiRequest } from '../lib/api';
import type { Testimonio } from '../types';
import { useResourceList } from './useResourceList';

export function useTestimonios(page = 1, limit = 12) {
  const list = useResourceList<Testimonio>('/testimonios', page, limit);
  return {
    ...list,
    create: (payload: Partial<Testimonio>) => apiRequest<Testimonio>('/testimonios', { method: 'POST', body: payload }),
    update: (id: string, payload: Partial<Testimonio>) => apiRequest<Testimonio>(`/testimonios/${id}`, { method: 'PATCH', body: payload }),
    updateEstado: (id: string, estado: Testimonio['estado']) => apiRequest<Testimonio>(`/testimonios/${id}/estado`, { method: 'PATCH', body: { estado } }),
    remove: (id: string) => apiRequest(`/testimonios/${id}`, { method: 'DELETE' }),
  };
}

export function getTestimoniosPublicos(paisSlug: string, page = 1, limit = 12) {
  return apiRequest<Testimonio[]>(`/public/paises/${paisSlug}/testimonios?page=${page}&limit=${limit}`);
}
