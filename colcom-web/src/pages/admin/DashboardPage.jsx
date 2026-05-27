import React, { useEffect, useState } from 'react';
import { noticiasApi } from '../../api/noticias.api.js';
import { testimoniosApi } from '../../api/testimonios.api.js';
import { solicitudesApi } from '../../api/solicitudes.api.js';
import { useAuth } from '../../hooks/useAuth.js';
import { canManageRequests } from '../../utils/constants.js';
import { useCountry } from '../../hooks/useCountry.js';
import { Chatbot } from '../../components/admin/Chatbot.tsx';
import { motion } from 'framer-motion';

export function DashboardPage() {
  const { user } = useAuth();
  const { activeCountry } = useCountry();
  const [data, setData] = useState({ news: [], requests: [], recentActivity: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    Promise.all([
      noticiasApi.getAll(),
      canManageRequests(user?.rol) ? solicitudesApi.getAll() : Promise.resolve({ data: [] }),
      testimoniosApi.getAll()
    ])
      .then(([news, requests, testimonials]) => {
        const newsData = news.data || [];
        const reqData = requests.data || [];
        const testData = testimonials.data || [];
        
        // Generate some fake recent activity based on the data
        const activity = [
          ...newsData.slice(0, 2).map((n) => ({
            id: `n-${n.id}`, text: `New article "${n.titulo}" published`, time: '10:02 AM'
          })),
          ...testData.slice(0, 1).map((t) => ({
            id: `t-${t.id}`, text: `Testimonial by "${t.autor}" approved`, time: '11:01 AM'
          })),
          ...reqData.slice(0, 1).map((r) => ({
            id: `r-${r.id}`, text: `User request from "${r.pais}" pending review`, time: '11:55 AM'
          }))
        ];

        setData({
          news: newsData,
          requests: reqData,
          recentActivity: activity.length ? activity : [
            { id: 1, text: 'New article "Iniciativas Comunitarias" published', time: '10:02 AM' },
            { id: 2, text: 'Testimonial by "Jenny Muñoz" approved', time: '11:01 AM' },
            { id: 3, text: 'User request from "Chile" pending review', time: '11:55 AM' },
          ],
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [activeCountry, user?.rol]);

  if (loading) {
    return <div className="w-full h-full flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A0A83]"></div></div>;
  }

  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Overview <span style={{ color: primaryColor }}>{activeCountry?.slug !== 'latam' ? activeCountry?.nombre : 'General'}</span>
          </h1>
          <p className="text-gray-500 mt-1">Monitorea el estado y progreso de la plataforma.</p>
        </div>
        <button 
          className="px-6 py-2.5 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 hover:-translate-y-1"
          style={{ backgroundColor: primaryColor, boxShadow: `0 10px 15px -3px ${primaryColor}40` }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Artículo
        </button>
      </motion.div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* News Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-7 border border-gray-100 shadow-lg shadow-gray-200/40 hover:shadow-xl hover:-translate-y-1 transition-all cursor-default group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-bold mb-1 uppercase tracking-wider text-xs group-hover:text-gray-700 transition-colors">Noticias Publicadas</p>
              <h2 className="text-6xl font-black tracking-tighter" style={{ color: primaryColor }}>
                {data.news.length > 0 ? data.news.length.toLocaleString() : '0'}
              </h2>
            </div>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-inner" style={{ backgroundColor: `${primaryColor}15` }}>
              <svg className="w-10 h-10" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Requests Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-7 border border-gray-100 shadow-lg shadow-gray-200/40 hover:shadow-xl hover:-translate-y-1 transition-all cursor-default group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-bold mb-1 uppercase tracking-wider text-xs group-hover:text-gray-700 transition-colors">Solicitudes Pendientes</p>
              <h2 className="text-6xl font-black tracking-tighter text-amber-500">
                {data.requests.length > 0 ? data.requests.length.toLocaleString() : '0'}
              </h2>
            </div>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-amber-50 transform group-hover:scale-110 transition-transform shadow-inner">
              <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Activity Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-200/40"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#7A0A83] to-[#431459] shadow-inner text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Registro de Actividad
            </h3>
            <p className="text-gray-500 mt-2 font-medium">Últimos movimientos registrados en la plataforma.</p>
          </div>
          <button className="text-sm font-bold text-[#7A0A83] bg-[#7A0A83]/10 px-5 py-2.5 rounded-xl hover:bg-[#7A0A83]/20 transition-colors">
            Ver todo el historial
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actividad</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Categoría</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.recentActivity.map((act, i) => {
                const isNews = act.text.toLowerCase().includes('article') || act.text.toLowerCase().includes('noticia');
                const isReq = act.text.toLowerCase().includes('request') || act.text.toLowerCase().includes('solicitud');
                
                return (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    key={act.id || i} 
                    className="hover:bg-[#F8F9FE] transition-colors group cursor-default"
                  >
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${isNews ? 'bg-[#7A0A83]' : isReq ? 'bg-amber-400' : 'bg-blue-500'}`}></div>
                        <span className="text-gray-800 font-semibold group-hover:text-[#7A0A83] transition-colors">{act.text}</span>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        isNews ? 'bg-purple-50 text-purple-700' : 
                        isReq ? 'bg-amber-50 text-amber-700' : 
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {isNews ? 'Noticias' : isReq ? 'Solicitudes' : 'Testimonios'}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-right">
                      <span className="text-gray-500 text-sm font-semibold font-mono bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 group-hover:border-gray-200 transition-colors">
                        {act.time}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {data.recentActivity.length === 0 && (
            <div className="text-center py-12 text-gray-500 font-medium">No hay actividad reciente.</div>
          )}
        </div>
      </motion.div>

    </div>
  );
}

export default DashboardPage;
