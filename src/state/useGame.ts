import { useCallback, useState } from 'react';
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

export function useGame() {
  const [state, setState] = useState<GameState>(createInitialState);

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
