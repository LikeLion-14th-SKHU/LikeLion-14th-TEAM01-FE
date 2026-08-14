import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface Props {
  children: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  caseLabel?: string;
  footer?: ReactNode;
  className?: string;
}

export function ScreenShell({
  children,
  onBack,
  backLabel = '뒤로',
  caseLabel,
  footer,
  className,
}: Props) {
  return (
    <div className="relative flex min-h-dvh flex-col text-atelier-text">
      {(onBack || caseLabel) && (
        <header className="relative z-10 flex items-center justify-between px-5 pt-16 md:px-8 lg:px-10">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="-ml-2 flex min-h-11 items-center gap-2 px-2 font-mono text-meta text-atelier-muted transition-colors hover:text-atelier-text"
            >
              <span aria-hidden>←</span>
              {backLabel}
            </button>
          ) : (
            <span />
          )}
          {caseLabel && (
            <span className="font-mono text-caption font-semibold tracking-label text-atelier-gold">
              {caseLabel}
            </span>
          )}
        </header>
      )}

      <main
        className={cn(
          'relative z-10 mx-auto w-full flex-1 px-5 pb-40 md:px-8 lg:px-10',
          onBack || caseLabel ? 'pt-6' : 'pt-20',
          className,
        )}
      >
        {children}
      </main>

      {footer && (
        <div className="sticky bottom-0 z-20 bg-linear-to-t from-atelier-bg via-atelier-bg/95 to-transparent px-5 pb-6 pt-8 md:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-2xl">{footer}</div>
        </div>
      )}
    </div>
  );
}
