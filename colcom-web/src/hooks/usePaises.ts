import { useCallback, useEffect, useState } from 'react';
import { API_BASE, getToken } from '../lib/api';
import type { ApiEnvelope, Pais } from '../types';

const isActiveCountry = (pais: Pais) => {
  const estado = String(pais.estado ?? 'activo').trim().toLowerCase();
  return estado === 'activo';
};

/**
 * Hook reutilizable que consume GET /api/paises.
 * Devuelve todos los paises activos de la DB sin listas hardcodeadas ni limites locales.
 */
export function usePaises() {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      // Usar endpoint público para no fallar en el frontend público
      const response = await fetch(`${API_BASE}/public/paises`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const res = await response.json() as ApiEnvelope<Pais[]>;

      if (!response.ok || !res.ok) {
        throw new Error(res.message || `Error HTTP ${response.status}`);
      }

      const activeCountries = Array.isArray(res.data) ? res.data.filter(isActiveCountry) : [];
      setPaises(activeCountries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los paises');
      setPaises([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { paises, loading, error, refresh };
}
