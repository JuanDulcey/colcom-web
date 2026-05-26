import React, { useRef, useEffect } from 'react';
import { CountryLogoData } from '../../data/countryLogos';

interface Props {
  data: CountryLogoData;
  isActive?: boolean;
  onHover?: (slug: string | null) => void;
}

export function CountryLogoCircle({ data, isActive, onHover }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!data.videoSrc || !videoRef.current) return;

    const video = videoRef.current;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        // Evita errores si el navegador bloquea autoplay temporalmente.
      }
    };

    playVideo();
  }, [data.videoSrc]);

  const handleMouseEnter = () => {
    onHover?.(data.slug);

    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    onHover?.(null);

    // No pausamos ni reiniciamos el video.
  };

  const conicGradient =
    data.colors.length > 0
      ? `conic-gradient(from 0deg, ${data.colors.join(', ')}, ${data.colors[0]})`
      : 'none';

  return (
    <div
      className={`relative rounded-full flex items-center justify-center cursor-pointer transition-transform duration-500 ease-out ${
        data.isFeatured ? 'w-32 h-32 md:w-40 md:h-40' : 'w-20 h-20 md:w-24 md:h-24'
      }`}
      style={{
        transform: isActive ? 'scale(1.04)' : 'scale(1)',
        zIndex: isActive || data.isFeatured ? 10 : 1,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => window.location.href = `/${data.slug}`}
    >
      {/* Animated glowing border */}
      <div
        className={`absolute inset-[-4px] rounded-full transition-opacity duration-500 ease-out ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: conicGradient,
          animation: isActive ? 'spin 4s linear infinite' : 'none',
          filter: 'blur(8px)',
        }}
      />

      <div
        className={`absolute inset-[-2px] rounded-full transition-opacity duration-500 ease-out ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: conicGradient,
          animation: isActive ? 'spin 4s linear infinite' : 'none',
        }}
      />

      {/* Inner Circle Content */}
      <div className="absolute inset-0 bg-white rounded-full overflow-hidden shadow-lg border border-white/20 flex items-center justify-center z-10">
        {data.videoSrc ? (
          <video
            ref={videoRef}
            src={data.videoSrc}
            className="absolute inset-0 w-full h-full object-cover opacity-100"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
          />
        ) : (
          <img
            src={data.logoSrc}
            alt={data.name}
            className="absolute inset-0 w-full h-full object-contain p-2 opacity-100"
          />
        )}
      </div>

      {/* Tooltip */}
      <div
        className={`absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-white text-sm font-semibold tracking-wide drop-shadow-md z-20 transition-all duration-300 ${
          isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        {data.name}
      </div>
    </div>
  );
}