import type { Auditoria } from '../types';
import { useResourceList } from './useResourceList';

export function useAuditoria(page = 1, limit = 12) {
  return useResourceList<Auditoria>('/auditoria', page, limit);
}
