import { useState } from 'react';
import { EVIDENCE } from '../data/case';
import { cn } from '../lib/cn';
import { ScreenShell } from '../components/ui/ScreenShell';
import { Button } from '../components/ui/Button';
import { Reveal, RevealGroup } from '../components/motion/Reveal';

interface Props {
  onBack: () => void;
  onDeduce: () => void;
}

export function EvidenceScreen({ onBack, onDeduce }: Props) {
  const [opened, setOpened] = useState<string[]>([EVIDENCE[0].id]);
  const toggle = (id: string) =>
    setOpened((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <ScreenShell
      onBack={onBack}
      backLabel="작업실 선택"
      caseLabel="CASE 1 · SIGNATURE"
      footer={
        <Button fullWidth onClick={onDeduce} disabled={opened.length === 0}>
          최종 추리하기
        </Button>
      }
    >
      <Reveal>
        <h2 className="font-display text-[24px] font-bold">현장 증거</h2>
      </Reveal>

      <RevealGroup onView={false} stagger={0.1} delay={0.2} className="mt-5 flex flex-col gap-4">
        {EVIDENCE.map((doc) => {
          const isOpen = opened.includes(doc.id);
          return (
            <Reveal key={doc.id}>
              <article className="overflow-hidden rounded-xl border border-atelier-line bg-atelier-card">
                <button
                  type="button"
                  onClick={() => toggle(doc.id)}
                  aria-expanded={isOpen}
                  className="flex min-h-[56px] w-full items-center justify-between gap-3 px-4 text-left"
                >
                  <span>
                    <span className="block font-display text-[15px] font-bold">{doc.title}</span>
                    <span className="mt-1 block text-[12.5px] text-atelier-muted">{doc.subtitle}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[11px] font-medium text-atelier-gold">
                    {isOpen ? '✓ 확인' : '열기'}
                  </span>
                </button>

                {isOpen && (
                  <div className="animate-rise-in border-t border-atelier-line bg-atelier-surface px-4 py-4 font-mono text-[12.5px] leading-[1.85]">
                    {doc.lines.map((line, i) => (
                      <p
                        key={i}
                        className={cn(
                          line.heading && 'mt-3 font-semibold tracking-[0.06em] text-atelier-gold first:mt-0',
                          line.highlight && !line.heading && 'text-atelier-alert',
                          !line.heading && !line.highlight && 'text-atelier-text/90',
                        )}
                      >
                        {line.text}
                      </p>
                    ))}
                  </div>
                )}
              </article>
            </Reveal>
          );
        })}
      </RevealGroup>
    </ScreenShell>
  );
}
