// 임시 (일단 와이어프레임에 나온대로)
export interface EvidenceDoc {
    id: string;
    title: string;
    subtitle: string;
    lines: { text: string; highlight?: boolean; heading?: boolean }[];
  }
  
  export const EVIDENCE: EvidenceDoc[] = [
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
  ];
  
  export interface DeductionOption {
    id: 'A' | 'B' | 'C';
    text: string;
  }
  
  export const DEDUCTION_QUESTION =
    '증언과 아카이브 기록, 촬영실 콘택트시트를 종합했을 때 SIGNATURE 시안에 일어난 일은 무엇인가?';
  
  export const DEDUCTION_OPTIONS: DeductionOption[] = [
    { id: 'A', text: '클라라가 시안을 반납하지 않고 염색실로 가져갔다.' },
    { id: 'B', text: '요하네스가 RP-03 포트폴리오를 촬영실로 옮겨 추가 촬영한 뒤 반납하지 않았다.' },
    { id: 'C', text: '시안은 정상적으로 반납됐고 포트폴리오만 우연히 촬영실에 있었다.' },
  ];
  
  export const CORRECT_ANSWER: DeductionOption['id'] = 'B';
  
  export const RESOLUTION = {
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
  };
  