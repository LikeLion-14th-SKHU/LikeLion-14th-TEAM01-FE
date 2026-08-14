import type { CaseId } from '../types/game';

export interface EvidenceDoc {
  id: string;
  title: string;
  subtitle: string;
  lines: { text: string; highlight?: boolean; heading?: boolean }[];
}

export interface DeductionOption {
  id: 'A' | 'B' | 'C';
  text: string;
}

export interface CaseDefinition {
  id: CaseId;
  number: 1 | 2;
  code: 'SIGNATURE' | 'FUNCTION';
  roomName: string;
  investigationTitle: string;
  investigationDescription: string;
  evidence: EvidenceDoc[];
  deductionQuestion: string;
  deductionOptions: DeductionOption[];
  correctAnswer: DeductionOption['id'];
  resolution: {
    title: string;
    body: string;
    reasons: string[];
  };
}

export const CASES: Record<CaseId, CaseDefinition> = {
  signature: {
    id: 'signature',
    number: 1,
    code: 'SIGNATURE',
    roomName: '패턴실',
    investigationTitle: '패턴실 조사',
    investigationDescription: '사라진 SIGNATURE 시안에 대해 관련자들에게 질문하세요.',
    evidence: [
      {
        id: 'archive',
        title: 'QR 증거 A · 아카이브 기록',
        subtitle: '클라라의 대여 / 반납 기록',
        lines: [
          { text: 'MCM ARCHIVE RECORD', heading: true },
          { text: '문서번호: SIG-1976-01' },
          { text: '대여자: Clara Bauer' },
          { text: '대여 시각: 14:02' },
          { text: '반납 시각: 15:11', highlight: true },
          { text: '보관: Red Portfolio RP-03 / Gold Clasp' },
          { text: 'DYE ROOM ACCESS LOG', heading: true },
          { text: '입실: 15:14 · 퇴실: 16:06', highlight: true },
        ],
      },
      {
        id: 'contact',
        title: 'QR 증거 B · 촬영실 콘택트시트',
        subtitle: '요하네스의 촬영 기록',
        lines: [
          { text: 'STUDIO B CONTACT SHEET', heading: true },
          { text: '촬영자: Johannes' },
          { text: '프레임 번호: 27' },
          { text: '촬영 시각: 15:52', highlight: true },
          { text: '촬영 장소: Studio B' },
          { text: '※ 프레임에 포착된 물체', heading: true },
          { text: '· MCM 여행용 프로토타입' },
          { text: '· 금색 잠금장치가 달린 빨간색 포트폴리오', highlight: true },
          { text: '· 포트폴리오 측면 RP-03 태그', highlight: true },
        ],
      },
    ],
    deductionQuestion:
      '증언과 아카이브 기록, 촬영실 콘택트시트를 종합했을 때 SIGNATURE 시안에 일어난 일은 무엇인가?',
    deductionOptions: [
      { id: 'A', text: '클라라가 시안을 반납하지 않고 염색실로 가져갔다.' },
      { id: 'B', text: '요하네스가 RP-03 포트폴리오를 촬영실로 옮겨 추가 촬영한 뒤 반납하지 않았다.' },
      { id: 'C', text: '시안은 정상적으로 반납됐고 포트폴리오만 우연히 촬영실에 있었다.' },
    ],
    correctAnswer: 'B',
    resolution: {
      title: '사건 종결',
      body:
        '요하네스는 패턴 근접 사진을 추가로 촬영하기 위해 RP-03을 촬영실로 옮겼습니다. 촬영 후 평면 서류함에 넣어두고 반납하지 않았으며, 서류함 안에서 SIGNATURE 시안이 발견됐습니다.',
      reasons: [
        '클라라는 15:11에 시안을 RP-03에 넣어 반납',
        '클라라는 15:14부터 염색실에 있었음',
        '요하네스는 마지막 촬영이 15:40이었다고 주장',
        '하지만 15:52 콘택트시트에 RP-03이 등장',
        '요하네스는 포트폴리오를 본 적 없다고 증언',
      ],
    },
  },
  function: {
    id: 'function',
    number: 2,
    code: 'FUNCTION',
    roomName: '설계실',
    investigationTitle: '설계실 조사',
    investigationDescription: '사라진 FUNCTION 설계도에 대해 관련자들에게 질문하세요.',
    evidence: [
      {
        id: 'felix-record',
        title: 'QR 증거 A · 펠릭스의 기록',
        subtitle: '설계도 보관 및 퇴실 기록',
        lines: [
          { text: 'DESIGN DOCUMENT RECORD', heading: true },
          { text: '문서: FUNCTION PLAN' },
          { text: '보관 물품: Blue Drawing Tube B-02', highlight: true },
          { text: '보관 위치: Felix Design Desk' },
          { text: '보관 시각: 16:30' },
          { text: 'EXIT LOG', heading: true },
          { text: 'Felix Schmidt' },
          { text: '퇴실: 16:40', highlight: true },
          { text: '재입실 기록: 없음', highlight: true },
        ],
      },
      {
        id: 'emil-record',
        title: 'QR 증거 B · 에밀의 기록',
        subtitle: '테스트실 입실 및 반입 물품 기록',
        lines: [
          { text: 'TEST ROOM ENTRY RECORD', heading: true },
          { text: '입실자: Emil Krüger' },
          { text: '입실 시각: 17:20', highlight: true },
          { text: '반입 물품', heading: true },
          { text: '· Travel Prototype' },
          { text: '· 8kg Test Weight' },
          { text: '· Test Card' },
          { text: '· Blue Drawing Tube B-02', highlight: true },
        ],
      },
    ],
    deductionQuestion:
      '두 사람의 증언과 QR 기록을 비교했을 때 FUNCTION 설계도에 일어난 일은 무엇인가?',
    deductionOptions: [
      { id: 'A', text: '펠릭스가 B-02을 가지고 외부 미팅에 갔다.' },
      { id: 'B', text: '에밀이 B-02을 테스트실로 가져간 뒤 반납하지 않았다.' },
      { id: 'C', text: 'FUNCTION 설계도는 처음부터 이동 카트에 실려 있었다.' },
    ],
    correctAnswer: 'B',
    resolution: {
      title: '사건 종결',
      body:
        '에밀은 테스트 기준을 확인하기 위해 설계 테이블 옆에 있던 B-02을 테스트실로 가져갔습니다. 테스트가 끝난 뒤 설계통을 장비 보관함에 넣어두고 반납하지 않았습니다. 해당 보관함에서 FUNCTION 설계도가 발견됐습니다.',
      reasons: [
        'FUNCTION 설계도는 16:30에 B-02에 보관됨',
        '펠릭스는 16:40에 퇴실한 뒤 돌아오지 않음',
        '에밀은 파란색 설계통을 본 적 없다고 증언',
        '하지만 17:20 테스트실 반입 기록에 B-02이 포함됨',
        '에밀의 증언과 반입 기록이 서로 모순됨',
      ],
    },
  },
};

export const getCase = (id: CaseId): CaseDefinition => CASES[id];
