import React from 'react';
import { useCountry } from '../../hooks/useCountry';

export function LatamPartnersSection() {
  const { activeCountry } = useCountry();
  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';

  const partners = [
    'Alpina S.A.', 'AMCOR', 'Boehringer Ingelheim', 'Brinks', 
    'Cencosud', 'Grupo Éxito', 'Grupo Nutresa', 'Homecenter Sodimac', 
    'JM Tracking', 'SoEnergy', 'Olimpia IT', 'Sanfer'
  ];

  return (
    <section className="py-24 px-4 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900 uppercase tracking-wide">
          EMPRESAS QUE COMPARTEN
          <div className="h-1 w-24 mx-auto mt-4 rounded-full" style={{ backgroundColor: primaryColor }} />
        </h2>
        
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16 text-lg">
          Las empresas que creen en el bienestar y la productividad con propósito hacen parte de esta red. Gracias a ellas, más familias en Latinoamérica vuelven a creer, crear y prosperar.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
          {partners.map((partner, index) => (
            <div key={index} className="flex items-center justify-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <span className="font-bold text-gray-400 text-center text-sm md:text-base uppercase tracking-wider">
                {partner}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
