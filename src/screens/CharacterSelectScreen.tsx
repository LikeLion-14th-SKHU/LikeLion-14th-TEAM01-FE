import { CHARACTERS } from '../data/characters';
import { MAX_ASKS } from '../state/useGame';
import { CharacterCard } from '../components/character/CharacterCard';
import { ScreenShell } from '../components/ui/ScreenShell';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { RevealGroup } from '../components/motion/Reveal';

interface Props {
  asked: Record<string, number>;
  onBack: () => void;
  onSelect: (id: string) => void;
  onEvidence: () => void;
}

export function CharacterSelectScreen({ asked, onBack, onSelect, onEvidence }: Props) {
  const allDone = CHARACTERS.every((c) => (asked[c.id] ?? 0) >= MAX_ASKS);

  return (
    <ScreenShell
      onBack={onBack}
      backLabel="작업실 선택"
      caseLabel="CASE 1 · SIGNATURE"
      backdrop="/art/room-pattern.jpg"
      footer={
        allDone ? (
          <Button fullWidth onClick={onEvidence}>
            현장 증거 확보하기
          </Button>
        ) : null
      }
    >
      <SectionHeading
        title="패턴실 조사"
        description="사라진 SIGNATURE 시안에 대해 관련자들에게 질문하세요."
      />

      <RevealGroup onView={false} stagger={0.1} delay={0.25} className="mt-8 flex flex-col gap-4">
        {CHARACTERS.map((c) => (
          <CharacterCard
            key={c.id}
            character={c}
            asked={asked[c.id] ?? 0}
            total={MAX_ASKS}
            onSelect={onSelect}
          />
        ))}
      </RevealGroup>

      {!allDone && (
        <p className="mt-6 text-center font-mono text-caption text-atelier-muted">
          두 사람의 증언을 모두 확보하면 현장 기록을 열 수 있습니다
        </p>
      )}
    </ScreenShell>
  );
}
