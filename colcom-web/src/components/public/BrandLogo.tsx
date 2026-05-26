import React from 'react';
import america from '../../assets/imgs/america.png';
import colombiaLogo from '../../assets/imgs/colombiaLogo.png';
import argentinaLogo from '../../assets/imgs/argentinaLogo.png';
import chileLogo from '../../assets/imgs/ChileLogo.png';
import ecuadorLogo from '../../assets/imgs/ecuadorLogo.png';

interface BrandLogoProps {
  slug: string;
  className?: string;
  isHeader?: boolean;
}

export function BrandLogo({ slug, className = "", isHeader = false }: BrandLogoProps) {
  let logoImg = america;
  let textPart1 = "LA";
  let textPart2 = "TINOAMÉRICA";

  if (slug === 'colombia') {
    logoImg = colombiaLogo;
    textPart1 = "CO";
    textPart2 = "LOMBIA";
  } else if (slug === 'argentina') {
    logoImg = argentinaLogo;
    textPart1 = "AR";
    textPart2 = "GENTINA";
  } else if (slug === 'chile') {
    logoImg = chileLogo;
    textPart1 = "CH";
    textPart2 = "ILE";
  } else if (slug === 'ecuador') {
    logoImg = ecuadorLogo;
    textPart1 = "EC";
    textPart2 = "UADOR";
  }

  const baseSize1 = isHeader ? "text-[16px] md:text-[20px]" : "text-[18px] md:text-[22px]";
  const baseSize2 = isHeader ? "text-[16px] md:text-[20px]" : "text-[19px] md:text-[23px]";

  // When in header and not scrolled, the text might need to be white or dark depending on the header state, 
  // but we stick to the user's requested classes (text-white) which should be handled by CSS if needed.
  // Actually, we'll use a class 'brand-text-main' to allow CSS overrides, but default to text-white as requested.

  return (
    <>
      <img
        src={logoImg}
        alt={`${textPart1}${textPart2} Comparte`}
        className={`h-14 md:h-16 w-auto object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105 ${className}`}
      />

      <span className={`${isHeader ? 'hidden sm:flex' : 'flex'} flex-col leading-none text-left`}>
        <span className={`${baseSize1} font-black tracking-tight`}>
          <span className="text-[#ff5757]">{textPart1}</span>
          <span className="text-white brand-text-main">{textPart2}</span>
        </span>

        <span className={`${baseSize2} font-black tracking-wide`}>
          <span className="text-[#a855f7]">C</span>
          <span className="text-[#38bdf8]">O</span>
          <span className="text-white brand-text-main">MPARTE</span>
        </span>
      </span>
    </>
  );
}
