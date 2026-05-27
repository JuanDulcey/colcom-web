import React from 'react';
import { useCountry } from '../../hooks/useCountry';
import { navigate } from '../../routes/navigation';

import imgCarolina from '../../assets/imgs/team_carolina_1779904009902.png';
import imgMarcela from '../../assets/imgs/team_marcela_1779904024727.png';
import imgEduardo from '../../assets/imgs/team_eduardo_1779904037978.png';
import imgAngie from '../../assets/imgs/team_angie_1779904052228.png';
import imgMariana from '../../assets/imgs/team_mariana_1779904067709.png';
import imgNancy from '../../assets/imgs/team_nancy_1779904082426.png';

export function LatamTeamSection() {
  const { activeCountry } = useCountry();
  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';

  const team = [
    { name: 'Carolina Ruiz', role: 'Cofundadora y CEO para Latinoamérica Comparte', image: imgCarolina },
    { name: 'Marcela Moreno', role: 'Directora de Relacionamiento para Colombia y Latinoamérica', image: imgMarcela },
    { name: 'Eduardo Del Castillo', role: 'Cofundador y Vicepresidente comercial para Latinoamérica Comparte', image: imgEduardo },
    { name: 'Angie Castañeda', role: 'Coordinadora Académica programa de Emprendimiento Edifica', image: imgAngie },
    { name: 'Mariana Gómez', role: 'Directora de Mercadeo', image: imgMariana },
    { name: 'Nancy Vivas', role: 'Directora de comunicación y estrategia digital', image: imgNancy }
  ];

  return (
    <section className="py-24 px-4 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900 uppercase tracking-wide">
          NUESTRO EQUIPO
          <div className="h-1 w-24 mx-auto mt-4 rounded-full" style={{ backgroundColor: primaryColor }} />
        </h2>
        
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16 text-lg">
          El corazón de Latinoamérica Comparte está en las personas que día a día trabajan por transformar vidas.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {team.map((member, index) => (
            <div key={index} className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-32 h-32 rounded-full mb-6 bg-gray-200 border-4 border-gray-50 shadow-inner flex items-center justify-center text-gray-400 overflow-hidden">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{member.name}</h3>
              <p className="text-sm text-gray-500 text-center uppercase tracking-wider font-medium">{member.role}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button 
            onClick={() => navigate('/nosotros')}
            className="px-8 py-3 rounded-full text-white font-bold uppercase tracking-wider text-sm shadow-md hover:shadow-lg transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            Conoce a nuestro equipo
          </button>
        </div>
      </div>
    </section>
  );
}
