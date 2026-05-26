import { apiRequest } from '../lib/api';
import type { Noticia } from '../types';
import { useResourceList } from './useResourceList';

export function useNoticias(page = 1, limit = 12) {
  const list = useResourceList<Noticia>('/noticias', page, limit);
  return {
    ...list,
    create: (payload: Partial<Noticia>) => apiRequest<Noticia>('/noticias', { method: 'POST', body: payload }),
    update: (id: string, payload: Partial<Noticia>) => apiRequest<Noticia>(`/noticias/${id}`, { method: 'PATCH', body: payload }),
    updateEstado: (id: string, estado: Noticia['estado']) => apiRequest<Noticia>(`/noticias/${id}/estado`, { method: 'PATCH', body: { estado } }),
    uploadImagen: (id: string, file: File) => {
      const form = new FormData();
      form.append('file', file);
      return apiRequest<Noticia>(`/noticias/${id}/imagen`, { method: 'PATCH', body: form });
    },
    remove: (id: string) => apiRequest(`/noticias/${id}`, { method: 'DELETE' }),
  };
}

export function getNoticiasPublicas(paisSlug: string, page = 1, limit = 12) {
  return apiRequest<Noticia[]>(`/public/paises/${paisSlug}/noticias?page=${page}&limit=${limit}`);
}
