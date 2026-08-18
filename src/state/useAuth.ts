import { useCallback, useEffect, useRef, useState } from 'react';
import {
  API_ORIGIN,
  api,
  clearStoredTokens,
  getStoredTokens,
  storeTokens,
} from '../api/client';

interface AuthCallbackResult {
  code: string | null;
  error: string | null;
  handled: boolean;
}

const readCallbackResult = (): AuthCallbackResult => {
  const query = new URLSearchParams(window.location.search);
  const code = query.get('code');
  const callbackError = query.get('error_description') ?? query.get('error') ?? query.get('message');
  const handled = Boolean(code || callbackError || window.location.pathname.endsWith('/auth/callback'));

  return {
    code,
    error: callbackError ?? (handled && !code ? '카카오 로그인 코드가 없습니다.' : null),
    handled,
  };
};

const consumeCallbackResult = (): AuthCallbackResult => {
  const result = readCallbackResult();
  if (result.handled) {
    window.history.replaceState(window.history.state, '', import.meta.env.BASE_URL);
  }
  return result;
};

export function useAuth() {
  const [initialAuth] = useState(() => {
    const callback = consumeCallbackResult();
    return {
      callback,
      isLoggedIn: callback.code ? false : Boolean(getStoredTokens()),
    };
  });
  const [authError, setAuthError] = useState<string | null>(initialAuth.callback.error);
  const [isLoggedIn, setIsLoggedIn] = useState(initialAuth.isLoggedIn);
  const [isAuthLoading, setIsAuthLoading] = useState(Boolean(initialAuth.callback.code));
  const exchangeStarted = useRef(false);

  useEffect(() => {
    const sync = () => setIsLoggedIn(Boolean(getStoredTokens()));
    window.addEventListener('mcm:auth-changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('mcm:auth-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    const code = initialAuth.callback.code;
    if (!code || exchangeStarted.current) return;
    exchangeStarted.current = true;
    clearStoredTokens();

    api
      .exchangeLoginCode(code)
      .then((result) => {
        storeTokens(result.tokens);
        setAuthError(null);
      })
      .catch((error: unknown) => {
        setAuthError(error instanceof Error ? error.message : '카카오 로그인을 완료하지 못했습니다.');
      })
      .finally(() => {
        setIsAuthLoading(false);
      });
  }, [initialAuth.callback.code]);

  const loginWithKakao = useCallback(() => {
    setAuthError(null);
    window.location.assign(`${API_ORIGIN}/detective/auth/kakao/login`);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      clearStoredTokens();
    }
  }, []);

  const withdraw = useCallback(async () => {
    await api.withdrawMember();
    clearStoredTokens();
  }, []);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  return {
    isLoggedIn,
    isAuthLoading,
    authError,
    loginWithKakao,
    logout,
    withdraw,
    clearAuthError,
  };
}
