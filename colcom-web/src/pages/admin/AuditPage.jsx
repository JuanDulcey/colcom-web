import { useAuditoria } from '../../hooks/useAuditoria.ts';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/AsyncState.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { formatDate } from '../../utils/formatDate.js';

export function AuditPage() {
  const audit = useAuditoria();

  return (
    <main className="admin-content">
      <div className="admin-heading">
        <div><p className="eyebrow">Readonly</p><h1>Auditoria</h1></div>
      </div>
      <ErrorState message={audit.error} />
      {audit.loading ? <LoadingState /> : audit.items.length === 0 ? <EmptyState /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Modulo</th><th>Accion</th><th>Usuario</th><th>Registro</th><th>Fecha</th></tr></thead>
            <tbody>
              {audit.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.modulo}</td>
                  <td><StatusBadge value={item.accion} /></td>
                  <td>{item.usuario_id}</td>
                  <td>{item.registro_id}</td>
                  <td>{formatDate(item.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
