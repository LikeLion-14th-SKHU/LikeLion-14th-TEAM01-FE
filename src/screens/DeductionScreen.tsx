import { DEDUCTION_OPTIONS, DEDUCTION_QUESTION } from '../data/case';
import { ScreenShell } from '../components/ui/ScreenShell';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal, RevealGroup } from '../components/motion/Reveal';

interface Props {
  onBack: () => void;
  onSubmit: (id: string) => void;
}

export function DeductionScreen({ onBack, onSubmit }: Props) {
  return (
    <ScreenShell onBack={onBack} backLabel="증거 다시 보기" caseLabel="CASE 1 · SIGNATURE">
      <SectionHeading eyebrow="FINAL DEDUCTION" title="최종 추리" />
      <Reveal delay={0.2}>
        <p className="mt-4 text-[15px] leading-[1.7] text-atelier-muted text-pretty">
          {DEDUCTION_QUESTION}
        </p>
      </Reveal>

      <RevealGroup onView={false} stagger={0.09} delay={0.3} className="mt-7 flex flex-col gap-3.5">
        {DEDUCTION_OPTIONS.map((opt) => (
          <Reveal key={opt.id}>
            <button
              type="button"
              onClick={() => onSubmit(opt.id)}
              className="flex w-full items-start gap-3.5 rounded-xl border border-atelier-line bg-atelier-card p-4 text-left transition-colors duration-300 hover:border-atelier-gold"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-atelier-goldDim/30 font-mono text-[13px] font-bold text-atelier-gold">
                {opt.id}
              </span>
              <span className="text-[14.5px] leading-[1.55] text-pretty">{opt.text}</span>
            </button>
          </Reveal>
        ))}
      </RevealGroup>

      <p className="mt-6 text-center font-mono text-[11px] text-atelier-muted">
        선택하면 즉시 채점됩니다 · 1회 제한
      </p>
    </ScreenShell>
  );
}
