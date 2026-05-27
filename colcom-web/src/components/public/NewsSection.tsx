import React from 'react';
import { useCountry } from '../../hooks/useCountry';
import { navigate } from '../../routes/navigation';

interface NewsItem {
  id?: string | number;
  titulo: string;
  resumen: string;
  fecha_publicacion?: string;
  imagen_url?: string;
  imagen_principal_url?: string;
  autor?: string;
}

interface NewsSectionProps {
  noticias?: NewsItem[];
}

export function NewsSection({ noticias = [] }: NewsSectionProps) {
  const { activeCountry } = useCountry();
  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';

  const palette = {
    orange: '#FF7A45',
    coral: '#FF9B73',
    pink: '#F25F8C',
    purple: '#8B5CF6',
    blue: '#22B8F0',
    cream: '#FFF4EA',
    blush: '#FFEAF2',
    lavender: '#F1EAFE',
    sky: '#E8F8FF',
    ink: '#111827',
    muted: '#6B7280',
  };

  const items = noticias.slice(0, 3);
  const featured = items[0];
  const secondary = items.slice(1);

  const formatDate = (date?: string) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getImage = (item: NewsItem) => {
    return item.imagen_principal_url || item.imagen_url;
  };

  return (
    <section
      className="relative py-24 px-4 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 8% 12%, ${palette.orange}55 0%, transparent 28%),
          radial-gradient(circle at 92% 16%, ${palette.blue}50 0%, transparent 26%),
          radial-gradient(circle at 18% 88%, ${palette.pink}42 0%, transparent 30%),
          radial-gradient(circle at 82% 86%, ${palette.purple}35 0%, transparent 28%),
          linear-gradient(135deg, #fff3e8 0%, #ffeaf2 34%, #f1eafe 68%, #e8f8ff 100%)
        `,
      }}
    >
      {/* Luces de fondo */}
      <div
        className="absolute -top-28 -left-24 w-80 h-80 rounded-full blur-3xl opacity-45"
        style={{ backgroundColor: palette.orange }}
      />

      <div
        className="absolute top-16 -right-24 w-96 h-96 rounded-full blur-3xl opacity-40"
        style={{ backgroundColor: palette.blue }}
      />

      <div
        className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-35"
        style={{ backgroundColor: palette.pink }}
      />

      <div
        className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: palette.purple }}
      />

      {/* Capa suave para evitar saturación */}
      <div className="absolute inset-0 bg-white/20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <span
              className="inline-flex items-center px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-[0.16em] mb-5 text-white shadow-sm"
              style={{
                background: `linear-gradient(90deg, ${palette.orange}, ${palette.pink})`,
              }}
            >
              Actualidad
            </span>

            <h2 className="text-3xl md:text-4xl font-black text-gray-950 uppercase tracking-wide mb-5">
              Noticias
            </h2>

            <div
              className="h-1.5 w-24 rounded-full mb-6"
              style={{
                background: `linear-gradient(90deg, ${palette.orange}, ${palette.pink}, ${palette.blue})`,
              }}
            />

            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              Conoce historias, avances y novedades de nuestra red en Latinoamérica.
            </p>
          </div>

          <button
            onClick={() => navigate('/noticias')}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(90deg, ${palette.purple}, ${palette.blue})`,
            }}
          >
            Ver todas
          </button>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Noticia destacada */}
            {featured && (
              <article className="lg:col-span-2 group bg-white/95 backdrop-blur rounded-[2rem] overflow-hidden border border-white shadow-[0_22px_60px_rgba(111,66,193,0.16)] hover:shadow-[0_28px_70px_rgba(111,66,193,0.22)] transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.95fr] h-full">
                  <div className="relative min-h-[280px] md:min-h-full bg-gray-100 overflow-hidden">
                    {getImage(featured) ? (
                      <img
                        src={getImage(featured)}
                        alt={featured.titulo}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${palette.coral}55 0%, ${palette.lavender} 100%)`,
                        }}
                      >
                        <svg
                          className="w-14 h-14 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                      </div>
                    )}

                    <div className="absolute top-5 left-5">
                      <span className="px-4 py-2 rounded-full bg-white/90 backdrop-blur text-xs font-extrabold uppercase tracking-wider text-gray-800 shadow-sm">
                        {featured.autor || 'Noticia destacada'}
                      </span>
                    </div>
                  </div>

                  <div className="p-7 md:p-8 flex flex-col justify-between">
                    <div>
                      {featured.fecha_publicacion && (
                        <p className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                          {formatDate(featured.fecha_publicacion)}
                        </p>
                      )}

                      <h3 className="text-2xl md:text-3xl font-black text-gray-950 leading-tight mb-4">
                        {featured.titulo}
                      </h3>

                      <p className="text-gray-600 leading-relaxed text-base line-clamp-5">
                        {featured.resumen}
                      </p>
                    </div>

                    <div className="mt-8">
                      <button
                        onClick={() => navigate('/noticias')}
                        className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider transition-all"
                        style={{ color: primaryColor }}
                      >
                        Leer noticia
                        <svg
                          className="w-4 h-4 transition-transform group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Noticias secundarias */}
            <div className="flex flex-col gap-8">
              {secondary.map((item, index) => (
                <article
                  key={item.id || index}
                  className="group bg-white/95 backdrop-blur rounded-[1.75rem] overflow-hidden border border-white shadow-[0_18px_48px_rgba(255,122,69,0.13)] hover:shadow-[0_24px_60px_rgba(255,122,69,0.18)] transition-all duration-300"
                >
                  <div className="relative h-52 bg-gray-100 overflow-hidden">
                    {getImage(item) ? (
                      <img
                        src={getImage(item)}
                        alt={item.titulo}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background:
                            index % 2 === 0
                              ? `linear-gradient(135deg, ${palette.sky} 0%, ${palette.lavender} 100%)`
                              : `linear-gradient(135deg, ${palette.cream} 0%, ${palette.blush} 100%)`,
                        }}
                      >
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                      </div>
                    )}

                    {item.fecha_publicacion && (
                      <div className="absolute bottom-4 left-4 bg-black/65 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur">
                        {formatDate(item.fecha_publicacion)}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-3">
                      {item.autor || 'Noticia'}
                    </p>

                    <h3 className="text-lg font-black text-gray-950 leading-snug mb-3 line-clamp-2">
                      {item.titulo}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-5">
                      {item.resumen}
                    </p>

                    <button
                      onClick={() => navigate('/noticias')}
                      className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider"
                      style={{ color: primaryColor }}
                    >
                      Leer más
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-14 bg-white/95 backdrop-blur rounded-[2rem] border border-white shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
            <div
              className="w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${palette.cream}, ${palette.blush})`,
              }}
            >
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-2">
              Pronto tendremos nuevas noticias
            </h3>

            <p className="text-gray-500">
              Estamos preparando contenido interesante para compartir contigo.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}