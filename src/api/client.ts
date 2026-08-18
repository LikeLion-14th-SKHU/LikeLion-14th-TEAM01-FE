import type {
  ApiResponse,
  CaseType,
  CharacterType,
  ConversationResponse,
  DesignDirection,
  FinalDeductionResponse,
  GameProgressResponse,
  LoginExchangeResponse,
  MyPageResponse,
  ProductRecommendationResponse,
  TokenResponse,
} from './types';

export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN?.replace(/\/$/, '') ?? 'https://mcm-api.i1000u.store';
const API_BASE_URL = import.meta.env.DEV
  ? '/backend'
  : (import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? API_ORIGIN);
const TOKEN_STORAGE_KEY = 'mcmAuthTokens';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

const readTokens = (): TokenResponse | null => {
  try {
    const raw = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<TokenResponse>;
    return parsed.accessToken && parsed.refreshToken ? (parsed as TokenResponse) : null;
  } catch {
    return null;
  }
};

export const getStoredTokens = readTokens;

export const storeTokens = (tokens: TokenResponse) => {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  window.dispatchEvent(new Event('mcm:auth-changed'));
};

export const clearStoredTokens = () => {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.dispatchEvent(new Event('mcm:auth-changed'));
};

const parseResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    // 아래에서 HTTP 상태를 사용해 일관된 오류로 변환합니다.
  }

  if (!response.ok || !payload?.success) {
    throw new ApiError(
      payload?.message || `요청을 처리하지 못했습니다. (${response.status})`,
      response.status,
      payload?.code,
    );
  }
  return payload;
};

let refreshPromise: Promise<TokenResponse> | null = null;

const refreshTokens = async (): Promise<TokenResponse> => {
  const current = readTokens();
  if (!current?.refreshToken) throw new ApiError('로그인이 필요합니다.', 401, 'UNAUTHORIZED');

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/detective/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: current.refreshToken }),
    })
      .then((response) => parseResponse<TokenResponse>(response))
      .then(({ data }) => {
        storeTokens(data);
        return data;
      })
      .catch((error) => {
        clearStoredTokens();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

interface RequestOptions extends RequestInit {
  authenticated?: boolean;
  retryOnUnauthorized?: boolean;
}

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { authenticated = true, retryOnUnauthorized = true, headers, ...init } = options;
  const tokens = readTokens();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(authenticated && tokens?.accessToken
        ? { Authorization: `${tokens.tokenType || 'Bearer'} ${tokens.accessToken}` }
        : {}),
      ...headers,
    },
  });

  if (response.status === 401 && authenticated && retryOnUnauthorized && tokens?.refreshToken) {
    await refreshTokens();
    return request<T>(path, { ...options, retryOnUnauthorized: false });
  }

  return (await parseResponse<T>(response)).data;
};

const requestNoContent = async (path: string, options: RequestOptions = {}): Promise<void> => {
  const { authenticated = true, retryOnUnauthorized = true, headers, ...init } = options;
  const tokens = readTokens();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(authenticated && tokens?.accessToken
        ? { Authorization: `${tokens.tokenType || 'Bearer'} ${tokens.accessToken}` }
        : {}),
      ...headers,
    },
  });

  if (response.status === 401 && authenticated && retryOnUnauthorized && tokens?.refreshToken) {
    await refreshTokens();
    return requestNoContent(path, { ...options, retryOnUnauthorized: false });
  }

  if (!response.ok) await parseResponse<never>(response);
};

export const api = {
  exchangeLoginCode: (code: string) =>
    request<LoginExchangeResponse>('/detective/auth/exchange', {
      method: 'POST',
      body: JSON.stringify({ code }),
      authenticated: false,
    }),
  logout: () => requestNoContent('/detective/auth/logout', { method: 'POST' }),
  withdrawMember: () => requestNoContent('/detective/members/me', { method: 'DELETE' }),
  setDesignerName: (designerName: string) =>
    request<{ designerName: string }>('/detective/designer-name', {
      method: 'POST',
      body: JSON.stringify({ designerName }),
    }),
  selectDesignDirection: (designDirection: DesignDirection) =>
    request<GameProgressResponse>('/detective/games/design-direction', {
      method: 'POST',
      body: JSON.stringify({ designDirection }),
    }),
  selectCase: (currentCase: CaseType) =>
    request<GameProgressResponse>('/detective/games/current-case', {
      method: 'POST',
      body: JSON.stringify({ currentCase }),
    }),
  getProgress: () => request<GameProgressResponse>('/detective/games'),
  getConversation: (characterType: CharacterType) =>
    request<ConversationResponse>(`/detective/conversations/${characterType}`),
  askCharacter: (characterType: CharacterType, content: string) =>
    request<ConversationResponse>(`/detective/conversations/${characterType}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
  completeConversation: (characterType: CharacterType) =>
    request<ConversationResponse>(`/detective/conversations/${characterType}/complete`, {
      method: 'POST',
    }),
  deduce: (characterType: CharacterType) =>
    request<FinalDeductionResponse>('/detective/games/final-deduction', {
      method: 'POST',
      body: JSON.stringify({ characterType }),
    }),
  getMyPage: () => request<MyPageResponse>('/detective/mypage'),
  getProductRecommendations: () =>
    request<ProductRecommendationResponse>('/detective/products/recommendation'),
};
