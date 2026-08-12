import { useState } from 'react';
import { DIRECTIONS, type Direction } from '../data/directions';
import { cn } from '../lib/cn';
import { ScreenShell } from '../components/ui/ScreenShell';
import { SectionHeading } from '../components/ui/SectionHeading';
import { StepDots } from '../components/ui/StepDots';
import { HoverZoomImage } from '../components/ui/HoverZoomImage';
import { Reveal, RevealGroup } from '../components/motion/Reveal';

interface Props {
  onBack: () => void;
  onSelect: (id: Direction['id']) => void;
}

export function DirectionScreen({ onBack, onSelect }: Props) {
  const [picked, setPicked] = useState<Direction['id'] | null>(null);

  const choose = (id: Direction['id']) => {
    if (picked) return;
    setPicked(id);
    window.setTimeout(() => onSelect(id), 400);
  };

  return (
    <ScreenShell onBack={onBack}>
      <StepDots total={3} current={2} className="mb-8" />
      <SectionHeading
        eyebrow="STEP 2 · DESIGN DIRECTION"
        title="디자인 방향을 선택하세요"
        description="세 가지 접근 중 하나를 선택하면 해당 방향의 레퍼런스 자료가 제공됩니다."
      />

      <RevealGroup onView={false} stagger={0.09} delay={0.25} className="mt-7 flex flex-col gap-3.5">
        {DIRECTIONS.map((d) => (
          <Reveal key={d.id}>
            <button
              type="button"
              onClick={() => choose(d.id)}
              className={cn(
                'group block w-full overflow-hidden rounded-xl border bg-atelier-card text-left transition-all duration-300',
                picked === d.id ? 'border-atelier-gold' : 'border-atelier-line hover:border-atelier-gold/60',
                picked && picked !== d.id && 'opacity-40',
              )}
            >
              <div className="relative">
                <HoverZoomImage src={d.image} alt={d.title} useGroupHover className="h-32 w-full" />
                <span className="absolute left-3 top-3 grid size-8 place-items-center rounded-full bg-atelier-gold font-mono text-small font-bold text-atelier-bg">
                  {d.badge}
                </span>
              </div>
              <div className="p-4">
                <p className="font-display text-card-title font-bold">{d.title}</p>
                <p className="mt-1.5 font-mono text-caption font-semibold text-atelier-gold">{d.family}</p>
                <p className="mt-2 text-small text-atelier-muted text-pretty">{d.description}</p>
              </div>
            </button>
          </Reveal>
        ))}
      </RevealGroup>
    </ScreenShell>
  );
}
