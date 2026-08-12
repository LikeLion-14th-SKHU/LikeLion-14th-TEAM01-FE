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
          <p className="font-mono text-caption font-semibold tracking-eyebrow text-atelier-gold">
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal className="mt-3">
        <h2 className="font-display text-display-md font-bold text-atelier-text text-pretty">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal className="mt-3">
          <p className="text-body text-atelier-muted text-pretty">{description}</p>
        </Reveal>
      )}
    </RevealGroup>
  );
}
