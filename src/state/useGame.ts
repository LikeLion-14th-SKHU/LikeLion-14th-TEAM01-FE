import { useCallback, useState } from 'react';
import { api } from '../api/client';
import type { CaseType, DesignDirection, GameProgressResponse } from '../api/types';
import { CASE_CHARACTERS, CHARACTER_TYPES } from '../data/characters';
import type { Direction } from '../data/directions';
import type { CaseId } from '../types/game';
import { clearStoredEvidenceDirection, storeEvidenceDirection } from '../lib/fieldEvidenceRoute';

export type RoomId = 'pattern' | 'drafting';

export type Screen =
  | 'intro'
  | 'judge-login'
  | 'register'
  | 'direction'
  | 'rooms'
  | 'briefing'
  | 'characters'
  | 'interrogation'
  | 'evidence'
  | 'deduction'
  | 'result'
  | 'heritage'
  | 'pass'
  | 'mypage';

export interface GameState {
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
  deductionCorrect: boolean | null;
  passEligible: boolean;
  isBusy: boolean;
  error: string | null;
}

export const MAX_ASKS = 3;

const createInitialState = (): GameState => ({
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
  deductionCorrect: null,
  passEligible: true,
  isBusy: false,
  error: null,
});

const directionToApi: Record<Direction['id'], DesignDirection> = {
  travel: 'TRAVEL',
  handsfree: 'HANDS_FREE',
  daily: 'DAILY_TRAVEL',
};

const directionFromApi: Record<DesignDirection, Direction['id']> = {
  TRAVEL: 'travel',
  HANDS_FREE: 'handsfree',
  DAILY_TRAVEL: 'daily',
};

const caseToApi: Record<CaseId, CaseType> = {
  signature: 'SIGNATURE',
  function: 'FUNCTION',
};

const caseFromApi: Record<CaseType, CaseId> = {
  SIGNATURE: 'signature',
  FUNCTION: 'function',
};

const getCompletedCases = (progress: GameProgressResponse): CaseId[] => {
  const completed: CaseId[] = [];
  if (progress.functionSucceeded) completed.push('function');
  if (progress.signatureSucceeded) completed.push('signature');
  return completed;
};

const stateFromProgress = (
  progress: GameProgressResponse,
  designerName: string,
): Partial<GameState> => {
  const direction = progress.designDirection
    ? directionFromApi[progress.designDirection]
    : null;
  const caseId = progress.currentCase ? caseFromApi[progress.currentCase] : null;
  const completedCases = getCompletedCases(progress);

  let screen: Screen;
  if (!designerName.trim()) screen = 'register';
  else if (!direction) screen = 'direction';
  else if (progress.status === 'IN_PROGRESS' && caseId) screen = 'characters';
  else if (progress.status === 'FAILED' || progress.status === 'COMPLETED') screen = 'heritage';
  else screen = 'rooms';

  return {
    designerName,
    direction,
    caseId,
    roomId: caseId === 'signature' ? 'pattern' : caseId === 'function' ? 'drafting' : null,
    completedCases,
    screen,
    passEligible: progress.status !== 'FAILED',
  };
};

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : '요청을 처리하지 못했습니다.';

