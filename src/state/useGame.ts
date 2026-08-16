import { useCallback, useEffect, useRef, useState } from 'react';
import type { Direction } from '../data/directions';
import { getCase } from '../data/case';
import type { CaseId } from '../types/game';

export type RoomId = 'pattern' | 'drafting';

export type Screen =
  | 'intro'
  | 'register'
  | 'direction'
  | 'rooms'
  | 'characters'
  | 'interrogation'
  | 'evidence'
  | 'deduction'
  | 'result'
  | 'heritage'
  | 'pass'
  | 'mypage';

export interface GameState {
  sessionId: string;
  screen: Screen;
  returnScreen: Exclude<Screen, 'mypage'> | null;
  designerName: string;
  direction: Direction['id'] | null;
  roomId: RoomId | null;
  caseId: CaseId | null;
  completedCases: CaseId[];
  activeCharacterId: string | null;
  asked: Record<string, number>;
  interviewed: Record<string, boolean>;
  answer: string | null;
  passEligible: boolean;
}

const createSessionId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'game-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
};

const createInitialState = (): GameState => ({
  sessionId: createSessionId(),
  screen: 'intro',
  returnScreen: null,
  designerName: '',
  direction: null,
  roomId: null,
  caseId: null,
  completedCases: [],
  activeCharacterId: null,
  asked: {},
  interviewed: {},
  answer: null,
  passEligible: true,
});

export const MAX_ASKS = 3;

const HISTORY_STATE_KEY = 'mcmGameState';
const ATTEMPT_STORAGE_KEY = 'mcmCaseAttempts';

interface CaseAttempt {
  answer: string;
  correct: boolean;
}

type SessionAttempts = Partial<Record<CaseId, CaseAttempt>>;
type AttemptStore = Record<string, SessionAttempts>;

const isCaseId = (value: unknown): value is CaseId =>
  value === 'signature' || value === 'function';

const isCaseAttempt = (value: unknown): value is CaseAttempt => {
  if (!value || typeof value !== 'object') return false;
  const attempt = value as Partial<CaseAttempt>;
  return typeof attempt.answer === 'string' && typeof attempt.correct === 'boolean';
};

const getAttemptStore = (): AttemptStore => {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.sessionStorage.getItem(ATTEMPT_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as AttemptStore) : {};
  } catch {
    return {};
  }
};

const getSessionAttempts = (sessionId: string): SessionAttempts => {
  const stored = getAttemptStore()[sessionId];
  if (!stored || typeof stored !== 'object') return {};

  return {
    function: isCaseAttempt(stored.function) ? stored.function : undefined,
    signature: isCaseAttempt(stored.signature) ? stored.signature : undefined,
  };
};

const getCaseAttempt = (sessionId: string, caseId: CaseId): CaseAttempt | null =>
  getSessionAttempts(sessionId)[caseId] ?? null;

const saveCaseAttempt = (sessionId: string, caseId: CaseId, attempt: CaseAttempt) => {
  try {
    const store = getAttemptStore();
    window.sessionStorage.setItem(
      ATTEMPT_STORAGE_KEY,
      JSON.stringify({
        ...store,
        [sessionId]: { ...store[sessionId], [caseId]: attempt },
      }),
    );
  } catch {
    // sessionStorage가 차단된 환경에서는 현재 히스토리 상태로만 진행합니다.
  }
};

