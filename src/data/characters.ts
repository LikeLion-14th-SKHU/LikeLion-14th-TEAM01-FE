import type { CaseId, Character } from '../types/game';

export const CHARACTERS: Character[] = [
  {
    id: 'clara',
    name: '클라라',
    role: '패턴 장인',
    portrait: '/art/klara.png',
    standing: '/art/klara-cutout.png',
    standingScale: 0.9,
    backdrop: '/art/klara_room.png',
  },
  {
    id: 'johannes',
    name: '요하네스',
    role: '사진작가',
    portrait: '/art/johanes.png',
    standing: '/art/johanes-cutout.png',
    standingScale: 1.2,
    backdrop: '/art/johanes_room.png',
  },
  {
    id: 'felix',
    name: '펠릭스',
    role: '제품 설계자',
    portrait: '/art/felix.png',
    standing: '/art/felix-cutout.png',
    standingScale: 0.8,
    backdrop: '/art/felix_room.png',
  },
  {
    id: 'emil',
    name: '에밀',
    role: '테스트 담당자',
    portrait: '/art/emil.png',
    standing: '/art/emil-cutout.png',
    standingScale: 0.7,
    backdrop: '/art/emil_room.jpg',
  },
];

export const CASE_CHARACTERS: Record<CaseId, Character[]> = {
  signature: CHARACTERS.filter((character) => ['clara', 'johannes'].includes(character.id)),
  function: CHARACTERS.filter((character) => ['felix', 'emil'].includes(character.id)),
};

export const getCharacter = (id: string): Character => {
  const found = CHARACTERS.find((c) => c.id === id);
  if (!found) throw new Error('알 수 없는 인물: ' + id);
  return found;
};
