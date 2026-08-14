import { useState } from 'react';

interface Props {
  onMyPage: () => void;
  onLogout: () => void;
}

export function AppHeader({ onMyPage, onLogout }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-transparent px-5">
      <div className="pointer-events-auto flex items-center gap-2.5">
        <span
          aria-hidden
          className="flex size-8 items-center justify-center rounded-full border border-atelier-gold-dim font-display text-small font-bold text-atelier-gold"
        >
          M
        </span>
        <div className="text-left">
          <p className="font-display text-small font-bold leading-tight text-atelier-text">MCM ATELIER</p>
          <p className="font-mono text-micro tracking-label text-atelier-gold">MÜNCHEN · 1976</p>
        </div>
      </div>

      <div className="pointer-events-auto relative -mr-2">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="사용자 메뉴"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="grid size-11 place-items-center rounded-md text-atelier-muted transition-colors hover:text-atelier-text focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-atelier-gold"
        >
          <span aria-hidden className="flex w-5 flex-col gap-1.5">
            <span className="h-px w-full bg-current" />
            <span className="h-px w-full bg-current" />
            <span className="h-px w-full bg-current" />
          </span>
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-12 w-36 overflow-hidden rounded-lg border border-atelier-line bg-atelier-card shadow-xl"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onMyPage();
              }}
              className="flex min-h-12 w-full items-center px-4 font-mono text-meta text-atelier-text transition-colors hover:bg-atelier-gold/10"
            >
              마이페이지
            </button>
            <div className="h-px bg-atelier-line" />
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
              className="flex min-h-12 w-full items-center px-4 font-mono text-meta text-atelier-muted transition-colors hover:bg-atelier-gold/10 hover:text-atelier-text"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
