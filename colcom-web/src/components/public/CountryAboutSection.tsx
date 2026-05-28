import React, { useEffect, useRef, useState } from 'react';
import { useCountry } from '../../hooks/useCountry';

function AnimatedCounter({ endValueString }: { endValueString: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const cleanNumber = endValueString.replace(/[^\d]/g, '');
  const endNum = cleanNumber ? Number(cleanNumber) : 0;
  const suffix = endValueString.replace(/[\d.,\s]/g, '');

  useEffect(() => {
    if (!elementRef.current || hasAnimated || endNum === 0) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setHasAnimated(true);
      const duration = 1800;
      const startTime = performance.now();
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(eased * endNum));
        if (progress < 1) requestAnimationFrame(animate);
        else setCount(endNum);
      };
      requestAnimationFrame(animate);
    }, { threshold: 0.25 });
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [endNum, hasAnimated]);

  if (endNum === 0) return <span>{endValueString}</span>;
  return <span ref={elementRef}>{count.toLocaleString('es-CO')}{suffix}</span>;
}

const countryContent: Record<string, {
  quote: string;
  description: string[];
  pillars: { icon: string; title: string; text: string }[];
}> = {
  colombia: {
    quote: 'Porque cuando Colombia comparte, el futuro se construye entre todos.',
    description: [
      'Colombia Comparte nació de una historia real de pérdida, fe y reconstrucción.',
      'Sus cofundadores Carolina Ruiz y Eduardo Del Castillo vivieron en carne propia lo que significa perderlo todo y aún así levantarse.',
      'Hoy somos una organización social autosostenible que acompaña a personas, familias y empresas a reencontrar su propósito productivo.'
    ],
    pillars: [
      { icon: '🌱', title: 'Emprendimiento con Propósito', text: 'Programas de triple impacto que promueven un desarrollo responsable, consciente y perdurable.' },
      { icon: '🏘️', title: 'Desarrollo Comunitario', text: 'Proyectos sociales enfocados en comunidades vulnerables para mejorar su calidad de vida.' },
      { icon: '📚', title: 'Educación y Capacitación', text: 'Formación en herramientas de negocios y habilidades tecnológicas para el crecimiento profesional.' },
    ]
  },
  argentina: {
    quote: 'Una red que crece para que Argentina comparta sus oportunidades.',
    description: [
      'Argentina Comparte es parte de la red LatinoaméricaComparte, que promueve el bienestar y el emprendimiento consciente.',
      'Creemos que cuando una persona se transforma, su familia cambia. Y cuando las familias están bien, las empresas prosperan.',
      'Acompañamos a personas, emprendedores y empresas argentinas en su camino hacia una vida más plena y productiva.'
    ],
    pillars: [
      { icon: '💡', title: 'Innovación Social', text: 'Impulsamos ideas que generan impacto real en comunidades y organizaciones de todo el país.' },
      { icon: '🤝', title: 'Redes de Colaboración', text: 'Construimos puentes entre personas, empresas y comunidades que quieren crecer juntas.' },
      { icon: '🎯', title: 'Liderazgo Humano', text: 'Desarrollamos líderes conscientes que transforman sus entornos desde adentro hacia afuera.' },
    ]
  },
  chile: {
    quote: 'Chile Comparte: impacto que cruza fronteras y transforma realidades.',
    description: [
      'Chile Comparte impulsa el bienestar integral dentro y fuera de la empresa, conectando personas con propósito.',
      'Somos parte de una red continental que entiende que el desarrollo humano es la base de cualquier crecimiento sostenible.',
      'Acompañamos a emprendedores, familias y organizaciones chilenas en su camino hacia una vida más productiva y consciente.'
    ],
    pillars: [
      { icon: '⚡', title: 'Transformación Personal', text: 'Programas que ayudan a cada persona a descubrir su potencial y reconstruir su proyecto de vida.' },
      { icon: '🏢', title: 'Bienestar Empresarial', text: 'Acompañamos a organizaciones en la construcción de culturas más humanas y productivas.' },
      { icon: '🌿', title: 'Sostenibilidad Social', text: 'Proyectos de impacto duradero que benefician a comunidades y generaciones futuras.' },
    ]
  },
  ecuador: {
    quote: 'Ecuador Comparte: comunidades que se conectan para avanzar juntas.',
    description: [
      'Ecuador Comparte promueve el emprendimiento consciente y el bienestar integral en todo el territorio ecuatoriano.',
      'Trabajamos con personas, familias y empresas que quieren generar un impacto positivo en su entorno y en la sociedad.',
      'Somos parte de una red latinoamericana que cree que compartir conocimiento y oportunidades transforma vidas.'
    ],
    pillars: [
      { icon: '🌄', title: 'Emprendimiento Regional', text: 'Apoyamos iniciativas productivas en todo Ecuador, desde las ciudades hasta las comunidades rurales.' },
      { icon: '👨‍👩‍👧', title: 'Familia y Comunidad', text: 'Fortalecemos los vínculos familiares y comunitarios como base del desarrollo sostenible.' },
      { icon: '🔗', title: 'Alianzas Estratégicas', text: 'Conectamos empresas comprometidas con emprendedores y comunidades que necesitan apoyo.' },
    ]
  },
};

