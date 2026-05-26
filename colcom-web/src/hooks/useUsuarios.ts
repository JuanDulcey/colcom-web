import { apiRequest } from '../lib/api';
import type { User } from '../types';
import { useResourceList } from './useResourceList';

export function useUsuarios(page = 1, limit = 12) {
  const list = useResourceList<User>('/users', page, limit);
  return {
    ...list,
    create: (payload: Partial<User> & { password?: string }) => apiRequest<User>('/users', { method: 'POST', body: payload }),
    update: (id: string, payload: Partial<User>) => apiRequest<User>(`/users/${id}`, { method: 'PATCH', body: payload }),
    resetPassword: (id: string, password: string) => apiRequest(`/users/${id}/password`, { method: 'PATCH', body: { password } }),
    remove: (id: string) => apiRequest(`/users/${id}`, { method: 'DELETE' }),
  };
}
