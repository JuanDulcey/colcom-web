import React from 'react';
import { useCountry } from '../../hooks/useCountry';

interface CountryCTASectionProps {
  testimonios: any[];
}

const countryMission: Record<string, { title: string; body: string; cta: string }> = {
  colombia: {
    title: 'Nuestra misión en Colombia',
    body: 'En Colombia Comparte creemos que transformar personas es transformar empresas. Nuestra labor se sustenta en acompañar a quienes enfrentan la llamada "pobreza oculta" — personas y familias que, a pesar de su esfuerzo, viven quiebres en su estabilidad emocional, económica y profesional.',
    cta: 'Únete al movimiento'
  },
  argentina: {
    title: 'Nuestra misión en Argentina',
    body: 'Argentina Comparte acompaña a personas, familias y empresas en procesos de transformación humana y productiva. Creemos que el bienestar integral — personal, familiar y laboral — es el fundamento de una sociedad más próspera y consciente.',
    cta: 'Sé parte del cambio'
  },
  chile: {
    title: 'Nuestra misión en Chile',
    body: 'Chile Comparte trabaja para que cada persona, empresa y comunidad descubra su potencial de transformación. Desde el bienestar organizacional hasta el emprendimiento con propósito, acompañamos cada paso del camino.',
    cta: 'Conoce más'
  },
  ecuador: {
    title: 'Nuestra misión en Ecuador',
    body: 'Ecuador Comparte impulsa el desarrollo humano y productivo en todo el territorio, creyendo que cuando las personas tienen herramientas y acompañamiento, son capaces de transformar su realidad y la de su entorno.',
    cta: 'Únete hoy'
  },
};

const defaultMission = {
  title: 'Nuestra misión',
  body: 'Acompañamos a personas, familias y empresas en su proceso de transformación humana y productiva, creyendo en el poder del bienestar integral como base del desarrollo sostenible.',
  cta: 'Conoce más'
};

export function CountryMissionAndCTA({ testimonios }: CountryCTASectionProps) {
  const { activeCountry } = useCountry();
  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';
  const secondaryColor = activeCountry?.colors?.[1] || '#00AEEF';
  const accentColor = activeCountry?.colors?.[2] || '#E72B5A';
  const country = (activeCountry?.slug || '').toLowerCase();
  const mission = countryMission[country] || defaultMission;

  const displayTestimonios = testimonios.length > 0 ? testimonios.slice(0, 3) : [
    { id: 1, nombre: 'Ana García', empresa: 'Emprendedora', contenido: 'Esta organización cambió mi forma de ver los negocios. Hoy tengo una empresa rentable y un equipo comprometido.' },
    { id: 2, nombre: 'Carlos Mendoza', empresa: 'Director Empresarial', contenido: 'Implementamos su programa de bienestar y la productividad de nuestro equipo aumentó notablemente.' },
    { id: 3, nombre: 'Laura Torres', empresa: 'Lideresa Comunitaria', contenido: 'El acompañamiento que recibí me ayudó a reconstruir mi proyecto de vida después de una crisis muy difícil.' },
  ];

  return (
    <>
      {/* Mission Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual */}
            <div className="relative">
              <div
                className="absolute inset-0 rounded-3xl rotate-3 opacity-20"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              />
              <div
                className="relative rounded-3xl p-10 overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${primaryColor}08 0%, ${secondaryColor}12 100%)` }}
              >
                {/* Timeline */}
                <div className="space-y-6 relative">
                  <div className="absolute left-5 top-5 bottom-5 w-0.5" style={{ backgroundColor: `${primaryColor}30` }} />
                  {[
                    { year: '2014', text: 'Nace la organización en Colombia' },
                    { year: '2017', text: 'Expansión a otros países de Latinoamérica' },
                    { year: '2020', text: 'Más de 50,000 familias acompañadas' },
                    { year: 'Hoy', text: 'Una red que sigue creciendo' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-6 relative z-10">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                        style={{ backgroundColor: i === 3 ? accentColor : primaryColor }}
                      >
                        {i === 3 ? '★' : item.year.slice(-2)}
                      </div>
                      <div className="pt-2">
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>{item.year}</span>
                        <p className="text-gray-700 font-medium mt-0.5">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white mb-6"
                style={{ backgroundColor: accentColor }}
              >
                Nuestra misión
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight mb-2">
                {mission.title}
              </h2>
              <div className="h-1.5 w-20 rounded-full mb-8" style={{ background: `linear-gradient(90deg, ${accentColor}, ${primaryColor})` }} />
              <p className="text-gray-600 text-lg leading-relaxed mb-8">{mission.body}</p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: primaryColor }}>
                  Emprendimiento
                </span>
                <span className="px-4 py-2 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: secondaryColor }}>
                  Bienestar
                </span>
                <span className="px-4 py-2 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: accentColor }}>
                  Comunidad
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="py-24 px-4 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${primaryColor}08 0%, ${secondaryColor}10 100%)` }}
      >
        <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full blur-3xl opacity-[0.08]" style={{ backgroundColor: primaryColor }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white mb-5"
              style={{ backgroundColor: primaryColor }}
            >
              Testimonios
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight mb-4">
              Historias que inspiran
            </h2>
            <div className="h-1.5 w-24 mx-auto rounded-full" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayTestimonios.map((t: any, i) => (
              <div
                key={t.id || i}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="text-4xl font-serif mb-4" style={{ color: primaryColor }}>"</div>
                <p className="text-gray-700 leading-relaxed flex-grow italic mb-6">
                  {t.contenido || 'Una historia de transformación y crecimiento.'}
                </p>
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm"
                    style={{ backgroundColor: i === 1 ? secondaryColor : primaryColor }}
                  >
                    {(t.nombre || 'A').charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.nombre || 'Testimoniante'}</p>
                    <p className="text-gray-500 text-xs">{t.empresa || t.cargo || 'Beneficiario'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 px-4 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply opacity-30 blur-3xl"
          style={{ backgroundColor: accentColor }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
            {mission.cta}
          </h2>
          <p className="text-white/85 text-lg mb-10 max-w-2xl mx-auto">
            Juntos podemos construir una {activeCountry?.country || 'comunidad'} más humana, productiva y consciente.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/contacto"
              className="px-10 py-4 bg-white font-black uppercase tracking-wider rounded-full text-sm shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
              style={{ color: primaryColor }}
            >
              Contáctanos
            </a>
            <a
              href="/testimonios"
              className="px-10 py-4 bg-white/15 text-white font-black uppercase tracking-wider rounded-full text-sm border-2 border-white/40 hover:bg-white/25 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
            >
              Ver historias
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
