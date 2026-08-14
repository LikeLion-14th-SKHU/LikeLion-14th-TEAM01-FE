import { useCallback, useState } from 'react';

const AUTH_STORAGE_KEY = 'mcmAtelierLoggedIn';

const getStoredAuth = () => {
  try {
    return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(getStoredAuth);

  const loginWithKakao = useCallback(() => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsLoggedIn(false);
  }, []);

  return { isLoggedIn, loginWithKakao, logout };
}