export function useGame() {
  const [state, setState] = useState<GameState>(createInitialState);

  const clearError = useCallback(() => setState((current) => ({ ...current, error: null })), []);

  const hydrate = useCallback(async () => {
    setState((current) => ({ ...current, isBusy: true, error: null }));
    try {
      const [progress, myPage] = await Promise.all([api.getProgress(), api.getMyPage()]);
      const restored = stateFromProgress(progress, myPage.designerName ?? '');
      if (restored.direction) storeEvidenceDirection(restored.direction);
      const activeCase = progress.currentCase ? caseFromApi[progress.currentCase] : null;
      const asked: Record<string, number> = {};
      const interviewed: Record<string, boolean> = {};

      if (progress.status === 'IN_PROGRESS' && activeCase) {
        const conversations = await Promise.all(
          CASE_CHARACTERS[activeCase].map(async ({ id }) => ({
            id,
            conversation: await api.getConversation(CHARACTER_TYPES[id]),
          })),
        );
        for (const { id, conversation } of conversations) {
          asked[id] = conversation.questionCount;
          interviewed[id] = conversation.status === 'COMPLETED';
        }
      }

      setState((current) => ({
        ...current,
        ...restored,
        asked,
        interviewed,
        isBusy: false,
      }));
    } catch (error) {
      setState((current) => ({ ...current, isBusy: false, error: errorMessage(error) }));
      throw error;
    }
  }, []);

  const go = useCallback((screen: Screen) => setState((current) => ({ ...current, screen })), []);

  const setDesignerName = useCallback(
    (designerName: string) => setState((current) => ({ ...current, designerName })),
    [],
  );

  const registerDesigner = useCallback(async () => {
    const designerName = state.designerName.trim();
    if (!designerName) return;
    setState((current) => ({ ...current, isBusy: true, error: null }));
    try {
      await api.setDesignerName(designerName);
      setState((current) => ({ ...current, designerName, screen: 'direction', isBusy: false }));
    } catch (error) {
      setState((current) => ({ ...current, isBusy: false, error: errorMessage(error) }));
      throw error;
    }
  }, [state.designerName]);

  const chooseDirection = useCallback(async (direction: Direction['id']) => {
    setState((current) => ({ ...current, isBusy: true, error: null }));
    try {
      const progress = await api.selectDesignDirection(directionToApi[direction]);
      if (progress.designDirection) {
        storeEvidenceDirection(directionFromApi[progress.designDirection]);
      }
      setState((current) => ({
        ...current,
        ...stateFromProgress(progress, current.designerName),
        isBusy: false,
      }));
    } catch (error) {
      setState((current) => ({ ...current, isBusy: false, error: errorMessage(error) }));
      throw error;
    }
  }, []);

  const enterRoom = useCallback(async (roomId: RoomId) => {
    const caseId: CaseId = roomId === 'pattern' ? 'signature' : 'function';

    if (state.caseId === caseId) {
      setState((current) => ({
        ...current,
        roomId,
        screen: 'briefing',
        error: null,
      }));
      return;
    }

    setState((current) => ({ ...current, isBusy: true, error: null }));
    try {
      const progress = await api.selectCase(caseToApi[caseId]);
      setState((current) => ({
        ...current,
        ...stateFromProgress(progress, current.designerName),
        roomId,
        caseId,
        screen: 'briefing',
        asked: {},
        interviewed: {},
        isBusy: false,
      }));
    } catch (error) {
      setState((current) => ({ ...current, isBusy: false, error: errorMessage(error) }));
      throw error;
    }
  }, [state.caseId]);

  const startInvestigation = useCallback(
    () => setState((current) => ({ ...current, screen: 'characters' })),
    [],
  );

  const openCharacter = useCallback(
    (activeCharacterId: string) =>
      setState((current) => ({ ...current, activeCharacterId, screen: 'interrogation' })),
    [],
  );

  const closeCharacter = useCallback((id: string, asksUsed: number, completed = false) => {
    setState((current) => ({
      ...current,
      screen: 'characters',
      activeCharacterId: null,
      asked: { ...current.asked, [id]: asksUsed },
      interviewed: {
        ...current.interviewed,
        [id]: Boolean(current.interviewed[id]) || completed || asksUsed >= MAX_ASKS,
      },
    }));
  }, []);

  const submitAnswer = useCallback(async (answer: string) => {
    const characterType = CHARACTER_TYPES[answer];
    if (!characterType) return;
    setState((current) => ({ ...current, isBusy: true, error: null }));
    try {
      const result = await api.deduce(characterType);
      setState((current) => ({
        ...current,
        answer,
        deductionCorrect: result.correct,
        completedCases: getCompletedCases(result.progress),
        passEligible: result.progress.status !== 'FAILED',
        isBusy: false,
        screen: 'result',
      }));
    } catch (error) {
      setState((current) => ({ ...current, isBusy: false, error: errorMessage(error) }));
      throw error;
    }
  }, []);

  const completeCase = useCallback(() => {
    setState((current) => ({
      ...current,
      screen: current.completedCases.includes('signature') ? 'heritage' : 'rooms',
      roomId: null,
      caseId: null,
      activeCharacterId: null,
      answer: null,
      deductionCorrect: null,
    }));
  }, []);

  const endGameWithoutPass = useCallback(() => {
    setState((current) => ({
      ...current,
      screen: 'heritage',
      activeCharacterId: null,
      passEligible: false,
    }));
  }, []);

  const openMyPage = useCallback(() => {
    setState((current) =>
      current.screen === 'mypage'
        ? current
        : { ...current, returnScreen: current.screen, screen: 'mypage' },
    );
  }, []);

  const closeMyPage = useCallback(() => {
    setState((current) => ({
      ...current,
      screen: current.returnScreen ?? 'intro',
      returnScreen: null,
    }));
  }, []);

  const reset = useCallback(() => {
    clearStoredEvidenceDirection();
    setState(createInitialState());
  }, []);

  return {
    state,
    hydrate,
    clearError,
    go,
    setDesignerName,
    registerDesigner,
    chooseDirection,
    enterRoom,
    startInvestigation,
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
