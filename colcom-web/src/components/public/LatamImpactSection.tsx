import React from 'react';
import { useCountry } from '../../hooks/useCountry';

export function LatamImpactSection() {
  const { activeCountry } = useCountry();
  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';
  const metrics = activeCountry?.metrics || { people: '20,000+', companies: '120+', projects: '40+', years: '10+' };

  return (
    <section className="py-24 px-4 bg-gray-900 relative overflow-hidden">
      {/* Decorative gradient */}
      <div 
        className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${primaryColor}, transparent 50%)`
        }}
      />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white uppercase tracking-wide mb-6">
            NUESTRO IMPACTO
            <div className="h-1 w-24 mx-auto mt-4 rounded-full" style={{ backgroundColor: primaryColor }} />
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Una red que crece desde Colombia para inspirar procesos de transformación humana, social y empresarial en Latinoamérica.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-white">
          {/* Item 1 */}
          <div className="flex flex-col items-center gap-4 justify-center text-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 text-white">
              <h4 className="text-2xl font-bold">{metrics.years || '10+'}</h4>
            </div>
            <p className="text-sm uppercase tracking-wider opacity-90 max-w-[140px] leading-tight">Años de impacto social y empresarial</p>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col items-center gap-4 justify-center text-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 text-white">
              <h4 className="text-2xl font-bold">{metrics.people || '1200+'}</h4>
            </div>
            <p className="text-sm uppercase tracking-wider opacity-90 max-w-[140px] leading-tight">Familias transformadas</p>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col items-center gap-4 justify-center text-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 text-white">
              <h4 className="text-2xl font-bold">{metrics.projects || '65+'}</h4>
            </div>
            <p className="text-sm uppercase tracking-wider opacity-90 max-w-[140px] leading-tight">Emprendimientos creados</p>
          </div>

          {/* Item 4 */}
          <div className="flex flex-col items-center gap-4 justify-center text-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 text-white">
              <h4 className="text-2xl font-bold">{metrics.companies || '70+'}</h4>
            </div>
            <p className="text-sm uppercase tracking-wider opacity-90 max-w-[140px] leading-tight">Empresas aliadas</p>
          </div>
        </div>
      </div>
    </section>
  );
}
