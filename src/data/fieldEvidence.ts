import type { EvidenceDoc } from './case';
import { CASES } from './case';
import type { Direction } from './directions';

export type FieldEvidenceCharacterId = 'clara' | 'johannes' | 'felix' | 'emil';

export interface FieldEvidenceDefinition {
  characterName: string;
  role: string;
  caseLabel: string;
  title: string;
  description: string;
  imageAlt?: string;
  images?: Record<Direction['id'], string>;
  record: EvidenceDoc;
}

const findEvidence = (caseId: keyof typeof CASES, evidenceId: string): EvidenceDoc => {
  const evidence = CASES[caseId].evidence.find((item) => item.id === evidenceId);
  if (!evidence) throw new Error(`현장 증거를 찾을 수 없습니다: ${evidenceId}`);
  return evidence;
};

export const FIELD_EVIDENCE: Record<FieldEvidenceCharacterId, FieldEvidenceDefinition> = {
  clara: {
    characterName: '클라라',
    role: '패턴 장인',
    caseLabel: 'CASE 2 · 패턴 시안',
    title: '클라라의 현장 증거',
    description: '패턴 시안의 대여·반납 내역과 염색실 출입 기록입니다.',
    record: findEvidence('signature', 'archive'),
  },
  emil: {
    characterName: '에밀',
    role: '테스트 담당자',
    caseLabel: 'CASE 1 · 기능 시안',
    title: '에밀의 현장 증거',
    description: '17시 20분, 에밀이 테스트실로 이동하던 순간을 포착한 현장 기록입니다.',
    imageAlt:
      '17시 20분 에밀이 가방과 8kg 테스트 추, 파란색 보관통을 실은 카트를 테스트실로 옮기는 모습',
    images: {
      daily: '/art/emil_evid_common.png',
      handsfree: '/art/emil_evid_handsfree.png',
      travel: '/art/emil_evid_travel.png',
    },
    record: findEvidence('function', 'emil-record'),
  },
  johannes: {
    characterName: '요하네스',
    role: '사진작가',
    caseLabel: 'CASE 2 · 패턴 시안',
    title: '요하네스의 현장 증거',
    description: '촬영실에서 발견된 콘택트시트의 마지막 프레임을 복원한 현장 기록입니다.',
    imageAlt:
      '촬영실 콘택트시트 24번부터 27번 프레임과 27번 프레임에 함께 찍힌 RP-03',
    images: {
      daily: '/art/johan_evid_common.png',
      handsfree: '/art/johan_evid_handsfree.png',
      travel: '/art/johan_evid_travel.png',
    },
    record: findEvidence('signature', 'contact'),
  },
  felix: {
    characterName: '펠릭스',
    role: '제품 설계자',
    caseLabel: 'CASE 1 · 기능 시안',
    title: '펠릭스의 현장 증거',
    description: '기능 시안의 보관 내역과 펠릭스의 퇴실 기록입니다.',
    record: findEvidence('function', 'felix-record'),
  },
};
