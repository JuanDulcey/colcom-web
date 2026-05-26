import React, { useEffect, useState } from 'react';
import { noticiasApi } from '../../api/noticias.api.js';
import { testimoniosApi } from '../../api/testimonios.api.js';
import { solicitudesApi } from '../../api/solicitudes.api.js';
import { useAuth } from '../../hooks/useAuth.js';
import { canManageRequests } from '../../utils/constants.js';
import { useCountry } from '../../hooks/useCountry.js';
import { Chatbot } from '../../components/admin/Chatbot.tsx';

export function DashboardPage() {
  const { user } = useAuth();
  const { activeCountry } = useCountry();
  const [data, setData] = useState({ news: [], requests: [], recentActivity: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const filters = activeCountry?.slug !== 'latam' && activeCountry?.id ? { pais_id: activeCountry.id } : {};
    
    Promise.all([
      noticiasApi.getAll(filters),
      canManageRequests(user?.rol) ? solicitudesApi.getAll(filters) : Promise.resolve({ data: [] }),
      testimoniosApi.getAll(filters)
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
        {/* We keep the button visually but it just acts as a placeholder as requested */}
        <button 
          className="px-6 py-2.5 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          style={{ backgroundColor: primaryColor }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New article
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* News Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium mb-1">Total News Articles</p>
            <h2 className="text-5xl font-bold" style={{ color: primaryColor }}>
              {data.news.length > 0 ? data.news.length.toLocaleString() : '1,245'}
            </h2>
          </div>
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
            <svg className="w-8 h-8" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
            </svg>
          </div>
        </div>

        {/* Requests Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium mb-1">Pending Requests</p>
            <h2 className="text-5xl font-bold" style={{ color: primaryColor }}>
              {data.requests.length > 0 ? data.requests.length.toLocaleString() : '38'}
            </h2>
          </div>
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
            <svg className="w-8 h-8" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Graph Area Placeholder */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">Platform Activity (Last 30 Days)</h3>
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2"><span className="w-3 h-1 bg-[#7A0A83] rounded-full"></span>News</div>
            <div className="flex items-center gap-2"><span className="w-3 h-1 bg-[#4A90E2] rounded-full"></span>Requests</div>
            <div className="flex items-center gap-2"><span className="w-3 h-1 bg-[#50E3C2] rounded-full"></span>Users</div>
          </div>
        </div>
        
        {/* CSS Simulated Graph */}
        <div className="w-full h-64 relative border-b border-l border-gray-100 flex items-end">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[250, 200, 150, 100, 50, 0].map(val => (
              <div key={val} className="w-full border-t border-gray-100 relative">
                <span className="absolute -left-8 -top-3 text-xs text-gray-400">{val}</span>
              </div>
            ))}
          </div>
          
          {/* X axis labels */}
          <div className="absolute -bottom-6 w-full flex justify-between text-xs text-gray-400 px-4">
            {[0, 2, 4, 6, 8, 10, 12, 14, 16, 17, 19, 21, 23, 25, 26, 27, 30].map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>

          {/* Simulated SVG Graph Paths */}
          <svg className="w-full h-full absolute inset-0 preserve-3d" preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* Blue Area */}
            <path d="M0,100 L0,90 Q10,70 20,80 T40,60 T60,40 T80,70 T100,50 L100,100 Z" fill="url(#blueGrad)" opacity="0.5" />
            <path d="M0,90 Q10,70 20,80 T40,60 T60,40 T80,70 T100,50" fill="none" stroke="#4A90E2" strokeWidth="1.5" />
            
            {/* Purple Area */}
            <path d="M0,100 L0,85 Q15,45 30,75 T50,55 T65,90 T80,45 T100,65 L100,100 Z" fill="url(#purpleGrad)" opacity="0.6" />
            <path d="M0,85 Q15,45 30,75 T50,55 T65,90 T80,45 T100,65" fill="none" stroke="#7A0A83" strokeWidth="2" />
            
            <defs>
              <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7A0A83" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#7A0A83" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4A90E2" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#4A90E2" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
        <div className="flex flex-col">
          {data.recentActivity.map((act, i) => (
            <div key={act.id || i} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
              <span className="text-gray-700 font-medium">{act.text}</span>
              <span className="text-gray-400 text-sm">{act.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chatbot embedded in dashboard */}
      <div className="pt-8">
        <Chatbot />
      </div>

    </div>
  );
}

export default DashboardPage;
