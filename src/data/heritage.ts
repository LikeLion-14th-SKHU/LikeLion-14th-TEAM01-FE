export interface HeritageItem {
    id: string;
    label: string;
    title: string;
    body: string;
    image: string;
    href: string;
  }
  
  export const HERITAGE: HeritageItem[] = [
    {
      id: 'visetos',
      label: 'VISETOS SIGNATURE',
      title: '비세토스 시그니처',
      body: '1976년 뮌헨에서 탄생한 코팅 캔버스 패턴. 월계수와 다이아몬드 모티프가 반복되는 시그니처 디자인.',
      image: '/art/heritage-visetos.jpg',
      href: '#product-visetos',
    },
    {
      id: 'straps',
      label: 'STRAPS & HANDLES',
      title: '스트랩 & 핸들',
      body: '이동 중에도 편안한 착용감을 제공하는 인체공학적 설계. 탈부착 크로스바디 스트랩과 견고한 가죽 핸들.',
      image: '/art/heritage-straps.jpg',
      href: '#product-straps',
    },
    {
      id: 'storage',
      label: 'STORAGE SYSTEM',
      title: '수납 구조',
      body: '여행과 일상을 위한 내부 수납 설계. 다중 포켓과 컴파트먼트로 소지품을 체계적으로 정리합니다.',
      image: '/art/heritage-storage.jpg',
      href: '#product-storage',
    },
    {
      id: 'travel',
      label: 'TRAVEL READY',
      title: '트래블 레디',
      body: '1976년부터 시작된 여행을 위한 장인정신. 경량 소재와 확장 가능한 구조, TSA 잠금장치까지.',
      image: '/art/heritage-travel.jpg',
      href: '#product-travel',
    },
  ];
  