import { useCallback, useEffect, useState } from 'react';
import { API_ORIGIN, clearStoredTokens, getStoredTokens, storeTokens } from '../api/client';
import type { TokenResponse } from '../api/types';

interface AuthCallbackResult {
  tokens: TokenResponse | null;
  error: string | null;
  handled: boolean;
}

const readCallbackResult = (): AuthCallbackResult => {
  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#\??/, ''));
  const value = (...keys: string[]) => {
    for (const key of keys) {
      const found = hash.get(key) ?? query.get(key);
      if (found) return found;
    }
    return null;
  };

  let nestedTokens: Partial<TokenResponse> | null = null;
  const serializedTokens = value('tokens');
  if (serializedTokens) {
    try {
      nestedTokens = JSON.parse(serializedTokens) as Partial<TokenResponse>;
    } catch {
      nestedTokens = null;
    }
  }

  const accessToken = value('accessToken', 'access_token') ?? nestedTokens?.accessToken ?? null;
  const refreshToken = value('refreshToken', 'refresh_token') ?? nestedTokens?.refreshToken ?? null;
  const error = value('error_description', 'error', 'message');
  const handled = Boolean(
    accessToken ||
      refreshToken ||
      error ||
      serializedTokens ||
      window.location.pathname.endsWith('/auth/callback'),
  );

  if (!accessToken || !refreshToken) {
    return {
      tokens: null,
      error: error ?? (handled ? '카카오 로그인 결과에 인증 토큰이 없습니다.' : null),
      handled,
    };
  }

  return {
    tokens: {
      tokenType: value('tokenType', 'token_type') ?? nestedTokens?.tokenType ?? 'Bearer',
      accessToken,
      accessTokenExpiresIn: Number(
        value('accessTokenExpiresIn', 'access_token_expires_in') ??
          nestedTokens?.accessTokenExpiresIn ??
          0,
      ),
      refreshToken,
      refreshTokenExpiresIn: Number(
        value('refreshTokenExpiresIn', 'refresh_token_expires_in') ??
          nestedTokens?.refreshTokenExpiresIn ??
          0,
      ),
    },
    error: null,
    handled,
  };
};

const consumeCallbackResult = (): string | null => {
  const result = readCallbackResult();
  if (!result.handled) return null;
  if (result.tokens) storeTokens(result.tokens);
  window.history.replaceState(window.history.state, '', import.meta.env.BASE_URL);
  return result.error;
};

export function useAuth() {
  const [initialAuth] = useState(() => {
    const error = consumeCallbackResult();
    return { error, isLoggedIn: Boolean(getStoredTokens()) };
  });
  const [authError, setAuthError] = useState<string | null>(initialAuth.error);
  const [isLoggedIn, setIsLoggedIn] = useState(initialAuth.isLoggedIn);

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
    setAuthError(null);
    window.location.assign(`${API_ORIGIN}/detective/auth/kakao/login`);
  }, []);

  const logout = useCallback(() => {
    clearStoredTokens();
  }, []);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  return { isLoggedIn, authError, loginWithKakao, logout, clearAuthError };
}
