import React from 'react';
import { useCountry } from '../../hooks/useCountry';
import { navigate } from '../../routes/navigation';

export function MissionSection() {
  const { activeCountry } = useCountry();
  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';

  const cards = [
    {
      title: 'Programa de vida saludable en emprendimiento',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'Equipo de coaching y fortalecimiento empresarial',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Apoyo espiritual y bienestar integral',
      gradient: 'from-orange-400 to-red-500'
    }
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Content */}
        <div className="lg:col-span-4 flex flex-col items-start">
          <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-wide mb-6">
            Nuestra misión en acción
            <div className="h-1 w-16 mt-4 rounded-full" style={{ backgroundColor: primaryColor }} />
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            En Colombia Comparte, nuestra labor se sustenta en tres pilares fundamentales que hacen posible la transformación de vidas y empresas.
          </p>
          <button 
            onClick={() => navigate('/testimonios')}
            className="px-8 py-3 rounded-full text-white font-bold uppercase tracking-wider text-sm hover:opacity-90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
            style={{ backgroundColor: primaryColor }}
          >
            Conócenos
          </button>
        </div>

        {/* Right Content - Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div key={index} className="group cursor-pointer relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Background Placeholder Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Overlay for contrast */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-white font-bold text-xl leading-snug drop-shadow-md">
                  {card.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
