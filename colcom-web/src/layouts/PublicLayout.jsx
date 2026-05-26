import { PublicHeader } from '../components/public/PublicHeader';
import { PublicFooter } from '../components/public/PublicFooter.jsx';
import { useCountry } from '../hooks/useCountry';

export function PublicLayout({ children }) {
  const { activeCountry } = useCountry();
  
  const colors = activeCountry?.colors || ['#00AEEF', '#E72B5A', '#FF7A50'];
  
  return (
    <div style={{
      '--color-primary': colors[0],
      '--color-secondary': colors[1] || colors[0],
      '--color-tertiary': colors[2] || colors[0],
    }}>
      <PublicHeader />
      {children}
      <PublicFooter />
    </div>
  );
}
