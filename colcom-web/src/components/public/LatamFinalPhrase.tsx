import React from 'react';
import { useCountry } from '../../hooks/useCountry';

export function LatamFinalPhrase() {
  const { activeCountry } = useCountry();
  const colors = activeCountry?.colors || ['#7A0A83', '#00AEEF', '#F26522', '#E72B5A'];

  return (
    <section className="relative py-24 px-4 overflow-hidden flex items-center justify-center">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 opacity-90"
        style={{
          background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1] || colors[0]} 33%, ${colors[2] || colors[1]} 66%, ${colors[3] || colors[2]} 100%)`
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-wider leading-tight drop-shadow-xl">
          “Cuando un país comparte,<br className="hidden md:block"/> Latinoamérica avanza.”
        </h2>
      </div>
    </section>
  );
}
