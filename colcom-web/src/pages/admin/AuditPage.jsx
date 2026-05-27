import { useAuditoria } from '../../hooks/useAuditoria.ts';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/AsyncState.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { motion } from 'framer-motion';

export function AuditPage() {
  const audit = useAuditoria();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <p className="text-sm font-semibold text-[#7A0A83] tracking-wide uppercase mb-1">Readonly</p>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Registro de Auditoría</h1>
        </div>
      </div>
      
      <ErrorState message={audit.error} />
      
      {audit.loading ? <LoadingState /> : audit.items.length === 0 ? <EmptyState /> : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 font-semibold">
                  <th className="py-4 px-6 whitespace-nowrap">Módulo</th>
                  <th className="py-4 px-6 whitespace-nowrap">Acción</th>
                  <th className="py-4 px-6 whitespace-nowrap">Usuario ID</th>
                  <th className="py-4 px-6 whitespace-nowrap">Registro ID</th>
                  <th className="py-4 px-6 whitespace-nowrap">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {audit.items.map((item, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900 group-hover:text-[#7A0A83] transition-colors capitalize">{item.modulo}</p>
                    </td>
                    <td className="py-4 px-6"><StatusBadge value={item.accion} /></td>
                    <td className="py-4 px-6 text-gray-600 font-mono text-xs">{item.usuario_id}</td>
                    <td className="py-4 px-6 text-gray-600 font-mono text-xs">{item.registro_id}</td>
                    <td className="py-4 px-6 text-gray-500 text-sm">{formatDate(item.created_at)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
