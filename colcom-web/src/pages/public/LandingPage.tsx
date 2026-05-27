import React, { useEffect, useState } from 'react';
import { HeroSection } from '../../components/public/HeroSection';
import { useCountry } from '../../hooks/useCountry';
import { testimoniosApi } from '../../api/testimonios.api';
import { noticiasApi } from '../../api/noticias.api';
import { GalleryAndImpactSection } from '../../components/public/GalleryAndImpactSection';
import { SupportSection } from '../../components/public/SupportSection';
import { MissionSection } from '../../components/public/MissionSection';
import { HistorySection } from '../../components/public/HistorySection';
import { TestimonialsSection } from '../../components/public/TestimonialsSection';
import { CTASection } from '../../components/public/CTASection';
import { NewsSection } from '../../components/public/NewsSection';

import { LatamAboutSection } from '../../components/public/LatamAboutSection';
import { LatamSupportSection } from '../../components/public/LatamSupportSection';
import { LatamMissionSection } from '../../components/public/LatamMissionSection';
import { LatamImpactSection } from '../../components/public/LatamImpactSection';
import { LatamPartnersSection } from '../../components/public/LatamPartnersSection';
import { LatamTeamSection } from '../../components/public/LatamTeamSection';
import { LatamHowToSupportSection } from '../../components/public/LatamHowToSupportSection';
import { LatamContactSection } from '../../components/public/LatamContactSection';
import { LatamFinalPhrase } from '../../components/public/LatamFinalPhrase';

export function LandingPage() {
  const { activeCountry, activeSlug } = useCountry();
  const [testimonios, setTestimonios] = useState<any[]>([]);
  const [noticias, setNoticias] = useState<any[]>([]);

  useEffect(() => {
    if (activeCountry?.slug) {
      testimoniosApi.publicByCountry(activeCountry.slug)
        .then(res => setTestimonios(res.data?.slice(0, 3) || []))
        .catch(() => {});
        
      noticiasApi.publicByCountry(activeCountry.slug)
        .then(res => setNoticias(res.data?.slice(0, 2) || []))
        .catch(() => {});
    }
  }, [activeCountry?.slug]);

  const displayTestimonios = testimonios.length > 0 ? testimonios : [
    { id: 1, nombre: 'Ana García', empresa: 'Empresa A', contenido: 'Increíble iniciativa para el desarrollo de LATAM.', destacado: true },
    { id: 2, nombre: 'Carlos Ruiz', empresa: 'Fundación B', contenido: 'Nuestra comunidad ha crecido enormemente.', destacado: true },
    { id: 3, nombre: 'Laura Gómez', empresa: 'Startup C', contenido: 'Excelente plataforma para conectar.', destacado: false },
  ];

  const displayNoticias = noticias;

  const sectionsText = activeCountry?.sectionsText || {
    whatWeDo: `QUÉ HACEMOS EN ${activeCountry?.nombre?.toUpperCase()}`,
    impact: `IMPACTO EN ${activeCountry?.nombre?.toUpperCase()}`,
    news: 'NOTICIAS LOCALES'
  };

  const metrics = activeCountry?.metrics || { people: '20,000+', companies: '120+', projects: '40+' };

  return (
    <div className="w-full bg-white text-gray-900 min-h-screen">
      <HeroSection />

      {activeSlug === 'latam' ? (
        <>
          <div id="somos"><LatamAboutSection /></div>
          <LatamSupportSection />
          <LatamMissionSection />
          <div id="impacto"><LatamImpactSection /></div>
          <LatamPartnersSection />
          <div id="equipo"><LatamTeamSection /></div>
          <div id="noticias"><NewsSection noticias={noticias} /></div>
          <LatamHowToSupportSection />
          <div id="contacto"><LatamContactSection /></div>
          <LatamFinalPhrase />
        </>
      ) : (
        <>
          <div id="somos"><SupportSection /></div>

          {/* Qué Hacemos */}
          <section className="py-24 px-4 max-w-7xl mx-auto">
            <h2 className="text-3xl font-extrabold text-center mb-16 text-gray-900 uppercase tracking-wide">
              {sectionsText.whatWeDo}
              <div className="h-1 w-24 mx-auto mt-4 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 flex items-center justify-center mb-6 rounded-full border-2 border-gray-200 shadow-sm" style={{ color: 'var(--color-primary)' }}>
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 uppercase text-gray-800">EMPRENDIMIENTO SOSTENIBLE</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Programas de negocio de triple impacto que promueven un desarrollo responsable, consciente y perdurable.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-20 h-20 flex items-center justify-center mb-6 rounded-full border-2 border-gray-200 shadow-sm" style={{ color: 'var(--color-primary)' }}>
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 uppercase text-gray-800">DESARROLLO COMUNITARIO</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Proyectos sociales que enfocan su esfuerzo en comunidades vulnerables para mejorar su calidad de vida y su entorno humano y social.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-20 h-20 flex items-center justify-center mb-6 rounded-full border-2 border-gray-200 shadow-sm" style={{ color: 'var(--color-primary)' }}>
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 uppercase text-gray-800">EDUCACIÓN Y CAPACITACIÓN</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Formación y capacitación en herramientas de negocios y habilidades tecnológicas para un crecimiento profesional.
                </p>
              </div>
            </div>
          </section>

          <MissionSection />

          <HistorySection />

          {/* Gallery and Impact Section */}
          <div id="impacto">
            <GalleryAndImpactSection 
              testimonios={displayTestimonios} 
              noticias={displayNoticias} 
              metrics={metrics} 
              sectionsText={sectionsText} 
            />
          </div>

          <TestimonialsSection testimonios={testimonios} />

          <div id="contacto"><CTASection /></div>

          <div id="noticias"><NewsSection noticias={noticias} /></div>
        </>
      )}
    </div>
  );
}

export default LandingPage;
