import type { FieldEvidenceCharacterId } from '../data/fieldEvidence';
import type { Direction } from '../data/directions';

const DIRECTION_STORAGE_KEY = 'mcmSelectedDesignDirection';
const characterAliases: Record<string, FieldEvidenceCharacterId> = {
  clara: 'clara',
  emil: 'emil',
  felix: 'felix',
  johan: 'johannes',
  johannes: 'johannes',
};
const directionAliases: Record<string, Direction['id']> = {
  common: 'daily',
  daily: 'daily',
  'daily-travel': 'daily',
  handsfree: 'handsfree',
  'hands-free': 'handsfree',
  travel: 'travel',
};

export const getFieldEvidenceCharacterId = (): FieldEvidenceCharacterId | null => {
  if (typeof window === 'undefined') return null;

  const segments = window.location.pathname.toLowerCase().split('/').filter(Boolean);
  const evidenceIndex = segments.lastIndexOf('evidence');
  const pathCharacter = evidenceIndex >= 0 ? segments[evidenceIndex + 1] : undefined;
  const queryCharacter = new URLSearchParams(window.location.search).get('evidence')?.toLowerCase();

  return characterAliases[pathCharacter ?? queryCharacter ?? ''] ?? null;
};

export const getRequestedEvidenceDirection = (): Direction['id'] | null => {
  if (typeof window === 'undefined') return null;
  const requested = new URLSearchParams(window.location.search).get('direction')?.toLowerCase();
  return directionAliases[requested ?? ''] ?? null;
};

export const getStoredEvidenceDirection = (): Direction['id'] | null => {
  if (typeof window === 'undefined') return null;
  try {
    return directionAliases[window.localStorage.getItem(DIRECTION_STORAGE_KEY) ?? ''] ?? null;
  } catch {
    return null;
  }
};

export const storeEvidenceDirection = (direction: Direction['id']) => {
  try {
    window.localStorage.setItem(DIRECTION_STORAGE_KEY, direction);
  } catch {
    // 저장소를 사용할 수 없어도 현재 화면의 증거는 정상적으로 표시한다.
  }
};

export const clearStoredEvidenceDirection = () => {
  try {
    window.localStorage.removeItem(DIRECTION_STORAGE_KEY);
  } catch {
    // 저장소를 사용할 수 없는 환경에서는 정리할 값도 없다.
  }
};
