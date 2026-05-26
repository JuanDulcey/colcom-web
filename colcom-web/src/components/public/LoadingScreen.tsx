import React, { useEffect, useState } from 'react';
import { useCountry } from '../../hooks/useCountry';
import latLogo from '../../assets/imgs/latComparte.png';

export function LoadingScreen() {
  const { activeCountry } = useCountry();
  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';
  const secondaryColor = activeCountry?.colors?.[1] || '#00AEEF';

  // Render floating rings in the background
  const renderRings = () => {
    const rings = [];
    for (let i = 0; i < 20; i++) {
      const size = Math.random() * 80 + 30; // 30px to 110px
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const opacity = Math.random() * 0.4 + 0.1;
      const isPrimary = Math.random() > 0.5;
      
      rings.push(
        <div 
          key={i}
          className="absolute rounded-full border-4 pointer-events-none"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: `${top}%`,
            opacity,
            borderColor: isPrimary ? primaryColor : secondaryColor,
            animation: `float ${Math.random() * 4 + 4}s ease-in-out infinite alternate`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      );
    }
    return rings;
  };

  return (
    <div 
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(circle at center, ${primaryColor} 0%, #2A044A 100%)`
      }}
    >
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-20px) scale(1.05); }
        }
      `}</style>
      
      {/* Abstract Floating Rings Background */}
      <div className="absolute inset-0 z-0">
        {renderRings()}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
          <img 
            src={latLogo} 
            alt="Latinoamérica Comparte" 
            className="h-48 w-auto drop-shadow-2xl"
          />
        </div>

        {/* Text */}
        <h2 className="text-white text-2xl md:text-3xl font-light tracking-wide mb-8 drop-shadow-md">
          Estamos preparando tu experiencia...
        </h2>

        {/* Loader Ring */}
        <div className="relative w-12 h-12">
          <svg className="animate-spin w-full h-full text-white/20" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
