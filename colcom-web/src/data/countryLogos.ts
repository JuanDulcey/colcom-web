import argLogo from '../assets/imgs/argComparte.jpeg';
import chiLogo from '../assets/imgs/chiComparte.jpeg';
import colLogo from '../assets/imgs/colComparte.png';
import ecuLogo from '../assets/imgs/ecuComparte.jpeg';
import latLogo from '../assets/imgs/latComparte.png';

import argVideo from '../assets/imgs/Logo_animation_Argentina_Comparte_202605241402.mp4';
import chiVideo from '../assets/imgs/Logo_animation_Chile_colors_202605241422.mp4';
import colVideo from '../assets/imgs/Logo_animation_Colombia_colors_202605241344.mp4';
import ecuVideo from '../assets/imgs/Logo_animation_Ecuador_Comparte_202605241413.mp4';
import latVideo from '../assets/imgs/Logo_animation_with_brand_colors_202605241449.mp4';

export interface CountryLogoData {
  slug: string;
  name: string;
  country: string;
  colors: string[];
  logoSrc: string;
  videoSrc?: string;
  isFeatured?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  metrics?: { people: string, companies: string, projects: string };
  sectionsText?: { whatWeDo: string, impact: string, news: string };
}

export const countryLogos: CountryLogoData[] = [
  {
    slug: 'colombia',
    name: 'Colombia Comparte',
    country: 'Colombia',
    colors: ['#FFE100', '#00AEEF', '#E72B5A'],
    logoSrc: colLogo,
    videoSrc: colVideo,
    heroTitle: 'UN PROPÓSITO NACIONAL: FORTALECIENDO COMUNIDADES EN COLOMBIA',
    heroSubtitle: 'Conectando personas y empresas para un futuro más humano y productivo',
    metrics: { people: '25,000+', companies: '150+', projects: '45+' },
    sectionsText: { whatWeDo: 'QUÉ HACEMOS EN COLOMBIA', impact: 'IMPACTO EN COLOMBIA', news: 'NOTICIAS LOCALES' }
  },
  {
    slug: 'ecuador',
    name: 'Ecuador Comparte',
    country: 'Ecuador',
    colors: ['#FFE100', '#00AEEF', '#E72B5A'],
    logoSrc: ecuLogo,
    videoSrc: ecuVideo,
    heroTitle: 'Ecuador Comparte: Comunidades que se conectan',
    heroSubtitle: 'Construyendo un futuro de oportunidades compartidas',
    metrics: { people: '45,000+', companies: '200+', projects: '35+' },
    sectionsText: { whatWeDo: 'QUÉ HACEMOS EN ECUADOR', impact: 'IMPACTO EN ECUADOR', news: 'HISTORIAS DE ÉXITO EN ECUADOR' }
  },
  {
    slug: 'latam',
    name: 'Latinoamérica Comparte',
    country: 'Latinoamérica',
    colors: ['#E72B5A', '#FF7A50', '#7A0A83', '#00AEEF'],
    logoSrc: latLogo,
    videoSrc: latVideo,
    isFeatured: true,
    heroTitle: 'BIENESTAR DENTRO Y FUERA DE LA EMPRESA',
    heroSubtitle: 'Uniendo personas, empresas y comunidades para construir una región más humana, productiva y consciente',
    metrics: { people: '250,000+', companies: '1000+', projects: '300+' },
    sectionsText: { whatWeDo: 'QUÉ HACEMOS EN LATINOAMÉRICA', impact: 'IMPACTO REGIONAL', news: 'NOTICIAS DESTACADAS' }
  },
  {
    slug: 'chile',
    name: 'Chile Comparte',
    country: 'Chile',
    colors: ['#00AEEF', '#FFFFFF', '#E72B5A'],
    logoSrc: chiLogo,
    videoSrc: chiVideo,
    heroTitle: 'CHILE COMPARTE: IMPACTO QUE CRUZA FRONTERAS',
    heroSubtitle: 'Transformando realidades a través de la colaboración regional',
    metrics: { people: '25,000+', companies: '150+', projects: '45+' },
    sectionsText: { whatWeDo: 'NUESTRO TRABAJO EN CHILE', impact: 'METRICS', news: 'TESTIMONIOS LOCALES' }
  },
  {
    slug: 'argentina',
    name: 'Argentina Comparte',
    country: 'Argentina',
    colors: ['#00AEEF', '#FFFFFF', '#00AEEF'],
    logoSrc: argLogo,
    videoSrc: argVideo,
    heroTitle: 'Argentina Comparte: Una red que sigue creciendo',
    heroSubtitle: 'Uniendo esfuerzos por una sociedad más consciente',
    metrics: { people: '20,000+', companies: '120+', projects: '40+' },
    sectionsText: { whatWeDo: 'QUÉ HACEMOS EN ARGENTINA', impact: 'IMPACTO EN ARGENTINA', news: 'NOTICIAS LOCALES' }
  },
];
