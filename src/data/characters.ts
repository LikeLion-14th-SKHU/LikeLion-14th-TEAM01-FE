import type { CaseId, Character } from '../types/game';

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
  {
    id: 'felix',
    name: '펠릭스 슈미트',
    role: '제품 설계자',
    portrait: '/art/function.jpg',
    standing: '/art/function.jpg',
    openingStatement:
      '오후에 기능 테스트 준비를 끝내고 외부 미팅을 다녀왔습니다. 돌아와 보니 FUNCTION 설계도가 보이지 않았어요. 테스트 준비물과 설계도는 따로 보관해뒀습니다.',
  },
  {
    id: 'emil',
    name: '에밀 크뤼거',
    role: '테스트 담당자',
    portrait: '/art/function.jpg',
    standing: '/art/function.jpg',
    openingStatement:
      '준비된 물건을 테스트실로 옮겨 기능 테스트를 진행했습니다. 설계실에 있던 다른 물건에는 손대지 않았어요.',
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

export const FALLBACK_QUESTIONS: Record<string, string[]> = {
  clara: ['시안을 정확히 몇 시에 반납했나요?', '반납한 다음에는 어디로 갔나요?'],
  johannes: ['마지막 촬영은 몇 시였나요?', '빨간색 포트폴리오를 본 적 있나요?'],
  felix: [
    '테스트 준비물은 무엇이었나요?',
    'FUNCTION 설계도는 어디에 보관했나요?',
    '설계통을 보관한 뒤에는 어디로 갔나요?',
  ],
  emil: [
    '테스트실로 무엇을 가져갔나요?',
    '파란색 설계통을 본 적 있나요?',
    '테스트실에는 언제 들어갔나요?',
  ],
};
