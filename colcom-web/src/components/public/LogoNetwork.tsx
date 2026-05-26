import React, { useState } from 'react';
import { CountryLogoCircle } from './CountryLogoCircle';
import { countryLogos } from '../../data/countryLogos';

export function LogoNetwork() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-12 mb-8">
      {/* Connecting lines or net background */}
      <div className="absolute inset-0 top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-y-1/2 z-0 hidden md:block" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 px-4">
        {countryLogos.map((logo) => (
          <CountryLogoCircle 
            key={logo.slug}
            data={logo}
            isActive={activeSlug === logo.slug}
            onHover={setActiveSlug}
          />
        ))}
      </div>
    </div>
  );
}
