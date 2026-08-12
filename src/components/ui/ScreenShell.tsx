import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface Props {
  children: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  caseLabel?: string;
  footer?: ReactNode;
  backdrop?: string;
  className?: string;
}

export function ScreenShell({
  children,
  onBack,
  backLabel = '뒤로',
  caseLabel,
  footer,
  backdrop,
  className,
}: Props) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-atelier-bg text-atelier-text">
      {backdrop && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: 'url(' + backdrop + ')' }}
        />
      )}
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-gradient-to-b from-atelier-bg/70 via-atelier-bg/85 to-atelier-bg" />

      {(onBack || caseLabel) && (
        <header className="relative z-10 flex items-center justify-between px-6 pt-6">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="-ml-2 flex min-h-[44px] items-center gap-2 px-2 font-mono text-[12px] text-atelier-muted transition-colors hover:text-atelier-text"
            >
              <span aria-hidden>←</span>
              {backLabel}
            </button>
          ) : (
            <span />
          )}
          {caseLabel && (
            <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-atelier-gold">
              {caseLabel}
            </span>
          )}
        </header>
      )}

      <main className={cn('relative z-10 flex-1 px-6 pb-40 pt-6', className)}>{children}</main>

      {footer && (
        <div className="sticky bottom-0 z-20 bg-gradient-to-t from-atelier-bg via-atelier-bg/95 to-transparent px-6 pb-7 pt-8">
          {footer}
        </div>
      )}
    </div>
  );
}
