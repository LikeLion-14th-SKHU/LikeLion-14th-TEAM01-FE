import { cn } from '../../lib/cn';
import { Reveal, RevealGroup } from '../motion/Reveal';

interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, align = 'center', className }: Props) {
  return (
    <RevealGroup
      onView={false}
      className={cn('flex flex-col', align === 'center' ? 'items-center text-center' : 'items-start', className)}
    >
      {eyebrow && (
        <Reveal>
          <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-atelier-gold">
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal className="mt-3">
        <h2 className="font-display text-[26px] font-bold leading-[1.35] text-atelier-text text-pretty">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal className="mt-3">
          <p className="text-[15px] leading-[1.65] text-atelier-muted text-pretty">{description}</p>
        </Reveal>
      )}
    </RevealGroup>
  );
}
