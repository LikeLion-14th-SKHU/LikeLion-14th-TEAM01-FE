import { CASE_CHARACTERS } from '../data/characters';
import type { CaseDefinition } from '../data/case';
import { MAX_ASKS } from '../state/useGame';
import { CharacterCard } from '../components/character/CharacterCard';
import { ScreenShell } from '../components/ui/ScreenShell';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { RevealGroup } from '../components/motion/Reveal';

interface Props {
  caseData: CaseDefinition;
  asked: Record<string, number>;
  interviewed: Record<string, boolean>;
  onBack: () => void;
  onSelect: (id: string) => void;
  onEvidence: () => void;
}

export function CharacterSelectScreen({
  caseData,
  asked,
  interviewed,
  onBack,
  onSelect,
  onEvidence,
}: Props) {
  const characters = CASE_CHARACTERS[caseData.id];
  const allDone = characters.every((character) => interviewed[character.id]);

  return (
    <ScreenShell
      onBack={onBack}
      backLabel="작업실 선택"
      caseLabel={`CASE ${caseData.number} · ${caseData.code}`}
      footer={
        allDone ? (
          <Button fullWidth onClick={onEvidence}>
            현장 증거 확보하기
          </Button>
        ) : null
      }
    >
      <SectionHeading
        title={caseData.investigationTitle}
        description={caseData.investigationDescription}
      />

      <RevealGroup
        onView={false}
        stagger={0.1}
        delay={0.25}
        className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5"
      >
        {characters.map((c) => (
          <CharacterCard
            key={c.id}
            character={c}
            asked={asked[c.id] ?? 0}
            completed={Boolean(interviewed[c.id])}
            total={MAX_ASKS}
            onSelect={onSelect}
            className="h-full"
          />
        ))}
      </RevealGroup>

      {!allDone && (
        <p className="mt-6 text-center font-mono text-caption text-atelier-muted">
          두 사람과의 대화를 종료하면 현장 기록을 열 수 있습니다
        </p>
      )}
    </ScreenShell>
  );
}
