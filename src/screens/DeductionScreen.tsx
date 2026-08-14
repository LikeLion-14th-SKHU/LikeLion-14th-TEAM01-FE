import type { CaseDefinition } from '../data/case';
import { ScreenShell } from '../components/ui/ScreenShell';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal, RevealGroup } from '../components/motion/Reveal';

interface Props {
  caseData: CaseDefinition;
  onBack: () => void;
  onSubmit: (id: string) => void;
}

export function DeductionScreen({ caseData, onBack, onSubmit }: Props) {
  return (
    <ScreenShell
      onBack={onBack}
      backLabel="증거 다시 보기"
      caseLabel={`CASE ${caseData.number} · ${caseData.code}`}
    >
      <SectionHeading eyebrow="FINAL DEDUCTION" title="최종 추리" />
      <Reveal delay={0.2}>
        <p className="mt-4 text-body text-atelier-muted text-pretty">
          {caseData.deductionQuestion}
        </p>
      </Reveal>

      <RevealGroup
        onView={false}
        stagger={0.09}
        delay={0.3}
        className="mt-7 grid grid-cols-1 gap-3.5 md:grid-cols-3 md:gap-4"
      >
        {caseData.deductionOptions.map((opt) => (
          <Reveal key={opt.id}>
            <button
              type="button"
              onClick={() => onSubmit(opt.id)}
              className="flex h-full w-full items-start gap-3.5 rounded-xl border border-atelier-line bg-atelier-card p-4 text-left transition-colors duration-300 hover:border-atelier-gold"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-atelier-gold-dim/30 font-mono text-small font-bold text-atelier-gold">
                {opt.id}
              </span>
              <span className="text-small text-pretty">{opt.text}</span>
            </button>
          </Reveal>
        ))}
      </RevealGroup>

      <p className="mt-6 text-center font-mono text-caption text-atelier-muted">
        선택하면 즉시 채점됩니다 · 1회 제한
      </p>
    </ScreenShell>
  );
}
