import type { Character } from '../types/game';

export const CHARACTERS: Character[] = [
  {
    id: 'clara',
    name: '클라라 바우어',
    role: '패턴 장인',
    portrait: '/art/clara-portrait.png',
    standing: '/art/clara-standing.png',
  },
  {
    id: 'johannes',
    name: '요하네스',
    role: '사진작가',
    portrait: '/art/johannes-portrait.png',
    standing: '/art/johannes-standing.png',
  },
];

export const getCharacter = (id: string): Character => {
  const found = CHARACTERS.find((c) => c.id === id);
  if (!found) throw new Error('알 수 없는 인물: ' + id);
  return found;
};

// export const FALLBACK_QUESTIONS: Record<string, string[]> = {
//   clara: ['시안을 정확히 몇 시에 반납했나요?', '반납한 다음에는 어디로 갔나요?'],
//   johannes: ['마지막 촬영은 몇 시였나요?', '빨간색 포트폴리오를 본 적 있나요?'],
// };
