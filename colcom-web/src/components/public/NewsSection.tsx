import React from 'react';
import { useCountry } from '../../hooks/useCountry';
import { navigate } from '../../routes/navigation';

interface NewsItem {
  id?: string | number;
  titulo: string;
  resumen: string;
  fecha_publicacion?: string;
  imagen_url?: string;
  autor?: string;
}

interface NewsSectionProps {
  noticias?: NewsItem[];
}

export function NewsSection({ noticias = [] }: NewsSectionProps) {
  const { activeCountry } = useCountry();
  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';

  const defaultNews: NewsItem[] = [
    {
      id: 1,
      titulo: 'Inicia el segundo programa de altos estudios EDFICA 2024',
      resumen: 'Nuevas oportunidades para fortalecer procesos de formación, liderazgo y transformación social.',
      fecha_publicacion: new Date().toISOString(),
      autor: 'Colombia Comparte'
    },
    {
      id: 2,
      titulo: 'Colombia Comparte participó en la Semana del Talento 2024',
      resumen: 'La organización continúa elevando la productividad nacional desde procesos de acompañamiento humano y empresarial.',
      fecha_publicacion: new Date().toISOString(),
      autor: 'Equipo Editorial'
    }
  ];

  const items = noticias.length > 0 ? noticias.slice(0, 3) : defaultNews;

  return (
    <section className="py-24 px-4 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-16 text-gray-900 uppercase tracking-wide">
          NOTICIAS
          <div className="h-1 w-24 mx-auto mt-4 rounded-full" style={{ backgroundColor: primaryColor }} />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {items.map((item, index) => (
            <div key={item.id || index} className="flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group">
              {/* Imagen */}
              <div className="relative h-56 bg-gray-200 overflow-hidden">
                {item.imagen_url ? (
                  <img src={item.imagen_url} alt={item.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
                {/* Etiqueta / Autor */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    {item.autor || 'Noticia'}
                  </span>
                </div>
                {/* Fecha esquina */}
                {item.fecha_publicacion && (
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-white text-xs font-medium">
                    {new Date(item.fecha_publicacion).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-purple-700 transition-colors">
                  {item.titulo}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                  {item.resumen}
                </p>
                
                <div className="mt-auto">
                  <button 
                    onClick={() => navigate('/noticias')}
                    className="inline-flex items-center text-sm font-bold uppercase tracking-wider hover:opacity-80 transition-opacity"
                    style={{ color: primaryColor }}
                  >
                    LEER MÁS
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={() => navigate('/noticias')}
            className="px-8 py-3 rounded-full text-white font-bold uppercase tracking-wider text-sm shadow-md hover:shadow-lg transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            Ver más noticias
          </button>
        </div>
      </div>
    </section>
  );
}