const defaultContent = {
  quote: 'Cuando compartimos, crecemos juntos.',
  description: ['Somos parte de la red LatinoaméricaComparte.', 'Acompañamos personas y empresas en su camino de transformación.'],
  pillars: [
    { icon: '🌱', title: 'Emprendimiento', text: 'Impulsamos iniciativas con propósito.' },
    { icon: '🤝', title: 'Comunidad', text: 'Construimos redes de apoyo.' },
    { icon: '📚', title: 'Formación', text: 'Desarrollamos talento humano.' },
  ]
};

export function CountryAboutSection() {
  const { activeCountry } = useCountry();
  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';
  const secondaryColor = activeCountry?.colors?.[1] || '#00AEEF';
  const country = (activeCountry?.slug || '').toLowerCase();
  const content = countryContent[country] || defaultContent;
  const metrics = activeCountry?.metrics || { people: '20,000+', companies: '120+', projects: '40+' };

  const metricItems = [
    { value: metrics.people, label: 'Personas transformadas' },
    { value: metrics.companies, label: 'Empresas aliadas' },
    { value: metrics.projects, label: 'Proyectos activos' },
  ];

  return (
    <>
      {/* About / Who We Are */}
      <section className="py-24 px-4 relative overflow-hidden bg-gray-50" id="somos">
        <div
          className="absolute -top-48 -right-48 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.12] pointer-events-none"
          style={{ backgroundColor: primaryColor }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-[0.10] pointer-events-none"
          style={{ backgroundColor: secondaryColor }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Text */}
            <div>
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white mb-6"
                style={{ backgroundColor: primaryColor }}
              >
                Quiénes somos
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight mb-2">
                Nuestra historia
              </h2>
              <div className="h-1.5 w-20 rounded-full mb-8" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }} />
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                {content.description.map((p, i) => (
                  <p key={i} className={i === 0 ? 'font-semibold text-gray-900 text-xl' : ''}>{p}</p>
                ))}
              </div>
            </div>

            {/* Quote Card */}
            <div
              className="relative rounded-3xl p-10 text-white overflow-hidden shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
            >
              <div className="absolute top-6 left-8 text-7xl font-serif opacity-20 leading-none">"</div>
              <div className="relative z-10">
                <p className="text-xl md:text-2xl font-bold leading-relaxed italic">
                  {content.quote}
                </p>
              </div>
              <div className="absolute bottom-6 right-8 text-7xl font-serif opacity-20 leading-none rotate-180">"</div>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-6 mb-20">
            {metricItems.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="h-1 w-12 mx-auto rounded-full mb-4" style={{ backgroundColor: i === 1 ? secondaryColor : primaryColor }} />
                <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                  <AnimatedCounter endValueString={item.value} />
                </div>
                <p className="text-xs uppercase tracking-wider font-bold text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Three Pillars */}
          <div>
            <h3 className="text-2xl font-black text-gray-900 text-center uppercase mb-10">
              ¿Qué hacemos en {activeCountry?.country || 'tu país'}?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.pillars.map((pillar, i) => (
                <div key={i} className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm"
                    style={{ backgroundColor: `${i === 1 ? secondaryColor : primaryColor}15` }}
                  >
                    {pillar.icon}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 uppercase mb-3">{pillar.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{pillar.text}</p>
                  <div
                    className="h-0.5 w-0 group-hover:w-full mt-6 rounded-full transition-all duration-500"
                    style={{ backgroundColor: i === 1 ? secondaryColor : primaryColor }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
