import React from 'react';
import { useCountry } from '../../hooks/useCountry';

export function LatamAboutSection() {
  const { activeCountry } = useCountry();
  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-gray-50 border-b border-gray-100">
      {/* Decorative Circle */}
      <div 
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div className="flex flex-col items-start relative z-10">
          <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-wide mb-8">
            QUIÉNES SOMOS
            <div className="h-1 w-16 mt-4 rounded-full" style={{ backgroundColor: primaryColor }} />
          </h2>
          
          <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
            <p className="font-semibold text-xl text-gray-900">
              En Latinoamérica Comparte creemos que transformar personas es transformar empresas.
            </p>
            <p>
              Nacimos de una historia real de pérdida, fe y propósito.
            </p>
            <p>
              Lo que comenzó en Colombia como un movimiento para ayudar a familias a reconstruir su productividad, hoy se ha convertido en una red continental que promueve el bienestar, la cultura organizacional y el emprendimiento con propósito.
            </p>
            <p>
              En cada país acompañamos a personas, familias y empresas a reencontrar su propósito productivo y a construir un futuro sostenible.
            </p>
          </div>
        </div>

        {/* Highlight Phrase / Visual Element */}
        <div className="relative flex justify-center items-center p-12 bg-gray-50 rounded-3xl border border-gray-100 shadow-xl relative z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-3xl" />
          <h3 className="text-3xl md:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 leading-tight">
            "Porque cuando un país comparte, <br/>
            <span style={{ color: primaryColor }} className="text-transparent bg-none">Latinoamérica avanza."</span>
          </h3>
        </div>
      </div>
    </section>
  );
}
