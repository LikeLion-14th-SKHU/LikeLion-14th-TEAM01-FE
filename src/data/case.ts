import type { CaseId } from '../types/game';

export interface EvidenceDoc {
  id: string;
  title: string;
  subtitle: string;
  lines: { text: string; highlight?: boolean; heading?: boolean }[];
}

export interface DeductionOption {
  id: string;
  badge: 'A' | 'B';
  text: string;
}

export interface CaseDefinition {
  id: CaseId;
  number: 1 | 2;
  briefingTitle: string;
  briefing: string[];
  investigationTitle: string;
  investigationDescription: string;
  evidence: EvidenceDoc[];
  deductionQuestion: string;
  deductionOptions: DeductionOption[];
  correctAnswer: string;
  resolution: {
    title: string;
    body: string;
    reasons: string[];
  };
}

export const CASES: Record<CaseId, CaseDefinition> = {
  signature: {
    id: 'signature',
    number: 2,
    briefingTitle: '패턴 시안',
    briefing: [
      '신제품 발표를 앞두고 외관과 비세토스 무늬가 담긴 패턴 시안이 사라졌습니다.',
      '• 패턴 장인 클라라: “패턴 시안 작업을 마치고 제자리에 분명히 반납했습니다.”',
      '• 사진작가 요하네스: “촬영 준비로 바빴을 뿐, 시안에는 손대지 않았습니다.”',
      '시안을 마지막으로 다룬 클라라와 반납 장소 주변에 있던 요하네스를 심문해 사라진 패턴 시안의 행방을 밝혀내세요.',
    ],
    investigationTitle: '패턴실 조사',
    investigationDescription: '사라진 패턴 시안에 대해 용의자들에게 질문하세요.',
    evidence: [
      {
        id: 'archive',
        title: 'QR 증거 A · 아카이브 기록',
        subtitle: '클라라의 대여 / 반납 기록',
        lines: [
          { text: 'MCM ARCHIVE RECORD', heading: true },
          { text: '문서번호: SIG-1976-01' },
          { text: '대여자: Clara' },
          { text: '대여 시각: 14:02' },
          { text: '반납 시각: 15:11', highlight: true },
          { text: '보관 상태:', heading: true },
          { text: 'RP-03' },
          { text: '아카이브 카트' },
          { text: '염색실 ACCESS LOG', heading: true },
          { text: 'Clara' },
          { text: '입실: 15:14', highlight: true },
          { text: '퇴실: 16:06', highlight: true },
        ],
      },
      {
        id: 'contact',
        title: 'QR 증거 B · 촬영실 콘택트시트',
        subtitle: '요하네스의 촬영 기록',
        lines: [
          { text: '촬영실 CONTACT SHEET', heading: true },
          { text: '촬영자: Leon' },
          { text: '프레임 번호: 27' },
          { text: '촬영 시각: 15:52', highlight: true },
          { text: '촬영 장소: Studio B' },
        ],
      },
    ],
    deductionQuestion: '증언과 현장 기록을 종합했을 때 패턴 시안을 가져간 용의자는 누구인가?',
    deductionOptions: [
      { id: 'clara', badge: 'A', text: '클라라 · 패턴 장인' },
      { id: 'johannes', badge: 'B', text: '요하네스 · 사진작가' },
    ],
    correctAnswer: 'johannes',
    resolution: {
      title: '사건 종결',
      body:
        '요하네스는 패턴 사진을 추가로 촬영하기 위해 RP-03을 촬영 테이블로 옮겼습니다. 추가 촬영 후 패턴 시안을 RP-03에 넣어두고 아카이브 카트에 반납하지 않았으며, RP-03 안에서 패턴 시안이 발견됐습니다.',
      reasons: [
        '클라라는 15:11에 시안을 RP-03에 넣어 반납',
        '클라라는 15:14부터 염색실에 있었음',
        '요하네스는 마지막 촬영이 15:40이었다고 주장',
        '하지만 15:52 콘택트시트에 RP-03이 등장',
        '요하네스는 RP-03을 본 적 없다고 증언',
      ],
    },
  },
  function: {
    id: 'function',
    number: 1,
    briefingTitle: '기능 시안',
    briefing: [
      '가방의 스트랩과 수납 구조가 담긴 기능 시안이 테스트 직후 사라졌습니다.',
      '• 제품 설계자 펠릭스: “기능 시안을 파란색 보관통에 분명히 넣어두었습니다.”',
      '• 테스트 담당자 에밀: “저는 기능 시안을 본 적도 없습니다.”',
      '서로 엇갈리는 주장을 하는 두 사람을 심문해 사라진 기능 시안의 행방을 밝혀내세요.',
    ],
    investigationTitle: '설계실 조사',
    investigationDescription: '사라진 기능 시안에 대해 용의자들에게 질문하세요.',
    evidence: [
      {
        id: 'felix-record',
        title: 'QR 증거 A · 펠릭스의 기록',
        subtitle: '기능 시안 보관 및 퇴실 기록',
        lines: [
          { text: 'DESIGN DOCUMENT RECORD', heading: true },
          { text: '문서: 기능 시안' },
          { text: '보관 물품: 파란색 보관통', highlight: true },
          { text: '보관 위치: Felix 설계 테이블' },
          { text: '보관 시각: 16:30' },
          { text: 'EXIT LOG', heading: true },
          { text: 'Felix' },
          { text: '퇴실: 16:40', highlight: true },
          { text: '재입실 기록: 없음', highlight: true },
        ],
      },
      {
        id: 'emil-record',
        title: 'QR 증거 B · 에밀의 기록',
        subtitle: '테스트실 입실 및 반입 물품 기록',
        lines: [
          { text: '테스트실 ENTRY RECORD', heading: true },
          { text: '입실자: Emil' },
          { text: '입실 시각: 17:20', highlight: true },
          { text: '반입 물품:', heading: true },
          { text: '· 여행용 프로토타입' },
          { text: '· 8kg 테스트 추' },
          { text: '· 테스트 카드' },
          { text: '· 파란색 보관통(B-02)', highlight: true },
        ],
      },
    ],
    deductionQuestion: '두 사람의 증언과 현장 기록을 비교했을 때 기능 시안을 가져간 용의자는 누구인가?',
    deductionOptions: [
      { id: 'felix', badge: 'A', text: '펠릭스 · 제품 설계자' },
      { id: 'emil', badge: 'B', text: '에밀 · 테스트 담당자' },
    ],
    correctAnswer: 'emil',
    resolution: {
      title: '사건 종결',
      body:
        '에밀은 테스트 기준을 확인하기 위해 설계 테이블에 있던 파란색 보관통을 테스트실로 가져갔습니다. 테스트가 끝난 뒤 파란색 보관통을 테스트실에 두고 반납하지 않았습니다. 테스트실에서 기능 시안이 발견됐습니다.',
      reasons: [
        '기능 시안은 16:30에 파란색 보관통에 보관됨',
        '펠릭스는 16:40에 퇴실한 뒤 돌아오지 않음',
        '에밀은 파란색 보관통을 본 적 없다고 증언',
        '하지만 17:20 테스트실 반입 기록에 파란색 보관통이 포함됨',
        '에밀의 증언과 반입 기록이 서로 모순됨',
      ],
    },
  },
};

export const getCase = (id: CaseId): CaseDefinition => CASES[id];
