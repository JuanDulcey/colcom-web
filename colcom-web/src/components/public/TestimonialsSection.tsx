import React from 'react';
import { useCountry } from '../../hooks/useCountry';

interface Testimonial {
  id?: string | number;
  nombre: string;
  contenido: string;
  imagen_url?: string;
  empresa?: string;
}

interface TestimonialsSectionProps {
  testimonios?: Testimonial[];
}

export function TestimonialsSection({ testimonios = [] }: TestimonialsSectionProps) {
  const { activeCountry } = useCountry();
  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';

  const defaultTestimonials: Testimonial[] = [
    {
      id: 1,
      nombre: 'Viviana Lobo',
      contenido: 'Colombia Comparte me ayudó a creer nuevamente en mi proyecto y a organizar mi camino.',
    },
    {
      id: 2,
      nombre: 'Carlos Cáceres',
      contenido: 'Encontré orientación, acompañamiento y herramientas para fortalecer mi emprendimiento.',
    },
    {
      id: 3,
      nombre: 'Diana Galindo',
      contenido: 'Este proceso me permitió crecer como persona y proyectar mejor mi negocio.',
    }
  ];

  const items = testimonios.length >= 3 ? testimonios.slice(0, 3) : defaultTestimonials;

  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-16 text-gray-900 uppercase tracking-wide">
          TESTIMONIOS
          <div className="h-1 w-24 mx-auto mt-4 rounded-full" style={{ backgroundColor: primaryColor }} />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {items.map((item, index) => (
            <div key={item.id || index} className="flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
              {/* Header Color */}
              <div className="h-3 w-full" style={{ backgroundColor: primaryColor }} />
              
              <div className="p-8 flex flex-col items-center text-center flex-grow">
                {/* Avatar Placeholder / Image */}
                <div className="w-24 h-24 rounded-full mb-6 overflow-hidden border-4 border-gray-50 shadow-md bg-gray-200">
                  {item.imagen_url ? (
                    <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.nombre}</h3>
                {item.empresa && <span className="text-sm text-gray-500 mb-4 block">{item.empresa}</span>}
                
                <p className="text-gray-600 italic leading-relaxed relative flex-grow">
                  <span className="text-4xl absolute -top-4 -left-2 text-gray-200 opacity-50 font-serif">"</span>
                  {item.contenido}
                  <span className="text-4xl absolute -bottom-4 -right-2 text-gray-200 opacity-50 font-serif">"</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
