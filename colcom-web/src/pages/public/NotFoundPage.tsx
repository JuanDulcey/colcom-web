import React from 'react';
import errorVideo from '../../assets/imgs/error404.mp4';
import { navigate } from '../../routes/navigation';
import { useCountry } from '../../hooks/useCountry';

export function NotFoundPage() {
  const { activeCountry } = useCountry();
  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="relative w-full min-h-[70vh] rounded-3xl overflow-hidden bg-black flex flex-col items-center justify-center shadow-2xl border border-gray-800">
        {/* Background Video */}
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
          src={errorVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      
        {/* Dark overlay to ensure text is readable */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text Content */}
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
            404
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-200 mb-8">
            Página no encontrada
          </h2>

          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 rounded-full font-bold text-white transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-white/20 flex items-center gap-3 backdrop-blur-md border border-white/30"
            style={{ backgroundColor: `${primaryColor}CC` }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
