import React from 'react';
import { navigate } from '../../routes/navigation';

interface Props {
  text: string;
  onClick?: () => void;
  className?: string;
  path?: string;
}

export function CTAButton({ text, onClick, className = '', path }: Props) {
  const handleClick = () => {
    if (onClick) onClick();
    if (path) navigate(path);
  };

  return (
    <button 
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-300 bg-transparent border border-white/30 rounded-full hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 group overflow-hidden ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {text}
        <span className="text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
      </span>
      <div className="absolute inset-0 z-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}
