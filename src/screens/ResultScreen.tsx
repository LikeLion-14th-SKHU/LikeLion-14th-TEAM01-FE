import type { CaseDefinition } from '../data/case';
import type { Direction } from '../data/directions';
import { cn } from '../lib/cn';
import { ScreenShell } from '../components/ui/ScreenShell';
import { Button } from '../components/ui/Button';
import { Reveal, RevealGroup } from '../components/motion/Reveal';
import { DesignProgressReveal } from '../components/design/DesignProgressReveal';

interface Props {
  caseData: CaseDefinition;
  answer: string;
  direction: Direction | null;
  isLastCase: boolean;
  onNext: () => void;
}

export function ResultScreen({ caseData, answer, direction, isLastCase, onNext }: Props) {
  const correct = answer === caseData.correctAnswer;

  return (
    <ScreenShell
      caseLabel={`CASE ${caseData.number} · ${caseData.code}`}
      footer={
        <Button fullWidth onClick={onNext}>
          {isLastCase || !correct ? '최종 결과 보기 →' : '다음 사건 조사하기 →'}
        </Button>
      }
      className="md:max-w-2xl"
    >
      <RevealGroup onView={false} stagger={0.08} className="flex flex-col items-center text-center">
        <Reveal>
          <div
            className={cn(
              'grid size-17.5 place-items-center rounded-full text-display-md',
              correct ? 'bg-atelier-gold-dim/40 text-atelier-gold' : 'bg-atelier-alert/20 text-atelier-alert',
            )}
          >
            {correct ? '✓' : '✕'}
          </div>
        </Reveal>
        <Reveal className="mt-4">
          <h2
            className={cn(
              'font-display text-display-lg font-bold',
              correct ? 'text-atelier-text' : 'text-atelier-alert',
            )}
          >
            {correct ? '추리 성공' : '추리 실패'}
          </h2>
        </Reveal>
        <Reveal className="mt-2">
          <p className="font-mono text-small text-atelier-muted">
            {correct
              ? '정답: ' + caseData.correctAnswer
              : '정답은 ' + caseData.correctAnswer + '였습니다.'}
          </p>
        </Reveal>
      </RevealGroup>

      {correct && direction && (
        <Reveal delay={0.25} className="mt-7">
          <DesignProgressReveal
            direction={direction}
            stage={caseData.id === 'function' ? 'function' : 'signature'}
          />
        </Reveal>
      )}

      <Reveal delay={0.3} className="mt-7">
        <article className="rounded-xl border border-atelier-line bg-atelier-card p-5">
          <h3 className="font-display text-card-title font-bold">{caseData.resolution.title}</h3>
          <p className="mt-3 text-small text-atelier-text/90 text-pretty">
            {caseData.resolution.body}
          </p>
          <p className="mt-5 border-t border-atelier-line pt-4 font-mono text-meta font-semibold text-atelier-gold">
            추리 근거
          </p>
          <ul className="mt-2 flex flex-col gap-1 font-mono text-meta/7 text-atelier-muted">
            {caseData.resolution.reasons.map((r) => (
              <li key={r}>· {r}</li>
            ))}
          </ul>
        </article>
      </Reveal>
    </ScreenShell>
  );
}
