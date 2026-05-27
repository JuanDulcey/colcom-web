import React from 'react';

import logoAlpina from '../../assets/imgs/logo_alpina_1779904884518.png';
import logoExito from '../../assets/imgs/logo_exito_1779904896452.png';
import logoNutresa from '../../assets/imgs/logo_nutresa_1779904910301.png';
import logoAmcor from '../../assets/imgs/logo_amcor_1779904927211.png';
import logoCencosud from '../../assets/imgs/logo_cencosud_1779904946055.png';
import logoSanfer from '../../assets/imgs/logo_sanfer_1779904958161.png';

export function LatamPartnersSection() {
  const colors = {
    coral: '#FF725E',
    pink: '#E83E75',
    purple: '#7B2CBF',
    blue: '#12A8E8',
    dark: '#111827',
  };

  const partners = [
    { name: 'Alpina', image: logoAlpina },
    { name: 'Amcor', image: logoAmcor },
    { name: 'Cencosud', image: logoCencosud },
    { name: 'Éxito', image: logoExito },
    { name: 'Nutresa', image: logoNutresa },
    { name: 'Sanfer', image: logoSanfer },
  ];

  const LogoGroup = ({ prefix }: { prefix: string }) => (
    <div className="latam-logo-group flex items-center gap-0 shrink-0">
      {partners.map((partner, index) => (
        <div
          key={`${prefix}-${partner.name}-${index}`}
          className="
            group relative flex items-center justify-center
            w-56 sm:w-64 md:w-72
            h-32 sm:h-36 md:h-40
            bg-white/95 backdrop-blur-xl
            border-y border-r border-white/70
            overflow-hidden p-4 md:p-5
            transition-all duration-300
            hover:z-10 hover:scale-[1.025]
          "
          style={{
            boxShadow: `0 18px 40px rgba(123, 44, 191, 0.10)`,
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg, ${colors.coral}18, ${colors.pink}18, ${colors.blue}18)`,
            }}
          />

          <img
            src={partner.image}
            alt={partner.name}
            className="
              relative z-10
              w-full h-full
              max-w-[96%] max-h-[90%]
              object-contain
              transition-all duration-300
              group-hover:scale-105
            "
          />
        </div>
      ))}
    </div>
  );

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 10% 15%, ${colors.coral}30 0%, transparent 30%),
          radial-gradient(circle at 85% 20%, ${colors.blue}30 0%, transparent 28%),
          radial-gradient(circle at 50% 100%, ${colors.purple}22 0%, transparent 35%),
          linear-gradient(135deg, #fff7f4 0%, #fff 35%, #f5fbff 70%, #fff4fb 100%)
        `,
      }}
    >
      <style>
        {`
          @keyframes latamPartnersScroll {
            from {
              transform: translate3d(0, 0, 0);
            }
            to {
              transform: translate3d(-50%, 0, 0);
            }
          }

          .latam-partners-track {
            display: flex;
            width: max-content;
            animation: latamPartnersScroll 34s linear infinite;
            will-change: transform;
          }

          .latam-partners-strip:hover .latam-partners-track {
            animation-play-state: paused;
          }

          @media (max-width: 768px) {
            .latam-partners-track {
              animation-duration: 26s;
            }
          }
        `}
      </style>

      {/* Fondo decorativo */}
      <div
        className="absolute -top-28 -left-20 w-80 h-80 rounded-full blur-3xl opacity-40"
        style={{ backgroundColor: colors.pink }}
      />

      <div
        className="absolute top-32 -right-24 w-96 h-96 rounded-full blur-3xl opacity-35"
        style={{ backgroundColor: colors.blue }}
      />

      <div
        className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: colors.purple }}
      />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <span
            className="inline-flex items-center px-6 py-2 rounded-full text-sm font-extrabold uppercase tracking-wider text-white shadow-lg mb-5"
            style={{
              background: `linear-gradient(90deg, ${colors.coral}, ${colors.pink}, ${colors.purple}, ${colors.blue})`,
            }}
          >
            Aliados que impulsan la red
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-gray-950 uppercase tracking-wide">
            Empresas que comparten
            <div
              className="h-1.5 w-32 mx-auto mt-4 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${colors.coral}, ${colors.pink}, ${colors.purple}, ${colors.blue})`,
              }}
            />
          </h2>

          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16 text-lg leading-relaxed">
            Las empresas que creen en el bienestar y la productividad con propósito hacen parte de esta red.
            Gracias a ellas, más familias en Latinoamérica vuelven a creer, crear y prosperar.
          </p>
        </div>
      </div>

      <div
        className="latam-partners-strip relative w-full overflow-hidden py-14 border-y border-white/70"
        style={{
          background: `
            linear-gradient(90deg, ${colors.coral}20 0%, ${colors.pink}22 28%, ${colors.purple}22 58%, ${colors.blue}20 100%)
          `,
          boxShadow: 'inset 0 20px 60px rgba(255,255,255,0.45)',
        }}
      >
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 z-20 pointer-events-none bg-gradient-to-r from-white/95 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 z-20 pointer-events-none bg-gradient-to-l from-white/95 to-transparent" />

        <div className="latam-partners-track rounded-[2rem] overflow-hidden">
          <LogoGroup prefix="first" />
          <LogoGroup prefix="second" />
        </div>
      </div>
    </section>
  );
}