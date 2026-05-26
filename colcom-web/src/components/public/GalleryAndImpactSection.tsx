import React, { useState, useRef } from 'react';
import { useCountry } from '../../hooks/useCountry';

interface GalleryAndImpactSectionProps {
  testimonios: any[];
  noticias: any[];
  metrics: any;
  sectionsText: any;
}

export function GalleryAndImpactSection({ testimonios, noticias, metrics, sectionsText }: GalleryAndImpactSectionProps) {
  const { activeCountry } = useCountry();
  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';
  const secondaryColor = activeCountry?.colors?.[1] || '#4A90E2';
  
  // Use testimonios if we have them, otherwise use noticias as fallback for the gallery
  const galleryItems = testimonios.length > 0 ? testimonios : noticias;
  
  // Fake data if api is empty
  const defaultItems = [
    { id: 1, titulo: 'Empowering Local Entrepreneurs', resumen: 'Their success is our community\'s success.', imagen_url: '' },
    { id: 2, titulo: 'Building Bridges Through Art', resumen: 'Creativity unites us.', imagen_url: '' },
    { id: 3, titulo: 'Building Bridges Through Art', resumen: 'Creativity unites us.', imagen_url: '' },
    { id: 4, titulo: 'Sustainable Farming Initiatives', resumen: 'Harvesting hope for the future.', imagen_url: '' },
    { id: 5, titulo: 'Argentina Comparte Initiatives', resumen: 'Harvesting hope for the future.', imagen_url: '' },
  ];
  
  const itemsToDisplay = galleryItems.length > 0 ? galleryItems : defaultItems;
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="w-full py-20 overflow-hidden relative"
      style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${primaryColor} 100%)`
      }}
    >
      {/* Title */}
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-wider drop-shadow-md">
          STORIES AND IMPACT VIDEO GALLERY
        </h2>
      </div>

      {/* Carousel */}
      <div className="relative max-w-[90rem] mx-auto px-4 md:px-12 mb-20 flex items-center">
        {/* Left Arrow */}
        <button 
          onClick={scrollLeft}
          className="hidden md:flex absolute left-4 z-10 w-12 h-20 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg items-center justify-center text-white transition-all border border-white/30 shadow-lg"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Cards Container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-8 pt-4 snap-x snap-mandatory scrollbar-hide w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {itemsToDisplay.map((item, index) => (
            <div 
              key={item.id || index} 
              className="relative flex-shrink-0 w-72 md:w-80 h-96 rounded-2xl overflow-hidden snap-center group cursor-pointer border border-white/40 shadow-xl bg-white/10 backdrop-blur-sm transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Background Image */}
              {item.imagen_url ? (
                <img src={item.imagen_url} alt={item.titulo || item.nombre} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black/60 to-black/30" />
              )}
              
              {/* Play Button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-md border border-white/50 group-hover:bg-white/50 transition-all duration-300 transform group-hover:scale-110">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              
              {/* Logo in top left */}
              <div className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
                <span className="font-bold text-xs" style={{ color: primaryColor }}>Logo</span>
              </div>

              {/* Text Content */}
              <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                  {item.titulo || item.nombre}
                </h3>
                <p className="text-gray-300 text-sm italic">
                  "{item.resumen || item.contenido}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button 
          onClick={scrollRight}
          className="hidden md:flex absolute right-4 z-10 w-12 h-20 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg items-center justify-center text-white transition-all border border-white/30 shadow-lg"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-3 mb-24">
        <div className="w-8 h-2 rounded-full bg-white"></div>
        <div className="w-2 h-2 rounded-full bg-white/50"></div>
        <div className="w-2 h-2 rounded-full bg-white/50"></div>
        <div className="w-2 h-2 rounded-full bg-white/50"></div>
      </div>

      {/* Regional Impact */}
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-3xl text-center text-white mb-12 font-medium tracking-wide">Nuestro Impacto</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-white">
          {/* Item 1 */}
          <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg text-gray-900">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-3xl font-bold">{metrics.people || '1,200'}</h4>
              <p className="text-[0.65rem] md:text-xs uppercase tracking-wider opacity-90 leading-tight mt-1 max-w-[120px]">PERSONAS Y FAMILIAS EN RECONSTRUCCIÓN PRODUCTIVA</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg text-gray-900">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-3xl font-bold">{metrics.companies || '70'}</h4>
              <p className="text-[0.65rem] md:text-xs uppercase tracking-wider opacity-90 leading-tight mt-1 max-w-[120px]">EMPRESAS COMPROMETIDAS CON SU GENTE</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg text-gray-900">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-3xl font-bold">{metrics.mentors || '65'}</h4>
              <p className="text-[0.65rem] md:text-xs uppercase tracking-wider opacity-90 leading-tight mt-1 max-w-[120px]">MENTORES Y VOLUNTARIOS EN SERVICIO</p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg text-gray-900">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-3xl font-bold">{metrics.years || '10'}</h4>
              <p className="text-[0.65rem] md:text-xs uppercase tracking-wider opacity-90 leading-tight mt-1 max-w-[120px]">AÑOS TRANSFORMANDO VIDAS Y CULTURA</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GalleryAndImpactSection;
