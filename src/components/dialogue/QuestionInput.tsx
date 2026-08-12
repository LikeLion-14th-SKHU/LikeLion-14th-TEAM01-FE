import { useState, type FormEvent } from 'react';
import { cn } from '../../lib/cn';

interface Props {
  asksLeft: number;
  disabled?: boolean;
  onSubmit: (question: string) => void;
  suggestions?: string[];
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

export function QuestionInput({
  asksLeft,
  disabled,
  onSubmit,
  suggestions = [],
  placeholder = '용의자에게 질문하기...',
  maxLength = 80,
  className,
}: Props) {
  const [value, setValue] = useState('');
  const locked = asksLeft === 0;
  const blocked = locked || disabled;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q || blocked) return;
    onSubmit(q);
    setValue('');
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between px-1">
        <span className="font-mono text-[11px] text-paper-muted">
          {locked ? '질문 기회를 모두 사용했습니다' : '남은 질문 ' + asksLeft + '회'}
        </span>
        {!locked && (
          <span aria-hidden className="flex gap-1.5">
            {Array.from({ length: asksLeft }).map((_, i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-paper-line" />
            ))}
          </span>
        )}
      </div>

      {suggestions.length > 0 && !blocked && (
        <div className="flex flex-wrap gap-2 px-1">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSubmit(s)}
              className="rounded-full border border-paper-line px-3 py-2 font-sans text-[12px] text-paper-muted transition-colors hover:text-paper-ink"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="flex items-stretch gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={blocked}
          maxLength={maxLength}
          placeholder={locked ? '질문 종료' : placeholder}
          aria-label="용의자에게 질문"
          className={cn(
            'min-h-[52px] flex-1 rounded-md border-2 border-paper-line bg-paper-bg px-4',
            'font-sans text-[15px] text-paper-ink placeholder:text-paper-muted/70',
            'focus:border-paper-ink focus:outline-none disabled:opacity-50',
          )}
        />
        <button
          type="submit"
          disabled={blocked || value.trim().length === 0}
          className={cn(
            'min-h-[52px] shrink-0 rounded-md border-2 border-paper-line bg-paper-ink px-5',
            'font-display text-[15px] font-bold text-paper-bg transition-opacity',
            'disabled:cursor-not-allowed disabled:opacity-40',
          )}
        >
          전송
        </button>
      </form>
    </div>
  );
}
