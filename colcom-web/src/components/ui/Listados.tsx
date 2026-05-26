import type { Pagination } from '../../types';
import { Loader } from './Loader';

export function Listados<T extends { id: string }>({
  items,
  loading,
  error,
  pagination,
  page,
  setPage,
  renderItem,
}: {
  items: T[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  page: number;
  setPage: (page: number) => void;
  renderItem: (item: T) => React.ReactNode;
}) {
  if (loading) return <Loader />;
  if (error) return <div className="alert error">{error}</div>;
  return (
    <section className="list-shell">
      <div className="grid-list">{items.map(renderItem)}</div>
      <footer className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button>
        <span>Pagina {pagination?.page || page} de {pagination?.totalPages || 1}</span>
        <button disabled={!pagination || page >= pagination.totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
      </footer>
    </section>
  );
}
