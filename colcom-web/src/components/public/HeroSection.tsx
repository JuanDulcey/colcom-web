import React from 'react';
import { LogoNetwork } from './LogoNetwork';
import { CountryLogoCircle } from './CountryLogoCircle';
import { CTAButton } from './CTAButton';
import { useCountry } from '../../hooks/useCountry';
import heroBg from '../../assets/imgs/hero_collab_bg.png';

export function HeroSection() {
  const { activeCountry, activeSlug } = useCountry();
  const countryName = activeCountry?.nombre || 'LATINOAMÉRICA';
  
  const isLatam = activeSlug === 'latam';
  
  // Use colors from activeCountry, falling back to a default if missing
  const colors = activeCountry?.colors || ['#E72B5A', '#00AEEF', '#FFE100'];
  const gradientOverlay = `linear-gradient(90deg, ${colors[0]}B3 0%, ${colors[1] || colors[0]}B3 50%, ${colors[2] || colors[1] || colors[0]}B3 100%)`;
  
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-12 px-4 overflow-hidden">
      {/* Background Image with Gradient Overlay */}
     
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div 
          className="absolute inset-0 mix-blend-multiply"
          style={{ background: gradientOverlay }}
        />
        <div 
          className="absolute inset-0"
          style={{ background: `linear-gradient(90deg, ${colors[0]}66 0%, ${colors[1] || colors[0]}66 50%, ${colors[2] || colors[1] || colors[0]}66 100%)` }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center mt-8">
        
        {/* Conditional Logo Display */}
        {isLatam ? (
          <div className="mb-12"><LogoNetwork /></div>
        ) : (
          <div className="mb-8 mt-4">
            <CountryLogoCircle data={activeCountry as any} />
          </div>
        )}

        {/* Dynamic Titles */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-md max-w-5xl uppercase">
          {activeCountry?.heroTitle || 'BIENESTAR DENTRO Y FUERA DE LA EMPRESA'}
        </h1>
        
        <p className="text-white text-lg md:text-2xl font-medium mb-12 drop-shadow-md max-w-3xl">
          {activeCountry?.heroSubtitle || 'Uniendo personas, empresas y comunidades para construir una región más humana, productiva y consciente.'}
        </p>

      </div>
    </section>
  );
}
