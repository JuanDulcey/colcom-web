import { apiRequest } from '../lib/api';
import type { Solicitud } from '../types';
import { useResourceList } from './useResourceList';

export function useSolicitudes(page = 1, limit = 12) {
  const list = useResourceList<Solicitud>('/solicitudes', page, limit);
  return {
    ...list,
    createPublic: (payload: Partial<Solicitud> & { pais_slug?: string }) => apiRequest<Solicitud>('/solicitudes/public', { method: 'POST', body: payload }),
    update: (id: string, payload: Partial<Solicitud>) => apiRequest<Solicitud>(`/solicitudes/${id}`, { method: 'PATCH', body: payload }),
    updateEstado: (id: string, estado: Solicitud['estado']) => apiRequest<Solicitud>(`/solicitudes/${id}/estado`, { method: 'PATCH', body: { estado } }),
    remove: (id: string) => apiRequest(`/solicitudes/${id}`, { method: 'DELETE' }),
  };
}
