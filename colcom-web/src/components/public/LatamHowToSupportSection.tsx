import React from 'react';
import { useCountry } from '../../hooks/useCountry';
import { navigate } from '../../routes/navigation';

export function LatamHowToSupportSection() {
  const { activeCountry } = useCountry();
  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';
  const secondaryColor = activeCountry?.colors?.[1] || '#00AEEF';

  return (
    <section className="py-24 px-4 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-wide mb-6">
            CÓMO APOYAR
            <div className="h-1 w-24 mx-auto mt-4 rounded-full" style={{ backgroundColor: primaryColor }} />
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Súmate a una red que transforma desde el propósito.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Bloque 1: Empresas Aliadas */}
          <div className="bg-white p-10 rounded-3xl shadow-xl flex flex-col items-start border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full opacity-50 pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl mb-8 flex items-center justify-center text-white shadow-md" style={{ backgroundColor: secondaryColor }}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Empresas Aliadas</h3>
            <p className="text-gray-600 mb-8 leading-relaxed flex-grow">
              Vincula tu compañía a nuestros programas e impulsa el bienestar de tus colaboradores.
            </p>
            <button 
              onClick={() => navigate('/contacto')}
              className="px-8 py-3 rounded-full text-white font-bold uppercase tracking-wider text-sm shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: secondaryColor }}
            >
              Más información
            </button>
          </div>

          {/* Bloque 2: Donaciones Individuales */}
          <div className="bg-white p-10 rounded-3xl shadow-xl flex flex-col items-start border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-100 to-transparent rounded-bl-full opacity-50 pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl mb-8 flex items-center justify-center text-white shadow-md" style={{ backgroundColor: primaryColor }}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Donaciones Individuales</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Tu aporte ayuda a más personas a recuperar su productividad y esperanza.
            </p>
            
            <div className="bg-gray-50 rounded-xl p-6 w-full mb-8 border border-gray-100 text-sm">
              <p className="mb-2"><span className="font-bold text-gray-900">Banco:</span> Bancolombia</p>
              <p className="mb-2"><span className="font-bold text-gray-900">Tipo:</span> Cuenta de ahorros</p>
              <p className="mb-2"><span className="font-bold text-gray-900">Número:</span> 084-000103-67</p>
              <p className="mb-2"><span className="font-bold text-gray-900">A nombre de:</span> Fundación Colombia Comparte</p>
              <p><span className="font-bold text-gray-900">NIT:</span> 901.213.196-8</p>
            </div>

            <div className="mt-auto w-full flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={() => window.open('https://checkout.wompi.co/l/VPOS_e7p1vX', '_blank')}
                className="w-full sm:w-auto px-8 py-3 rounded-full text-white font-bold uppercase tracking-wider text-sm shadow-md hover:shadow-lg transition-all"
                style={{ backgroundColor: primaryColor }}
              >
                Donar con tarjeta
              </button>
              <span className="text-xs text-gray-500 font-medium">También aceptamos tarjetas de crédito y débito.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
