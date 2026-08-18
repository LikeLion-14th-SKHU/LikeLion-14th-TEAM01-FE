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
  result: {
    title: string;
    description: string;
    productUrl: string | null;
  };
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
    result: {
      title: 'Aren 비세토스 크로스바디',
      description: '두 손을 자유롭게 유지하면서 필요한 소지품을 가까이 둘 수 있도록 완성한 컴팩트 디자인입니다.',
      productUrl: null,
    },
  },
  {
    id: 'daily',
    badge: 'B',
    title: '데일리 트래블',
    family: '쇼퍼 · 데일리 & 트래블',
    description: '출근부터 여행까지. 일상과 이동에 필요한 물건을 편안하게 담는 여유로운 가방입니다.',
    artwork: {
      silhouette: '/art/bag-daily-silhouette.png',
      patternless: '/art/bag-daily-patternless.png',
      complete: '/art/bag-daily-complete.png',
      frameAspectRatio: 767 / 936,
    },
    track: '데일리 디자인',
    result: {
      title: 'Leni 비세토스 쇼퍼',
      description: '출근과 가벼운 외출에 필요한 물건을 편안하게 담을 수 있도록 완성한 데일리 디자인입니다.',
      productUrl: null,
    },
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
    result: {
      title: 'Ottomar 비세토스 위켄더',
      description: '여정에 필요한 넉넉한 수납과 안정적인 휴대성을 결합해 완성한 트래블 디자인입니다.',
      productUrl: null,
    },
  },
];
