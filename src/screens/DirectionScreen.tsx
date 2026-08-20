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
  onSelect: (id: Direction['id']) => Promise<void>;
}

export function DirectionScreen({ onBack, onSelect }: Props) {
  const [picked, setPicked] = useState<Direction['id'] | null>(null);

  const choose = (id: Direction['id']) => {
    if (picked) return;
    setPicked(id);
    window.setTimeout(() => {
      onSelect(id).catch(() => setPicked(null));
    }, 400);
  };

  return (
    <ScreenShell onBack={onBack}>
      <StepDots total={3} current={2} className="mb-8" />
      <SectionHeading
        eyebrow="STEP 2 · DESIGN DIRECTION"
        title="완성하고자 하는 가방의 디자인을 선택하세요."
        description="선택한 디자인의 사라진 시안 2장을 찾아야 제품이 완성됩니다."
      />

      <RevealGroup
        onView={false}
        stagger={0.09}
        delay={0.25}
        className="mt-7 grid grid-cols-1 gap-3.5 md:grid-cols-3 md:gap-4"
      >
        {DIRECTIONS.map((d) => (
          <Reveal key={d.id}>
            <button
              type="button"
              onClick={() => choose(d.id)}
              className={cn(
                'group block h-full w-full overflow-hidden rounded-xl border bg-atelier-card text-left transition-all duration-300',
                picked === d.id ? 'border-atelier-gold' : 'border-atelier-line hover:border-atelier-gold/60',
                picked && picked !== d.id && 'opacity-40',
              )}
            >
              <div className="relative">
                <HoverZoomImage
                  src={d.artwork.silhouette}
                  alt={`${d.title} 가방 실루엣`}
                  useGroupHover
                  scale={1.03}
                  className="h-52 w-full bg-[#f4f2ee] md:h-56"
                  imageClassName="object-contain p-3 md:p-4"
                />
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
