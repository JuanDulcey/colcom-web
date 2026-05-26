import React from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { canManageCountries, canManageRequests } from '../utils/constants.js';
import { navigate } from '../routes/navigation.js';
import { useCountry } from '../hooks/useCountry.js';
import latLogo from '../assets/imgs/latComparte.png';

export function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const { activeCountry, countries, setCountryBySlug } = useCountry();

  const navItems = [
    ['Dashboard', '/admin/dashboard', true, (
      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )],
    ['News', '/admin/noticias', true, (
      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
      </svg>
    )],
    ['Testimonials', '/admin/testimonios', true, (
      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    )],
    ['Requests', '/admin/solicitudes', canManageRequests(user?.rol), (
      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )],
    ['Files', '/admin/archivos', true, (
      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    )],
    ['Users', '/admin/usuarios', canManageCountries(user?.rol), (
      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )],
    ['Settings', '/admin/auditoria', canManageRequests(user?.rol), (
      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      </svg>
    )],
  ].filter((item) => item[2]);

  const currentPath = window.location.pathname;

  return (
    <div className="flex h-screen bg-[#F8F9FE] overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#F8F9FE] border-r border-gray-200 flex flex-col pt-6 flex-shrink-0 z-20">
        <div className="px-6 mb-10 cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
          <img src={latLogo} alt="Logo" className="w-48 object-contain" />
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map(([label, path, visible, icon]) => {
            const isActive = currentPath.startsWith(path);
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-semibold ${
                  isActive 
                    ? 'bg-[#7A0A83] text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {icon}
                {label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-bold text-gray-800 text-lg">
              {user?.nombre} {user?.apellido}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-gray-500 font-medium text-sm">Country</span>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 shadow-sm">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-200 bg-gray-200">
                  {/* Just a color placeholder for flag, or use actual flag if available */}
                  <div className="w-full h-full" style={{ background: activeCountry?.colors?.[0] || '#ccc' }}></div>
                </div>
                <select 
                  className="bg-transparent font-semibold text-gray-800 focus:outline-none appearance-none pr-4 cursor-pointer"
                  value={activeCountry?.slug || ''}
                  onChange={(e) => setCountryBySlug(e.target.value)}
                  disabled={!canManageCountries(user?.rol)}
                >
                  <option value="latam">Latinoamérica</option>
                  {countries.filter(c => c.slug !== 'latam').map(c => (
                    <option key={c.slug} value={c.slug}>{c.nombre}</option>
                  ))}
                </select>
                <svg className="w-4 h-4 text-gray-500 -ml-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            <button onClick={logout} className="text-gray-400 hover:text-[#7A0A83] transition-colors" title="Cerrar Sesión">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        {/* Page Content Scrollable Area */}
        <main className="flex-1 overflow-auto bg-[#F8F9FE] p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
