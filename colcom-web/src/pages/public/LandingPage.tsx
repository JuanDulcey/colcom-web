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
import { CountryAboutSection } from '../../components/public/CountryAboutSection';
import { CountryMissionAndCTA } from '../../components/public/CountryMissionAndCTA';

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
          <CountryAboutSection />
          <CountryMissionAndCTA testimonios={testimonios} />
          <div id="noticias"><NewsSection noticias={noticias} /></div>
        </>
      )}
    </div>
  );
}

export default LandingPage;
