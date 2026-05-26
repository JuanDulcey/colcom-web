import {
  apiRequest,
  clearSession,
  getStoredUser,
  getToken,
  saveSession,
  toQuery,
} from '../lib/api.ts';

export const getStoredAuth = () => {
  const accessToken = getToken();
  const user = getStoredUser();
  return accessToken ? { accessToken, user } : null;
};

export const setStoredAuth = (value) => {
  if (!value) {
    clearSession();
    return;
  }
  saveSession(value.accessToken, value.user);
};

export const clearStoredAuth = clearSession;
export { apiRequest, toQuery };
