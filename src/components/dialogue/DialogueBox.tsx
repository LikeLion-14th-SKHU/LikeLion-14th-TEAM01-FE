import { cn } from '../../lib/cn';

interface Props {
  name: string;
  text: string;
  isTyping: boolean;
  onAdvance?: () => void;
  advanceLabel?: string;
  className?: string;
}

export function DialogueBox({
  name,
  text,
  isTyping,
  onAdvance,
  advanceLabel = '다음',
  className,
}: Props) {
  return (
    <section
      aria-live="polite"
      className={cn(
        'relative rounded-lg border-2 border-paper-line bg-paper-card px-5 pb-5 pt-4 shadow-lg',
        className,
      )}
    >
      <h3 className="font-display text-display-sm font-bold text-paper-ink">{name}</h3>
      <div className="my-3 h-px bg-paper-line/70" />

      <p className="min-h-22 font-sans text-body text-paper-ink text-pretty">
        {text}
        {isTyping && (
          <span aria-hidden className="ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-0.5 bg-paper-ink animate-caret-blink" />
        )}
      </p>

      {onAdvance && (
        <button
          type="button"
          onClick={onAdvance}
          aria-label={isTyping ? '대사 건너뛰기' : advanceLabel}
          className={cn(
            'absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full',
            'border border-paper-line bg-paper-bg text-paper-ink transition-transform duration-200',
            'hover:scale-105 active:scale-95',
          )}
        >
          <span aria-hidden className="text-small">▶</span>
        </button>
      )}
    </section>
  );
}
