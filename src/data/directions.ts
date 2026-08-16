export interface DirectionArtwork {
  silhouette: string;
  patternless: string;
  complete: string;
  frameAspectRatio: number;
}

export interface Direction {
  id: 'handsfree' | 'daily' | 'travel';
  badge: 'A' | 'B' | 'C';
  title: string;
  family: string;
  description: string;
  artwork: DirectionArtwork;
  track: string;
}

export const DIRECTIONS: Direction[] = [
  {
    id: 'handsfree',
    badge: 'A',
    title: '핸즈프리',
    family: '크로스바디 · 컴팩트',
    description: '두 손은 자유롭게, 필요한 소지품은 가까이. 가벼운 이동에 어울리는 밀착형 가방입니다.',
    artwork: {
      silhouette: '/art/bag-handsfree-silhouette.png',
      patternless: '/art/bag-handsfree-patternless.png',
      complete: '/art/bag-handsfree-complete.png',
      frameAspectRatio: 965 / 434,
    },
    track: '핸즈프리 디자인',
  },
  {
    id: 'daily',
    badge: 'B',
    title: '일상',
    family: '쇼퍼 · 데일리 토트',
    description: '출근부터 가벼운 외출까지. 매일의 물건을 편안하게 담는 여유로운 가방입니다.',
    artwork: {
      silhouette: '/art/bag-daily-silhouette.png',
      patternless: '/art/bag-daily-patternless.png',
      complete: '/art/bag-daily-complete.png',
      frameAspectRatio: 767 / 936,
    },
    track: '데일리 디자인',
  },
  {
    id: 'travel',
    badge: 'C',
    title: '여행',
    family: '위켄더 · 트래블',
    description: '낯선 도시로 떠나는 여정에 맞춰 넉넉한 수납과 안정적인 휴대성을 갖춘 가방입니다.',
    artwork: {
      silhouette: '/art/bag-travel-silhouette.png',
      patternless: '/art/bag-travel-patternless.png',
      complete: '/art/bag-travel-complete.png',
      frameAspectRatio: 1061 / 743,
    },
    track: '트래블 디자인',
  },
];
