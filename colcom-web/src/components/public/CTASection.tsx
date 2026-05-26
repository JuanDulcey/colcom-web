import React from 'react';
import { useCountry } from '../../hooks/useCountry';
import { navigate } from '../../routes/navigation';

export function CTASection() {
  const { activeCountry, activeSlug } = useCountry();
  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';
  const secondaryColor = activeCountry?.colors?.[1] || '#4A90E2';
  const countryName = activeCountry?.nombre || 'Latinoamérica';

  return (
    <section 
      className="relative py-20 px-4 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 drop-shadow-md leading-tight">
          Conoce a los emprendedores de {countryName} Comparte
        </h2>
        <button 
          onClick={() => navigate('/directorio')}
          className="bg-white text-gray-900 font-bold uppercase tracking-wider px-8 py-4 rounded-full shadow-xl hover:bg-gray-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          style={{ color: primaryColor }}
        >
          Directorio de Emprendedores
        </button>
      </div>
    </section>
  );
}
