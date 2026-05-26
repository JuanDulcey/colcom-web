import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiRequest, clearSession, getStoredUser, saveSession } from '../lib/api';
import type { User } from '../types';

interface LoginResponse {
  accessToken: string;
  user: User;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onLogout = () => setUser(null);
    window.addEventListener('colcom:logout', onLogout);
    return () => window.removeEventListener('colcom:logout', onLogout);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: { username, password },
      });
      saveSession(res.data.accessToken, res.data.user);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error de conexion';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    history.pushState({}, '', '/login');
    window.dispatchEvent(new Event('colcom:navigate'));
  }, []);

  const getSecurityQuestion = useCallback((username: string) => (
    apiRequest<{ pregunta_seguridad: string }>('/auth/security-question', {
      method: 'POST',
      body: { username },
    })
  ), []);

  const forgotPassword = useCallback((payload: {
    username: string;
    respuesta_seguridad: string;
    new_password: string;
  }) => apiRequest('/auth/forgot-password', { method: 'POST', body: payload }), []);

  const changePassword = useCallback((payload: {
    current_password: string;
    new_password: string;
  }) => apiRequest('/auth/change-my-password', { method: 'PATCH', body: payload }), []);

  return useMemo(() => ({
    user,
    role: user?.rol || null,
    isAuthenticated: Boolean(user),
    loading,
    error,
    login,
    logout,
    getSecurityQuestion,
    forgotPassword,
    changePassword,
  }), [user, loading, error, login, logout, getSecurityQuestion, forgotPassword, changePassword]);
}
