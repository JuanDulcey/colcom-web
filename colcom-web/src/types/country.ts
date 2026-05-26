export type CountryKey = 'colombia' | 'ecuador' | 'latam' | 'chile' | 'argentina';

export interface CountryThemeConfig {
  slug: CountryKey;
  name: string;
  eyebrow: string;
  title: string;
  desc: string;
  themeColor: string;
  rgbColor: { r: number; g: number; b: number };
  gradient: string;
}
