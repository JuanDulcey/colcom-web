import React, { useEffect, useRef, useState } from 'react';
import { useCountry } from '../../hooks/useCountry';

function AnimatedCounter({ endValueString }: { endValueString: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  const cleanNumber = endValueString.replace(/[^\d]/g, '');
  const endNum = cleanNumber ? Number(cleanNumber) : 0;
  const suffix = endValueString.replace(/[\d.,\s]/g, '');

  useEffect(() => {
    if (!elementRef.current || hasAnimated || endNum === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setHasAnimated(true);

        const duration = 1800;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 4);

          setCount(Math.floor(easeProgress * endNum));

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(endNum);
          }
        };

        requestAnimationFrame(animate);
      },
      { threshold: 0.25 }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [endNum, hasAnimated]);

  if (endNum === 0) return <span>{endValueString}</span>;

  return (
    <span ref={elementRef}>
      {count.toLocaleString('es-CO')}
      {suffix}
    </span>
  );
}

export function LatamImpactSection() {
  const { activeCountry } = useCountry();

  const colors = {
    coral: '#FF725E',
    pink: '#E83E75',
    purple: '#7B2CBF',
    blue: '#12A8E8',
    dark: '#111827',
  };

  const metrics = activeCountry?.metrics || {
    people: '20,000+',
    companies: '120+',
    projects: '40+',
    years: '10+',
  };

  const impactItems = [
    {
      value: metrics.years || '10+',
      label: 'Años de impacto social y empresarial',
      color: colors.coral,
    },
    {
      value: metrics.people || '20,000+',
      label: 'Familias transformadas',
      color: colors.pink,
    },
    {
      value: metrics.projects || '40+',
      label: 'Emprendimientos creados',
      color: colors.purple,
    },
    {
      value: metrics.companies || '120+',
      label: 'Empresas aliadas',
      color: colors.blue,
    },
  ];

  return (
    <section
      className="relative py-24 px-4 overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, #ffffff 0%, #fff7f5 35%, #f7fbff 70%, #ffffff 100%)
        `,
      }}
    >
      {/* Luces suaves de fondo */}
      <div
        className="absolute -top-32 -left-24 w-80 h-80 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: colors.pink }}
      />

      <div
        className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: colors.blue }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span
            className="inline-flex items-center px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-[0.18em] text-white mb-5"
            style={{
              background: `linear-gradient(90deg, ${colors.coral}, ${colors.pink}, ${colors.purple}, ${colors.blue})`,
            }}
          >
            Impacto regional
          </span>

          <h2 className="text-3xl md:text-4xl font-black text-gray-950 uppercase tracking-wide mb-5">
            Nuestro impacto
          </h2>

          <div
            className="h-1.5 w-28 mx-auto rounded-full mb-6"
            style={{
              background: `linear-gradient(90deg, ${colors.coral}, ${colors.pink}, ${colors.blue})`,
            }}
          />

          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Una red que crece desde Colombia para inspirar procesos de transformación humana,
            social y empresarial en Latinoamérica.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {impactItems.map((item) => (
            <div
              key={item.label}
              className="
                group relative overflow-hidden
                bg-white rounded-3xl p-6 md:p-7
                border border-gray-100
                shadow-[0_16px_45px_rgba(15,23,42,0.08)]
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(15,23,42,0.12)]
              "
            >
              <div
                className="absolute top-0 left-0 w-full h-1.5"
                style={{ backgroundColor: item.color }}
              />

              <div
                className="w-11 h-11 rounded-2xl mb-6 flex items-center justify-center"
                style={{ backgroundColor: `${item.color}18` }}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>

              <h4 className="text-3xl md:text-4xl font-black text-gray-950 mb-3 tracking-tight">
                <AnimatedCounter endValueString={item.value} />
              </h4>

              <p className="text-xs md:text-sm uppercase tracking-wider font-bold text-gray-500 leading-snug">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}