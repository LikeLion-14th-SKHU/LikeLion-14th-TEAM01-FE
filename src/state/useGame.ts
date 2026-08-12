import { useCallback, useEffect, useRef, useState } from 'react';
import type { Direction } from '../data/directions';

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
  | 'pass';

export interface GameState {
  sessionId: string;
  screen: Screen;
  designerName: string;
  direction: Direction['id'] | null;
  roomId: string | null;
  activeCharacterId: string | null;
  asked: Record<string, number>;
  answer: string | null;
}

const createSessionId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'game-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
};

const createInitialState = (): GameState => ({
  sessionId: createSessionId(),
  screen: 'intro',
  designerName: '',
  direction: null,
  roomId: null,
  activeCharacterId: null,
  asked: {},
  answer: null,
});

export const MAX_ASKS = 3;

const HISTORY_STATE_KEY = 'mcmGameState';

const getHistoryGameState = (historyState: unknown): GameState | null => {
  if (!historyState || typeof historyState !== 'object') return null;

  const gameState = (historyState as Record<string, unknown>)[HISTORY_STATE_KEY];
  if (!gameState || typeof gameState !== 'object' || !('screen' in gameState)) return null;

  return gameState as GameState;
};

export function useGame() {
  const [state, setState] = useState<GameState>(createInitialState);
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

      restoringHistory.current = true;
      previousState.current = restoredState;
      setState(restoredState);
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

  const go = useCallback((screen: Screen) => setState((s) => ({ ...s, screen })), []);

  const setDesignerName = useCallback(
    (designerName: string) => setState((s) => ({ ...s, designerName })),
    [],
  );

  const chooseDirection = useCallback(
    (direction: Direction['id']) => setState((s) => ({ ...s, direction, screen: 'rooms' })),
    [],
  );

  const enterRoom = useCallback(
    (roomId: string) => setState((s) => ({ ...s, roomId, screen: 'characters' })),
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
      })),
    [],
  );

  const submitAnswer = useCallback(
    (answer: string) => setState((s) => ({ ...s, answer, screen: 'result' })),
    [],
  );

  const reset = useCallback(() => setState(createInitialState()), []);

  return {
    state,
    go,
    setDesignerName,
    chooseDirection,
    enterRoom,
    openCharacter,
    closeCharacter,
    submitAnswer,
    reset,
  };
}
