import { cn } from '../../lib/cn';

interface Props {
  total: number;
  current: number;
  className?: string;
}

export function StepDots({ total, current, className }: Props) {
  return (
    <div className={cn('flex justify-center gap-2', className)} aria-label={'단계 ' + current + '/' + total}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'h-0.75 w-9 rounded-xs transition-colors duration-300',
            i < current ? 'bg-atelier-gold' : 'bg-atelier-line',
          )}
        />
      ))}
    </div>
  );
}
