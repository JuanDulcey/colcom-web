import React from 'react';
import { useCountry } from '../../hooks/useCountry';
import { navigate } from '../../routes/navigation';

export function LatamMissionSection() {
  const { activeCountry } = useCountry();
  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';

  const cards = [
    {
      title: 'Emprendimiento con propósito',
      text: 'Procesos de formación y acompañamiento para que más personas conviertan sus habilidades en oportunidades sostenibles.',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'Bienestar y cultura organizacional',
      text: 'Programas para empresas que buscan fortalecer equipos, liderazgo humano y entornos laborales más conscientes.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Red regional de transformación',
      text: 'Una comunidad latinoamericana que conecta personas, empresas, mentores y aliados alrededor de un propósito común.',
      gradient: 'from-blue-400 to-blue-600'
    }
  ];

  return (
    <section className="py-24 px-4 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Content */}
        <div className="lg:col-span-4 flex flex-col items-start">
          <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-wide mb-6">
            Nuestra misión en acción
            <div className="h-1 w-16 mt-4 rounded-full" style={{ backgroundColor: primaryColor }} />
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Nuestra labor se sustenta en programas, alianzas y procesos de acompañamiento que conectan propósito, bienestar, emprendimiento y productividad humana.
          </p>
          <button 
            onClick={() => navigate('/nosotros')}
            className="px-8 py-3 rounded-full text-white font-bold uppercase tracking-wider text-sm hover:opacity-90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
            style={{ backgroundColor: primaryColor }}
          >
            Conócenos
          </button>
        </div>

        {/* Right Content - Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div key={index} className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Background Placeholder Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-90 transition-opacity duration-300`} />
              
              {/* Overlay for contrast */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-white font-bold text-xl leading-snug mb-2 drop-shadow-md">
                  {card.title}
                </h3>
                <p className="text-white/90 text-sm drop-shadow-sm leading-relaxed">
                  {card.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
