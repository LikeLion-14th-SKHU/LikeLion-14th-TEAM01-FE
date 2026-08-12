import { CORRECT_ANSWER, RESOLUTION } from '../data/case';
import { cn } from '../lib/cn';
import { ScreenShell } from '../components/ui/ScreenShell';
import { Button } from '../components/ui/Button';
import { Reveal, RevealGroup } from '../components/motion/Reveal';

interface Props {
  answer: string;
  onNext: () => void;
}

export function ResultScreen({ answer, onNext }: Props) {
  const correct = answer === CORRECT_ANSWER;

  return (
    <ScreenShell
      caseLabel="CASE 1 · SIGNATURE"
      footer={
        <Button fullWidth onClick={onNext}>
          결과 보기 →
        </Button>
      }
    >
      <RevealGroup onView={false} stagger={0.08} className="flex flex-col items-center text-center">
        <Reveal>
          <div
            className={cn(
              'grid h-17.5 w-17.5 place-items-center rounded-full text-[26px]',
              correct ? 'bg-atelier-goldDim/40 text-atelier-gold' : 'bg-atelier-alert/20 text-atelier-alert',
            )}
          >
            {correct ? '✓' : '✕'}
          </div>
        </Reveal>
        <Reveal className="mt-4">
          <h2
            className={cn(
              'font-display text-[28px] font-bold',
              correct ? 'text-atelier-text' : 'text-atelier-alert',
            )}
          >
            {correct ? '추리 성공' : '추리 실패'}
          </h2>
        </Reveal>
        <Reveal className="mt-2">
          <p className="font-mono text-[13px] text-atelier-muted">
            {correct ? '정답: ' + CORRECT_ANSWER : '정답은 ' + CORRECT_ANSWER + '였습니다.'}
          </p>
        </Reveal>
      </RevealGroup>

      <Reveal delay={0.3} className="mt-7">
        <article className="rounded-xl border border-atelier-line bg-atelier-card p-5">
          <h3 className="font-display text-[19px] font-bold">{RESOLUTION.title}</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-atelier-text/90 text-pretty">
            {RESOLUTION.body}
          </p>
          <p className="mt-5 border-t border-atelier-line pt-4 font-mono text-[12px] font-semibold text-atelier-gold">
            추리 근거
          </p>
          <ul className="mt-2 space-y-1 font-mono text-[12.5px] leading-[1.8] text-atelier-muted">
            {RESOLUTION.reasons.map((r) => (
              <li key={r}>· {r}</li>
            ))}
          </ul>
        </article>
      </Reveal>
    </ScreenShell>
  );
}
