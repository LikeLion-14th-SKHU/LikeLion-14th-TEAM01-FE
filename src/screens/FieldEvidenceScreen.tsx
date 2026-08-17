import { Reveal, RevealGroup } from '../components/motion/Reveal';
import { ScreenShell } from '../components/ui/ScreenShell';
import type { FieldEvidenceDefinition } from '../data/fieldEvidence';
import { DIRECTIONS, type Direction } from '../data/directions';
import { cn } from '../lib/cn';

interface Props {
  evidence: FieldEvidenceDefinition;
  direction: Direction['id'];
}

export function FieldEvidenceScreen({ evidence, direction }: Props) {
  const selectedDirection = DIRECTIONS.find((item) => item.id === direction);

  return (
    <ScreenShell caseLabel={evidence.caseLabel} className="mx-auto max-w-5xl pb-20">
      <Reveal>
        <p className="font-mono text-caption font-semibold tracking-eyebrow text-atelier-gold">
          QR FIELD EVIDENCE
        </p>
        <h1 className="mt-3 font-display text-display-lg font-bold md:text-hero">
          {evidence.title}
        </h1>
        <p className="mt-3 max-w-2xl text-small text-atelier-muted md:text-body">
          {evidence.description}
        </p>
      </Reveal>

      <RevealGroup onView={false} stagger={0.12} delay={0.15} className="mt-7 space-y-5">
        <Reveal>
          <figure className="overflow-hidden rounded-xl border border-atelier-line bg-atelier-card shadow-2xl shadow-black/25">
            <img
              src={evidence.images[direction]}
              alt={evidence.imageAlt}
              className="block h-auto w-full bg-black object-contain"
            />
            <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-atelier-line px-4 py-3 font-mono text-caption text-atelier-muted md:px-5">
              <span>{evidence.characterName} · {evidence.role}</span>
              <span className="text-atelier-gold">
                {selectedDirection?.title ?? '데일리 트래블'} 시제품 기록
              </span>
            </figcaption>
          </figure>
        </Reveal>

        <Reveal>
          <article className="overflow-hidden rounded-xl border border-atelier-line bg-atelier-card">
            <header className="px-4 py-4 md:px-6 md:py-5">
              <p className="font-display text-card-title font-bold">{evidence.record.title}</p>
              <p className="mt-1 text-meta text-atelier-muted">{evidence.record.subtitle}</p>
            </header>

            <div className="border-t border-atelier-line bg-atelier-surface px-4 py-5 font-mono text-meta/7 md:px-6">
              {evidence.record.lines.map((line, index) => (
                <p
                  key={`${line.text}-${index}`}
                  className={cn(
                    line.heading &&
                      'mt-4 font-semibold tracking-wide text-atelier-gold first:mt-0',
                    line.highlight && !line.heading && 'font-semibold text-atelier-alert',
                    !line.heading && !line.highlight && 'text-atelier-text/90',
                  )}
                >
                  {line.text}
                </p>
              ))}
            </div>
          </article>
        </Reveal>
      </RevealGroup>

      <p className="mt-6 text-center font-mono text-caption text-atelier-muted">
        현장의 QR 코드를 스캔해 확보한 기록입니다
      </p>
    </ScreenShell>
  );
}

