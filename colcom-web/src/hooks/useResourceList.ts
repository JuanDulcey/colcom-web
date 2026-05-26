import { useCallback, useEffect, useState } from 'react';
import { listResource } from '../lib/api';
import type { ListState, Pagination } from '../types';

export function useResourceList<T>(path: string, initialPage = 1, limit = 12): ListState<T> {
  const [items, setItems] = useState<T[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listResource<T>(path, page, limit);
      setItems(res.items);
      setPagination(res.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de carga');
    } finally {
      setLoading(false);
    }
  }, [path, page, limit]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { items, pagination, loading, error, page, setPage, refresh };
}
