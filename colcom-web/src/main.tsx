import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppRouter } from './routes/AppRouter.jsx';
import { CountryProvider } from './context/CountryContext.jsx';
import './styles/futuristic.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CountryProvider>
      <AppRouter />
    </CountryProvider>
  </React.StrictMode>,
);
