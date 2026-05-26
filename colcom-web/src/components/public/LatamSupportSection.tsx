import React from 'react';

export function LatamSupportSection() {
  const cards = [
    {
      title: 'Personas y familias en reconstrucción productiva',
      text: 'Acompañamos a personas y familias que atraviesan momentos de pérdida, desempleo, quiebre económico o necesidad de reorganizar su proyecto de vida. Nuestro propósito es ayudarles a recuperar confianza, productividad y esperanza.',
      color: 'bg-purple-600',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: 'Emprendedores que quieren crecer',
      text: 'Fortalecemos iniciativas productivas, talentos y negocios en etapa de crecimiento mediante formación, acompañamiento, mentoría y herramientas para construir emprendimientos sostenibles.',
      color: 'bg-pink-500',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: 'Empresas y aliados con propósito',
      text: 'Vinculamos empresas que creen en el bienestar, la productividad humana y la cultura organizacional como motores de transformación social y empresarial en Latinoamérica.',
      color: 'bg-orange-500',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-24 px-4 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900 uppercase tracking-wide">
          A QUIÉNES APOYAMOS
          <div className="h-1 w-24 mx-auto mt-4 rounded-full bg-purple-600" />
        </h2>
        
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16 text-lg">
          En Latinoamérica Comparte impulsamos el progreso humano y productivo en la región, acompañando a personas, familias, emprendedores, empresas y comunidades que creen en una transformación con propósito.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <div key={index} className="flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
              <div className={`${card.color} p-6 flex items-center justify-center`}>
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  {card.icon}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-4 min-h-[56px]">{card.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-grow mb-6">
                  {card.text}
                </p>
                <div className="mt-auto flex justify-start">
                  <button className={`w-10 h-10 rounded-full ${card.color} flex items-center justify-center hover:opacity-90 transition-opacity text-white`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
