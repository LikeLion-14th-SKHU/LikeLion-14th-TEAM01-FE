import { useCallback, useEffect, useState } from 'react';
import { API_ORIGIN, clearStoredTokens, getStoredTokens, storeTokens } from '../api/client';
import type { TokenResponse } from '../api/types';

const readCallbackTokens = (): TokenResponse | null => {
  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const value = (key: string) => query.get(key) ?? hash.get(key);
  const accessToken = value('accessToken');
  const refreshToken = value('refreshToken');
  if (!accessToken || !refreshToken) return null;

  return {
    tokenType: value('tokenType') ?? 'Bearer',
    accessToken,
    accessTokenExpiresIn: Number(value('accessTokenExpiresIn') ?? 0),
    refreshToken,
    refreshTokenExpiresIn: Number(value('refreshTokenExpiresIn') ?? 0),
  };
};

const consumeCallbackTokens = () => {
  const tokens = readCallbackTokens();
  if (!tokens) return;
  storeTokens(tokens);
  window.history.replaceState(window.history.state, '', window.location.pathname);
};

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    consumeCallbackTokens();
    return Boolean(getStoredTokens());
  });

  useEffect(() => {
    const sync = () => setIsLoggedIn(Boolean(getStoredTokens()));
    window.addEventListener('mcm:auth-changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('mcm:auth-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const loginWithKakao = useCallback(() => {
    window.location.assign(`${API_ORIGIN}/detective/auth/kakao/login`);
  }, []);

  const logout = useCallback(() => {
    clearStoredTokens();
  }, []);

  return { isLoggedIn, loginWithKakao, logout };
}