const clearSessionAttempts = (sessionId: string) => {
  try {
    const store = getAttemptStore();
    delete store[sessionId];
    window.sessionStorage.setItem(ATTEMPT_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // 저장소 정리에 실패해도 새 sessionId로 게임을 다시 시작할 수 있습니다.
  }
};

const getHistoryGameState = (historyState: unknown): GameState | null => {
  if (!historyState || typeof historyState !== 'object') return null;

  const gameState = (historyState as Record<string, unknown>)[HISTORY_STATE_KEY];
  if (!gameState || typeof gameState !== 'object' || !('screen' in gameState)) return null;

  const stored = gameState as Partial<GameState>;

  const initialState = createInitialState();

  return {
    ...initialState,
    ...stored,
    sessionId: typeof stored.sessionId === 'string' ? stored.sessionId : initialState.sessionId,
    caseId: isCaseId(stored.caseId) ? stored.caseId : null,
    completedCases: Array.isArray(stored.completedCases)
      ? stored.completedCases.filter(isCaseId)
      : [],
    asked: stored.asked ?? {},
    interviewed: stored.interviewed ?? {},
  };
};

const LOCKED_CASE_SCREENS: Screen[] = [
  'characters',
  'interrogation',
  'evidence',
  'deduction',
];

const reconcileAttemptState = (state: GameState): GameState => {
  const attempts = getSessionAttempts(state.sessionId);
  const hasFailedAttempt = Object.values(attempts).some(
    (attempt) => attempt && !attempt.correct,
  );
  const passEligible = state.passEligible && !hasFailedAttempt;

  if (!state.caseId) return passEligible === state.passEligible ? state : { ...state, passEligible };

  const attempt = attempts[state.caseId];
  if (!attempt) return passEligible === state.passEligible ? state : { ...state, passEligible };

  if (state.screen === 'result' || LOCKED_CASE_SCREENS.includes(state.screen)) {
    return {
      ...state,
      screen: 'result',
      activeCharacterId: null,
      answer: attempt.answer,
      passEligible,
    };
  }

  return passEligible === state.passEligible ? state : { ...state, passEligible };
};

const getInitialGameState = (): GameState => {
  if (typeof window === 'undefined') return createInitialState();
  const restoredState = getHistoryGameState(window.history.state);
  return restoredState ? reconcileAttemptState(restoredState) : createInitialState();
};

export function useGame() {
  const [state, setState] = useState<GameState>(getInitialGameState);
  const previousState = useRef(state);
  const restoringHistory = useRef(false);
  const historyReady = useRef(false);

  useEffect(() => {
    const initialState = previousState.current;

    window.history.replaceState(
      { ...window.history.state, [HISTORY_STATE_KEY]: initialState },
      '',
    );
    historyReady.current = true;

    const handlePopState = (event: PopStateEvent) => {
      const restoredState = getHistoryGameState(event.state);
      if (!restoredState) return;
      const reconciledState = reconcileAttemptState(restoredState);

      restoringHistory.current = true;
      previousState.current = reconciledState;
      window.history.replaceState(
        { ...event.state, [HISTORY_STATE_KEY]: reconciledState },
        '',
      );
      setState(reconciledState);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!historyReady.current) return;

    if (restoringHistory.current) {
      restoringHistory.current = false;
      return;
    }

    const previous = previousState.current;
    const nextHistoryState = { ...window.history.state, [HISTORY_STATE_KEY]: state };

    if (previous.screen === state.screen) {
      window.history.replaceState(nextHistoryState, '');
    } else {
      window.history.pushState(nextHistoryState, '');
    }

    previousState.current = state;
  }, [state]);

  const go = useCallback(
    (screen: Screen) => setState((s) => reconcileAttemptState({ ...s, screen })),
    [],
  );

  const setDesignerName = useCallback(
    (designerName: string) => setState((s) => ({ ...s, designerName })),
    [],
  );

  const chooseDirection = useCallback(
    (direction: Direction['id']) => setState((s) => ({ ...s, direction, screen: 'rooms' })),
    [],
  );

  const enterRoom = useCallback(
    (roomId: RoomId) =>
      setState((s) => {
        const caseId = roomId === 'pattern' ? 'signature' : 'function';
        const attempt = getCaseAttempt(s.sessionId, caseId);

        if (attempt) {
          return {
            ...s,
            roomId,
            caseId,
            activeCharacterId: null,
            answer: attempt.answer,
            passEligible: s.passEligible && attempt.correct,
            screen: 'result',
          };
        }

        return {
          ...s,
          roomId,
          caseId,
          answer: null,
          screen: 'characters',
        };
      }),
    [],
  );

  const openCharacter = useCallback(
    (activeCharacterId: string) =>
      setState((s) => ({ ...s, activeCharacterId, screen: 'interrogation' })),
    [],
  );

  const closeCharacter = useCallback(
    (id: string, asksUsed: number) =>
      setState((s) => ({
        ...s,
        screen: 'characters',
        activeCharacterId: null,
        asked: { ...s.asked, [id]: Math.max(s.asked[id] ?? 0, asksUsed) },
        interviewed: { ...s.interviewed, [id]: true },
      })),
    [],
  );

  const submitAnswer = useCallback(
    (answer: string) =>
      setState((s) => {
        if (!s.caseId) return s;

        const storedAttempt = getCaseAttempt(s.sessionId, s.caseId);
        const attempt =
          storedAttempt ??
          ({
            answer,
            correct: answer === getCase(s.caseId).correctAnswer,
          } satisfies CaseAttempt);

        if (!storedAttempt) saveCaseAttempt(s.sessionId, s.caseId, attempt);

        return {
          ...s,
          answer: attempt.answer,
          passEligible: s.passEligible && attempt.correct,
          screen: 'result',
        };
      }),
    [],
  );

  const completeCase = useCallback(
    () =>
      setState((s) => {
        if (!s.caseId) return s;

        const completedCases = s.completedCases.includes(s.caseId)
          ? s.completedCases
          : [...s.completedCases, s.caseId];
        const allCompleted =
          s.caseId === 'signature' && completedCases.includes('function');

        return {
          ...s,
          screen: allCompleted ? 'heritage' : 'rooms',
          roomId: null,
          caseId: null,
          activeCharacterId: null,
          completedCases,
          answer: null,
        };
      }),
    [],
  );

  const endGameWithoutPass = useCallback(
    () =>
      setState((s) => ({
        ...s,
        screen: 'heritage',
        roomId: null,
        caseId: null,
        activeCharacterId: null,
        answer: null,
        passEligible: false,
      })),
    [],
  );

  const openMyPage = useCallback(
    () =>
      setState((s) =>
        s.screen === 'mypage'
          ? s
          : { ...s, returnScreen: s.screen, screen: 'mypage' },
      ),
    [],
  );

  const closeMyPage = useCallback(
    () =>
      setState((s) =>
        reconcileAttemptState({
          ...s,
          screen: s.returnScreen ?? 'intro',
          returnScreen: null,
        }),
      ),
    [],
  );

  const reset = useCallback(() => {
    clearSessionAttempts(state.sessionId);
    setState(createInitialState());
  }, [state.sessionId]);

  return {
    state,
    go,
    setDesignerName,
    chooseDirection,
    enterRoom,
    openCharacter,
    closeCharacter,
    submitAnswer,
    completeCase,
    endGameWithoutPass,
    openMyPage,
    closeMyPage,
    reset,
  };
}
