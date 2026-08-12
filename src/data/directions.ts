export interface Direction {
    id: 'trolley' | 'backpack' | 'tote';
    badge: 'A' | 'B' | 'C';
    title: string;
    family: string;
    description: string;
    image: string;
    track: string;
  }
  
  export const DIRECTIONS: Direction[] = [
    {
      id: 'trolley',
      badge: 'A',
      title: '이동이 많은 여행자를 위한 제품',
      family: '트롤리 · 위켄더 계열',
      description: '공항과 호텔을 오가는 글로벌 노마드를 위한 설계. 내구성과 수납력을 극대화합니다.',
      image: '/art/direction-trolley.jpg',
      track: '트롤리 트랙',
    },
    {
      id: 'backpack',
      badge: 'B',
      title: '도시를 걷는 사람을 위한 제품',
      family: '백팩 · 크로스바디 계열',
      description: '매일의 이동에 맞춘 경량 구조. 한 손으로 여닫는 플랩과 밀착 스트랩.',
      image: '/art/direction-backpack.jpg',
      track: '백팩 트랙',
    },
    {
      id: 'tote',
      badge: 'C',
      title: '일과 여행을 함께 담는 제품',
      family: '토트 · 브리프 계열',
      description: '서류와 짐을 한 번에. 아틀리에의 가죽 마감과 확장 가능한 내부 구조.',
      image: '/art/direction-tote.jpg',
      track: '토트 트랙',
    },
  ];
  