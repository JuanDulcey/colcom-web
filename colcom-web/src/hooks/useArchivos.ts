import { apiRequest } from '../lib/api';
import type { Archivo } from '../types';
import { useResourceList } from './useResourceList';

export function useArchivos(page = 1, limit = 12) {
  const list = useResourceList<Archivo>('/archivos', page, limit);
  return {
    ...list,
    create: (payload: Partial<Archivo>) => apiRequest<Archivo>('/archivos', { method: 'POST', body: payload }),
    upload: (file: File, meta: Partial<Archivo>) => {
      const form = new FormData();
      form.append('file', file);
      form.append('nombre_archivo', meta.nombre_archivo || file.name);
      if (meta.modulo) form.append('modulo', meta.modulo);
      if (meta.referencia_id) form.append('referencia_id', meta.referencia_id);
      return apiRequest<Archivo>('/archivos/upload', { method: 'POST', body: form });
    },
    update: (id: string, payload: Partial<Archivo>) => apiRequest<Archivo>(`/archivos/${id}`, { method: 'PATCH', body: payload }),
    remove: (id: string) => apiRequest(`/archivos/${id}`, { method: 'DELETE' }),
  };
}
