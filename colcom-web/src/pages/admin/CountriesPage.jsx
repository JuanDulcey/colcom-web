import { useEffect, useState } from 'react';
import { paisesApi } from '../../api/paises.api.js';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/AsyncState.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { motion } from 'framer-motion';

export function CountriesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    paisesApi.all()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <p className="text-sm font-semibold text-[#7A0A83] tracking-wide uppercase mb-1">Portales</p>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Países Activos</h1>
        </div>
      </div>
      
      <ErrorState message={error} />
      
      {loading ? <LoadingState /> : items.length === 0 ? <EmptyState /> : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 font-semibold">
                  <th className="py-4 px-6 whitespace-nowrap">Nombre</th>
                  <th className="py-4 px-6 whitespace-nowrap">Código</th>
                  <th className="py-4 px-6 whitespace-nowrap">Slug</th>
                  <th className="py-4 px-6 whitespace-nowrap text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                          {/* Color block representing the country code/flag */}
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-500 uppercase">
                            {item.codigo}
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900 group-hover:text-[#7A0A83] transition-colors">{item.nombre}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-mono text-sm">{item.codigo}</td>
                    <td className="py-4 px-6 text-gray-600 font-mono text-sm">{item.slug}</td>
                    <td className="py-4 px-6 text-right"><StatusBadge value={item.estado} /></td>
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
