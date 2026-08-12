import { FadeIn } from '../motion/FadeIn';
import { cn } from '../../lib/cn';

interface Props {
  src: string;
  name: string;
  role?: string;
  className?: string;
  duration?: number;
}

export function CharacterStage({ src, name, role, className, duration = 1 }: Props) {
  return (
    <div className={cn('relative flex flex-1 items-end justify-center overflow-hidden', className)}>
      <FadeIn duration={duration} scaleFrom={0.96} className="h-full w-full">
        <img
          src={src}
          alt={name}
          className="mx-auto h-full w-auto max-w-full object-contain object-bottom"
        />
      </FadeIn>
      {role && (
        <span className="pointer-events-none absolute left-0 top-0 font-mono text-[11px] tracking-[0.14em] text-paper-muted">
          {role}
        </span>
      )}
    </div>
  );
}
